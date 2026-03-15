#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

echo "=========================================="
echo "   USG India - COMPLETE SETUP (Linux/Mac)"
echo "=========================================="
echo ""

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

echo ""
echo "Setup Complete!"
