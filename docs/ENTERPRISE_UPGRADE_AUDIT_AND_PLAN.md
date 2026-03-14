# Enterprise Organizational Level Upgrade: Audit & Implementation Plan

## 1. Audit Report

### 1.1 Database & Schema
*   **Current Status**: Using **SQLite** (`dev.db`). The schema (`schema.prisma`) is feature-rich (includes Exams, Departments, etc.) but uses `String` types instead of Enums for compatibility with SQLite.
*   **Requirement**: **PostgreSQL** (via Supabase) with proper Enums and Relations.
*   **Gap**: Critical. The database engine must be switched to PostgreSQL. Enums must be restored.

### 1.2 Backend Architecture (NestJS)
*   **Current Status**: **Feature-based modules** (`src/admin`, `src/auth`, etc.). This is standard for smaller NestJS apps but doesn't follow the Domain-Driven Design (DDD) requirement.
*   **Requirement**: **Layered DDD Structure** (Domain, Application, Infrastructure, Interface).
*   **Gap**: High. A structural refactor is needed, though it can be done iteratively.

### 1.3 Validation & Type Safety
*   **Current Status**: **Mixed**. `nestjs-zod` is installed and `ZodValidationPipe` is globally active (`main.ts`), but `class-validator` is also present.
*   **Requirement**: **Strict Zod** adoption.
*   **Action**: Ensure all DTOs are Zod-based and remove `class-validator` dependency eventually.

### 1.4 Logging & Monitoring
*   **Current Status**: Basic `LoggingMiddleware` and `NestJS` default logger.
*   **Requirement**: **Structured Logging** (Winston/Pino) with Correlation IDs.
*   **Gap**: Medium. Need to replace the default logger with a structured one for production-grade observability.

### 1.5 Security
*   **Current Status**: `helmet` and `throttler` (Rate Limiting) are configured. Authentication is handled via `SupabaseAuthGuard`.
*   **Requirement**: Enhanced security (CSP, HSTS, strict RLS).
*   **Status**: Good foundation. Need to review RLS policies in Supabase (SQL side).

### 1.6 Frontend (Next.js)
*   **Current Status**: Next.js 16+, Zustand, Shadcn/UI, Tailwind.
*   **Requirement**: Modern stack.
*   **Status**: **Excellent**. No major architectural changes needed here, mostly feature additions and polish.

---

## 2. Detailed Implementation Plan

### Phase 1: Backend Core Hardening (Immediate Focus)
**Goal**: Establish the enterprise foundation (DB, Validation, Logging).

1.  **Database Migration (SQLite -> PostgreSQL)**
    *   Set up Supabase project (if not already connected).
    *   Update `schema.prisma` to use `postgresql` provider.
    *   Restore `enum` definitions.
    *   Run `prisma migrate dev` to initialize the Postgres DB.
2.  **Validation Standardization**
    *   Audit all Controllers and DTOs.
    *   Convert any remaining `class-validator` DTOs to `nestjs-zod` schemas.
    *   Ensure all endpoints have Zod response schemas (for Swagger/OpenAPI accuracy).
3.  **Structured Logging**
    *   Install `nestjs-pino` or `winston`.
    *   Configure correlation IDs (request tracking).
    *   Update `LoggingMiddleware` to use the new logger.

### Phase 2: Architecture & Security
**Goal**: Refactor for scalability and security.

1.  **Refactor to DDD (Iterative)**
    *   Create `libs/common` or `src/shared` for shared kernel code.
    *   Move `admin` module to DDD structure as a pilot.
2.  **Security Audit**
    *   Review `helmet` CSP settings.
    *   Implement strictly scoped RLS policies in Supabase (SQL).
    *   Set up Audit Logging triggers in DB.

### Phase 3: Advanced Features
**Goal**: Real-time and Background processing.

1.  **Queues (BullMQ)**
    *   Verify Redis connection (required for BullMQ).
    *   Implement `EmailProcessor` for transactional emails.
2.  **Real-time (Socket.io)**
    *   Enhance `GatewayModule` for exam monitoring events (`proctor:focus-lost`).

### Phase 4: Frontend Polish
**Goal**: Professional UI/UX.

1.  **Global Error Handling**: Ensure API errors are displayed gracefully (Toasts).
2.  **Loading States**: Implement Skeleton loaders for all data-fetching components.
