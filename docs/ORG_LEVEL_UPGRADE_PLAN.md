# USGIndia: Highly Professional Organizational Level Upgrade Blueprint

This document outlines the technical strategy for elevating the USGIndia project to an enterprise-grade platform. The focus is on security, scalability, maintainability, and a premium user experience.

---

## 1. Backend Hardening (NestJS)

### 1.1 Architectural Shift: Domain-Driven Design (DDD)
Transition from feature-based modules to a Layered DDD structure to ensure clear separation of concerns.

**Proposed Folder Structure (Per Module):**
- `domain/`: Pure business logic (Entities, Value Objects, Repository Interfaces).
- `application/`: Orchestration (Use Cases/Interactors, DTOs, Command/Query handlers).
- `infrastructure/`: Implementation details (Prisma/Supabase Repositories, External API adapters).
- `interface/`: External communication (Controllers, Sockets Gateways).

### 1.2 Validation & Type Safety: Zod Integration
Replace `class-validator` with **Zod** for runtime validation and shared types between frontend and backend.

- **Global ZodPipe**: Implement a global pipe to validate incoming requests against Zod schemas.
- **Contract-First DTOs**: Define schemas in `application/dtos/` and infer TypeScript types from them.

### 1.3 Modular Controller & Middleware Pattern
- **Base Controller**: Create an abstract `BaseController` to handle standardized JSON responses, pagination metadata, and error mapping.
- **Middleware Suite**:
    - `GlobalErrorHandler`: Catch all exceptions and map them to RFC 7807 problem details.
    - `RequestLogger`: Structured logging (using Winston or Pino) with Correlation IDs for trace-ability.
    - `SecurityHeaders`: Enhanced Helmet configuration (CSP, HSTS, XSS Protection).
    - `RateLimiter`: Redis-backed throttling per user/IP.

### 1.4 Real-time Engine: Socket.io
Focus on **Real-time Exam Monitoring** and **Instant Notifications**.

**Event Handlers:**
- `exam:start`: Initializes monitoring session.
- `proctor:focus-lost`: Triggers alert when student leaves tab.
- `proctor:sync`: Periodic snapshot of exam progress for crash recovery.
- `chat:message`: Real-time student-support communication.

### 1.5 Background Processing: BullMQ
Offload long-running tasks to a distributed queue.

- **Processors**:
    - `EmailProcessor`: Handlers for transactional emails (Auth, Reminders).
    - `PDFProcessor`: Asynchronous generation of Exam Results and Certificates using Puppeteer or React-PDF.
    - `SyncProcessor`: Scheduled synchronization with external job portals or government data.

---

## 2. Frontend Evolution (Next.js 14+)

### 2.1 State Management: Zustand
Adopt a decentralized state management approach using **Zustand**.

**Core Stores:**
- `useAuthStore`: Persisted session state, role-based access control (RBAC).
- `useUIStore`: Global UI state (sidebar, modals, dark mode).
- `useExamStore`: Transient state for active exams (timer, temporary answers).

### 2.2 UI Standard: Shadcn/UI & Tailwind
Elevate the UI to "Organizational Level" aesthetics.

- **Component Library**: Implement Shadcn/UI for consistent, accessible, and theme-able components.
- **Design Tokens**: Standardize colors, typography, and spacing in `tailwind.config.js`.
- **Framer Motion**: Subtle transitions for a high-end feel.

### 2.3 Business Logic: Custom Hooks
Extract complex logic from components into specialized hooks.

- `useAuth()`: Login/Logout/Refresh logic.
- `useProctoring(attemptId)`: Manages tab-switching detection and webcam monitoring logic.
- `useResourceSearch()`: Debounced search and filtering for jobs/exams.

---

## 3. Infrastructure & Security

### 3.1 Data Security: Supabase & RLS
- **RLS Policies**: Strict "least privilege" access. Users can only read their own attempts; Admins have scoped access.
- **DB Triggers**: Automatic audit logging for sensitive tables (`exams`, `user_profiles`).

### 3.2 Performance: Redis Caching
- **API Caching**: Cache result-heavy endpoints like `GET /exams` and `GET /jobs` with TTL (Time-To-Live).
- **Session Store**: Store active socket sessions and rate-limiting counters.

### 3.3 Perimeter Security: Cloudflare
- **WAF Rules**: Block common SQLi, XSS, and bot patterns.
- **DDoS Protection**: Enable "I'm Under Attack" mode during high-stakes exam windows.
- **CDN**: Cache static assets and global edge caching for public API responses.

---

## 4. Admin Dashboard (AdminJS)

Use **AdminJS** integrated into NestJS for rapid, yet professional administration.

- **Resources**: Map all Prisma models to AdminJS resources.
- **Custom Actions**: Implement "Export to CSV", "Bulk User Activation", and "Exam Result Recalculation".
- **Role-Based Admin**: Restrict dashboard sections based on admin sub-roles (e.g., "Content Manager" vs "Super Admin").

---

## 5. Summary of Key Architectural Shifts

1.  **From Monolithic Logic to DDD**: Ensuring the backend remains maintainable as USGIndia scales.
2.  **From Class-Validator to Zod**: Moving to a more robust, type-safe validation paradigm.
3.  **From Sync to Async**: Using BullMQ to ensure a responsive UI while heavy lifting happens in the background.
4.  **From Client-Side Only to RLS-First**: Moving security logic into the database layer for ultimate protection.
5.  **Professional Polish**: Standardizing on Shadcn/UI and Zustand for a modern, fluid user experience.
