# Replication Plan

## Objective
Replicate advanced features from `D:\usgindia` (Monorepo) and `Downloads` (React App) into the current `backend` (NestJS) and `frontend` (Next.js) workspace, while maintaining the current simple structure.

## Source Analysis
- **D:\usgindia**:
  - Backend: `ai`, `cms`, `audit`, `email`, `notifications`, `sms`.
  - Frontend: `ai`, `cms`, `system`.
- **Downloads**:
  - Frontend: `Tools`, `Chat`, `Universities` (already have `institutions`), `Career` (already have `jobs`).

## Implementation Steps

### Phase 1: Backend Modules (NestJS)
Adapting from `D:/usgindia/apps/api/src` to `backend/src`.
*Note: Will adapt Prisma calls to Supabase/TypeORM as per current project setup.*

1.  **AI Module**
    - Copy `ai.controller.ts`, `ai.service.ts`.
    - Functionality: likely wrapper for OpenAI/Gemini.
2.  **CMS Module**
    - Copy `cms.controller.ts`, `cms.service.ts`.
    - Functionality: Content management for the platform.
3.  **Notifications Module**
    - Copy `notifications.controller.ts`, `notifications.service.ts`.
    - Functionality: In-app, Email, SMS notifications.
4.  **Audit Module**
    - Copy `audit.service.ts`.
    - Functionality: Track user actions.

### Phase 2: Frontend Features (Next.js)
Adapting from `D:/usgindia/apps/web/app` and `Downloads`.

1.  **AI Section** (`/ai`)
    - Create `frontend/src/app/ai`.
    - Port AI chat/tools interfaces.
2.  **CMS Admin** (`/admin/cms`)
    - Create `frontend/src/app/(dashboard)/admin/cms`.
    - Port CMS management UI.
3.  **Tools Page** (`/tools`)
    - Port `Tools.tsx` from Downloads to `frontend/src/app/(dashboard)/tools`.
4.  **Chat/Community** (`/community`)
    - Enhance `frontend/src/app/(dashboard)/community` with `ChatPage.tsx` features from Downloads.

## Execution Strategy
- Read source file -> Adapt code (Fix imports, DB calls) -> Write to destination.
