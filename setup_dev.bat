@echo off
echo ==========================================
echo   USG India - Offline Dev Mode Setup
echo ==========================================

echo.
echo [1/4] Checking prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js (v18+ recommended).
    pause
    exit /b 1
)
echo Node.js is installed.

echo.
echo [2/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies.
    cd ..
    pause
    exit /b 1
)

echo.
echo [3/4] Setting up Database (SQLite)...
echo Pushing schema to dev.db...
call npx prisma db push
if %errorlevel% neq 0 (
    echo Error: Database push failed.
    cd ..
    pause
    exit /b 1
)

echo Seeding database with sample data...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo Error: Database seeding failed.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo To start development:
echo 1. Open a terminal in 'backend' folder and run: npm run start:dev
echo 2. Open a terminal in 'frontend' folder and run: npm run dev
echo.
echo Refer to DEV_RESOURCES.md for login credentials.
echo.
pause
