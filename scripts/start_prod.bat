@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo.
echo ==========================================
echo    USG India - PRODUCTION MODE
echo ==========================================
echo.

if not exist "backend\dist" (
    echo [ERROR] Backend not built. Please run scripts\setup.bat first.
    pause
    exit /b 1
)
if not exist "frontend\.next" (
    echo [ERROR] Frontend not built. Please run scripts\setup.bat first.
    pause
    exit /b 1
)

echo Starting Backend (Production)...
start "Backend Server (Prod)" cmd /k "cd backend && npm run start:prod"

timeout /t 3 /nobreak >nul 2>&1

echo Starting Frontend (Production)...
start "Frontend Client (Prod)" cmd /k "cd frontend && npm start"

echo.
echo Production environment started in separate windows!
pause
