@echo off
REM ===========================================================================
REM  USG India - Setup Script
REM ===========================================================================
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo.
echo ==========================================
echo    USG India - COMPLETE SETUP
echo ==========================================
echo.

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
pause
