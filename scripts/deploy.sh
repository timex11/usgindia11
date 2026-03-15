#!/bin/bash

# USG India - Advanced Application Deployment Script
# Targets: Ubuntu/Debian VPS running Node.js, PM2, and Docker

set -e

APP_DIR="/var/www/usgindia"
LOG_FILE="/var/log/usgindia_deploy.log"

# --- HELPER FUNCTIONS ---

log() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[$timestamp] [INFO] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[$timestamp] [ERROR] $1" | tee -a "$LOG_FILE" >&2
    exit 1
}

check_prerequisites() {
    log "Checking prerequisites..."
    if [ ! -d "$APP_DIR" ]; then
        error_exit "Application directory $APP_DIR does not exist. Run setup script first."
    fi
    command -v pm2 >/dev/null 2>&1 || error_exit "PM2 is not installed."
    command -v docker >/dev/null 2>&1 || error_exit "Docker is not installed."
    command -v npm >/dev/null 2>&1 || error_exit "NPM is not installed."
}

# --- DEPLOYMENT FUNCTIONS ---

pull_latest_code() {
    log "Pulling latest changes from main branch..."
    cd "$APP_DIR" || error_exit "Failed to enter $APP_DIR"
    
    # Ensure safe directory for git to avoid ownership issues when running with sudo
    git config --global --add safe.directory "$APP_DIR"
    
    git fetch origin main || error_exit "Failed to fetch from origin"
    git reset --hard origin/main || error_exit "Failed to reset to origin/main"
    git clean -fd || log "Warning: Failed to clean untracked files"
}

start_infrastructure() {
    log "Starting Docker infrastructure..."
    cd "$APP_DIR"
    docker compose up -d || error_exit "Failed to start Docker containers."
    log "Waiting for databases to initialize..."
    sleep 5
}

build_backend() {
    log "Building Backend system..."
    cd "$APP_DIR/backend" || error_exit "Backend directory missing."
    log "Installing backend dependencies..."
    npm install --no-audit --no-fund --legacy-peer-deps || error_exit "Backend 'npm install' failed."
    log "Generating Prisma Client..."
    npx prisma generate || error_exit "Prisma generate failed."
    log "Running Database Migrations..."
    npx prisma migrate deploy || log "Warning: Prisma migrate deploy failed or no database available."
    log "Compiling backend..."
    npm run build || error_exit "Backend build failed."
}

build_frontend() {
    log "Building Frontend application..."
    cd "$APP_DIR/frontend" || error_exit "Frontend directory missing."
    log "Installing frontend dependencies..."
    npm install --no-audit --no-fund --legacy-peer-deps || error_exit "Frontend 'npm install' failed."
    log "Compiling frontend (with memory limit to prevent OOM)..."
    export NODE_OPTIONS="--max-old-space-size=2048"
    npm run build || error_exit "Frontend build failed."
}

reload_applications() {
    log "Reloading PM2 applications with zero downtime..."
    cd "$APP_DIR"
    if pm2 list | grep -q "backend\|frontend"; then
        log "Applications found in PM2, reloading..."
        pm2 reload config/ecosystem.config.js --env production --update-env || error_exit "Failed to reload apps via PM2."
    else
        log "Applications not running, starting them..."
        pm2 start config/ecosystem.config.js --env production || error_exit "Failed to start apps via PM2."
    fi
    pm2 save || log "Warning: Failed to save PM2 process list."
}

# --- MAIN EXECUTION PIPELINE ---

main() {
    echo "======================================================"
    echo "  USG INDIA - SECURE DEPLOYMENT PIPELINE RUNNING"
    echo "======================================================"
    
    sudo touch "$LOG_FILE" || echo "Warning: Cannot create log file at $LOG_FILE"
    sudo chmod 666 "$LOG_FILE" 2>/dev/null || true

    log "Starting deployment pipeline..."
    
    check_prerequisites
    pull_latest_code
    start_infrastructure
    build_backend
    build_frontend
    reload_applications

    log "Deployment completed successfully!"
    echo "======================================================"
    pm2 list
    echo "======================================================"
}

main "$@"
