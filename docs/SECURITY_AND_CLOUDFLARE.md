# USGIndia Security & Cloudflare Configuration Guide

This document outlines the recommended security configurations for USGIndia using Cloudflare to ensure enterprise-grade protection.

## 1. Cloudflare WAF (Web Application Firewall) Rules

To block common attacks like SQL Injection (SQLi) and Cross-Site Scripting (XSS), implement the following custom rules in the Cloudflare Dashboard under **Security > WAF > Custom rules**.

### Rule 1: Block Common Attack Patterns
- **Expression**: `(http.request.uri.path contains "/api/" and (sql_injection or xss or directory_traversal))`
- **Action**: Block
- **Description**: Blocks known SQLi, XSS, and Directory Traversal patterns targeting the API.

### Rule 2: Geo-Blocking (Optional)
- **Expression**: `not (ip.src.country in {"IN"})`
- **Action**: Managed Challenge
- **Description**: If USGIndia is strictly for users in India, challenge or block traffic from other countries to reduce the attack surface.

### Rule 3: Protect Sensitive Endpoints
- **Expression**: `(http.request.uri.path contains "/api/v1/admin" and not ip.src in {YOUR_OFFICE_IP})`
- **Action**: Block or Managed Challenge
- **Description**: Restrict access to admin endpoints to known IP ranges or enforce a challenge.

---

## 2. DNS & SSL/TLS Best Practices

### SSL/TLS Encryption Mode
- **Setting**: Full (Strict)
- **Reason**: Ensures a secure connection between Cloudflare and the origin server (Supabase/Vercel/Heroku). Requires a valid SSL certificate on the origin.

### Edge Certificates
- **Minimum TLS Version**: TLS 1.2 (or 1.3 for maximum security).
- **Opportunistic Encryption**: Enabled.
- **HSTS (HTTP Strict Transport Security)**: Enabled.
    - Max Age: 6 months.
    - Include subdomains: Enabled.
    - Preload: Enabled.

---

## 3. Rate Limiting Recommendations

Implement rate limiting to prevent brute-force attacks and API abuse.

### API Throttling
- **Path**: `/api/v1/*`
- **Characteristics**: IP Address
- **Requests**: 100 requests per 1 minute.
- **Action**: Managed Challenge (to allow humans but block bots).

### Auth Endpoints (High Sensitivity)
- **Path**: `/api/v1/auth/login`
- **Requests**: 5 requests per 5 minutes.
- **Action**: Block.

---

## 4. DDoS Protection

- **HTTP DDoS Attack Protection**: Set to "High" sensitivity.
- **Under Attack Mode**: Enable only during active high-stakes exam windows if suspicious traffic is detected.

---

## 5. Security Headers (Origin Side)

Ensure the NestJS backend uses `helmet` with the following configuration:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.supabase.co"],
      connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
    },
  },
  referrerPolicy: { policy: 'same-origin' },
}));
```

---

## 6. Supabase Security

- **RLS**: Always enable Row Level Security (managed via `scripts/security_rls_setup.sql`).
- **Connection**: Use SSL connection strings for database access.
- **Service Role Key**: NEVER expose the `service_role` key in the frontend or public repositories.
