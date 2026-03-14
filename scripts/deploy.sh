#!/bin/bash

# Exit on error
set -e

# Ensure we are in the project root
cd "$(dirname "$0")/.."

echo "Deploying to production using PM2..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null
then
    echo "ERROR: PM2 not found. Install with: npm install -g pm2"
    exit 1
fi

echo "Building Backend..."
cd backend
npm install --legacy-peer-deps
npx prisma generate
npm run build
cd ..

echo "Building Frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "Restarting PM2..."
# Start or reload
pm2 start config/ecosystem.config.js --update-env || pm2 reload config/ecosystem.config.js --env production
pm2 save

echo "Deployment complete!"
pm2 status
