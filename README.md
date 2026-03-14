# USG India - National Education Super Infrastructure OS

## Overview
USG India is not just a product; it is a **National-Scale Digital Education & Professional Infrastructure Platform**. It combines the complexity of LinkedIn, Instagram, Discord, Coursera, SAP (ERP layer), Salesforce (CRM layer), Notion (Workspace), and Government education infrastructure into a single, modular, and scalable ecosystem.

### Architectural Blueprint (13 Domains)
1. **Core System**: Identity, RBAC, Multi-tenant infrastructure.
2. **Discovery Layer**: University & Course Knowledge Graphs.
3. **Institutional ERP**: SAP-level academic & operational management.
4. **Professional Identity**: Career network & intelligence engine.
5. **Social Media Super Layer**: Content, Community, Creator Economy.
6. **Advanced Messaging Matrix**: E2E encryption, multimedia, P2P/P2G/P2I.
7. **Enterprise Office Suite**: Task boards, OKRs, HR, Payroll.
8. **AI Operating System**: Cross-domain intelligence embedded everywhere.
9. **National Data Intelligence**: Big data warehouse and analytics.
10. **Monetization Engine**: User premium, SaaS, Enterprise licensing.
11. **Security & Governance**: Zero-trust, GDPR/India-compliance ready.
12. **Infrastructure & Scaling**: Edge caching, horizontal scaling, observability.
13. **Government Integration**: Board APIs, National credential registry.

## Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **Supabase / PostgreSQL**: v15+ (The system relies heavily on Supabase for Auth & Realtime, and Postgres for the core schema).
- **Redis**: v6+ (For BullMQ and caching)

## Project Structure
- `backend/`: NestJS application (Modular Monolith, DDD).
- `frontend/`: Next.js 14+ application (App Router, Tailwind, Shadcn).
- `config/`: Configuration files.
- `scripts/`: Deployment scripts.

## Getting Started (Local Development)

### 1. Environment Setup
Copy the environment templates and configure them with your actual API keys (Supabase, Cloudflare, AI providers).
```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```
*Note: Ensure `DATABASE_URL` in `backend/.env` points to your Supabase Postgres connection pooler, and `DIRECT_URL` points directly to the DB for migrations.*

### 2. Backend Setup
Navigate to the backend directory, install dependencies, generate the Prisma client, and apply the "National-Scale" schema.
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init_national_scale
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Architecture Principles
- **Domain Driven Design (DDD)**: Clear bounded contexts.
- **Event-Driven Architecture**: Redis event bus and BullMQ pipelines.
- **Modular Monolith**: Ready for Microservices extraction.
- **Zero Cross-Domain DB Corruption**: Strict relational boundaries.
- **Observability-First**: Built-in audit logging and metrics.

## Troubleshooting
- **Prisma Validation Errors**: Ensure you run `npx prisma generate` if any schema changes occur.
- **Database Connection**: Verify Supabase credentials in the `.env` file. If migrating, ensure the `DIRECT_URL` is set correctly.
