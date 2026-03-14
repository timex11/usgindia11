# Windows Path Errors - Quick Fix Guide

## The Problem (Windows Only)

```
Error: The system cannot find the path specified
```

**Causes:**
1. npm PowerShell wrapper fails with spaces in `C:\Program Files\nodejs`
2. Bash scripts (`.bin/nest`, `.bin/next`) don't work in PowerShell
3. Path strings with backslashes break without proper quoting

## Quick Fixes for Windows Development

### Option 1: Direct Node Execution (WORKS BEST)

**Backend:**
```powershell
cd c:\Users\m\Music\usgindia\backend
node node_modules/@nestjs/cli/bin/nest.js build
node dist/main.js
```

**Frontend:**
```powershell
cd c:\Users\m\Music\usgindia\frontend
node node_modules/next/dist/bin/next build
node node_modules/.bin/next start
```

### Option 2: Use Fixed build.js Files

Your `build.js` files now bypass npm:

**Backend build:**
```powershell
cd c:\Users\m\Music\usgindia\backend
node build.js
```

**Frontend build:**
```powershell
cd c:\Users\m\Music\usgindia\frontend
node build.js
```

### Option 3: Use batch files on Windows

For convenience, create `build.bat` in each folder:

**backend\build.bat:**
```batch
@echo off
node node_modules/@nestjs/cli/bin/nest.js build
```

**frontend\build.bat:**
```batch
@echo off
node node_modules/next/dist/bin/next build
```

## Why Linux is Better

On Linux, both of these just work:
```bash
npm run build          # ✓ Works perfectly
npm run start:prod     # ✓ Works perfectly
bash start_prod.sh     # ✓ Uses PM2
```

## Your Project Structure

```
backend/
├── node_modules/
│   ├── @nestjs/cli/bin/nest.js    ← Use this directly
│   └── ...
├── build.js                        ← Fixed to use nest CLI directly
├── package.json
└── src/

frontend/
├── node_modules/
│   ├── next/dist/bin/next          ← Use this directly  
│   └── ...
├── build.js                        ← Fixed to use next CLI directly
├── package.json
└── src/
```

## Files Already Fixed

### 1. backend/build.js
```javascript
const nestJsPath = path.resolve('./node_modules/@nestjs/cli/bin/nest.js');
spawnSync('node', [nestJsPath, 'build']);  // ✓ Avoids npm wrapper
```

### 2. frontend/build.js
```javascript
const nextPath = path.resolve('./node_modules/next/dist/bin/next');
spawnSync('node', [nextPath, 'build']);    // ✓ Avoids npm wrapper
```

## For Linux Production

Nothing changes! Your scripts work on Linux:

```bash
# Deploy via PM2
npm install -g pm2
bash start_prod.sh

# That's it. No Windows path issues on Linux.
```

## Summary

| Situation | Solution | Command |
|-----------|----------|---------|
| Windows dev - build backend | Direct node | `node node_modules/@nestjs/cli/bin/nest.js build` |
| Windows dev - build frontend | Direct node | `node node_modules/next/dist/bin/next build` |
| Windows dev - run backend | Direct node | `node dist/main.js` |
| Windows dev - run frontend | Direct node/npm | `npm start` (works now) |
| **Linux prod** | PM2 | `bash start_prod.sh` |
| Linux prod - check status | PM2 | `pm2 status` |
| Linux prod - view logs | PM2 | `pm2 logs` |

## Root Cause Summary

Your project is fine. Windows PowerShell npm wrapper has issues with:
- Paths containing spaces (`C:\Program Files\...`)
- Bash script wrappers in `node_modules/.bin/`
- Mixed forward/backslash paths

The fix: Bypass npm, use node directly, target JavaScript entry points.
