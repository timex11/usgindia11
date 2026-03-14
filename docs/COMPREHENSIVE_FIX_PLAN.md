# OOM, Infinite Loop, and Duplication Fix Plan

## 1. Findings & Diagnosis

### A. Memory (OOM) Issues
- **Symptoms:** User reported "oom" (Out of Memory) errors.
- **Root Cause:**
    - Node.js default memory limit (approx 1.5GB-2GB) is often insufficient for large Next.js builds or NestJS applications with many dependencies.
    - `frontend/next.config.ts` did not have optimized package imports for heavy UI libraries.
- **Fix Strategy:**
    - Increase heap memory size using `NODE_OPTIONS="--max-old-space-size=4096"` (4GB) in `package.json` scripts.
    - Optimize Next.js bundling to tree-shake heavy libraries (`lucide-react`, `framer-motion`, `@radix-ui/*`).

### B. Infinite Loops & Recursion
- **Static Analysis:**
    - Searched for `while(true)`, `for(;;)`, and recursion patterns.
    - Found standard library usages in `node_modules` (safe).
    - No obvious infinite loops in user code (`backend/src` or `frontend/src`).
- **React Hooks (`useEffect`):**
    - `frontend/src/components/chat/chat-interface.tsx`: Correctly manages socket connection and message history fetching.
    - `frontend/src/components/admin/realtime-dashboard.tsx`: Correctly cleans up socket listeners.
    - `frontend/src/app/(dashboard)/exams/[id]/take/page.tsx`:
        - Uses `setInterval` for the timer. It correctly clears the interval on unmount (`return () => clearInterval(timer)`).
        - **Improvement:** The timer logic `setTimeLeft(prev => prev - 1)` runs every second. While not a leak, it causes re-renders. This is acceptable for a countdown timer.

### C. Duplications & Dependencies
- **Backend:** `prisma` and `@prisma/client` versions should match. Currently `^5.22.0` for client and `^5.22.0` (in devDependencies) for prisma CLI. This is good.
- **Frontend:** Dependencies look standard. No obvious duplicate packages (e.g., `react` listed twice with different versions).

## 2. Applied Fixes

### Step 1: Backend Memory Limit
Modified `backend/package.json` to increase memory for start/build scripts.

### Step 2: Frontend Memory Limit & Optimization
Modified `frontend/package.json` to increase memory.
Modified `frontend/next.config.ts` to optimize package imports.

### Step 3: Code cleanup
- Ensured `useSocket` in `frontend/src/hooks/useSocket.ts` correctly handles connection/disconnection to prevent socket leaks (multiple connections open if re-rendering occurs without cleanup). The existing code has a cleanup function `newSocket.disconnect()`, which is correct.

## 3. Verification
- The user can now run `npm run dev` or `npm run build` with significantly reduced chance of OOM.
- No malicious infinite loops were found.

## 4. Future Recommendations
- If OOM persists during *deployment*, ensure the host machine (e.g., AWS EC2, Vercel, Heroku) has at least 4GB RAM.
- Monitor `useEffect` dependencies in future features to avoid "effect loops" where a state update triggers the effect, which updates the state again.
