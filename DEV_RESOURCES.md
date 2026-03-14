# Developer Resources (Offline Mode)

This project has been configured for **Offline Development** using SQLite and a mocked Authentication system. You do not need a connection to Supabase to run the core features locally.

## 🚀 Quick Start

1.  Run `setup_dev.bat` to install dependencies and seed the database.
2.  Start Backend:
    ```bash
    cd backend
    npm run start:dev
    ```
3.  Start Frontend:
    ```bash
    cd frontend
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Login Credentials

The following users are pre-seeded with hardcoded UUIDs and bypassed authentication. You can use ANY password (e.g., `123456`) as the backend ignores it for these specific emails in Dev Mode.

| Role | Email | Features Enabled |
| :--- | :--- | :--- |
| **Admin** | `admin@usgindia.com` | System mgmt, User mgmt, CMS, Analytics |
| **Student** | `student@example.com` | Exams, Scholarships, Community, Mentorship |
| **Alumni** | `alumni@example.com` | Mentorship (as Mentor), Donations, Community |
| **Teacher** | `teacher@example.com` | Exam creation, Class management |
| **College** | `college@example.com` | Department verification, Student lists |

---

## 🛠️ Configuration Details

### Database
- **Provider**: SQLite
- **File**: `backend/dev.db`
- **Schema**: Updated to include `AlumniProfile`, `MentorshipRequest`, `Donation` (Feature par with `features.sql`).
- **Seed**: `backend/prisma/seed.ts` populates all tables.

### Authentication (Bypass)
- **Supabase**: Bypassed for the emails listed above.
- **Logic**: See `backend/src/auth/auth.service.ts`.
- **Token**: Returns `DEV_TOKEN_<ROLE>` which is trusted by the backend.
- **Frontend Sync**: The frontend `useAuthStore` might try to sync with Supabase and fail silently. This is expected. API calls will work because `LoginPage` manually sets the auth state.

### Ports
- **Frontend**: `3000`
- **Backend**: `3001`
- **Redis**: Disabled (`REDIS_SUPPORTED=false`)

---

## ⚠️ Limitations

- **Real Auth**: Signup/Login with *new* emails will try to contact Supabase and fail (unless you configure real keys).
- **Payments**: Donation processing is mocked.
- **File Uploads**: Might fail if depending on Supabase Storage (unless mocked or local driver used).
- **RLS**: Row Level Security policies are NOT enforced by SQLite/Prisma (they are a Postgres/Supabase feature). The backend logic should handle permission checks.
