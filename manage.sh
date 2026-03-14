#!/bin/bash

cd "$(dirname "$0")"

show_help() {
    echo "=========================================="
    echo "   USG India - Advanced Server Management"
    echo "=========================================="
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup        - Complete local setup (install deps, generate prisma, build)"
    echo "  setup-offline- Offline dev setup (deps, Prisma push to SQLite & seed)"
    echo "  setup-vps    - Initial VPS environment setup (Docker, Node, PM2)"
    echo "  dev          - Start development servers (frontend + backend)"
    echo "  prod         - Start production servers (Docker Infra + PM2 Apps)"
    echo "  deploy       - Secure deployment pipeline (pull, build, PM2 reload)"
    echo "  health-check - Probe backend health endpoint"
    echo ""
}

if [ -z "$1" ]; then
    show_help
    exit 0
fi

log() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[$timestamp] [INFO] $1"
}

error_exit() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[$timestamp] [ERROR] $1" >&2
    exit 1
}

case "$1" in
    setup)
        echo "=========================================="
        echo "   USG India - COMPLETE SETUP (Linux/Mac)"
        echo "=========================================="
        echo "[1/4] Clearing Node processes..."
        pkill -f node || true
        sleep 1
        
        echo "[2/4] Setting up Backend..."
        cd backend || exit 1
        rm -rf node_modules package-lock.json
        npm install --legacy-peer-deps
        npx prisma generate
        npm run build
        cd ..
        
        echo "[3/4] Setting up Frontend..."
        cd frontend || exit 1
        rm -rf node_modules package-lock.json
        npm install --legacy-peer-deps
        npm run build
        cd ..
        
        echo "[4/4] Checking Environment..."
        if [ ! -f "backend/.env" ]; then
            if [ -f "backend/.env.example" ]; then
                cp backend/.env.example backend/.env
            else
                cat <<EOF > backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/usgindia
JWT_SECRET=your-secret-key-change-me
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
EOF
            fi
        fi
        
        if [ ! -f "frontend/.env.local" ]; then
            if [ -f "frontend/.env.local.example" ]; then
                cp frontend/.env.local.example frontend/.env.local
            else
                cat <<EOF > frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
            fi
        fi
        echo "Setup Complete!"
        ;;

    setup-offline)
        echo "=========================================="
        echo "   USG India - Offline Dev Mode Setup"
        echo "=========================================="
        if ! command -v node >/dev/null 2>&1; then error_exit "Node.js is not installed."; fi
        
        echo "[1/3] Installing Backend Dependencies..."
        cd backend || exit 1
        npm install
        
        echo "[2/3] Setting up Database (SQLite)..."
        npx prisma db push
        npx prisma db seed
        cd ..
        
        echo "[3/3] Installing Frontend Dependencies..."
        cd frontend || exit 1
        npm install
        cd ..
        
        echo "Setup Complete!"
        ;;

    setup-vps)
        echo "======================================================"
        echo "  USG INDIA - INITIAL VPS SETUP"
        echo "======================================================"
        echo "[1/6] Updating system and installing base utilities..."
        sudo apt-get update && sudo apt-get upgrade -y
        sudo apt-get install -y curl git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
        
        if ! command -v docker &> /dev/null; then
            echo "[2/6] Installing Docker..."
            sudo install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            sudo chmod a+r /etc/apt/keyrings/docker.gpg
            echo "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        fi
        
        if ! command -v node &> /dev/null; then
            echo "[3/6] Installing Node.js (LTS)..."
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        if ! command -v pm2 &> /dev/null; then
            echo "[4/6] Installing PM2..."
            sudo npm install -g pm2
        fi
        
        APP_DIR="/var/www/usgindia"
        echo "[5/6] Ensuring app directory exists at $APP_DIR..."
        sudo mkdir -p $APP_DIR
        sudo chown -R $USER:$USER $APP_DIR
        
        echo "[6/6] Environment Setup Complete!"
        ;;

    dev)
        echo "=========================================="
        echo "   USG India - DEV MODE"
        echo "=========================================="
        if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
            error_exit "Dependencies not found. Run ./manage.sh setup first."
        fi
        
        cleanup() {
            echo "Shutting down servers..."
            kill $(jobs -p) 2>/dev/null
            exit
        }
        trap cleanup SIGINT SIGTERM EXIT
        
        echo "Starting Backend..."
        cd backend || exit 1
        npm run start:dev &
        cd ..
        
        sleep 3
        
        echo "Starting Frontend..."
        cd frontend || exit 1
        npm run dev &
        cd ..
        
        echo "Services are running! Press Ctrl+C to stop."
        wait
        ;;

    prod)
        echo "=========================================="
        echo "   USG India - PRODUCTION INITIALIZATION"
        echo "=========================================="
        if ! command -v docker >/dev/null 2>&1; then error_exit "Docker is not installed."; fi
        if ! command -v pm2 >/dev/null 2>&1; then error_exit "PM2 is not installed."; fi
        
        echo "[1/3] Starting System Infrastructure (Postgres, Redis, Kafka, Nginx)..."
        docker compose up -d || error_exit "Failed to start Docker containers."
        
        echo "[2/3] Warming up infrastructure (10 seconds)..."
        sleep 10
        
        echo "[3/3] Starting Applications (Frontend & Backend) via PM2..."
        pm2 start config/ecosystem.config.js || error_exit "Failed to start PM2 applications."
        pm2 save
        
        echo "DEPLOYMENT COMPLETE! Your production environment is running."
        ;;

    deploy)
        echo "======================================================"
        echo "  USG INDIA - SECURE DEPLOYMENT PIPELINE RUNNING"
        echo "======================================================"
        APP_DIR=$(pwd)
        
        if ! command -v pm2 >/dev/null 2>&1; then error_exit "PM2 is not installed."; fi
        if ! command -v npm >/dev/null 2>&1; then error_exit "NPM is not installed."; fi
        
        log "Pulling latest changes from main branch..."
        git fetch origin main || log "Warning: Failed to fetch from origin"
        git reset --hard origin/main || log "Warning: Failed to reset to origin/main"
        
        if command -v docker &> /dev/null && [ -f "docker-compose.yml" ]; then
            log "Starting Docker infrastructure..."
            docker compose up -d || log "Warning: Failed to start Docker containers."
            sleep 5
        fi
        
        log "Building Backend system..."
        cd "$APP_DIR/backend" || error_exit "Backend directory missing."
        npm ci || npm install --legacy-peer-deps || error_exit "Backend install failed."
        npx prisma generate || error_exit "Prisma generate failed."
        npm run build || error_exit "Backend build failed."
        
        log "Building Frontend application..."
        cd "$APP_DIR/frontend" || error_exit "Frontend directory missing."
        npm ci || npm install --legacy-peer-deps || error_exit "Frontend install failed."
        npm run build || error_exit "Frontend build failed."
        
        log "Reloading PM2 applications with zero downtime..."
        cd "$APP_DIR"
        if pm2 list | grep -q "backend\|frontend"; then
            pm2 reload config/ecosystem.config.js --env production --update-env || pm2 start config/ecosystem.config.js --env production
        else
            pm2 start config/ecosystem.config.js --env production || error_exit "Failed to start apps via PM2."
        fi
        pm2 save || log "Warning: Failed to save PM2 process list."
        
        log "Deployment completed successfully!"
        pm2 list
        ;;

    health-check)
        node -e "const http=require('http');http.get('http://localhost:3001/api/v1/health',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(r.statusCode,d))}).on('error',console.error);"
        ;;

    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
