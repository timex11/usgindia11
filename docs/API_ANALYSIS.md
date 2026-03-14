# API Mismatch Analysis

## Backend Endpoints vs Frontend Calls

### 1. `Backend: WebhooksController` (`/webhooks`)
- `POST /webhooks/stripe`: No direct frontend call found (likely external).
- `POST /webhooks/supabase`: No direct frontend call found (likely external).

### 2. `Backend: TodosController` (`/todos`)
- `POST /todos`: Frontend calls `post<Todo>('/todos', ...)` in `todo-list.tsx`. **MATCH**
- `GET /todos`: Frontend calls `get<Todo[]>('/todos')` in `todo-list.tsx`. **MATCH**
- `PATCH /todos/:id`: Frontend calls `patch(/todos/${id}, ...)` in `todo-list.tsx`. **MATCH**
- `DELETE /todos/:id`: Frontend calls `del(/todos/${id})` in `todo-list.tsx`. **MATCH**

### 3. `Backend: ScholarshipsController` (`/scholarships`)
- `POST /scholarships`: No direct frontend call found in searched files (admin feature?).
- `GET /scholarships`: Frontend calls `apiClient<Scholarship[]>(/scholarships${queryString}, ...)` in `api-client.ts`. **MATCH**
- `GET /scholarships/:id`: Frontend calls `apiClient<Scholarship>(/scholarships/${id}, ...)` in `api-client.ts`. **MATCH**
- `POST /scholarships/:id/apply`: Frontend calls `post(/scholarships/${scholarshipId}/apply, ...)` in `scholarship-application-form.tsx`. **MATCH**
- `PATCH /scholarships/:id`: No direct frontend call found.
- `DELETE /scholarships/:id`: No direct frontend call found.

### 4. `Backend: ResourcesController` (`/resources`)
- `GET /resources`: Frontend calls `get<Resource[]>('/resources')` in `resources/page.tsx`. **MATCH**
- `GET /resources/:id`: No direct frontend call found.
- `POST /resources`: No direct frontend call found.
- `PUT /resources/:id`: No direct frontend call found.
- `DELETE /resources/:id`: No direct frontend call found.

### 5. `Backend: NotificationsController` (`/notifications`)
- `GET /notifications`: No direct frontend call found.
- `PATCH /notifications/:id/read`: No direct frontend call found.

### 6. `Backend: InstitutionsController` (`/institutions`)
- `GET /institutions`: Frontend calls `get<Institution[]>('/institutions')` in `institutions/page.tsx` and `get<University[]>('/institutions')` in `resources/page.tsx`. **MATCH**

### 7. `Backend: JobsController` (`/jobs`)
- `GET /jobs`: Frontend calls `fetch('${process.env.NEXT_PUBLIC_API_URL}/jobs?search=${search}')` in `jobs/page.tsx`. **MATCH**
- `GET /jobs/:id`: No direct frontend call found.
- `POST /jobs/:id/apply`: Frontend calls `post(/jobs/${jobId}/apply, ...)` in `job-application-form.tsx` and `fetch(...)` in `jobs/page.tsx`. **MATCH**
- `POST /jobs`: No direct frontend call found.
- `PUT /jobs/:id`: No direct frontend call found.
- `DELETE /jobs/:id`: No direct frontend call found.

### 8. `Backend: HealthController` (`/health`)
- `GET /health`: No direct frontend call found.

### 9. `Backend: FilesController` (`/files`)
- `POST /files/upload/avatar`: No direct frontend call found.
- `POST /files/upload/document`: No direct frontend call found.
- `GET /files/*path`: No direct frontend call found.
- `DELETE /files/*path`: No direct frontend call found.

### 10. `Backend: ExamsController` (`/exams`)
- `GET /exams`: Frontend calls `get<Exam[]>("/exams")` in `exams/page.tsx`. **MATCH**
- `GET /exams/:id`: Frontend calls `fetch('${process.env.NEXT_PUBLIC_API_URL}/exams/${params.id}')` in `exams/[id]/take/page.tsx`. **MATCH**
- `POST /exams`: No direct frontend call found.
- `POST /exams/:id/start`: Frontend calls `fetch('${process.env.NEXT_PUBLIC_API_URL}/exams/${params.id}/attempt')` (Note: Frontend uses `/attempt` suffix, backend uses `/start` or logic might be in attempt creation). **MISMATCH ALERT**: Backend `ExamsController` has `@Post(':id/start')`, but frontend calls `/exams/${params.id}/attempt`. I need to check if there is an `/attempt` route or if this is a mismatch.
- `POST /exams/attempts/:id/submit`: Frontend calls `fetch('${process.env.NEXT_PUBLIC_API_URL}/exams/attempts/${attemptId}/submit')` in `exams/[id]/take/page.tsx`. **MATCH**
- `POST /exams/attempts/:id/log-event`: Frontend calls `emit('exam_event')` via socket, not HTTP directly, but the backend controller has `@Post('attempts/:id/log-event')`. This might be dual-supported or a mismatch in protocol understanding.

### 11. `Backend: ContactController` (`/contact`)
- `POST /contact`: No direct frontend call found.
- `GET /contact`: No direct frontend call found.

### 12. `Backend: CommunityController` (`/community`)
- `GET /community/posts`: Frontend calls `get<Post[]>('/community/posts')` in `community/page.tsx`. **MATCH**
- `GET /community/messages/:roomId`: Frontend calls `get<ChatMessage[]>(/community/messages/${roomId})` in `chat-interface.tsx`. **MATCH**
- `POST /community/posts`: No direct frontend call found.
- `POST /community/posts/:id/comments`: No direct frontend call found.
- `GET /community/posts/:id/delete`: No direct frontend call found.

### 13. `Backend: AuthController` (`/auth`)
- `POST /auth/login`: Frontend calls `fetch('${process.env.NEXT_PUBLIC_API_URL}/auth/login', ...)` in `login/page.tsx`. **MATCH**
- `POST /auth/register`: Frontend calls `fetch('${process.env.NEXT_PUBLIC_API_URL}/auth/register', ...)` in `register/page.tsx`. **MATCH**
- `GET /auth/profile`: Frontend calls `apiClient('/auth/profile', ...)` in `api-client.ts`. **MATCH**
- `GET /auth/dashboard`: Frontend calls `get<DashboardData>('/auth/dashboard')` in `dashboard/page.tsx`. **MATCH**
- `GET /auth/admin`: No direct frontend call found.

### 14. `Backend: CmsController` (`/cms`)
- `GET /cms`: Frontend calls `get<CmsPage[]>('/cms')` in `admin/cms/page.tsx`. **MATCH**
- `GET /cms/:slug`: No direct frontend call found.
- `POST /cms`: Frontend calls `post('/cms', ...)` in `admin/cms/page.tsx`. **MATCH**
- `PUT /cms/:id`: Frontend calls `put(/cms/${editingPage.id}, ...)` in `admin/cms/page.tsx`. **MATCH**
- `DELETE /cms/:id`: Frontend calls `remove(/cms/${id})` in `admin/cms/page.tsx`. **MATCH**

### 15. `Backend: AppController` (`/`)
- `GET /`: No direct frontend call found.

### 16. `Backend: AiController` (`/ai`)
- `POST /ai/chat`: Frontend calls `apiClient<ChatResponse>("/ai/chat", ...)` in `ai/ask/page.tsx`. **MATCH**
- `GET /ai/history`: No direct frontend call found.
- `POST /ai/generate`: Frontend calls `apiClient<RecommendationResult>('/ai/generate', ...)` in `ai/recommend/page.tsx`. **MATCH**
- `GET /ai/recommendations/:userId`: No direct frontend call found.

### 17. `Backend: AlumniController` (`/alumni`)
- `GET /alumni`: No direct frontend call found.
- `GET /alumni/mentors`: Frontend calls `get<AlumniProfile[]>('/alumni/mentors')` in `alumni/page.tsx`. **MATCH**
- `POST /alumni/mentorship-request`: Frontend calls `post('/alumni/mentorship-request', ...)` in `alumni/page.tsx`. **MATCH**
- `POST /alumni/donation`: Frontend calls `post('/alumni/donation', ...)` in `alumni/page.tsx`. **MATCH**

### 18. `Backend: TeamController` (`/team`)
- `GET /team`: No direct frontend call found.
- `POST /team`: No direct frontend call found.
- `DELETE /team/:id`: No direct frontend call found.

### 19. `Backend: AdminController` (`/admin`)
- `GET /admin/stats`: Frontend calls `get('/admin/stats')` in `admin/page.tsx`. **MATCH**
- `GET /admin/users`: Frontend calls `get('/admin/users')` in `admin/page.tsx`. **MATCH**
- `GET /admin/ai-usage`: No direct frontend call found.
- `GET /admin/activity`: Frontend calls `get('/admin/activity')` in `admin/page.tsx`. **MATCH**
- `GET /admin/logs`: No direct frontend call found.
- `PATCH /admin/profile/:userId`: No direct frontend call found.
- `POST /admin/command`: Frontend calls `apiClient('/admin/command', ...)` in `api-client.ts`. **MATCH**
- `POST /admin/users/:userId/ban`: Frontend calls `post(/admin/users/${user.id}/ban, ...)` in `admin/user-management-tab.tsx`. **MATCH**
- `POST /admin/users/:userId/unban`: Frontend calls `post(/admin/users/${user.id}/unban, ...)` in `admin/user-management-tab.tsx`. **MATCH**
- `PATCH /admin/users/:userId/role`: Frontend calls `patch(/admin/users/${userId}/role, ...)` in `admin/user-management-tab.tsx`. **MATCH**
- `GET /admin/ai/settings`: No direct frontend call found.
- `PATCH /admin/ai/settings/:key`: No direct frontend call found.

## Critical Findings
1.  **Exam Attempt Creation Mismatch**:
    - Frontend: `POST /exams/${params.id}/attempt` (Line 63 in `exams/[id]/take/page.tsx`)
    - Backend: `POST /exams/:id/start` (Line 42 in `exams.controller.ts`)
    - **Action**: Fix frontend to use `/exams/${params.id}/start`.

2.  **Notification List**: `NotificationsController` has `GET /notifications`, but no frontend call was found. The dashboard is likely missing a notifications feed.

3.  **Community Posts Creation**: `POST /community/posts` exists but no frontend call found in `community/page.tsx`.

4.  **Files/Uploads**: `POST /files/upload/avatar` and `POST /files/upload/document` exist but no direct usage found.

5.  **Contact Form**: `POST /contact` exists but no frontend call found.

## Action Plan
1.  **FIX**: Update `frontend/src/app/(dashboard)/exams/[id]/take/page.tsx` to use correct endpoint `/exams/${params.id}/start` instead of `/attempt`.
2.  **VERIFY**: Check if `Backend: ExamsController` (`backend/src/exams/exams.controller.ts`) actually uses `startExam` mapped to `@Post(':id/start')` and returns the expected `attemptId`.
3.  **FIX**: Create `frontend/src/app/api/route.ts` or similar if needed, but primarily reconcile direct calls.
