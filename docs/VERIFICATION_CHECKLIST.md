# Verification Checklist - Path Fixes

## Pre-Deployment Verification

Use these commands to verify your path issues are fixed BEFORE deploying to Linux.

### Step 1: Verify Backend Builds (Windows)

```powershell
# Clear stale build
cd c:\Users\m\Music\usgindia\backend
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Build using fixed method
node build.js

# Expected output:
#   >  SWC  Running...
#   Successfully compiled: 92 files with swc (xxx ms)

# Verify dist exists
if(Test-Path dist) { Write-Host "✓ Backend dist created" } else { Write-Host "✗ Failed" }
```

### Step 2: Verify Frontend Builds (Windows)

```powershell
# Clear stale build  
cd c:\Users\m\Music\usgindia\frontend
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Build using fixed method
node build.js

# Expected output:
#   ▲ Next.js 16.1.4
#   - Environments: .env.local
#   Creating an optimized production build...
#   ✓ Compiled successfully
#   Route (pages)  Size
#   ...

# Verify .next exists
if(Test-Path .next) { Write-Host "✓ Frontend .next created" } else { Write-Host "✗ Failed" }
```

### Step 3: Test Backend Startup (Windows)

```powershell
cd c:\Users\m\Music\usgindia\backend

# Start production mode
npm run start:prod

# Expected output within 5 seconds:
#   [bootstrapping module]
#   ...all modules loading...
#   ✓ Nest application successfully started
#   Listening on port 3001

# In another PowerShell, test:
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health" -Method Get

# Expected response:
#   {"status":"ok"}

# Stop with: Ctrl+C
```

### Step 4: Test Frontend Startup (Windows)

```powershell
cd c:\Users\m\Music\usgindia\frontend

# Start production mode
npm start

# Expected output within 10 seconds:
#   ▲ Next.js 16.1.4
#   - Environment: production
#   - Listening on port 3000
#   - Ready

# In browser, visit: http://localhost:3000

# Should load the homepage without errors
# (Check browser console for any errors)

# Stop with: Ctrl+C
```

### Step 5: Verify Environment Variables (Both)

```powershell
# Backend
cd c:\Users\m\Music\usgindia\backend
$env:DATABASE_URL  # Should be: file:./dev.db
$env:PORT          # Should be: 3001
$env:SUPABASE_URL  # Should be set

# Frontend
cd c:\Users\m\Music\usgindia\frontend
$env:NEXT_PUBLIC_API_URL  # Should be: http://localhost:3001/api/v1
$env:NEXT_PUBLIC_SUPABASE_URL  # Should be set
```

---

## Pre-Linux Deployment Verification

Before transferring to Linux, verify on Windows that:

### Checklist

- [ ] Backend builds without errors: `node build.js`
- [ ] Frontend builds without errors: `node build.js`
- [ ] Backend starts on port 3001: `npm run start:prod`
- [ ] Frontend starts on port 3000: `npm start`
- [ ] Health endpoint responds: `curl http://localhost:3001/api/v1/health`
- [ ] Frontend loads: `curl http://localhost:3000` (or browser)
- [ ] No console errors in frontend (browser F12)
- [ ] Environment files exist: `.env` and `.env.local`
- [ ] database `dev.db` exists in project root
- [ ] All modules loaded in backend output

---

## Linux Deployment Verification

Once on Linux server, verify with:

```bash
# Install PM2
npm install -g pm2

# Deploy
cd /path/to/usgindia
bash start_prod.sh

# Verify status
pm2 status
# Expected: Both "backend" and "frontend" should show "online"

# Check logs
pm2 logs backend
pm2 logs frontend

# Test connections
curl http://localhost:3001/api/v1/health
curl http://localhost:3000

# Save for auto-restart
pm2 save
pm2 startup
```

---

## Troubleshooting Windows Build Issues

### Issue: "The system cannot find the path specified"

**Still getting this?** Try:

```powershell
# Clear everything and rebuild
cd c:\Users\m\Music\usgindia\backend
Remove-Item -Recurse -Force dist, node_modules\.bin -ErrorAction SilentlyContinue
npm ci  # Fresh install
node build.js  # Should work now

cd c:\Users\m\Music\usgindia\frontend
Remove-Item -Recurse -Force .next, node_modules\.bin -ErrorAction SilentlyContinue
npm ci  # Fresh install
node build.js  # Should work now
```

### Issue: "Module not found"

```powershell
# Reinstall dependencies
npm ci --verbose  # With verbose output to see what's happening

# Verify workspace root
npm ls nestjs  # Check NestJS installation
npm ls next    # Check Next.js installation
```

### Issue: Port already in use

```powershell
# Find process on port 3001
Get-NetTCPConnection -LocalPort 3001

# Kill it
Stop-Process -Id <pid> -Force

# Same for 3000
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

### Issue: Database not found

```powershell
# Check database file
Test-Path "./dev.db"  # Should be True

# Check database path in .env
Get-Content backend\.env | Select-String DATABASE_URL
# Should show: DATABASE_URL="file:./dev.db"
```

---

## Quick Verification Summary

| Component | Windows | Linux |
|-----------|---------|-------|
| Backend build | `node build.js` | `npm run build` ✓ |
| Frontend build | `node build.js` | `npm run build` ✓ |
| Backend start | `npm run start:prod` | PM2 via `start_prod.sh` |
| Frontend start | `npm start` | PM2 via `start_prod.sh` |
| Verify health | `curl http://localhost:3001/health` | `curl http://localhost:3001/health` |
| Verify frontend | `http://localhost:3000` | `http://localhost:3000` |
| Check logs | Console output | `pm2 logs` |

---

## Expected Output When Everything Works

### Backend Startup:
```
[Nest] 23476  - 02/16/2026, 1:15:AM   LOG [NestFactory] Starting Nest application...
[Nest] 23476  - 02/16/2026, 1:15:AM   LOG [InstanceLoader] HttpModule dependencies initialized
...
[Nest] 23476  - 02/16/2026, 1:15:AM   LOG [RoutesResolver] JobsController {/jobs}
...
[Nest] 23476  - 02/16/2026, 1:15:AM   LOG [NestApplication] Nest application successfully started
✓ Listening on port 3001
```

### Frontend Startup:
```
▲ Next.js 16.1.4 (Turbopack)
- Environment: production
- Server: http://localhost:3000
- Listening on port 3000

✓ Ready in 8.5s
```

### Health Check:
```json
{"status":"ok"}
```

---

## After Verification

Once everything works:

1. **Stage for Linux**: Copy project to Linux server as-is
   - All `build.js` fixes are included
   - `ecosystem.config.js` is ready
   - `start_prod.sh` is optimized

2. **Deploy on Linux**: Run `bash start_prod.sh`
   - No modifications needed
   - PM2 handles both services
   - Auto-restart on failure

3. **Monitor**: Use PM2 commands
   - `pm2 status` - Check processes
   - `pm2 logs` - View logs
   - `pm2 save` - Save config
   - `pm2 startup` - Enable auto-start on reboot

You're done! Both Windows and Linux ready to go.
