@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo ============================================================
echo   USG India - Production Build ^& Cloudflare Deployment
echo ============================================================
echo.

:: --- 1. Backend Build ---
echo [1/5] Building Backend...
cd backend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Backend npm install failed!
    pause
    exit /b 1
)

echo [2/5] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)

echo [3/5] Compiling Backend (NestJS)...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
cd ..

:: --- 2. Frontend Build ---
echo [4/5] Building Frontend (Next.js)...
cd frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Frontend npm install failed!
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..

:: --- 3. PM2 Deploy ---
echo [5/5] Starting Production Server with PM2...
call pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing PM2 globally...
    call npm install -g pm2
)

call pm2 delete all >nul 2>&1
call pm2 start config/ecosystem.config.js --env production
call pm2 save

echo.
echo ============================================================
echo   BUILD COMPLETE! Production server is running.
echo ============================================================
echo.
call pm2 status
echo.
echo Frontend: https://usgindia.in (via Cloudflare)
echo Backend:  https://usgindia.in/api/v1
echo.
pause
