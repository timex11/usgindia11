# Gap Analysis & Schema Design Report

## 1. Gap Analysis

### Current State vs. PRD Requirements

| Feature | PRD Requirement | Current Implementation | Gap / Action Required |
| :--- | :--- | :--- | :--- |
| **ORM / DB Management** | Type-safe ORM (Prisma) implicit for robust backend | Raw Supabase Client + SQL Scripts (`setup.sql`) | **Major Gap:** No Prisma implementation. Need to introduce Prisma for type safety and schema management. |
| **Authentication & RBAC** | 3-Tier (Admin, University, Student) | `auth` module, `RolesGuard`, Supabase Auth Triggers | **Aligned:** Logic exists. Need to ensure Prisma schema mirrors the existing SQL `profiles` and roles. |
| **Scholarships** | Comprehensive management & applications | Basic `scholarships` table. No application tracking. | **Gap:** Add `ScholarshipApplication` table and workflow status. |
| **Jobs / Placements** | Job listing & applications | `jobs` module exists in NestJS, but **NO tables** in SQL. | **Gap:** Create `Job` and `JobApplication` tables. |
| **Institutions** | University/College management | `universities` and `colleges` tables exist. | **Aligned:** Good base. Might need `Course`/`Department` tables later. |
| **Community** | Chat & Forums | `community_posts` (Forum) exists. Real-time Chat missing. | **Gap:** Add `Channel`, `DirectMessage`, `ChatMember` tables for real-time chat. |
| **Resources** | Study material sharing | `resources` table exists. | **Aligned:** Good base. |
| **CMS** | Content Management | `cms_content`, `site_blocks` tables exist. | **Aligned:** Good base. |
| **AI Command Center** | AI interactions | `ai_conversations`, `ai_messages` exist. | **Aligned:** Good base. |

## 2. Proposed Prisma Schema Design

This schema bridges the existing SQL structure with the missing PRD requirements.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Enums matching existing SQL types
enum UserRole {
  admin
  teacher
  student
  college
  alumni
}

enum MembershipStatus {
  pending
  active
  expired
}

enum ResourceType {
  notes
  guess_paper
  syllabus
  other
}

enum ApplicationStatus {
  pending
  reviewing
  accepted
  rejected
}

enum JobType {
  full_time
  part_time
  internship
  contract
}

// --- Core User & Auth ---

model Profile {
  id              String           @id @default(uuid()) // Links to auth.users
  email           String
  fullName        String?          @map("full_name")
  avatarUrl       String?          @map("avatar_url")
  role            UserRole         @default(student)
  
  // Student Specifics
  aadhaarNumber   String?          @map("aadhaar_number")
  universityId    String?          @map("university_id") // Foreign Key to University
  collegeId       String?          @map("college_id")    // Foreign Key to College
  membershipStatus MembershipStatus @default(pending) @map("membership_status")
  
  // Relations
  university      University?      @relation(fields: [universityId], references: [id])
  college         College?         @relation(fields: [collegeId], references: [id])
  
  uploadedResources Resource[]
  scholarshipApps   ScholarshipApplication[]
  jobApps           JobApplication[]
  
  // Community & Social
  posts             CommunityPost[]
  comments          CommunityComment[]
  
  // AI & System
  aiConversations   AiConversation[]
  notifications     Notification[]
  adminLogs         AdminLog[]
  
  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @updatedAt @map("updated_at")

  @@map("profiles")
}

// --- Institutions ---

model University {
  id        String    @id @default(uuid())
  name      String
  location  String?
  colleges  College[]
  profiles  Profile[]
  resources Resource[]
  
  createdAt DateTime  @default(now()) @map("created_at")

  @@map("universities")
}

model College {
  id           String     @id @default(uuid())
  universityId String     @map("university_id")
  name         String
  location     String?
  university   University @relation(fields: [universityId], references: [id], onDelete: Cascade)
  profiles     Profile[]

  createdAt    DateTime   @default(now()) @map("created_at")

  @@map("colleges")
}

// --- Opportunities (Scholarships & Jobs) ---

model Scholarship {
  id          String   @id @default(uuid())
  title       String
  description String?
  amount      String?
  deadline    DateTime?
  eligibility String?
  category    String?  // State, Central, Private
  link        String?
  
  applications ScholarshipApplication[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("scholarships")
}

model ScholarshipApplication {
  id            String            @id @default(uuid())
  scholarshipId String            @map("scholarship_id")
  userId        String            @map("user_id")
  status        ApplicationStatus @default(pending)
  
  scholarship   Scholarship       @relation(fields: [scholarshipId], references: [id], onDelete: Cascade)
  applicant     Profile           @relation(fields: [userId], references: [id], onDelete: Cascade)

  appliedAt     DateTime          @default(now()) @map("applied_at")
  
  @@unique([scholarshipId, userId]) // Prevent duplicate applications
  @@map("scholarship_applications")
}

model Job {
  id          String   @id @default(uuid())
  title       String
  company     String
  location    String?
  type        JobType  @default(full_time)
  description String?
  salaryRange String?  @map("salary_range")
  link        String?  // External link if applicable
  
  applications JobApplication[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("jobs")
}

model JobApplication {
  id        String            @id @default(uuid())
  jobId     String            @map("job_id")
  userId    String            @map("user_id")
  status    ApplicationStatus @default(pending)
  resumeUrl String?           @map("resume_url")
  
  job       Job               @relation(fields: [jobId], references: [id], onDelete: Cascade)
  applicant Profile           @relation(fields: [userId], references: [id], onDelete: Cascade)

  appliedAt DateTime          @default(now()) @map("applied_at")

  @@unique([jobId, userId])
  @@map("job_applications")
}

// --- Resources ---

model Resource {
  id           String       @id @default(uuid())
  title        String
  type         ResourceType
  subject      String?
  fileUrl      String       @map("file_url")
  
  universityId String?      @map("university_id")
  uploaderId   String?      @map("uploader_id")
  
  university   University?  @relation(fields: [universityId], references: [id])
  uploader     Profile?     @relation(fields: [uploaderId], references: [id])

  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  @@map("resources")
}

// --- Community (Forum & Chat) ---

model CommunityPost {
  id        String             @id @default(uuid())
  title     String
  content   String
  authorId  String?            @map("author_id")
  author    Profile?           @relation(fields: [authorId], references: [id])
  comments  CommunityComment[]

  createdAt DateTime           @default(now()) @map("created_at")
  updatedAt DateTime           @updatedAt @map("updated_at")

  @@map("community_posts")
}

model CommunityComment {
  id        String        @id @default(uuid())
  postId    String        @map("post_id")
  content   String
  authorId  String?       @map("author_id")
  
  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    Profile?      @relation(fields: [authorId], references: [id])

  createdAt DateTime      @default(now()) @map("created_at")

  @@map("community_comments")
}

// --- AI Command Center ---

model AiConversation {
  id        String      @id @default(uuid())
  userId    String?     @map("user_id")
  title     String?
  messages  AiMessage[]
  user      Profile?    @relation(fields: [userId], references: [id])

  createdAt DateTime    @default(now()) @map("created_at")

  @@map("ai_conversations")
}

model AiMessage {
  id             String         @id @default(uuid())
  conversationId String         @map("conversation_id")
  role           String         // 'user' or 'assistant'
  content        String
  conversation   AiConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  createdAt      DateTime       @default(now()) @map("created_at")

  @@map("ai_messages")
}

// --- System & CMS ---

model Notification {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")
  title     String
  body      String
  type      String?  // info, success, warning, error
  read      Boolean  @default(false)
  user      Profile? @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now()) @map("created_at")

  @@map("notifications")
}

model AdminLog {
  id        String   @id @default(uuid())
  adminId   String?  @map("admin_id")
  action    String
  details   Json?
  admin     Profile? @relation(fields: [adminId], references: [id])

  createdAt DateTime @default(now()) @map("created_at")

  @@map("admin_logs")
}

model CmsContent {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  body            String
  status          String   @default("draft") // draft, published
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("cms_content")
}
```

## 3. Implementation Roadmap

1.  **Initialize Prisma:**
    *   Install `prisma` and `@prisma/client`.
    *   Initialize with `npx prisma init`.
2.  **Schema Setup:**
    *   Copy the designed schema into `prisma/schema.prisma`.
    *   Ensure strict mapping to existing SQL table names (using `@@map`) to avoid data loss or conflicts if tables already exist.
3.  **Migration:**
    *   Run `npx prisma migrate dev --name init` to sync the DB state and generate the client.
    *   **Note:** Since existing tables are in `public` schema, Prisma will detect them. We might need to `prisma db pull` first to see exactly how Prisma interprets the current state, then merge with our design.
4.  **Backend Integration:**
    *   Create `PrismaModule` and `PrismaService` in NestJS.
    *   Replace `SupabaseService` calls with `PrismaService` calls for database operations.
    *   Keep `SupabaseService` for Auth and Storage (Buckets).
5.  **Feature Implementation:**
    *   Implement Jobs CRUD using Prisma.
    *   Implement Scholarship Applications.
    *   Update Community features.
