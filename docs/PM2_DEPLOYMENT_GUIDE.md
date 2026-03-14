# PM2 Linux Deployment Guide

## Prerequisites
- Node.js v24+ installed
- SQLite database (dev.db) in project root
- `.env` files configured for both backend and frontend

## Quick Start

### 1. Install PM2 Globally
```bash
npm install -g pm2
```

### 2. Deploy on Linux
```bash
bash start_prod.sh
```

This script will:
1. Build backend with Prisma
2. Build frontend (Next.js)
3. Start both services via `ecosystem.config.js` using PM2

### 3. Verify Services
```bash
pm2 status
```

Expected output:
- **backend** - running on port 3001 (cluster mode, all CPU cores)
- **frontend** - running on port 3000 (single instance)

## Essential PM2 Commands

### View Status
```bash
pm2 status              # Show all processes
pm2 logs                # Stream all logs
pm2 logs backend        # Backend logs only
pm2 logs frontend       # Frontend logs only
```

### Control Processes
```bash
pm2 restart all         # Restart all services
pm2 restart backend     # Restart backend only
pm2 restart frontend    # Restart frontend only
pm2 stop all            # Stop all services
pm2 start all           # Start all services
```

### Management
```bash
pm2 delete all          # Remove from PM2
pm2 delete backend      # Remove backend from PM2
pm2 save                # Save current configuration (auto-restart on reboot)
pm2 startup             # Setup PM2 to auto-start on system boot
pm2 unstartup           # Remove auto-start
```

## Configuration

### Memory Limits (in ecosystem.config.js)
- Backend: 1GB max memory
- Frontend: 1GB max memory

Both will auto-restart if memory limit exceeded.

### Environment Variables
The script automatically uses:
- **Backend**: backend/.env
- **Frontend**: frontend/.env.local

Ensure these files contain:
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY`
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- `DATABASE_URL` (SQLite path)

## Troubleshooting

### Services not starting
```bash
# Check PM2 error logs
pm2 logs

# Rebuild and restart
bash start_prod.sh
```

### Port already in use
```bash
# Find process on port
lsof -i :3001  # Backend port
lsof -i :3000  # Frontend port

# Kill process
kill -9 <PID>
```

### Memory issues
```bash
# Check memory usage
pm2 monit

# Increase memory limits in ecosystem.config.js
# Change max_memory_restart from '1G' to '2G'
```

## Maintenance

### Daily operations
```bash
# Monitor services
pm2 monit

# View logs throughout the day
pm2 logs
```

### Weekly tasks
```bash
# Check disk space for logs
pm2 logs --lines 0  # Clear old logs if needed
```

### System reboot persistence
```bash
# Save current PM2 configuration
pm2 save

# Enable startup on system boot
pm2 startup
```

## Notes
- Backend runs in **cluster mode** (uses all available CPU cores)
- Frontend runs in **single instance** mode (Next.js handles concurrency)
- All services auto-restart on crash
- All processes log to PM2's log directory
