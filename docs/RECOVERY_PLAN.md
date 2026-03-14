# Recovery and Enrichment Plan

This plan addresses the "corruption" and "poor system" feedback by performing a clean reset of the environment and injecting rich demonstration data.

## Phase 1: Foundation Repair
The audit shows the code structure is sound, but the runtime environment may be inconsistent.

1.  **Prisma Configuration**: Ensure `backend/prisma/schema.prisma` is optimized for Windows (completed in audit, but double-check).
2.  **Startup Script**: Enhance `start_dev.bat` to be more robust against missing dependencies.

## Phase 2: System Enrichment (Crucial Step)
To address the "poor" system feedback, we must seed the database with rich, realistic data. An empty system feels broken.

**New File:** `backend/prisma/seed.ts`
We will create a seeder that generates:
*   **Users:** Admin, Student, Alumni, University Admin profiles.
*   **Institutions:** 5 demo Universities with Colleges and Departments.
*   **Opportunities:** 10+ Scholarships and Jobs.
*   **Exams:** 1 fully functional "General Knowledge" exam with questions.
*   **Community:** Sample posts and comments.

## Phase 3: "Deep Clean" & Restart
We will perform a destructive reset of the local database to eliminate any "corruption".

1.  **Reset DB:** `npx prisma db push --force-reset` (Wipes `dev.db` and recreates schema).
2.  **Seed DB:** `npx prisma db seed` (Populates rich data).
3.  **Build:** Run a fresh build of backend and frontend.

## Execution Steps for Developer

1.  **Create Seeder:** Write `backend/prisma/seed.ts` with comprehensive fake data.
2.  **Configure Prisma:** Add `"seed": "ts-node prisma/seed.ts"` to `backend/package.json`.
3.  **Run Reset:** Execute the reset and seed commands.
4.  **Verify:** Run `verify_system.js` to ensure endpoints return the new data.
