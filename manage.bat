<# :
@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

if "%~1"=="" goto help
if "%~1"=="setup" goto setup
if "%~1"=="setup-offline" goto setup_offline
if "%~1"=="dev" goto dev
if "%~1"=="prod" goto prod
if "%~1"=="deploy" goto deploy
if "%~1"=="deploy-cf" goto deploy_cf
if "%~1"=="firewall" goto firewall
if "%~1"=="cf-tunnel" goto cf_tunnel
if "%~1"=="cf-dns" goto cf_dns
if "%~1"=="health-check" goto health_check

echo Unknown command: %~1
goto help

:help
echo ==========================================
echo    USG India - Advanced Server Management Tool
echo ==========================================
echo Usage: manage.bat [command]
echo.
echo Commands:
echo   setup        - Complete local setup (deps, env vars, Prisma generate)
echo   setup-offline- Offline dev setup (deps, Prisma push to SQLite ^& seed)
echo   dev          - Start development servers (Frontend + Backend)
echo   prod         - Start production environment (Docker Infra + PM2 Apps)
echo   deploy       - Build and restart PM2 for production deployment
echo   deploy-cf    - Build and deploy specific to Cloudflare environment
echo   firewall     - Open Windows Firewall ports for web traffic (Run as Admin)
echo   cf-tunnel    - Create and configure Cloudflare Tunnel
echo   cf-dns       - Configure Cloudflare DNS records and SSL
echo   health-check - Probe backend health endpoint
echo.
exit /b 0

:setup
echo ==========================================
echo    USG India - COMPLETE SETUP
echo ==========================================
echo [1/6] Configuring Windows...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f >nul 2>&1

echo [2/6] Clearing Node.js processes...
taskkill /im node.exe /f >nul 2>&1
timeout /t 1 /nobreak >nul 2>&1

echo [3/6] Setting up Backend...
cd backend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install --legacy-peer-deps
call npx prisma generate
call npm run build
cd ..

echo [4/6] Setting up Frontend...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install --legacy-peer-deps
call npm run build
cd ..

echo [5/6] Checking Environment...
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env"
    ) else (
        (
            echo DATABASE_URL=postgresql://user:password@localhost:5432/usgindia
            echo JWT_SECRET=your-secret-key-change-me
            echo REDIS_URL=redis://localhost:6379
            echo NODE_ENV=development
            echo PORT=3001
            echo FRONTEND_URL=http://localhost:3000
        ) > "backend\.env"
    )
)
if not exist "frontend\.env.local" (
    if exist "frontend\.env.local.example" (
        copy "frontend\.env.local.example" "frontend\.env.local"
    ) else (
        (
            echo NEXT_PUBLIC_API_URL=http://localhost:3001/api
            echo NEXT_PUBLIC_APP_URL=http://localhost:3000
        ) > "frontend\.env.local"
    )
)
echo.
echo [6/6] Setup Complete!
exit /b 0

:setup_offline
echo ==========================================
echo   USG India - Offline Dev Mode Setup
echo ==========================================
node -v >nul 2>&1
if %errorlevel% neq 0 ( echo Error: Node.js is not installed. & exit /b 1 )
echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
echo [2/3] Setting up Database (SQLite)...
call npx prisma db push
call npx prisma db seed
cd ..
echo [3/3] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo Setup Complete!
exit /b 0

:dev
echo ==========================================
echo    USG India - DEV MODE
echo ==========================================
if not exist "backend\node_modules" ( echo [ERROR] Backend not setup. & exit /b 1 )
if not exist "frontend\node_modules" ( echo [ERROR] Frontend not setup. & exit /b 1 )
echo Starting Backend...
start "USG India Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak >nul 2>&1
echo Starting Frontend...
start "USG India Frontend" cmd /k "cd frontend && npm run dev"
echo Services starting in separate windows.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
exit /b 0

:prod
echo ======================================================
echo   USG INDIA - PRODUCTION ENVIRONMENT INITIALIZATION   
echo ======================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Command -ScriptBlock ([Scriptblock]::Create((Get-Content '%~f0' -Raw))) -ArgumentList 'prod'"
exit /b 0

:deploy
echo Deploying to production using PM2...
call pm2 --version >nul 2>&1
if %errorlevel% neq 0 ( echo ERROR: PM2 not found. Install with: npm install -g pm2 & exit /b 1 )
cd backend
call npm install --legacy-peer-deps
call npx prisma generate
call npm run build
cd ..
cd frontend
call npm install --legacy-peer-deps
call npm run build
cd ..
call pm2 start config/ecosystem.config.js --update-env
if %errorlevel% neq 0 ( call pm2 reload config/ecosystem.config.js --env production )
call pm2 save
call pm2 status
exit /b 0

:deploy_cf
echo ============================================================
echo   USG India - Production Build ^& Cloudflare Deployment
echo ============================================================
cd backend
call npm install --legacy-peer-deps
call npx prisma generate
call npm run build
cd ..
cd frontend
call npm install --legacy-peer-deps
call npm run build
cd ..
call pm2 --version >nul 2>&1
if %errorlevel% neq 0 ( call npm install -g pm2 )
call pm2 delete all >nul 2>&1
call pm2 start config/ecosystem.config.js --env production
call pm2 save
call pm2 status
exit /b 0

:firewall
netsh advfirewall firewall add rule name="USG India HTTP Port 80" dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="USG India HTTPS Port 443" dir=in action=allow protocol=TCP localport=443
netsh advfirewall firewall add rule name="USG India Frontend 3000" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="USG India Backend 3001" dir=in action=allow protocol=TCP localport=3001
echo Firewall rules added successfully!
exit /b 0

:health_check
node -e "const http=require('http');http.get('http://localhost:3001/api/v1/health',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(r.statusCode,d))}).on('error',console.error);"
exit /b 0

:cf_tunnel
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Command -ScriptBlock ([Scriptblock]::Create((Get-Content '%~f0' -Raw))) -ArgumentList 'cf-tunnel'"
exit /b 0

:cf_dns
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Command -ScriptBlock ([Scriptblock]::Create((Get-Content '%~f0' -Raw))) -ArgumentList 'cf-dns'"
exit /b 0
#>

param([string]$cmd)

if ($cmd -eq 'prod') {
    $ErrorActionPreference = "Stop"
    Write-Host "[1/4] Verifying Prerequisites..." -ForegroundColor Yellow
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Docker is not installed or not in PATH." -ForegroundColor Red
        exit 1
    }
    if (!(Get-Command pm2 -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: PM2 is not installed." -ForegroundColor Red
        exit 1
    }
    Write-Host "  -> Prerequisites OK." -ForegroundColor Green

    Write-Host "`n[2/4] Starting System Infrastructure (Postgres, Redis, Kafka, Nginx)..." -ForegroundColor Yellow
    try {
        docker-compose up -d
        Write-Host "  -> Docker infrastructure started." -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to start Docker containers." -ForegroundColor Red
        exit 1
    }

    Write-Host "`n[3/4] Warming up infrastructure (10 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    Write-Host "`n[4/4] Starting Applications (Frontend & Backend) via PM2..." -ForegroundColor Yellow
    try {
        pm2 start config/ecosystem.config.js
        pm2 save
        Write-Host "  -> PM2 Applications started successfully." -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to start PM2 applications." -ForegroundColor Red
        exit 1
    }
    Write-Host "`nDEPLOYMENT COMPLETE! Your production environment is running." -ForegroundColor Cyan
}

if ($cmd -eq 'cf-tunnel') {
    $token       = "CDy_3KmDhh-re-28_tXLPXymz0Oy5T6OZTmpnKOc"
    $accountId   = "a7149932b29c325e1ec34d349bb9da47"
    $zoneId      = "84393dfc40c5af8d0841b62b8042f56a"
    $tunnelName  = "usgindia-tunnel"
    $credFile    = "C:\Users\m\.cloudflare\$tunnelName.json"
    $configFile  = "C:\Users\m\.cloudflare\config.yml"

    $headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
    $base = "https://api.cloudflare.com/client/v4/accounts/$accountId/cfd_tunnel"

    Write-Host "=== Step 1: Create Cloudflare Tunnel ===" -ForegroundColor Cyan
    $rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
    $bytes = New-Object byte[] 32
    $rng.GetBytes($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    $body = @{ name = $tunnelName; tunnel_secret = $secret } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri $base -Method Post -Headers $headers -Body $body -TimeoutSec 30
    $tunnelId = $resp.result.id
    $tunnelToken = $resp.result.token

    Write-Host "`n=== Step 2: Save credentials ===" -ForegroundColor Cyan
    New-Item -ItemType Directory -Force -Path "C:\Users\m\.cloudflare" | Out-Null
    $cred = @{ AccountTag = $accountId; TunnelSecret = $resp.result.tunnel_secret; TunnelID = $tunnelId } | ConvertTo-Json
    $cred | Out-File -FilePath $credFile -Encoding utf8

    Write-Host "`n=== Step 3: Create DNS CNAME records ===" -ForegroundColor Cyan
    $dnsBase = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records"
    function Upsert-CNAME($name, $target) {
        $existing = (Invoke-RestMethod -Uri "$dnsBase?name=$name" -Headers $headers -TimeoutSec 20).result
        $cnameBody = @{ type="CNAME"; name=$name; content=$target; proxied=$true; ttl=1 } | ConvertTo-Json
        if ($existing -and $existing.Count -gt 0) {
            Invoke-RestMethod -Uri "$dnsBase/$($existing[0].id)" -Method Put -Headers $headers -Body $cnameBody -TimeoutSec 20 | Out-Null
            Write-Host "UPDATED CNAME: $name -> $target" -ForegroundColor Green
        } else {
            Invoke-RestMethod -Uri $dnsBase -Method Post -Headers $headers -Body $cnameBody -TimeoutSec 20 | Out-Null
            Write-Host "CREATED CNAME: $name -> $target" -ForegroundColor Green
        }
    }
    $cfTarget = "$tunnelId.cfargotunnel.com"
    Upsert-CNAME "usgindia.in"     $cfTarget
    Upsert-CNAME "www.usgindia.in" $cfTarget
    Upsert-CNAME "api.usgindia.in" $cfTarget

    Write-Host "`n=== Step 4: Write cloudflared config.yml ===" -ForegroundColor Cyan
    $configYml = "tunnel: $tunnelId`ncredentials-file: $credFile`ningress:`n  - hostname: www.usgindia.in`n    service: http://localhost:3000`n  - hostname: usgindia.in`n    service: http://localhost:3000`n  - hostname: api.usgindia.in`n    service: http://localhost:3001`n  - service: http_status:404"
    $configYml | Out-File -FilePath $configFile -Encoding utf8

    Write-Host "`n  TUNNEL SETUP COMPLETE! Tunnel ID: $tunnelId" -ForegroundColor Green
}

if ($cmd -eq 'cf-dns') {
    $token = "CDy_3KmDhh-re-28_tXLPXymz0Oy5T6OZTmpnKOc"
    $zoneId = "84393dfc40c5af8d0841b62b8042f56a"
    $ip = "223.184.241.22"
    $headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
    $base = "https://api.cloudflare.com/client/v4/zones/$zoneId"

    function Upsert-DNSRecord($name, $ip, $proxied) {
        $existing = (Invoke-RestMethod -Uri "$base/dns_records?type=A&name=$name" -Headers $headers -TimeoutSec 20).result
        $body = @{ type="A"; name=$name; content=$ip; proxied=$proxied; ttl=1 } | ConvertTo-Json
        if ($existing -and $existing.Count -gt 0) {
            Invoke-RestMethod -Uri "$base/dns_records/$($existing[0].id)" -Method Put -Headers $headers -Body $body -TimeoutSec 20 | Out-Null
            Write-Host "UPDATED: $name"
        } else {
            Invoke-RestMethod -Uri "$base/dns_records" -Method Post -Headers $headers -Body $body -TimeoutSec 20 | Out-Null
            Write-Host "CREATED: $name"
        }
    }
    Write-Host "=== Configuring DNS ==="
    Upsert-DNSRecord "usgindia.in"     $ip $true
    Upsert-DNSRecord "www.usgindia.in" $ip $true
    Upsert-DNSRecord "api.usgindia.in" $ip $true

    Invoke-RestMethod -Uri "$base/settings/ssl" -Method Patch -Headers $headers -Body (@{value="full"}|ConvertTo-Json) -TimeoutSec 20 | Out-Null
    Invoke-RestMethod -Uri "$base/settings/always_use_https" -Method Patch -Headers $headers -Body (@{value="on"}|ConvertTo-Json) -TimeoutSec 20 | Out-Null
    Invoke-RestMethod -Uri "$base/settings/http2" -Method Patch -Headers $headers -Body (@{value="on"}|ConvertTo-Json) -TimeoutSec 20 | Out-Null
    Write-Host "   ALL CLOUDFLARE SETTINGS CONFIGURED!"
}
