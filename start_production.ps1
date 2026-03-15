<#
.SYNOPSIS
USG India - Production Setup & Startup Script

.DESCRIPTION
This script serves as a single "drag and drop" deployment trigger.
It verifies prerequisites, starts the infrastructure (Kafka, Redis, Postgres, Nginx)
via Docker Compose, and launches the frontend/backend Node applications via PM2.
#>

$ErrorActionPreference = "Stop"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  USG INDIA - PRODUCTION ENVIRONMENT INITIALIZATION   " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verify Prerequisites
Write-Host "[1/4] Verifying Prerequisites..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not in PATH. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}
if (!(Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: PM2 is not installed. Run 'npm install -g pm2'." -ForegroundColor Red
    exit 1
}
Write-Host "  -> Prerequisites OK." -ForegroundColor Green

# 2. Start Infrastructure via Docker Compose
Write-Host "`n[2/4] Starting System Infrastructure (Postgres, Redis, Kafka, Nginx)..." -ForegroundColor Yellow
try {
    # Run from the root directory
    docker-compose up -d
    Write-Host "  -> Docker infrastructure started successfully." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to start Docker containers." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# 3. Wait for Infrastructure readiness (Optional but recommended for Kafka)
Write-Host "`n[3/4] Warming up infrastructure (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host "  -> Ready." -ForegroundColor Green

# 4. Start Application Processes via PM2
Write-Host "`n[4/4] Starting Applications (Frontend & Backend)..." -ForegroundColor Yellow
try {
    # Assuming ecosystem.config.js handles both
    pm2 start config/ecosystem.config.js
    pm2 save
    Write-Host "  -> PM2 Applications started successfully." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to start PM2 applications." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE! " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Infrastructure:"
Write-Host " - Nginx:      http://localhost / https://localhost"
Write-Host " - Kafka UI:   http://localhost:8080"
Write-Host " - App Config: PM2 (run 'pm2 list' or 'pm2 monit')"
Write-Host ""
Write-Host "Your production environment is now actively running."
