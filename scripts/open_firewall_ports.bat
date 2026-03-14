@echo off
echo ============================================================
echo   USG India - Opening Firewall Ports for Cloudflare
echo   Run this as Administrator!
echo ============================================================

:: Allow port 80 (HTTP) inbound
netsh advfirewall firewall add rule name="USG India HTTP Port 80" dir=in action=allow protocol=TCP localport=80
echo [OK] Port 80 opened

:: Allow port 443 (HTTPS) inbound
netsh advfirewall firewall add rule name="USG India HTTPS Port 443" dir=in action=allow protocol=TCP localport=443
echo [OK] Port 443 opened

:: Allow port 3000 (Frontend) inbound
netsh advfirewall firewall add rule name="USG India Frontend 3000" dir=in action=allow protocol=TCP localport=3000
echo [OK] Port 3000 opened

:: Allow port 3001 (Backend API) inbound
netsh advfirewall firewall add rule name="USG India Backend 3001" dir=in action=allow protocol=TCP localport=3001
echo [OK] Port 3001 opened

echo.
echo ============================================================
echo   Firewall rules added successfully!
echo   Your server is now accessible from the internet.
echo ============================================================
pause
