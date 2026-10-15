# Architecture & Data Specification
> **MYSchool ERP — JSS School**  
> *Define how every component, connection pool, and data model connects.*

---

## 01. System Overview

```
┌────────────────────────────────┐     ┌────────────────────────────────┐     ┌────────────────────────────────┐
│ 💻 CLIENT TIER                 │     │ ⚙️ APPLICATION & LOGIC TIER    │     │ 🗄️ DATA & STORAGE TIER         │
├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤
│ • Next.js 19 React Server      │ ──> │ • Next.js App Router Runtime   │ ──> │ • Supabase PostgreSQL 16+      │
│   Components (RSC) & Client    │     │   (Server Actions + Zod)       │     │   (ACID Relational Core)       │
│ • URL-Scoped Context:          │     │ • Feature-Sliced Domain Logic  │     │ • Supabase Supavisor Pooler    │
│   /[branch]/[dept]/[module]    │     │   (@/features/* Services)      │     │   (Transaction Mode Port 6543) │
│ • Global Branch/Ward Switcher  │     │ • Prisma Singleton Client      │     │ • Direct Port 5432 (Migrations)│
│ • Tailwind CSS + shadcn/ui     │ <── │ • Inngest Headless Queue       │ <── │ • Supabase Private S3 Buckets  │
│ • Direct S3 Upload via Presign │     │   (Async Batch PDF Generation) │     │   (Pre-Signed 60s Direct URLs) │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

---

## 02. Technology Stack & Framework Specifications

MYSchool ERP utilizes a unified, high-concurrency 7-tier architecture engineered for enterprise reliability across multi-campus operations:

### Tier 1: Frontend & User Interface Layer
- **Core Framework:** Next.js 15+ with React 19 (App Router). Leverages React Server Components (RSC) for instantaneous server rendering and minimal client JavaScript payload.
- **Styling Engine:** Tailwind CSS v3.4+ configured with custom institutional color variables (`#682038` Burgundy, `#FAF6F0` Cream, `#8B5E3C` Warm Bronze).
- **Component Primitives:** Accessible, headless primitives styled with Radix UI and Lucide React icons for dense, high-efficiency data tables, multi-campus comboboxes, and responsive modal dialogues.
- **Client State & Tenancy:** URL-driven state scoping (`/[branchSlug]/[departmentCode]/[module]`) ensuring zero cross-tab session bleeding and full deep-linking fidelity.

### Tier 2: Backend, API & Validation Layer
- **Runtime Environment:** Next.js App Router Server Actions and typed Route Handlers running on Node.js 20+ LTS / Edge Runtimes.
- **Programming Language:** TypeScript 5.x+ in Strict Mode (`"strict": true`, `"noImplicitAny": true`) enforcing end-to-end type safety from the SQL schema to frontend form fields.
- **Runtime Validation:** Zod schema validation across all Server Actions, public endpoints, and environment variables (`@/config/env.ts`), ensuring fail-safe runtime verification before any database interaction.

### Tier 3: Database & Connection Pooling Tier
- **Relational Core:** Supabase PostgreSQL 16+ featuring ACID compliance, foreign key relational integrity, automated 7-day Point-In-Time Recovery (PITR), and zero Linux VM maintenance overhead.
- **High-Concurrency Pooler:** Supabase Supavisor running in **Transaction Mode on Port 6543**. Multiplexes 500+ concurrent 8:30 AM attendance spikes into 15–25 physical database connections, completely eliminating serverless socket exhaustion.
- **Migration & Admin Port:** Direct PostgreSQL connection on **Port 5432**, strictly isolated for Prisma CLI migrations and schema pushes.

### Tier 4: ORM & Data Access Layer
- **Object-Relational Mapping:** Prisma ORM (Latest Stable) providing type-safe database queries, schema migrations (`prisma/schema.prisma`), and auto-generated TypeScript client typings.
- **Database Client Singleton:** Centralized singleton (`src/lib/prisma.ts`) preventing redundant connection pool spawning across serverless hot reloads.
- **Dual-URL Configuration:** Configured with `DATABASE_URL` (Supavisor pooler on port 6543) and `DIRECT_URL` (direct PostgreSQL on port 5432).

### Tier 5: In-Memory Cache, Rate Limiting & Idempotency
- **Cache Engine:** Upstash Redis (Serverless HTTP/REST Redis).
- **Read-Heavy Caching:** Master metadata (academic calendars, branch configurations, department rosters, subjects) cached with a >90% hit ratio, deflecting ~80% of read traffic away from PostgreSQL during peak morning login hours.
- **Strict Idempotency Engine (`src/lib/idempotency.ts`):** Employs atomic Redis locks (`SET key NX EX 60`) on financial submissions (fees, UTR uploads) to prevent duplicate ledger records when parents double-tap submit on mobile connections.

### Tier 6: Authentication & Role-Based Access Control (RBAC)
- **Identity Provider:** NextAuth.js (Auth.js v5) with Credentials Provider.
- **Session Strategy:** Stateless, HTTP-only, encrypted Edge JWT cookies. Eliminates round-trip database queries inside Edge middleware for route protection (0ms auth latency).
- **7-Tier Role Hierarchy:** Enforces discrete permission boundaries for `SUPER_ADMIN`, `BRANCH_ADMIN`, `HOD`, `TEACHER`, `MANAGEMENT`, `PARENT`, and `STUDENT`.

### Tier 7: Object Storage, Media Pipeline & Async Background Workers
- **Direct S3 Upload Pipeline (`src/lib/storage.ts`):** Students and parents upload large fee receipts and statutory documents directly to Cloudflare R2 / Supabase Storage S3 buckets via short-lived (60s) HMAC pre-signed URLs. Completely bypasses Next.js server RAM and CPU (0MB server buffer).
- **Asynchronous Task Queue:** Inngest Headless Queue Worker. Implements the "Buzzer Token" pattern—returning an instant HTTP 200 with `jobId` in ~30ms for long-running batch operations.
- **Document Compilation:** `@react-pdf/renderer` compiling watermarked admit cards, multi-page fee receipts, and term report cards off-thread, streaming generated artifacts directly to private storage.

---

### Quick Sharing Summary Table

| Category | Technology | Target / Version | Core Architectural Function |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | React 19 / Next.js 15+ | Server components (RSC), URL-scoped multi-branch routing, zero client bloat. |
| **Language & Typings** | TypeScript | v5.x+ (Strict Mode) | Complete type safety from PostgreSQL schema to frontend client forms. |
| **UI & Styling** | Tailwind CSS + Lucide | v3.4+ / Vanilla CSS Vars | Accessible institutional design tokens, high-density data tables, responsive grids. |
| **Backend & API** | Next.js Server Actions | Node.js 20 LTS / Edge | Co-located RPC actions, zero REST boilerplate, typed mutations. |
| **Schema Validation** | Zod | v3.23+ | Runtime payload sanitization on forms, server actions, and environment variables. |
| **Relational Database** | Supabase PostgreSQL | PostgreSQL 16+ | Managed ACID database, row-level safety, 7-day point-in-time recovery (PITR). |
| **Connection Pooling** | Supabase Supavisor | Port 6543 (Transaction) | Multiplexes 500+ callers into 15–25 physical sockets; stops socket exhaustion. |
| **ORM & Data Layer** | Prisma ORM | Latest Stable | Type-safe migrations, auto-generated TypeScript models, dual-URL pooler support. |
| **In-Memory Cache** | Upstash Redis | Serverless REST Redis | Read-heavy caching (>90% hit rate) and atomic financial idempotency locks (`SET NX`). |
| **Auth & Security** | NextAuth.js (Auth.js) | v5 (Edge JWT) | Stateless encrypted session cookies; 0ms DB overhead in middleware; 7 RBAC roles. |
| **Object Storage** | Cloudflare R2 / S3 | S3-Compatible Buckets | 60-second HMAC presigned direct client uploads; 0MB server memory burden. |
| **Background Queue** | Inngest | Headless Task Queue | Async batch job queue (Buzzer Token pattern); prevents HTTP 504 timeouts. |
| **Document Compiler** | `@react-pdf/renderer` | Latest Stable | Headless rendering of watermarked admit cards and multi-page transcripts. |

---

## 03. Request Lifecycle

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ 1. CLIENT UI │ ──> │ 2. ROUTE & ACTION    │ ──> │ 3. DOMAIN SERVICE    │ ──> │ 4. DATABASE LAYER    │ ──> │ 5. RESPONSE & ASYNC  │
└──────────────┘     └──────────────────────┘     └──────────────────────┘     └──────────────────────┘     └──────────────────────┘
  Teacher clicks       Server Action receives       Feature service executes     Prisma singleton targets     Instant HTTP 200 (15ms).
  "Submit Register"    payload; Zod validates       business rules; isolates     Supavisor Pooler (Port       Background trigger fires
  with 40 student      `branchId` & `deptId`        data scope to active         6543) in Transaction Mode;   unexcused absence SMS to
  attendance states.   from URL context.            branch/wing.                 commits `createMany` (10ms). parents asynchronously.
```

### Key Request Path Workflows:
1. **Attendance Write:** Client sends 1 array payload $\rightarrow$ Zod validation $\rightarrow$ Service wraps in `db.attendance.createMany({ skipDuplicates: true })` $\rightarrow$ Supavisor executes in 1 socket (~10ms) $\rightarrow$ Return success $\rightarrow$ Trigger Inngest absence notice dispatch.
2. **Fee Verification & Partial Payments:** Parent selects payment gateway/UPI, enters UTR reference + receipt screenshot $\rightarrow$ Duplicate UTR check ensures transaction ID is globally unique $\rightarrow$ Recorded as `PENDING_VERIFICATION` (student balance strictly untouched) $\rightarrow$ Bursar audits physical bank statement $\rightarrow$ Manual `[APPROVE]` atomically decrements `due_amount` by `amount_declared` (supports partial payments) and issues an immutable digital receipt; `[REJECT]` requires a mandatory reason and alerts parent for re-submission.
3. **Document Audit & Rejection Loop:** Direct pre-signed S3 upload from browser $\rightarrow$ Document placed in Management Verification Queue $\rightarrow$ Bursar reviews split-screen document preview $\rightarrow$ `[VERIFY]` marks document approved; `[REJECT]` requires mandatory reason and renders active re-upload prompt on student/parent portal.
4. **Permanent Deletion Barrier:** Delete request $\rightarrow$ Staff must type student's exact `admission_no` into confirmation modal $\rightarrow$ Server Action verifies existence of 4 statutory exit certificates (TC, Character, Migration, No-Dues) marked `VERIFIED` $\rightarrow$ Hard block (HTTP 403) if any are missing or unverified $\rightarrow$ Archival to cold storage upon verified exit.
5. **Batch PDF Render (Buzzer Token Pattern):** Admin requests 2,000 admit cards/hall tickets $\rightarrow$ Next.js hands back `jobId` in ~30ms $\rightarrow$ Inngest headless worker compiles PDFs in chunks using `@react-pdf/renderer` $\rightarrow$ Streams zip/PDF directly to private Supabase Storage $\rightarrow$ Pre-signed 24h download URL saved to `bulk_job_logs` with active progress bar.
6. **Smart Substitution Matching (Collision Engine):** Absent teacher triggers leave $\rightarrow$ Assistant queries branch faculty timetable matrix cached in Upstash Redis $\rightarrow$ Identifies teachers with free period, matched wing/subject, and lowest substitution load that week $\rightarrow$ Coordinator confirms with 1 click $\rightarrow$ Atomic commit to `substitution_duties` without mutating master timetable $\rightarrow$ Push alert sent to substitute.
7. **Dual-Signoff Exam Grade Moderation:** Subject teacher inputs student term marks $\rightarrow$ Saved as `DRAFT` / `PENDING_MODERATION` $\rightarrow$ HOD opens moderation console with bell curves and class averages $\rightarrow$ `[APPROVE]` transitions status to `PUBLISHED` and unlocks student/parent lifetime report card download; `[REVISE]` flags anomalies with teacher feedback notes.

---

## 04. Relational Data Model Schema

```
┌────────────────────────────────┐       ┌────────────────────────────────┐       ┌────────────────────────────────┐
│ branches                       │       │ departments                    │       │ users                          │
├────────────────────────────────┤       ├────────────────────────────────┤       ├────────────────────────────────┤
│ id: String (CUID, PK)          │ ──┐   │ id: String (CUID, PK)          │ ──┐   │ id: String (CUID, PK)          │
│ organization_id: String (FK)   │   └── │ branch_id: String (FK)         │   └── │ branch_id: String (FK)         │
│ name: String ("Main Campus")   │       │ name: String ("PUC Wing")      │       │ email: String (Unique)         │
│ slug: String (Unique, "main")  │       │ code: String ("PUC", "PRIM")   │       │ password_hash: String          │
│ city: String                   │       └────────────────────────────────┘       │ role: Role (Enum: 7 Roles)     │
└────────────────────────────────┘                       │                        └────────────────────────────────┘
                                                         │                                         │
┌────────────────────────────────┐                       │                        ┌────────────────┴───────────────┐
│ classes                        │ <─────────────────────┘                        │ students                       │
├────────────────────────────────┤                                                ├────────────────────────────────┤
│ id: String (CUID, PK)          │ ─────────────────────────────────────────────> │ id: String (CUID, PK)          │
│ department_id: String (FK)     │                                                │ user_id: String (Unique, FK)   │
│ name: String ("Grade 10")      │                                                │ class_id: String (FK)          │
│ section: String ("A")          │                                                │ guardian_id: String (FK)       │
└────────────────────────────────┘                                                │ admission_no: String (Unique)  │
                │                                                                 │ dob: DateTime                  │
                │                                                                 └────────────────────────────────┘
                ├──────────────────────────────────────┬───────────────────────────────────────────┤
                ▼                                      ▼                                           ▼
┌────────────────────────────────┐   ┌────────────────────────────────┐          ┌────────────────────────────────┐
│ attendances                    │   │ fee_invoices                   │          │ student_documents              │
├────────────────────────────────┤   ├────────────────────────────────┤          ├────────────────────────────────┤
│ id: String (CUID, PK)          │   │ id: String (CUID, PK)          │          │ id: String (CUID, PK)          │
│ student_id: String (FK)        │   │ student_id: String (FK)        │ ──┐      │ student_id: String (FK)        │
│ recorded_by_id: String (FK)    │   │ invoice_no: String (Unique)    │   │      │ title: String                  │
│ date: Date                     │   │ total_amount: Decimal(10,2)    │   │      │ file_url: String               │
│ status: AttendanceStatus       │   │ paid_amount: Decimal(10,2)     │   │      │ certificate_type: Enum (Exit)  │
│ [Unique: student_id + date]    │   │ due_amount: Decimal(10,2)      │   │      │ status: VerificationStatus     │
└────────────────────────────────┘   └────────────────────────────────┘   │      │ rejection_reason: String?      │
                                                                          │      └────────────────────────────────┘
                                                                          ▼
                                                     ┌────────────────────────────────┐
                                                     │ payment_submissions            │
                                                     ├────────────────────────────────┤
                                                     │ id: String (CUID, PK)          │
                                                     │ invoice_id: String (FK)        │
                                                     │ transaction_id: String (UTR)   │
                                                     │ amount_declared: Decimal(10,2) │
                                                     │ status: VerificationStatus     │
                                                     │ verified_by_id: String? (FK)   │
                                                     └────────────────────────────────┘
```

### Core Schema Entity Summary:
* `branches`: Physical campuses (Main, North, Tech) with unique routing slugs.
* `departments`: Academic divisions (Primary, Secondary, PUC, Technical) bound to a branch.
* `users`: Consolidated authentication and role assignment (`SUPER_ADMIN`, `BRANCH_ADMIN`, `DEPT_HEAD`, `TEACHER`, `MANAGEMENT`, `STUDENT`, `PARENT`).
* `students`: Enrolled pupils mapped to a user account, class section, and guardian.
* `attendances`: Daily attendance records enforced unique by `[student_id, date]`.
* `fee_invoices` & `payment_submissions`: Two-phase fee ledger ensuring manual UTR reconciliation before balance updates.
* `student_documents`: Academic records, medical certificates, and mandatory exit barriers.
* `substitution_duties`: Dynamic daily teacher period substitutions without altering master timetables.
* `academic_histories`: Immutable lifetime archive for annual report cards and GPAs.
* `bulk_job_logs`: Asynchronous tracking table for headless Inngest batch PDF jobs.

---

## 05. Architectural Dependency Rules

```
┌──────────────────────────────────┐ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ 1. DUMB UI, SMART SERVICES       │ │ 2. BUSINESS RULE ENFORCEMENT     │ │ 3. ADDITIVE SCHEMA EVOLUTION     │
├──────────────────────────────────┤ ├──────────────────────────────────┤ ├──────────────────────────────────┤
│ • React components only handle   │ │ • No raw balance decrements.     │ │ • Never run `prisma db push`     │
│   state, events, and rendering.  │ │ • Mandatory exit documents guard │   with force-reset in production.  │
│ • No Prisma queries or SQL       │ │   student deletion.              │ │ • All schema updates must be     │
│   execution inside UI components.│ │ • Bulk single-payload attendance │   additive (new optional columns   │
│ • All operations route through   │ │   writes strictly enforced.      │   or standalone tables).           │
│   `@/features/*/server/*.service`│ │ • Batch PDFs offloaded to queue. │ │ • Migrations run via Port 5432.  │
└──────────────────────────────────┘ └──────────────────────────────────┘ └────────────────────────────────┘
```

### 5.1 Standard API Response Envelope
All Route Handlers and Server Actions return a uniform JSON envelope to guarantee predictable client-side state handling and error parsing:
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}
```

### 5.2 Universal Error Handling & Boundaries
* **Custom Error Hierarchy:** Domain services throw typed exceptions (`AppError`, `UnauthorizedError`, `NotFoundError`, `ValidationError`).
* **Safe Envelope Formatting:** Global try/catch wrappers serialize errors into `{ success: false, error: err.message }` with appropriate HTTP status codes (400, 401, 403, 404, 500).
* **React Error Boundaries:** Feature layouts wrap views with error boundary fallbacks to prevent whole-page crashes if an isolated sub-component fails.

### 5.3 Feature-Sliced Directory Hierarchy
Code is organized by business feature domains rather than technical file layers:
```
src/
├── app/                           # Next.js App Router (pages, layouts, route handlers)
│   └── [branchSlug]/[deptCode]/   # URL-driven multi-branch context boundaries
├── features/                      # Isolated domain slices
│   ├── attendance/                # components/, server/*.service.ts, schemas/*.zod.ts
│   ├── fees/                      # UTR verification queue, ledger services, receipt layouts
│   ├── documents/                 # Split-screen viewer, S3 pre-signed upload handlers
│   ├── students/                  # SIS profile, exit barrier guard, lifetime grade viewer
│   └── substitution/              # Timetable collision checks, daily period substitution
├── components/ui/                 # Headless, accessible UI primitives (shadcn/ui)
├── config/                        # Type-safe environment validation via Zod (env.ts)
└── lib/                           # db.ts (Prisma singleton), inngest.ts, storage.ts
```

### 5.4 Clean Engineering Conventions
* **Naming Standards:** PascalCase for React components/types (`AttendanceRoster.tsx`), camelCase for utilities/services (`verifyUtrPayment.ts`), snake_case for PostgreSQL database entities (`student_documents`).
* **Dumb UI, Smart Services:** React components only manage presentation and local UI state; business logic, database queries, and third-party APIs belong exclusively in `*.service.ts` domain services.
* **Dead-Code Elimination:** Proactive removal of unused imports, dead functions, and commented-out code blocks during every feature cycle.

---

## 06. Security, Authentication & Route Access Matrix

### 6.1 Authentication Mechanism: NextAuth.js (Auth.js v5)
* **Strategy:** Credentials Provider with secure, HTTP-only, SameSite=Lax JWT session cookies.
* **Zero Database Bottleneck:** Decodes `userId`, `role`, and `branchId` directly from the signed JWT in Next.js Edge middleware with **0ms database query latency**.
* **Unified Origin:** Shared cookies eliminate cross-origin third-party cookie blocking.

### 6.2 Route Access & Permission Matrix

| Route Pattern | Cleared Roles | Behavioral Guard & Unauthorized Handling |
| :--- | :--- | :--- |
| `/[branch]/[dept]/attendance` | `TEACHER`, `DEPT_HEAD`, `BRANCH_ADMIN` | Scoped to assigned classroom; non-teachers redirect to `/unauthorized`. |
| `/[branch]/[dept]/fees` | `MANAGEMENT`, `BRANCH_ADMIN`, `SUPER_ADMIN` | Bursar UTR audit queue & ledger clearance; 403 Forbidden for teachers/parents. |
| `/[branch]/[dept]/documents` | `MANAGEMENT`, `BRANCH_ADMIN` | Admission audit & statutory exit barrier verification; 403 Forbidden for others. |
| `/[branch]/[dept]/leaves` | `TEACHER`, `DEPT_HEAD`, `PARENT` | Scoped strictly to parent's active child or teacher's assigned classroom. |
| `/[branch]/[dept]/classes` | `BRANCH_ADMIN`, `DEPT_HEAD` | Section roster management & dynamic faculty period substitution duty. |
| `/admin/consolidated` | `SUPER_ADMIN` exclusively | Group-wide audit & cross-campus reports; 404 Not Found for campus-locked users. |

### 6.3 Environment Configuration Contract (`.env.example`)
* `DATABASE_URL`: `postgresql://postgres:[PWD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` (Port 6543)
* `DIRECT_URL`: `postgresql://postgres:[PWD]@db.[REF].supabase.co:5432/postgres` (Port 5432)
* `AUTH_SECRET`: 32-byte cryptographic secret for NextAuth JWT encryption
* `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: In-memory cache and API rate limiting
* `NEXT_PUBLIC_SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Supabase S3 private storage access
* `INNGEST_EVENT_KEY` & `INNGEST_SIGNING_KEY`: Headless background queue synchronization
* `SMS_GATEWAY_API_KEY`: SMS provider for morning unexcused absence alerts

### 6.4 Local Development Seed Strategy (`prisma/seed.ts`)
Run `npm run db:seed` on a fresh database to automatically provision the JSS School Central Board organization, 3 campus branches (`main`, `north`, `east`), core academic wings, and 1 demo account per role with pre-hashed credentials.

---

## 07. Failure Handling & Resilience Matrix

| Failure Scenario | Root Cause & Real-World Risk | Architectural Handling Strategy & Safeguard |
| :--- | :--- | :--- |
| **8:30 AM Attendance Surge** | **Serverless Socket Exhaustion:** 100+ teachers submitting at the bell creates hundreds of concurrent serverless threads, exhausting PostgreSQL's ~100 connection limit and throwing `FATAL: remaining connection slots are reserved`. | **Bulk Array Payload + Supavisor Pooling:** Classroom grid dispatches a single array of 40 students committed in ~10ms via Prisma `createMany` (100 total queries vs. 4,000). Supavisor (Port 6543) transaction mode holds physical database sockets only during query execution, multiplexing 500+ teachers across **15–25 physical connections**. |
| **Batch PDF Generation** | **HTTP 504 Gateway Timeout:** Compiling 500+ admit cards with student photos, barcodes, and watermarks requires 1–3 minutes of heavy CPU rendering, exceeding the 60s reverse proxy / browser timeout limit. | **Inngest Async Token Pattern:** Next.js offloads rendering to Inngest and returns an instant 200 response with `jobId` in ~30ms. Headless worker compiles PDFs in chunks, streams bundles directly to private Supabase Storage, and issues a 24-hour pre-signed download link to the admin dashboard. |
| **Invalid or Unmatched Fee UTR** | **Ledger Drift & Fraudulent Clearance:** Deducting dues prematurely upon parent payment intent causes massive financial discrepancies if the bank transfer fails or the UTR reference is invalid. | **Two-Step Manual Audit Queue:** Submissions are tagged `PENDING_VERIFICATION`; **student balance remains strictly untouched**. The campus bursar verifies the UTR against the school's physical bank statement. Only manual `[VERIFY & APPROVE]` triggers the atomic ledger deduction and generates an immutable receipt. |
| **Unverified Student Deletion** | **Regulatory Liability & Lost Transcripts:** Accidental or premature deletion before statutory clearance violates education board statutory mandates and permanently destroys student academic history. | **Statutory Exit Barrier Guard:** Programmatic barrier guards the deletion API. Checks `student_documents` to verify that **Transfer Certificate (TC)**, **Character Certificate**, and **No-Dues Clearance** exist with status `VERIFIED`. Deletion is hard-blocked if any slip is missing. |
| **Heavy Document Uploads (15MB Files)** | **Server RAM Exhaustion & 504 Timeouts:** Streaming multi-megabyte PDFs and scans through Next.js server threads burns CPU, saturates container RAM, and times out on mobile networks. | **Presigned S3 Direct Uploads (`src/lib/storage.ts`):** Next.js only signs a 60-second HMAC URL. Browser streams the file directly to S3/Cloudflare R2 via `DirectUploadZone.tsx`, keeping server RAM at **0MB** and CPU at **0%**. |
| **Mobile Payment Double-Clicks** | **Duplicate Ledger Submissions:** Parents on spotty 3G/4G connections double-tap "Submit Payment", spawning race conditions and duplicate transaction logs. | **Strict Idempotency Engine (`src/lib/idempotency.ts`):** Client modal attaches a UUID. Server executes an atomic Redis lock (`SET key NX EX 60`). Subsequent taps within the window return the cached pending response without writing to PostgreSQL. |
| **Local Dev Hot Reload Socket Leak** | **Exhausted Connection Slots:** Next.js hot module reloads create new Prisma client instances on every file save during development, rapidly saturating local PostgreSQL ports. | **Global Prisma Singleton:** `src/lib/db.ts` binds PrismaClient to `globalThis`, guaranteeing only one singleton instance is shared across module reloads. |

---

## 08. Read-Heavy Caching Architecture (Upstash Redis)

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│ Client Request (RSC)   │ ───> │ Upstash Redis Cache    │ ───> │ Supabase PostgreSQL    │
│ (e.g. Master Calendar) │      │ (Sub-5ms Edge Lookup)  │      │ (Fallback on Cache Miss│
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
                                    │ Cache HIT: Return (90%)       │ Cache MISS: Query DB,
                                    ▼                               ▼ setex TTL (1h - 24h)
```

### 8.1 Cached Entities & Invalidation Matrix
* **Academic Calendars & Cycles:** Cached at `cache:calendar:{branchId}` with 24-hour TTL; evicted on cycle modification.
* **Branch & Department Topology:** Cached at `cache:topology:{branchSlug}` with 12-hour TTL; evicted when admin edits wing codes.
* **Faculty Timetable Matrices (Smart Substitution):** Cached at `cache:timetables:{branchId}:{day}` with 6-hour TTL; evicted on permanent teacher re-allocation.
* **Subject Lists & Class Rosters:** Cached at `cache:classes:{departmentId}` with 4-hour TTL; evicted on section adjustments.

### 8.2 Strategic Benefits
1. **80% Database Load Reduction:** Eliminates repetitive queries for stationary institutional metadata during morning peak logins.
2. **Sub-15ms Page Initial Renders:** React Server Components (RSC) fetch cached metadata over low-latency REST calls before compiling layout HTML.
3. **Connection Pool Protection:** Keeps Supavisor transaction slots dedicated purely to write-heavy operations (attendance commits, UTR reconciliation, and grade publishing).

