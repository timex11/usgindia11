#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

echo "=========================================="
echo "   USG India - PRODUCTION MODE"
echo "=========================================="
echo ""

if [ ! -d "backend/dist" ] || [ ! -d "frontend/.next" ]; then
    echo "[ERROR] Project not built. Please run scripts/setup.sh first."
    exit 1
fi

cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

echo "Starting Backend (Production)..."
cd backend || exit 1
npm run start:prod &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting Frontend (Production)..."
cd frontend || exit 1
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Production environment running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo "Press Ctrl+C to stop."
wait
