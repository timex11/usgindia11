# Enterprise System Specifications

This document outlines the technical specifications for upgrading the USG India platform to an "Enterprise High-Level Organizational" standard.

## 1. Load Balancer & Reverse Proxy (`nginx.conf`)

**Objective:** Implement a robust Nginx configuration handling load balancing, SSL termination, and reverse proxying.

**File:** `backend/nginx.conf`

**Specifications:**
- **Upstream Blocks:** Define `upstream backend_servers` and `upstream frontend_servers` to allow for future horizontal scaling.
- **SSL Termination:** Include placeholders for SSL certificate paths (managed via Certbot/Let's Encrypt in production).
- **Security Headers:** Add strict security headers (HSTS, X-Frame-Options, X-Content-Type-Options).
- **Optimizations:** Enable Gzip, keepalive connections, and buffer sizing.

**Configuration Template:**
```nginx
worker_processes auto;
events { worker_connections 1024; }

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # Upstream definitions for Load Balancing
    upstream backend_servers {
        least_conn; # Load balancing strategy
        server localhost:3001 max_fails=3 fail_timeout=30s;
        # server localhost:3002; # Uncomment for additional instances
    }

    upstream frontend_servers {
        ip_hash; # Sticky sessions for frontend if needed
        server localhost:3000;
        # server localhost:3003; 
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name example.com www.example.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name example.com www.example.com;

        # SSL Config (Placeholders)
        # ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        # ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        # ssl_protocols TLSv1.2 TLSv1.3;
        # ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Gzip Compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;

        # Frontend Proxy
        location / {
            proxy_pass http://frontend_servers;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API Proxy
        location /api {
            proxy_pass http://backend_servers;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts for long-running operations (e.g., exports)
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }
    }
}
```

## 2. Enterprise Security (`main.ts` & `AppModule`)

**Objective:** Harden the application against common web vulnerabilities and abuse.

**Files:** `backend/src/main.ts`, `backend/src/app.module.ts`

**Specifications:**
- **Strict CORS:** Do not allow `*` or loose defaults. Use `ConfigService` to load allowed origins from `.env`.
- **Helmet CSP:** Update Content Security Policy to be compatible with new features but strict on external scripts.
- **Rate Limiting:** Ensure `ThrottlerModule` is configured for high-traffic endpoints (Auth/API).

**Implementation Details (`main.ts`):**
```typescript
// ... imports
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"], // Add analytics/monitoring domains here
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", configService.get<string>('FRONTEND_URL'), "https://*.supabase.co", "wss://*.supabase.co"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // For image serving
  }));

  // Strict CORS
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [
    'http://localhost:3000',
    'https://usgindia.com'
  ];
  
  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // ... rest of bootstrap
}
```

## 3. Advanced Queues & Workers

**Objective:** Offload heavy processing to background workers for scalability and compliance.

**Files:** `backend/src/workers/*`, `backend/src/audit/*`

**New Workers:**

### A. Audit Log Worker (`audit-log` queue)
*   **Purpose:** Asynchronously write audit logs to the database to prevent blocking main request threads during high-volume transactions.
*   **Trigger:** Interceptors/Services emit 'audit_log' event -> AuditService adds to Queue.
*   **Processor Logic:** Batch insert logs into `AuditLog` table.
*   **Implementation:** `backend/src/workers/audit.processor.ts`

### B. File Processing Worker (`file-processing` queue)
*   **Purpose:** Handle image resizing, virus scanning (mock/external API), and file format conversion.
*   **Trigger:** File upload controller.
*   **Processor Logic:** 
    1.  Download file from temporary storage.
    2.  Resize using `sharp`.
    3.  Scan (simulated).
    4.  Upload to permanent storage (Supabase Storage).
*   **Implementation:** `backend/src/workers/file.processor.ts`

### C. Notification Dispatch Worker (`notification-dispatch` queue)
*   **Purpose:** Separate from email worker. Handles in-app (WebSocket) and Push Notifications (FCM/OneSignal).
*   **Trigger:** System events (New Job, Exam Result).
*   **Processor Logic:**
    1.  Resolve user devices.
    2.  Send push notification.
    3.  Store in-app notification in DB.
    4.  Emit via WebSocket Gateway.
*   **Implementation:** `backend/src/workers/notification.processor.ts`

## 4. Missing Enterprise Pages

**Objective:** Provide administrators with deep visibility and control over the platform.

**Frontend Location:** `frontend/src/app/(dashboard)/admin/*`

### A. Admin > System Health (`/admin/system`)
*   **Upgrade Status:** *Existing but basic.*
*   **New Requirements:**
    *   **Redis Stats:** Memory fragmentation ratio, connected clients, hit rate.
    *   **Database Stats:** Active connections, query cache hit ratio, pool size.
    *   **Queue Health:** Jobs waiting/active/failed count for *each* queue (Email, Audit, File, etc.).
    *   **Visuals:** Real-time line charts for CPU/Memory over last 1 hour.

### B. Admin > Audit Logs (`/admin/audit`)
*   **Upgrade Status:** *New Page Required.*
*   **Features:**
    *   **Searchable Table:** Filter by User, Action (Create/Update/Delete), Entity (Job, User, Exam), Date Range.
    *   **Detail View:** JSON diff view showing `before` and `after` state of modified records.
    *   **Export:** CSV/JSON export button for compliance reports.

### C. Admin > User Management (`/admin/users`)
*   **Upgrade Status:** *Enhancement Required.*
*   **New Features:**
    *   **Role Matrix:** Visual grid to assign fine-grained permissions (e.g., `can_create_job`, `can_delete_user`) rather than just "Admin" vs "User".
    *   **Bulk Actions:** Select multiple users -> Suspend, Password Reset, Change Role.
    *   **Session Management:** View and revoke active sessions for a user.

### D. Organization Settings (`/admin/settings`)
*   **Upgrade Status:** *New Page Required.* (Distinct from User Settings)
*   **Features:**
    *   **Global Switches:** "Maintenance Mode" (locks non-admins out), "Allow Registration".
    *   **Branding:** Upload Logo, Favicon, set Primary Color (stored in DB/Config).
    *   **Legal:** Editors for "Terms of Service" and "Privacy Policy" content.
    *   **SMTP/Integration Config:** UI to test email connection or update API keys (encrypted).
