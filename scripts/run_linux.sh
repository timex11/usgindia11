#!/bin/bash

# Exit on error
set -e

# Ensure we are in the project root
cd "$(dirname "$0")/.."

echo "Starting project in Linux Development Mode..."

# Function to cleanup on exit
cleanup() {
    echo "Stopping processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM EXIT

echo "Starting Backend (Port 3001)..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
fi
npx prisma generate
npm run start:dev &
BACKEND_PID=$!
cd ..

echo "Starting Frontend (Port 3000)..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Both services started. Press Ctrl+C to stop."
wait $BACKEND_PID $FRONTEND_PID
