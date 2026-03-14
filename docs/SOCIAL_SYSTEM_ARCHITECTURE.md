# USGIndia Social & Chat System Architecture

## 1. Overview
This document outlines the architectural design for the new hybrid social and chat system for USGIndia. The system seamlessly blends features from Discord (Servers, Channels, DMs, Roles), Instagram (Visual Posts, Media), and Twitter (Feeds, Follows, Reposts, Likes) while maintaining an "organizational level" standard. 

Crucially, this design **adds** to the existing NestJS/Prisma/Next.js ecosystem without removing or modifying existing features.

---

## 2. Database Schema Additions (Prisma)
To support the new features, the following models will be appended to `backend/prisma/schema.prisma`. Existing models (like `Profile`, `CommunityPost`) remain completely intact. New relationships can be mapped to the existing `Profile` model.

```prisma
// --- SOCIAL NETWORK (Twitter/Insta style) ---

model SocialFollow {
  id          String   @id @default(uuid())
  followerId  String   @map("follower_id")
  followingId String   @map("following_id")
  
  follower    Profile  @relation("Following", fields: [followerId], references: [id], onDelete: Cascade)
  following   Profile  @relation("Followers", fields: [followingId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now()) @map("created_at")

  @@unique([followerId, followingId])
  @@map("social_follows")
}

model SocialPost {
  id             String        @id @default(uuid())
  content        String?
  authorId       String        @map("author_id")
  
  // Repost tracking
  isRepost       Boolean       @default(false) @map("is_repost")
  originalPostId String?       @map("original_post_id")
  
  // Metrics Cache
  likesCount     Int           @default(0) @map("likes_count")
  repostsCount   Int           @default(0) @map("reposts_count")
  repliesCount   Int           @default(0) @map("replies_count")
  
  // Relations
  author         Profile       @relation("SocialPosts", fields: [authorId], references: [id], onDelete: Cascade)
  originalPost   SocialPost?   @relation("Reposts", fields: [originalPostId], references: [id])
  reposts        SocialPost[]  @relation("Reposts")
  
  media          PostMedia[]
  likes          PostLike[]
  comments       PostComment[]

  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  @@map("social_posts")
}

model PostMedia {
  id          String     @id @default(uuid())
  postId      String     @map("post_id")
  url         String
  type        String     // 'image', 'video', 'document'
  
  post        SocialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now()) @map("created_at")

  @@map("social_post_media")
}

model PostLike {
  id          String     @id @default(uuid())
  postId      String     @map("post_id")
  userId      String     @map("user_id")
  
  post        SocialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user        Profile    @relation("PostLikes", fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now()) @map("created_at")

  @@unique([postId, userId])
  @@map("social_post_likes")
}

model PostComment {
  id          String     @id @default(uuid())
  postId      String     @map("post_id")
  authorId    String     @map("author_id")
  content     String
  
  post        SocialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  author      Profile    @relation("PostComments", fields: [authorId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@map("social_post_comments")
}

// --- CHAT & WORKSPACES (Discord style) ---

model Workspace {
  id          String            @id @default(uuid())
  name        String
  description String?
  iconUrl     String?           @map("icon_url")
  ownerId     String            @map("owner_id")
  
  owner       Profile           @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  channels    Channel[]
  roles       WorkspaceRole[]

  createdAt   DateTime          @default(now()) @map("created_at")
  updatedAt   DateTime          @updatedAt @map("updated_at")

  @@map("chat_workspaces")
}

model WorkspaceMember {
  id          String         @id @default(uuid())
  workspaceId String         @map("workspace_id")
  userId      String         @map("user_id")
  roleId      String?        @map("role_id")
  
  workspace   Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        Profile        @relation("WorkspaceMemberships", fields: [userId], references: [id], onDelete: Cascade)
  role        WorkspaceRole? @relation(fields: [roleId], references: [id])
  joinedAt    DateTime       @default(now()) @map("joined_at")

  @@unique([workspaceId, userId])
  @@map("chat_workspace_members")
}

model WorkspaceRole {
  id          String            @id @default(uuid())
  workspaceId String            @map("workspace_id")
  name        String
  permissions String            // JSON or bitfield for granular access
  color       String?
  
  workspace   Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  members     WorkspaceMember[]
  createdAt   DateTime          @default(now()) @map("created_at")

  @@map("chat_workspace_roles")
}

model Channel {
  id           String               @id @default(uuid())
  workspaceId  String?              @map("workspace_id") // Null for DMs
  name         String?              // Null for DMs
  type         String               @default("text") // 'text', 'voice', 'dm', 'group_dm'
  
  workspace    Workspace?           @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  messages     Message[]
  participants ChannelParticipant[] // Primarily for DMs/Group DMs
  
  createdAt    DateTime             @default(now()) @map("created_at")
  updatedAt    DateTime             @updatedAt @map("updated_at")

  @@map("chat_channels")
}

model ChannelParticipant {
  id          String   @id @default(uuid())
  channelId   String   @map("channel_id")
  userId      String   @map("user_id")
  
  channel     Channel  @relation(fields: [channelId], references: [id], onDelete: Cascade)
  user        Profile  @relation("ChannelParticipations", fields: [userId], references: [id], onDelete: Cascade)
  joinedAt    DateTime @default(now()) @map("joined_at")

  @@unique([channelId, userId])
  @@map("chat_channel_participants")
}

model Message {
  id             String              @id @default(uuid())
  channelId      String              @map("channel_id")
  authorId       String              @map("author_id")
  content        String
  hasAttachments Boolean             @default(false) @map("has_attachments")
  
  channel        Channel             @relation(fields: [channelId], references: [id], onDelete: Cascade)
  author         Profile             @relation("SentMessages", fields: [authorId], references: [id], onDelete: Cascade)
  attachments    MessageAttachment[]

  createdAt      DateTime            @default(now()) @map("created_at")
  updatedAt      DateTime            @updatedAt @map("updated_at")

  @@map("chat_channel_messages")
}

model MessageAttachment {
  id          String   @id @default(uuid())
  messageId   String   @map("message_id")
  url         String
  type        String   // 'image', 'file', 'video'
  
  message     Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("chat_message_attachments")
}
```

---

## 3. Backend Architecture (NestJS + Redis + BullMQ)

The backend needs to support high concurrency, fast realtime delivery, and heavy background processing to achieve an extreme-level architecture.

### 3.1 REST API Modules
- **`SocialModule`**:
  - `POST /api/social/posts`: Create a post/repost.
  - `GET /api/social/feed`: Fetch personalized feed (cursor-based pagination).
  - `POST /api/social/users/:id/follow`: Follow users.
- **`ChatModule`**:
  - `POST /api/chat/workspaces`: Create a server.
  - `POST /api/chat/channels`: Create channels.
  - `GET /api/chat/channels/:id/messages`: Infinite scroll message fetching.

### 3.2 WebSockets (Pub/Sub with Redis)
- **`ChatGateway`** (`@WebSocketGateway`): 
  - Subscribes to rooms corresponding to `channelId` and `workspaceId`.
  - Handles `sendMessage`, `typing_start`, `typing_stop`.
  - Uses **Redis Adapter** (`@nestjs/platform-socket.io`) to ensure users connected to different backend instances still receive messages from each other.
- **`PresenceGateway`**:
  - Tracks user online/offline status using Redis Sets (`sadd online_users <user_id>`).

### 3.3 Queues & Background Workers (BullMQ)
- **`feed-generation-queue`**: Uses Fan-out strategy. When a major profile posts, a worker updates the cached Redis feed for all active followers.
- **`media-processing-queue`**: Uploads via presigned URLs hit an S3/Supabase bucket. A webhook triggers this queue to generate thumbnails, compress images, and transcode videos in the background.
- **`notification-queue`**: Batches push notifications and emails to prevent spam and rate-limit issues.

---

## 4. Frontend Theme Upgrade: "Organizational Level"

To move away from a basic look and achieve a robust, professional, and visually appealing interface, the Next.js/Tailwind frontend will undergo a systematic theme upgrade.

### 4.1 Layout Structure
- **Three-Column Layout (Dashboard/Social View)**:
  - **Left Sidebar (250px)**: Collapsible navigation (Home, DMs, Workspaces, Profile, Settings) with active state indicators.
  - **Center Feed/Chat Area (Flexible, max 800px)**: The primary interaction zone. Clean scrollable area without main window scrollbars.
  - **Right Panel (300px)**: Contextual. Shows online users in a workspace, trending topics, or suggested follows.

### 4.2 Color Palette
Moving towards a "Corporate Glass" aesthetic:
- **Backgrounds**: Deep, rich slate for Dark Mode (`#0f172a` to `#020617`). Crisp white (`#ffffff`) to ultra-light gray (`#f8fafc`) for Light Mode.
- **Primary Accents**: High-contrast, trustworthy colors. 
  - Brand Primary: Ocean Blue (`#0ea5e9`) or Royal Blue (`#2563eb`).
- **Surfaces**: Use subtle distinctions. e.g., slightly elevated cards use `#1e293b` in dark mode, maintaining contrast without looking flat.

### 4.3 Typography
- **Font Family**: Switch to `Inter` or `Plus Jakarta Sans` for a highly legible, geometric, modern look.
- **Hierarchy**: 
  - Large, bold headings (tracking-tight) for sections.
  - Muted secondary text (`text-slate-500`) for timestamps, handles, and minor details to reduce visual noise.

### 4.4 UI Elements & Interactions
- **Borders & Shadows**: Abandon thick visible borders. Delineate elements using soft drop shadows (`shadow-sm` for cards, `shadow-lg` for modals) and extremely subtle borders (`border-slate-200/50` in light, `border-slate-800/50` in dark).
- **Glassmorphism**: Use backdrop blurs (`backdrop-blur-md bg-background/80`) for sticky headers, floating menus, and modals to give depth.
- **Micro-interactions**: Use `framer-motion` or Tailwind transitions for smooth hover states, button presses (scale down slightly), and skeleton loaders for all async data instead of standard spinners. 
- **Modals/Drawers**: Use Shadcn UI's `Dialog` and `Sheet` components extensively to keep users in context without full page reloads.

---
*End of Design Document*