# Architecture & Data Specification
> **Devloft Campus Management System — College & Affiliated Institutions Edition**  
> *Technical architecture, tenant isolation with PostgreSQL RLS, modular NestJS monolith, and high-concurrency background processing.*

---

## 01. System Architecture Overview

```
┌────────────────────────────────┐     ┌────────────────────────────────┐     ┌────────────────────────────────┐
│ 💻 CLIENT PROCESS (apps/web)   │     │ ⚙️ MODULAR BACKEND (apps/api)  │     │ 🗄️ DATA & STORAGE TIER         │
├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤
│ • React 18 + Vite SPA / PWA    │ ──> │ • NestJS (Fastify Adapter)     │ ──> │ • PostgreSQL 16+ (Tenant RLS)  │
│ • Subdomain Tenancy:           │     │   API Process (main.ts, :4000) │     │   SET LOCAL app.tenant_id = id │
│   college.example.com          │     │ • NestJS BullMQ Worker Process │ ──> │ • Redis (Cache, Queues, PubSub)│
│ • Role-Adaptive Clean Dashboards│     │   Worker Process (worker.ts)   │     │   BullMQ, Idempotency Locks    │
│ • Multi-Ward Sibling Hub       │ <── │ • CASL Ability Authorization   │ <── │ • S3-Compatible Object Store  │
│ • Presigned Direct S3 Uploads  │     │ • OpenAPI / Swagger Generator  │     │   Presigned 60s Direct Streams │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

The system is deployed as a **modular monolith** within a **Turborepo + pnpm workspace**:
1. **API Process (`apps/api/src/main.ts`):** HTTP REST endpoints (under `/api/v1`) and WebSocket channels (`WS /ws/notifications`) running on NestJS with the Fastify adapter.
2. **Worker Process (`apps/api/src/worker.ts`):** Dedicated BullMQ worker handling off-thread PDF rendering (Puppeteer pool), email dispatches, Excel/CSV bulk imports, and scheduled reports.
3. **Web Client (`apps/web`):** Single-page application and PWA built with React 18 and Vite, consuming typed API client generated from OpenAPI specs.

---

## 02. Technology Stack & Framework Specifications

### Layer 1: Monorepo & Build Tooling
- **Workspace Manager:** `pnpm workspaces` (v12+) providing strict symlink isolation and deterministic package hoisting.
- **Build Orchestrator:** `Turborepo` (v2.4+) caching task outputs across packages (`build`, `lint`, `type-check`, `test`).
- **Workspace Layout:**
  - `apps/api`: NestJS application (API + Worker).
  - `apps/web`: React 18 + Vite application.
  - `packages/shared`: DTOs, Zod validation schemas, enums, CASL permission constants.
  - `packages/ui`: Shared React components styled with Tailwind CSS and Radix UI primitives.
  - `packages/api-client`: Auto-generated typed client from OpenAPI / Swagger.
  - `packages/config`: Shared TypeScript (`tsconfig.base.json`), ESLint, and Prettier configurations.
  - `packages/docker`: Docker Compose files (PostgreSQL 16, Redis, MinIO, Mail catcher) and Nginx configuration.

### Layer 2: Backend Runtime & Framework
- **Core Framework:** NestJS (Node.js LTS) utilizing the **Fastify Adapter** (`@nestjs/platform-fastify`) for ultra-high HTTP throughput.
- **Background Worker Engine:** BullMQ with Redis (`@nestjs/bullmq`). Heavy operations (batch fees, marksheets, reports, payroll) run strictly off-thread.
- **Language:** TypeScript 5.x+ in Strict Mode across API, web, and shared libraries.
- **Validation:** Dual-tier validation: DTOs validated via `class-validator` and `class-transformer` on the API layer, backed by shared `zod` schemas in `packages/shared`.
- **API Documentation:** Automatic OpenAPI (Swagger) generation at `/api/docs`.

### Layer 3: Database & Row-Level Security (RLS)
- **Database Engine:** PostgreSQL 16+ running on localhost / managed VPS with continuous WAL archiving.
- **Multi-Tenant Isolation:** Shared database, shared schema. Every tenant-owned table contains a non-nullable `tenant_id` UUID column.
- **Row-Level Security (RLS):** Every tenant table enforces PostgreSQL RLS via policies checking:
  ```sql
  CREATE POLICY tenant_isolation_policy ON <table>
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
  ```
- **Context Injection:** A NestJS interceptor opens a transaction per request, executes `SET LOCAL app.tenant_id = <id>`, and exposes the transaction to domain services through `AsyncLocalStorage`. The application database role cannot bypass RLS.
- **Database Access:** Prisma ORM (configured with dual URLs: pooled runtime connection and direct migration port).

### Layer 4: In-Memory Cache, Idempotency & Queues
- **Engine:** Redis (standalone / cluster) accessed via `ioredis`.
- **Queues:** BullMQ dedicated queues: `pdf`, `email`, `reports`, `imports`, `bulk-ops`, `payroll`, `notifications`.
- **Strict Idempotency Engine (`src/platform/idempotency.service.ts`):** Enforces atomic Redis distributed locks (`SET idempotency:[key] PENDING NX EX 60`) on financial and bulk mutations. Subsequent requests with the same key immediately return the pending/completed response.
- **Read-Heavy Caching:** Master configurations (academic calendars, programs, regulations, subjects, fee heads) cached with a >90% hit ratio.

### Layer 5: Authentication & Authorization (CASL)
- **Identity Provider:** NestJS Passport with custom JWT strategies.
- **Session Tokens:** Short-lived JWT access token (15 minutes) + rotating refresh token in an `httpOnly, Secure, SameSite=Lax` cookie for browsers, and body-delivered refresh token for native mobile clients.
- **Fine-Grained Permissions (CASL):** Data-driven ABAC/RBAC using `@casl/ability`. Permissions are modeled as `action:subject` pairs (`read:Student`, `update:Marks`, `approve:Leave`) conditioned by scope (e.g. HOD scoped to department, Faculty to allocated courses).

### Layer 6: Object Storage & Document Compilation
- **Direct S3 Upload Pipeline (`src/platform/storage.service.ts`):** 60-second HMAC presigned direct client uploads to AWS S3, Cloudflare R2, or MinIO. Keeps server RAM at **0MB** and CPU at **0%** during large file transfers.
- **Document Rendering:** Puppeteer (Headless Chrome) pool running inside the BullMQ worker process. Compiles watermarked admit cards, grade sheets, transcripts, and payslips from versioned HTML/React templates directly to object storage.

---

## 03. Unified Architecture Feature Matrix

| Feature Module | Base Devloft College Specification | Unified User Innovation Retained |
| :--- | :--- | :--- |
| **01. Admissions & SIS** | Merit list generator, seat matrix quota, sequential roll numbers, promotion dry-run. | **Statutory Exit Barrier Guard:** Programmatic blocker preventing student deletion until 4 statutory slips (TC, Character, Migration, No-Dues) are verified.<br>**Single-Parent Multi-Ward Sibling Hub:** Header switcher for parents with multiple enrolled wards. |
| **02. Attendance** | Subject/period marking, lock window with audited edit requests, condonation calculator. | **100ms Bulk Attendance Matrix:** Single-payload array of 40 students committed in ~10ms via batch insert. |
| **03. Academics & Timetables** | Regulations, L-T-P hours, CBCS course catalog, constraint-satisfaction timetable builder. | **Smart Substitution Assistant:** Timetable collision engine finding faculty with free periods in the matching wing, generating a 1-click ranked duty proposal without mutating master slots. |
| **04. Examination & Results** | Anonymous dummy coding, exam scheduling, hall tickets, SGPA/CGPA engine, revaluation. | **Dual-Signoff Grade Moderation:** Subject teacher entry $\rightarrow$ HOD Moderation console with bell curves and class averages $\rightarrow$ Approved $\rightarrow$ Published. |
| **05. Fees & Accounting** | Versioned fee heads, online gateway webhooks (Razorpay/Cashfree), double-entry ledger vouchers. | **Two-Step Manual UTR Verification Desk:** Offline bank transfer audit desk matching bank statements before ledger cut.<br>**Strict Redis Idempotency:** Prevents duplicate payments on mobile double-clicks. |
| **06. HR & Payroll** | Service books, recruitment pipeline, leave policy engine, statutory PF/ESI/PT/TDS, monthly payroll lock. | **Sandboxed Formula Engine:** Component calculations evaluated safely without `eval`. |
| **07. Communication** | Targeted circulars, WebSocket notifications, email outbox, helpdesk SLA ticketing. | **Cost-Saving Policy:** Strictly NO SMS/WhatsApp; in-app real-time notifications + email outbox only. |
| **08. Reports & Analytics** | Materialized read models, custom SQL report builder, regulatory returns (NAAC, NBA, NIRF, AISHE). | **Role-Adaptive Clean Dashboards:** Clutter-free views customized by role (Faculty, Bursar, Student, Parent, Admin). |

---

## 04. Request Lifecycle & Multi-Tenant Routing

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. CLIENT BROWSER│ ──> │ 2. NGINX REVERSE│ ──> │ 3. NESTJS GLOBAL│ ──> │ 4. FEATURE      │ ──> │ 5. POSTGRES RLS │
│    & SUBDOMAIN  │     │    PROXY (SSL)  │     │    GUARDS/PIPES │     │    SERVICE      │     │    TRANSACTION  │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
  Request sent to         Nginx validates SSL,    Fastify receives req;   Domain service        Prisma singleton
  college.example.com     serves static Vite      JwtAuthGuard checks     executes business     runs in TX with
  with JWT cookie.        bundle, proxies /api    token; TenantGuard      rules; sets audit     SET LOCAL app.
                          to :4000 on localhost.  validates subdomain.    event in outbox.      tenant_id = <id>.
```

1. **Subdomain Resolution:** The incoming HTTP host (`college.example.com`) is mapped to a `tenant_id`. `TenantGuard` asserts that the subdomain matches the tenant claim inside the user's JWT access token.
2. **Transaction-Scoped Tenant Binding:** A global interceptor wraps the request execution in a database transaction, executing `SET LOCAL app.tenant_id = '<tenant_id>'` before any service query is invoked.
3. **Service Layer Execution:** Domain services (`@campus/api/modules/*`) execute business rules, enforce CASL abilities (`@CheckPolicies`), and emit domain events (`@nestjs/event-emitter`).
4. **Outbox & BullMQ Relay:** Cross-module asynchronous reactions and heavy jobs are written to a database outbox table in the same transaction and picked up by BullMQ for background worker execution.

---

## 05. Summary Quick-Reference Table

| Layer | Primary Technology | Configuration / Version | Core Architectural Function |
| :--- | :--- | :--- | :--- |
| **Monorepo** | Turborepo + pnpm | v2.4+ / pnpm v12 | Workspace orchestration, cached builds, shared packages. |
| **Backend API** | NestJS (Fastify) | Node LTS / Fastify v5 | High-speed REST API (`/api/v1`) and WebSockets (`/ws/notifications`). |
| **Background Worker** | BullMQ + Redis | `@nestjs/bullmq` | Worker process (`worker.ts`) executing off-thread PDF rendering and reports. |
| **Frontend Web** | React 18 + Vite | TypeScript / React Router | Responsive PWA in `apps/web` with route-level code splitting. |
| **Database** | PostgreSQL 16+ | RLS Enabled | Shared DB, shared schema; strict tenant isolation via database policies. |
| **ORM** | Prisma ORM | Latest Stable | Type-safe migrations, dual-URL pooler, transaction tenant-scoping. |
| **Cache & Lock** | Redis (ioredis) | Standalone / Cluster | Caching (>90% hit rate) and atomic payment locks (`SET NX EX 60`). |
| **Authorization** | CASL | `@casl/ability` v6 | Data-driven ABAC/RBAC action:subject evaluation with scope conditions. |
| **Object Storage** | S3-Compatible Storage | AWS S3 / Cloudflare R2 | 60-second HMAC presigned direct uploads (0MB server RAM overhead). |
| **Document Compiler** | Puppeteer | Chromium Worker Pool | Off-thread compilation of watermarked marksheets, admit cards, and receipts. |
| **Validation** | Zod + class-validator | Shared Packages | End-to-end schema validation across forms, DTOs, and environment vars. |
| **Deployment** | Docker Compose + Nginx | Ubuntu LTS VPS | Nginx reverse proxy with SSL termination, API and worker under PM2/Compose. |
