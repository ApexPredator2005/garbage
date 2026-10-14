# AI Agent Instructions (AGENTS.md)
> **MYSchool ERP — JSS School**  
> *Give your coding agent a clear, disciplined, and deterministic way to work.*

---

## 01. Project Context

```
Read the docs. Understand the code. Implement with intent.
This project is an institutional multi-campus ERP for JSS School.
All architectural decisions, database models, and operational constraints are fixed.
Never guess or introduce generic patterns that contradict this dossier.
```

---

## 02. Source of Truth

| Document | File Path | Canonical Responsibility |
| :--- | :--- | :--- |
| **PRD.md** | `docs/PRD.md` | Feature scopes, user personas, MVP boundary, acceptance criteria. |
| **ARCHITECTURE.md** | `docs/ARCHITECTURE.md` | Tech stack, request lifecycle, data flow, connection pool rules, failure modes. |
| **schema.prisma** | `prisma/schema.prisma` | Strict relational database models, enums, indexes, and foreign keys. |
| **DESIGN_SYSTEM.md** | `docs/DESIGN_SYSTEM.md` | Palette, typography, spacing tokens, component hierarchy, accessibility rules. |

---

## 03. Implementation Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 1. INSPECT  │ ──> │ 2. PLAN     │ ──> │ 3. IMPLEMENT│ ──> │ 4. TEST     │ ──> │ 5. REVIEW   │ ──> │ 6. DOCUMENT │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
  Read relevant       Break down into     Write minimal,      Execute typecheck   Verify against      Update docs if
  specifications      isolated feature    type-safe Next.js   and unit tests;     acceptance          contracts or
  and route context   steps with schema   code; adhere to     validate zero       criteria and        behaviors have
  before touching.    contracts.          feature slice.      runtime regressions security rules.     evolved.
```

---

## 04. Working Rules

```
┌──────────────────────────────────────────────────────────┐  ┌──────────────────────────────────────────────────────────┐
│ ✅ DO (MANDATORY PRACTICES)                              │  │ ❌ AVOID (STRICT ANTI-PATTERNS)                          │
├──────────────────────────────────────────────────────────┤  ├──────────────────────────────────────────────────────────┤
│ • Scrutinize branch and department route parameters:     │  │ • NEVER run `prisma db push --force-reset` or drop   │
│   Every query MUST include `branchId` & `departmentId`.  │  │   columns. Migrations must be strictly additive.         │
│ • Use the Prisma singleton from `@/lib/db.ts`:           │  │ • NEVER instantiate `new PrismaClient()` in feature    │
│   Runtime queries use Supavisor (Port 6543).             │  │   code. It bypasses pooling and causes socket leaks.     │
│ • Execute single-payload bulk writes:                    │  │ • NEVER auto-deduct fee dues upon payment submission.   │
│   Use `db.attendance.createMany` for classroom rosters.  │  │   Only staff approval can clear a student balance.       │
│ • Route batch PDF tasks to Inngest background workers:   │  │ • NEVER render batch PDFs synchronously on active HTTP   │
│   Keep Next.js HTTP responses under 50ms.                │  │   threads. This causes 504 Gateway Timeouts.             │
│ • Enforce statutory exit barrier:                        │  │ • NEVER delete a student record if required exit        │
│   Verify TC, Character, and No-Dues before deletion.     │  │   certificates are missing or unverified.                │
│ • Validate all environment variables with Zod schemas:   │  │ • NEVER access `process.env` directly in feature files. │
│   Import from `@/config/env.ts`.                         │  │ • NEVER write business logic or Prisma queries inside UI.│
└──────────────────────────────────────────────────────────┘  └──────────────────────────────────────────────────────────┘
```

---

## 05. Core Engineering & Hygiene Directives

Adhere strictly to these 10 baseline architectural and coding standards:

1. **Feature-Sliced Architecture:** Organize code strictly under `src/features/[feature]/` (`components/`, `server/*.service.ts`, `schemas/*.zod.ts`).
2. **Dumb UI, Smart Services:** UI components only handle render logic and local interaction state. All business logic, Prisma calls, and mutations belong in `*.service.ts`.
3. **Dead-Code Elimination:** Proactively remove unused imports, dead functions, test debris, and commented-out code blocks during every pass.
4. **Strict Naming Conventions:**
   - PascalCase for React components and types (`StudentRosterTable.tsx`).
   - camelCase for functions, Server Actions, hooks, and utilities (`submitAttendanceAction.ts`).
   - snake_case for PostgreSQL database tables and columns (`student_documents`, `invoice_no`).
5. **Universal Error Handling:** Use custom error classes (`AppError`, `UnauthorizedError`, `NotFoundError`, `ValidationError`) and wrap domain operations in try/catch envelopes returning uniform error responses.
6. **Environment Separation via Zod:** Never read `process.env` directly in feature files. Import strictly from `@/config/env.ts` with runtime Zod parsing.
7. **Modular UI Primitives:** Leverage accessible, composable primitives from `@/components/ui/` (shadcn/ui + Tailwind CSS).
8. **Deterministic State Management:** Rely on URL route parameters (`/[branchSlug]/[deptCode]/...`) as primary source of truth for branch context, supplemented by React Server Components and lightweight Zustand for client UI state.
9. **Inline Code Documentation:** Annotate complex concurrency constraints, transaction boundaries, and permission assertions with concise JSDoc comments.
10. **Scalable API Envelopes:** Enforce uniform JSON envelopes (`{ success, data, error, metadata }`) across all Route Handlers and Server Actions.

---

## 06. Validation Checklist

Before marking any task, feature, or PR complete, verify every gate:

* [ ] **Typecheck Passes:** `npm run typecheck` (`tsc --noEmit`) outputs **zero** errors.
* [ ] **Lint Clean:** `npm run lint` passes without warnings or unused imports.
* [ ] **Supavisor Pool Integrity:** No discrete `PrismaClient` instances created outside `@/lib/db.ts`.
* [ ] **URL Scope Enforced:** All data queries are bound to the active branch slug and department code.
* [ ] **Financial Audit Protected:** Fee submission leaves `due_amount` unchanged; status set to `PENDING_VERIFICATION`.
* [ ] **Duplicate UTR Blocked:** Payment submission rejects duplicate transaction reference numbers.
* [ ] **Roster Bulk Written:** Attendance registers commit in a single database payload using `createMany`.
* [ ] **Exit Documents Verified:** Permanent deletion actions check for TC, Character, Migration, and No-Dues records.

---

## 07. Conflict Handling Protocol

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠️ CONFLICT RESOLUTION ESCALATION                                      │
├────────────────────────────────────────────────────────────────────────┤
│ If an implementation requirement is ambiguous or conflicts with code:  │
│                                                                        │
│ 1. Review Canonical Docs: Re-read `PRD.md` and `ARCHITECTURE.md`.      │
│ 2. Inspect Prisma Schema: Check `prisma/schema.prisma` for type rules. │
│ 3. Formulate Viable Options: Identify 2 concrete options with impacts. │
│ 4. Halt and Request Human Sign-off: Present the conflict directly to  │
│    the team rather than guessing or applying destructive workarounds.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 08. Definition of Done (DoD)

```
┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│ 1. REQUIREMENTS MET       │ │ 2. CODE IS TYPE-SAFE      │ │ 3. ZERO REGRESSIONS       │ │ 4. DOCUMENTATION SYNC     │
├───────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤
│ The feature satisfies all │ │ Zero TypeScript errors;   │ │ Existing branch context   │ │ Any updated contract or   │
│ explicit criteria from    │ │ Zod schemas validate both │ │ and database isolation    │ │ schema change is reflected│
│ the PRD and dossier.      │ │ inputs and outputs.       │ │ remain intact.            │ │ in docs and schema files. │
└───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘
```
