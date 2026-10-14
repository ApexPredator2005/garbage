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

## 02. Technology Stack

| Layer | Technology | Version / Configuration | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | React 19 / Next.js 15+ | Unified repository eliminates CORS; shares Zod & Prisma types; halves hosting overhead. |
| **Language** | TypeScript | Strict Mode (`5.x+`) | End-to-end type safety from database models to frontend form components. |
| **Database** | Supabase PostgreSQL | PostgreSQL 16+ | Managed ACID compliance, 7-day Point-In-Time Recovery (PITR), zero Linux VM maintenance. |
| **Connection Pooling** | Supabase Supavisor | Port `6543` (Transaction Mode) | Multiplexes 500+ concurrent requests into 15–25 physical connections during 8:30 AM peak. |
| **ORM / Query Engine** | Prisma ORM | Latest Stable | Type-safe migrations, auto-generated TypeScript models, dual-URL pooler compatibility. |
| **Authentication** | NextAuth.js (Auth.js) | v5 (Beta / Latest) | Credentials Provider + Edge JWT session cookies; zero DB hits in middleware. |
| **Async Task Runner** | Inngest | Headless Task Queue | Offloads multi-minute PDF rendering from main HTTP threads, preventing 504 timeouts. |
| **Document Compiler** | `@react-pdf/renderer` | React-based PDF Engine | Headless generation of watermarked, multi-page admit cards and report card bundles. |
| **Object Storage** | Supabase Storage | S3-Compatible Private Buckets | Stores student certificates and receipts outside SQL; pre-signed direct upload bypasses RAM. |
| **Validation Layer** | Zod | Runtime Schema Validation | Validates all server actions, form submissions, and environment variables (`@/config/env.ts`). |
| **Styling & Icons** | Tailwind CSS + Lucide | Vanilla CSS Variables | Clean, accessible design system matching institutional typography and high-density tables. |

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
| **Local Dev Hot Reload Socket Leak** | **Exhausted Connection Slots:** Next.js hot module reloads create new Prisma client instances on every file save during development, rapidly saturating local PostgreSQL ports. | **Global Prisma Singleton:** `src/lib/db.ts` binds PrismaClient to `globalThis`, guaranteeing only one singleton instance is shared across module reloads. |
