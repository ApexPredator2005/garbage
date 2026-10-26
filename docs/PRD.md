# Product Requirements Document (PRD)
> **Devloft Campus Management System — College & Affiliated Institutions Edition**  
> *A unified, multi-tenant engineering specification synthesizing Devloft's 8-module college architecture with high-concurrency enterprise innovations.*

---

## 01. Product Overview

| Property | Specification Details |
| :--- | :--- |
| **Product Name** | **Devloft Campus Management System** (College Campus Management System) |
| **Platform** | Decoupled Modular Monolith: NestJS API (Fastify adapter) + BullMQ Worker Process, React 18 + Vite SPA/PWA, Tailwind CSS + shadcn/ui |
| **Target Institution** | **Higher Education Colleges & Affiliated Institutions** (Engineering, Arts & Science, Professional, Autonomous & University-Affiliated) |
| **Core Architecture** | Turborepo + pnpm monorepo (`apps/api`, `apps/web`, `packages/shared`, `packages/ui`, `packages/api-client`), Subdomain-based tenancy (`college.example.com`) backed by PostgreSQL 16+ Row-Level Security (RLS) on `current_setting('app.tenant_id')`, BullMQ background queues with Redis, CASL data-driven authorization |
| **Primary Goal** | Digitize, automate, and connect all academic, administrative, financial, and regulatory operations across colleges—absorbing peak 8:30 AM attendance spikes, running deterministic merit-based admissions, executing double-entry ledger accounting, safeguarding fee reconciliation with strict idempotency and dual manual/online clearance, and generating university compliance returns (NAAC, NBA, NIRF, AISHE). |

### Technology Stack & Frameworks Summary

| Architectural Tier | Technology & Framework | Version / Configuration | Core Architectural Role |
| :--- | :--- | :--- | :--- |
| **Backend API** | NestJS (Node LTS) | Fastify Adapter | Modular monolith API process; dependency injection, guards, interceptors, OpenAPI generation. |
| **Worker Process** | BullMQ with Redis | `@nestjs/bullmq` / Node LTS | Dedicated `worker.ts` process for off-thread heavy jobs (Puppeteer PDF rendering, bulk emails, imports, reports). |
| **Frontend SPA/PWA** | React 18 + Vite | TypeScript / React Router | Client-rendered PWA in `apps/web`; route-based code splitting, TanStack Query, TanStack Table. |
| **Language & Typings** | TypeScript | v5.x+ (Strict Mode) | End-to-end type safety across API, web, and shared contracts (`packages/shared`). |
| **Styling & Design** | Tailwind CSS + shadcn/ui | Radix UI Primitives | Accessible components, institutional typography, dense academic tables, and responsive mobile layouts. |
| **Relational Database** | PostgreSQL 16+ | RLS Enabled | Relational integrity, transactions, JSONB configuration, and strict tenant isolation via Row-Level Security. |
| **Database Access** | Prisma (or Drizzle) | Dual-URL Pooler | Typed client, versioned migrations. Transaction-scoped tenant setting `SET LOCAL app.tenant_id = <id>`. |
| **In-Memory Cache & Queue** | Redis (ioredis) | Standalone / Cluster | BullMQ job queue, rate limiting, pub/sub for WebSockets, and read-heavy caching (>90% hit rate). |
| **Auth & Authorization** | JWT + Rotating Refresh | Argon2id + CASL | Short-lived access token (15m), httpOnly cookie for web, body token for mobile, CASL ABAC ability checks. |
| **Object Storage** | S3-Compatible Storage | AWS S3 / Cloudflare R2 / MinIO | 60-second HMAC presigned direct client uploads; 0MB server RAM and 0% CPU burden during file streaming. |
| **Document Compiler** | Puppeteer (Headless Chrome) | Pool in Worker Process | Server-side rendering of watermarked marksheets, admit cards, receipts, and certificates from HTML templates. |
| **Validation Layer** | Zod + class-validator | Shared Packages | Runtime sanitization on DTOs, forms, API payloads, and environment variables. |

---

## 02. Problem & Goal

```
┌──────────────────────────────────────────────────────────┐  ┌──────────────────────────────────────────────────────────┐
│ 🎯 OPERATIONAL PAIN POINTS SOLVED                        │  │ 🏆 TARGET SUCCESS OUTCOMES                              │
├──────────────────────────────────────────────────────────┤  ├──────────────────────────────────────────────────────────┤
│ • Multi-Campus Tenant Leaks: Naive multi-tenancy risks   │  │ • Strict DB-Level RLS: PostgreSQL enforces tenant_id     │
│   exposing confidential grades across affiliated colleges.│  │   isolation even if application code omits a query filter│
│                                                          │  │                                                          │
│ • Accounting Ledger Desync: Disconnected fee collection  │  │ • Automated Double-Entry Posting: Every fee demand,      │
│   leads to mismatched student dues and campus audit chaos│  │   receipt, waiver, and refund generates balanced vouchers │
│                                                          │  │                                                          │
│ • 8:30 AM Attendance Bottleneck: Morning roll-calls      │  │ • Bulk Attendance & Condonation: Single-array payload    │
│   overload server threads and delay exam eligibility.    │  │   marked in ~10ms with automated condonation calculator. │
│                                                          │  │                                                          │
│ • Timetable Substitution Chaos: Faculty morning absences │  │ • Smart Substitution Assistant: Instant clash-free duty  │
│   leave classrooms unmonitored and delay curricula.      │  │   assignment finding free teachers in the same wing.     │
│                                                          │  │                                                          │
│ • Premature Grade Publication: Rogue grading inputs      │  │ • Dual-Signoff Moderation: HOD moderation console with   │
│   reach parents before formal department moderation.     │  │   bell curves before final locking and SGPA calculation. │
│                                                          │  │                                                          │
│ • Accidental Student Purges: Missing statutory clearances│  │ • Statutory Exit Barrier Guard: Cryptographic check      │
│   causes regulatory liability under university mandates. │  │   requiring verified TC, Character, Migration & No-Dues. │
│                                                          │  │                                                          │
│ • Server RAM Exhaustion: 15MB document uploads hang node.│  │ • Presigned S3 Direct Streams: 0MB server memory overhead│
└──────────────────────────────────────────────────────────┘  └──────────────────────────────────────────────────────────┘
```

---

## 03. Target User Personas (11 Roles)

| Persona | Role Scope | Key Responsibilities & Capabilities | Actions / Badges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Platform Owner / Multi-Tenant Executive | Tenant onboarding, global platform configuration, audited cross-tenant support access. | `Tenant Provisioning` `Platform Audit` `Cross-Tenant View` |
| **Institution Admin** | College Principal / Director | Campus-wide settings, user roles, permission policies, academic calendar initialization. | `Campus Locked` `Role Control` `Cycle Init` |
| **Principal** | Academic Executive Head | Campus-level executive dashboards, cross-module approval workflows, institutional reports. | `Executive Dashboard` `Approval Chain` `Institutional Oversight` |
| **Registrar** | Academic Operations & Records | Admissions oversight, student lifecycle promotions/detentions, degree & marksheet issuance. | `Merit Allotment` `Promotion Engine` `Degree Signoff` |
| **Department Head (HOD)** | Departmental Academic Leader | CBCS faculty course allocation, period substitutions, grade moderation review, student leave signoff. | `Timetable Solver` `Grade Moderation` `Department Scope` |
| **Faculty** | Classroom Instructor / Lab Head | Period attendance register marking, LMS study materials & assignments, mark entry, personal schedule. | `Attendance Submit` `Mark Entry` `Workload View` |
| **Exam Controller** | Autonomous Exam Cell Head | Examination schemes, anonymous dummy coding, hall ticket generation, revaluations, result locking. | `Dummy Coding` `Result Locking` `Revaluation Desk` |
| **Accountant / Bursar** | Campus Finance & Accounts Head | Fee structure configuration, cashier day-close, online gateway & manual UTR clearance, double-entry vouchers. | `UTR Audit Desk` `Cashier Close` `Ledger Audit` |
| **HR Officer** | Staff Operations & Payroll Head | Employee service books, recruitment pipeline, leave policy engine, monthly payroll run, PF/ESI/TDS. | `Staff Master` `Payroll Run` `Statutory Challans` |
| **Student** | Enrolled Pupil / Scholar | CBCS course registration, timetable view, LMS assignments/quizzes, fee payments, lifetime report cards. | `Self Service` `CBCS Select` `Lifetime Transcripts` |
| **Parent (Optional)** | Household Pupil Guardian | Multi-ward switcher, fee payment submission (online gateway or UTR), attendance summary, published results. | `Multi-Ward Switcher` `Fee Pay` `Attendance Gauge` |

---

## 04. The 8 Feature Modules & Unified User Features

### 01. Admissions & Student Information System (SIS)
- **Enquiry & Lead Tracking:** Lead capture, source attribution, counsellor follow-ups, and conversion funnel analytics.
- **Dynamic Online Application:** Program-specific configurable forms (sections, required document uploads), application fee collection, draft auto-save.
- **Merit & Quota Engine:** Deterministic merit list generation with configurable tie-break rules (qualifying exam marks, date of birth), seat matrix quota allocation, waitlists, and offer letters.
- **Enrollment & Roll Generation:** Confirmation tied to minimum fee deposit; automated per-tenant sequential enrollment and roll number generation.
- **Student Profile Master:** Academic history, category/scholarship details, medical records, and document repository.
- **Statutory Student Exit Barrier Guard (User Feature Preserved):** Hard programmatic check blocking student deletion or issuing permanent exit until 4 statutory certificates (**Transfer Certificate, Character Certificate, Migration Certificate, and Campus No-Dues Slip**) are marked `VERIFIED`, requiring confirmation of the pupil's exact admission number.
- **Single-Parent Multi-Ward Sibling Hub (User Feature Preserved):** Unified parent profile mapped to multiple enrolled wards with a 1-tap header sibling switcher to toggle active student context without page reloads.

### 02. Attendance
- **Period-Wise & Subject-Wise Marking:** Bulk matrix marking on web and mobile PWA with large touch targets; 40-student single array committed in ~10ms.
- **Lock Window & Audited Edits:** Sessions automatically lock after a configured window (e.g. end-of-day); modifications require an approved `attendance_edit_request` and create an append-only audit log entry.
- **Student Leave & On-Duty:** Medical leave, event on-duty requests with document uploads and multi-stage approval chains.
- **Condonation & Eligibility Engine:** Automated percentage calculation excluding cancelled sessions; condonation application desk with fee integration; dynamic exam hall ticket eligibility gating.
- **Staff Attendance:** Device punch import API and CSV reconciliation without ever mutating raw punch logs.

### 03. Academics, Timetable & Learning
- **CBCS Structure & Regulations:** Programs, batches, semesters, sections, syllabus versions, and Choice-Based Credit System course catalogs (Theory, Lab, Elective, Open Elective) with L-T-P hours and prerequisites.
- **Faculty Allocation & Workload Balancing:** Teacher-to-course mapping with credit-hour load monitoring.
- **Constraint-Satisfaction Timetable Builder:** Conflict-free scheduling engine checking room capacity, teacher availability, and student section clashes.
- **Smart Substitution Assistant (User Feature Preserved):** Real-time timetable collision detection engine that scans daily faculty leaves, identifies teachers with free periods in the matching department/wing, and proposes a 1-click ranked substitution proposal without mutating master timetable slots.
- **Lightweight LMS:** Study material repository, assignments with server-enforced submission deadlines, auto-graded MCQ quizzes, and meeting links for Google Meet / Zoom.

### 04. Examination & Results
- **Assessment Schemes & Schedules:** Internal and external assessment weightage, passing criteria, exam timetables, room seating plans, and invigilation duty allocations.
- **Anonymous Dummy Coding:** Decouples student identity from physical answer scripts; anonymous codes accessible exclusively to the Exam Controller role.
- **Dual-Signoff Exam Grade Moderation (User Feature Preserved):** Multi-tier grading lifecycle: Subject teachers enter marks in `DRAFT` / `SUBMITTED`; HOD moderation console displays grade distribution curves, class averages, and standard deviation before approval; Exam Controller locks marks to compute immutable SGPA/CGPA result snapshots.
- **Transcripts & Verification:** Watermarked marksheets and provisional certificates with embedded verification QR codes resolving to the immutable ledger record.
- **Revaluation & Backlogs:** Revaluation application tracking with fee integration; automated backlog tracking across subsequent examination cycles.

### 05. Fees & Double-Entry Accounting
- **Versioned Fee Structures:** Effective-dated fee heads (Tuition, Exam, Lab, Fine) mapped directly to general ledger accounts.
- **Demands & Waivers:** Bulk demand generation, scholarship/concession allocations with funding source tracking.
- **Dual Collection Pipeline (User Feature Preserved):**
  1. *Online Payment Gateway:* Integrated with Razorpay/Cashfree; webhook callbacks verified via cryptographic HMAC signatures and processed idempotently.
  2. *Two-Step Manual UTR Verification Desk:* Parents submit direct bank transfer / UPI UTR numbers with receipt photos; fee balance remains strictly untouched as `PENDING_VERIFICATION` until campus bursar audits bank statements and executes 1-click ledger approval.
- **Strict Idempotency Engine (User Feature Preserved):** Atomic Redis locks (`SET idempotency:[key] PENDING NX EX 60`) on all payment transactions, preventing duplicate ledger entries under flaky mobile network conditions.
- **Full Double-Entry Accounting ERP:** Chart of Accounts, Vouchers (Receipt, Payment, Journal, Contra), Cash Book, Bank Book, General Ledger, Trial Balance, Income & Expenditure Statement, Balance Sheet, Fixed Assets with Depreciation, and Tally export.

### 06. HR & Payroll
- **Employee Master & Service Book:** Master data, qualifications, documents, contracts, and chronological service record history.
- **Recruitment Pipeline:** Vacancies, applications, interview scheduling, offer letters, and onboarding checklists.
- **Policy-Driven Leave Engine:** Configurable accrual rules, carry-forward caps, encashment, and compensatory leaves; integrates with monthly loss-of-pay calculations.
- **Sandboxed Formula Payroll:** Salary components (earnings, deductions) evaluated via a sandboxed expression engine; monthly payroll run lifecycle (`DRAFT` $\rightarrow$ `APPROVED` $\rightarrow$ `LOCKED`).
- **Statutory Compliance:** Automated computation of Provident Fund (PF), Employee State Insurance (ESI), Professional Tax (PT), and TDS with Form 16 data generation.

### 07. Communication
- **Targeted Notices & Circulars:** Bulletin board announcements targeted by department, program, batch, section, or role, with read receipt tracking.
- **Notification Center:** Real-time in-app notification center powered by WebSocket channels with unread badges and user event preferences.
- **Email Delivery Service:** Provider-agnostic mail service (SMTP, SES, Brevo, Resend) using MJML / React Email templates with queue-backed retries and bounce tracking.
- **Internal Messaging & Helpdesk:** Mentor-student channels, department messaging groups, SLA-tracked grievance and helpdesk tickets.
- **Approval Workflow Engine:** Generic multi-stage request-and-approval engine for certificates, student leaves, and no-dues clearances.

### 08. Reports & Analytics
- **Materialized Read Models:** Standard reports query read-optimized views and summary tables (attendance summaries, fee ageing, result batches) rather than transactional tables.
- **Custom SQL Report Builder:** Curated catalog of reportable entities with allowed joins, columns, and filters; generates parameterized SQL without exposing raw SQL input.
- **Role-Adaptive Clean Dashboards (User Feature Preserved):** Clutter-free dashboards customized by role to eliminate cognitive fatigue: Faculty see timetables and attendance registers; Bursars see reconciliation queues and defaulters; Students/Parents see grades and payment receipts.
- **Regulatory Returns:** Automated data export generators for higher-education regulatory frameworks: **NAAC, NBA, NIRF, AISHE, and University Affiliation Returns**.

---

## 05. Scope Boundary & Non-Goals

### Included in MVP Scope (8 Modules)
* Modular NestJS monolith with Fastify adapter and separate BullMQ worker process.
* React 18 + Vite SPA/PWA with Tailwind CSS, shadcn/ui, and TanStack Suite.
* PostgreSQL 16+ with Row-Level Security (RLS) and multi-tenant subdomain resolution.
* Redis for queues, rate limiting, pub/sub, and read-heavy master caching.
* All 8 core modules: Admissions/SIS, Attendance, Academics, Exams, Fees/Accounting, HR/Payroll, Communication, Reports.
* All 9 User-specified innovations retained: Smart Substitution Assistant, Dual-Signoff Moderation, Presigned S3 Direct Uploads, Strict Idempotency Locks, Statutory Exit Barrier Guard, Single-Parent Multi-Ward Hub, Role-Adaptive Clean Dashboards, Read-Heavy Redis Caching, and Manual UTR Audit Desk.

### Explicitly Excluded (Non-Goals per Spec)
* **SMS, WhatsApp, and Voice:** Strictly prohibited to prevent telecom expenses; notifications are In-App + Email only.
* **Video Hosting:** System stores Google Meet or Zoom links; does not stream or host video directly.
* **Biometric Hardware Drivers:** System exposes import REST API and CSV upload only.
* **Native Mobile Apps (v1):** Responsive PWA for mobile web in this release; mobile architecture prepared for React Native / Expo later.
* **Excluded Modules:** Library, Hostel, Transport, Placement, and Inventory modules are strictly deferred to future releases.

---

## 06. Acceptance & Quality Gates

```
┌──────────────────────────────────┐ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ 📐 ARCHITECTURAL INTEGRITY       │ │ 🛡️ DATA SECURITY & AUDIT         │ │ 🚀 BUILD & QUALITY GATES         │
├──────────────────────────────────┤ ├──────────────────────────────────┤ ├──────────────────────────────────┤
│ • PostgreSQL RLS blocks cross-   │ │ • Zero fee deductions on UTR     │ │ • Clean compile on `turbo run    │
│   tenant reads even if tenant_id │ │   submission without bursar sign.│   build` across all workspaces.    │
│   is omitted in service queries. │ │ • Student delete hard-fails if   │ │ • Zero TypeScript errors on      │
│ • Puppeteer compiles 500+ PDFs   │ │   any of 4 exit slips is missing.│   `pnpm type-check`.               │
│   off-thread without 504 timeouts│ │ • Balanced double-entry vouchers │ │ • OpenAPI client generated in CI │
│ • S3 presigned direct uploads    │ │   enforced by DB trigger/defer.  │   matches backend routes 100%.     │
│   maintain server RAM at 0MB.    │ │ • All marks locked before SGPA.  │ │ • Fastify adapter handles Web-   │
│ • Redis atomic lock prevents     │ │ • Complete audit_log entry on    │   Sockets cleanly via WS /ws.      │
│   duplicate payments on mobile.  │ │   all sensitive edits & unlocks. │ • 100% responsive down to 390px.   │
└──────────────────────────────────┘ └──────────────────────────────────┘ └──────────────────────────────────┘
```
