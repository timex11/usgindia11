@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo Deploying to production using PM2...

call pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PM2 not found. Install with: npm install -g pm2
    pause
    exit /b 1
)

echo Building Backend...
cd backend
call npm install --legacy-peer-deps
call npx prisma generate
call npm run build
cd ..

echo Building Frontend...
cd frontend
call npm install --legacy-peer-deps
call npm run build
cd ..

echo Restarting PM2...
call pm2 start config/ecosystem.config.js --update-env
if %errorlevel% neq 0 (
    call pm2 reload config/ecosystem.config.js --env production
)
call pm2 save

echo Deployment complete!
call pm2 status
pause
