# Product Requirements Document (PRD)
> **MYSchool ERP — JSS School**  
> *A clear, high-concurrency plan before the first line of code.*

---

## 01. Product Overview

| Property | Specification Details |
| :--- | :--- |
| **Product Name** | **MYSchool ERP** (JSS School Edition) |
| **Platform** | Responsive Web Application (Next.js 15+ App Router, React 19, Tailwind CSS, shadcn/ui) |
| **Target Institution** | **JSS School** (Central Board, multi-campus physical branches, academic wings) |
| **Core Architecture** | Unified Full-Stack Repository, NextAuth.js (Auth.js v5) with Edge JWT cookies, URL-driven branch/wing tenancy (`/[branchSlug]/[deptCode]/[module]`), Managed Supabase PostgreSQL with Supavisor Connection Pooling, Upstash Redis In-Memory Cache, Inngest Async Workers |
| **Primary Goal** | Digitize, automate, and connect all daily academic and administrative operations across all JSS School campuses into a single unified platform—absorbing peak 8:30 AM attendance spikes, safeguarding financial audits with strict manual UTR verification, enforcing statutory student exit barriers, and guaranteeing lifetime student transcript access. |

### Technology Stack & Frameworks Summary

| Architectural Tier | Technology & Framework | Version / Configuration | Core Architectural Role |
| :--- | :--- | :--- | :--- |
| **Frontend / UI** | Next.js + React 19 | App Router / React Server Components | High-performance server rendering, URL-scoped tenancy, zero client bloat. |
| **Styling & Design** | Tailwind CSS + Lucide | v3.4+ / Vanilla CSS Variables | Institutional typography, responsive mobile grids, high-density data tables. |
| **Backend & Runtime** | Next.js Server Actions | Node.js 20 LTS / Edge Runtimes | Co-located RPC mutations, typed server operations without REST overhead. |
| **Language & Typings** | TypeScript | v5.x+ (Strict Mode) | End-to-end compile-time contract safety from PostgreSQL to form UI. |
| **Validation Layer** | Zod | Runtime Schema Validation | Runtime data sanitization on Server Actions, public APIs, and environment vars. |
| **Relational Database** | Supabase PostgreSQL | PostgreSQL 16+ | Managed ACID relational database, foreign-key integrity, 7-day PITR. |
| **Connection Pooler** | Supabase Supavisor | Port 6543 (Transaction Mode) | Multiplexes 500+ callers into 15–25 physical sockets; stops socket exhaustion. |
| **ORM & Migrations** | Prisma ORM | Latest Stable | Type-safe migrations, auto-generated TypeScript models, dual-URL pooler support. |
| **In-Memory Cache** | Upstash Redis | Serverless REST Redis | Read-heavy caching (>90% hit rate) and atomic financial idempotency locks (`SET NX`). |
| **Auth & RBAC** | NextAuth.js (Auth.js) | v5 (Edge JWT) | Stateless encrypted session cookies; 0ms DB overhead in middleware; 7 RBAC roles. |
| **Object Storage** | Cloudflare R2 / S3 | S3-Compatible Buckets | 60-second HMAC presigned direct client uploads; 0MB server memory burden. |
| **Background Queue** | Inngest | Headless Task Queue | Async batch job queue (Buzzer Token pattern); prevents HTTP 504 timeouts. |
| **Document Compiler** | `@react-pdf/renderer` | Latest Stable | Headless rendering of watermarked admit cards and multi-page transcripts. |


---

## 02. Problem & Goal

```
┌──────────────────────────────────────────────────────────┐  ┌──────────────────────────────────────────────────────────┐
│ 🎯 DOWNSIDE OF NOT HAVING THIS SYSTEM                    │  │ 🏆 WHAT SUCCESS LOOKS LIKE (DIGITIZES & AUTOMATES)       │
├──────────────────────────────────────────────────────────┤  ├──────────────────────────────────────────────────────────┤
│ • 8:30 AM Attendance Bottleneck: Manual paper roll-calls │  │ • 100ms Bulk Attendance: 40-student single array payload │
│   delay legal duty-of-care absence alerts to parents.    │  │   using Prisma `createMany` committed in ~10ms.           │
│                                                          │  │                                                          │
│ • Unverified Ledger Drift: Premature or unverified fee   │  │ • Immutable Financial Audit: Zero automated deductions;  │
│   deposits cause accounting errors and audit chaos.      │  │   2-step UTR clearance by campus bursar before ledger cut│
│                                                          │  │                                                          │
│ • 504 Gateway Timeouts: Synchronous report card and      │  │ • Zero-Timeout Batch Engine: Inngest async workers render│
│   admit card batch PDF generation hangs HTTP threads.    │  │   hundreds of PDFs into Supabase Storage with signed URLs│
│                                                          │  │                                                          │
│ • Accidental Student Purges: Missing transfer or conduct │  │ • Statutory Exit Barrier: Hard cryptographic barrier     │
│   records during withdrawal leads to regulatory liability│  │   requiring verified TC, Character & No-Dues slips.      │
│                                                          │  │                                                          │
│ • Bloated Database Backups: Binary files inside SQL.     │  │ • Direct Pre-Signed Uploads: 60s client-to-storage stream.│
└──────────────────────────────────────────────────────────┘  └──────────────────────────────────────────────────────────┘
```

---

## 03. Target User Personas

| Persona | Role Scope | Key Responsibilities & Capabilities | Actions / Badges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Central JSS School Board Executive | Group-wide financial auditing, multi-campus consolidated roll calls, cross-branch policy configuration. | `Consolidated View` `Trust Audit` `Global Scoping` |
| **Branch Admin** | Campus Principal / Director | Campus-wide admissions, academic cycle initialization, staff duty approvals, exam scheduling. | `Campus Locked` `Staff Approvals` `Cycle Control` |
| **Department Head (HOD)** | Academic Wing Leader (e.g. PUC, Primary) | Curriculum pacing, class-to-teacher mapping, period substitutions, leave escalations. | `Wing Locked` `Substitutions` `Leave Signoff` |
| **Class Teacher** | Classroom Instructor | 8:30 AM morning attendance matrix submission, daily student leave approval, student performance reviews. | `Roster Grid` `Attendance Submit` `Leave Review` |
| **Management** | Campus Operations, Bursar & Records | Physical bank statement reconciliation, UTR queue clearance, admission & exit certificate verification, fee ledger auditing. | `UTR Queue` `Ledger Audit` `Doc Clearance` `Exit Barrier` |
| **Parent / Guardian** | Household Pupil Guardian | Multi-ward toggling, fee payment submission (UTR + screenshot), leave application, receipt downloads. | `Ward Switcher` `Fee Submit` `Leave Apply` |
| **Student** | Enrolled Pupil | Class timetable inspection, exam schedule view, permanent lifetime access to historical report cards. | `Self Service` `Lifetime Grades` `Schedule` |

---

## 04. Core Features Matrix

*Concise technical feature listing without unnecessary narrative bloat:*

1. **URL-Scoped Tenancy (`/[branchSlug]/[departmentCode]/[module]`):**
   - Independent deep-linking across browser tabs without session or cookie collisions.
   - Layout-level data scoping and isolated Next.js cache boundaries.
   - Global sticky navbar combobox for instantaneous branch/wing switching by cleared personnel.

2. **High-Speed 8:30 AM Attendance Matrix:**
   - Single-payload JSON dispatch containing all 40 student records per classroom.
   - Atomic database write via Prisma `createMany` (or bulk upsert) in a single round-trip.
   - Non-blocking asynchronous trigger firing SMS/push notifications to guardians for unexcused absences.

3. **Manual UTR Fee Verification Pipeline:**
   - Student fee balances remain strictly untouched upon parent transaction initiation.
   - Duplicate UTR check validates that the submitted transaction reference number has never been used.
   - Partial payments fully supported: amount declared is credited against total dues only upon approval.
   - Dedicated Bursar audit desk matches physical bank statements before ledger write and receipt issuance.

4. **Headless Asynchronous Batch PDF Engine (Buzzer Token):**
   - Offloaded rendering of 500–2,000 watermarked admit cards / report cards via Inngest workers.
   - Fast token handoff: server returns `jobId` in ~30ms, preventing browser 504 Gateway Timeouts.
   - Background compilation with `@react-pdf/renderer` directly streamed to private Supabase Storage.
   - Pollable job log with 24-hour pre-signed ZIP/PDF download ticket upon completion.

5. **Direct Pre-Signed Document Storage & Split-Screen Audit Loop:**
   - Direct-to-bucket upload via 60-second HMAC pre-signed URLs, protecting Next.js server RAM.
   - Split-screen verification interface: management previews documents alongside student data.
   - Mandatory rejection reason: rejecting a document requires a written reason that immediately alerts the parent with a direct re-upload prompt.

6. **Statutory Exit Document Barrier:**
   - Hard programmatic blocker preventing permanent student deletion or archiving.
   - Two-stage confirmation modal requiring staff to type the pupil's exact `admission_no`.
   - Requires 4 verified statutory certificates: Transfer Certificate (TC), Character Certificate, Migration Certificate, and Campus No-Dues Slip.

7. **Single-Parent Multi-Ward Hub & Roster-Linked Leaves:**
   - Single-parent profile model (no dual-parenting overhead) mapped to multiple wards across campuses with top-bar switching.
   - Medical/general leave requests with attachments routed to assigned Class Teacher.
   - Approved student leaves automatically pre-populate class registers as `EXCUSED_LEAVE`.

8. **Smart Substitution Assistant (Timetables):**
   - Timetable collision engine analyzes daily teacher absences and leaves in real-time.
   - Automatically cross-references faculty schedules to find teachers with an unassigned/free block during that exact period in the same subject department.
   - Generates a 1-click ranked substitution proposal without mutating or corrupting the master timetable.
   - Substitute faculty receive an immediate push/toast alert with room assignment and curriculum topic.

9. **Dual-Signoff Exam Grade Moderation:**
   - Multi-tier grading lifecycle: Subject teachers submit student marks in a `DRAFT` / `PENDING_MODERATION` state.
   - Department Heads (HOD) and Wing Coordinators access a dedicated moderation console displaying grade distributions, class averages, and standard deviation curves.
   - Coordinators can approve grades (`APPROVED`) or request adjustments with specific commentary; final signoff transitions records to `PUBLISHED`, unlocking report cards and parent notifications.

10. **Role-Adaptive Clean Dashboards:**
    - Clutter-free, role-specific UI designed to eliminate cognitive overhead:
      - **Teacher View:** Today's timetable, immediate 8:30 AM attendance matrix card, student medical notes, pending leave requests. Zero financial noise.
      - **Bursar / Management View:** Split-screen bank reconciliation desk, live UTR verification queue with zoomable receipt preview, fee defaulter summaries.
      - **Parent View:** 1-tap multi-sibling switcher, instant UPI fee payment with receipt download, daily attendance percentage gauge, published exam report cards.
      - **Super Admin / Principal View:** Cross-campus enrollment numbers, trust-wide collection metrics vs. outstanding dues, faculty presence counters.

11. **Read-Heavy Caching via Redis (Upstash):**
    - High-velocity caching of master entities (Academic Calendars, Branch Metadata, Wing/Department Lists, Subjects) in Upstash Redis.
    - Absorbs read spikes during morning login surges, maintaining a >90% cache hit ratio and offloading ~80% of database roundtrips.
    - Automatic cache invalidation on admin mutation actions (`revalidatePath` + `redis.del`).

12. **Academic Cycle Lifecycle & Permanent Lifetime Transcripts:**
    - Institution-configured academic calendar cycle start and end dates.
    - Annual promotion workflows batching students to the next grade at cycle close.
    - Past attendance archived to read-only cold storage; students retain permanent lifetime access to download official transcripts and report cards.

---

## 05. Scope Definition

### Must Have (MVP)
* Full-stack Next.js App Router with URL-driven multi-branch routing.
* Supabase PostgreSQL 16+ integration with Supavisor transaction connection pooling.
* Central NextAuth.js RBAC authentication (7 distinct user roles) under single origin.
* High-speed attendance register with single-payload bulk commit (~10ms).
* Manual UTR verification queue with duplicate detection and two-step fee balance deduction.
* Smart Substitution Assistant with automated timetable collision checks.
* Dual-Signoff Exam Grade Moderation pipeline (Draft -> Moderation -> Approved -> Published).
* Role-Adaptive Clean Dashboards tailored for Teachers, Bursars, Parents, and Admins.
* Read-Heavy Caching via Redis (Upstash) for master calendars, branches, and subjects.
* Student document upload via pre-signed URLs with audit feedback loop.
* Mandatory exit certificate verification guard prior to student deletion.
* Multi-ward parent switcher and roster-synchronized student leave management.
* Inngest headless async worker setup for batch PDF compilation.

### Later (Post-MVP)
* Biometric hardware fingerprint/RFID integration for automated staff attendance sync.
* Push notification integration with WhatsApp Business API for fee and absence alerts.
* Bus GPS tracking integration for real-time guardian transit visibility.
* Native mobile applications (React Native / Expo) wrapping the existing Next.js backend API contracts.
* AI-assisted fee default forecasting based on historical payment cadences.

---

## 06. Acceptance Criteria

```
┌──────────────────────────────────┐ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ 📐 TECHNICAL INTEGRITY           │ │ 🛡️ ZERO-TOLERANCE EDGE CASES     │ │ 🚀 BUILD & QUALITY GATES         │
├──────────────────────────────────┤ ├──────────────────────────────────┤ ├──────────────────────────────────┤
│ • URL params define branch/wing; │ │ • Zero balance deduction on      │ │ • Zero TypeScript errors on      │
│   no cross-branch query leaks.   │ │   payment submit without UTR sign│   `tsc --noEmit`.                  │
│ • Max 25 physical connections    │ │ • Student delete hard-fails if   │ │ • Zero ESLint errors or unused   │
│   used during 500-user spike via │ │   TC or No-Dues slip is missing. │   Prisma client instantiations.    │
│   Supavisor transaction mode.    │ │ • Roster submit dispatches 1 HTTP│ │ • All environment variables      │
│ • All files uploaded via 60s     │ │   request per room, not 40.      │   validated through Zod schema.    │
│   signed direct-to-S3 URLs.      │ │ • Inngest job handles 500 PDFs   │ │ • Additive-only database         │
│ • Prisma singleton used strictly.│ │   without browser 504 gateway err│   migrations applied via Port 5432.│
└──────────────────────────────────┘ └──────────────────────────────────┘ └──────────────────────────────────┘
```
