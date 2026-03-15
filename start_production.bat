@echo off
echo Starting USG India Production Deployment...
powershell -ExecutionPolicy Bypass -File "%~dp0start_production.ps1"
pause
