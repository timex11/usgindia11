@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo.
echo ==========================================
echo    USG India - DEV MODE
echo ==========================================
echo.

if not exist "backend\node_modules" (
    echo [ERROR] Backend not setup. Please run scripts\setup.bat first.
    pause
    exit /b 1
)
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend not setup. Please run scripts\setup.bat first.
    pause
    exit /b 1
)

echo Starting Backend...
start "USG India Backend" cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak >nul 2>&1

echo Starting Frontend...
start "USG India Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Services are starting in separate windows.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo API Docs: http://localhost:3001/api/docs
echo.
pause
