#!/bin/bash

# USG India - VPS Environment Setup Script
# Targets: Ubuntu 22.04 / 24.04 LTS

set -e

echo "======================================================"
echo "  USG INDIA - INITIAL VPS SETUP"
echo "======================================================"

# 1. Update & Basic Tools
echo "[1/6] Updating system and installing base utilities..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# 2. Install Docker
if ! command -v docker &> /dev/null; then
    echo "[2/6] Installing Docker..."
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo "[2/6] Docker already installed. Skipping..."
fi

# 3. Install Node.js (LTS)
if ! command -v node &> /dev/null; then
    echo "[3/6] Installing Node.js (LTS)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "[3/6] Node.js already installed ($(node -v)). Skipping..."
fi

# 4. Install PM2 Globally
if ! command -v pm2 &> /dev/null; then
    echo "[4/6] Installing PM2..."
    sudo npm install -g pm2
else
    echo "[4/6] PM2 already installed. Skipping..."
fi

# 5. Create App Directory
APP_DIR="/var/www/usgindia"
echo "[5/6] Ensuring app directory exists at $APP_DIR..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 6. Final Summary
echo "[6/6] Environment Setup Complete!"
echo "======================================================"
echo "Prerequisites installed:"
echo " - Docker & Docker Compose"
echo " - Node.js $(node -v)"
echo " - PM2 $(pm2 -v)"
echo "======================================================"
echo "NEXT STEPS:"
echo "1. Clone your repository into $APP_DIR"
echo "2. Setup your .env files (frontend/.env.production and backend/.env)"
echo "3. Run the deployment script to start services."
