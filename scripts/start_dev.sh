#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

echo "=========================================="
echo "   USG India - DEV MODE"
echo "=========================================="
echo ""

if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "[ERROR] Dependencies not found. Please run scripts/setup.sh first."
    exit 1
fi

cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

echo "Starting Backend..."
cd backend || exit 1
npm run start:dev &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting Frontend..."
cd frontend || exit 1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Services are running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo "Press Ctrl+C to stop."
wait
