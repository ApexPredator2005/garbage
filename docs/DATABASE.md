# Database & Connection Pooling (DATABASE.md)
> **MYSchool ERP — JSS School**  
> *PostgreSQL 16+, Supavisor Transaction Multiplexing & High-Concurrency Patterns.*

---

## 01. Engine & Hosting Topology

```
┌────────────────────────────────────────────────────────┐
│ 🐘 SUPABASE MANAGED POSTGRESQL 16+                      │
├────────────────────────────────────────────────────────┤
│ • Production Storage Engine: Managed PostgreSQL 16+    │
│ • Point-In-Time Recovery (PITR): Active 7-day rollback │
│ • Automated Nightly Backups: Off-site WAL archiving    │
│ • Zero Server Maintenance: No host OS or kernel patches│
└────────────────────────────────────────────────────────┘
```

---

## 02. Connection Architecture (The Dual-URL Pattern)

To survive serverless scale and prevent connection crashes during morning peak hours:

| Environment Variable | Port | Mode | Intended Consumer | Max Conn Pool |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `6543` | **Transaction Mode** | Next.js Server Actions & Runtime API | 25 physical slots (handles 500+ callers) |
| `DIRECT_URL` | `5432` | **Session Mode** | Prisma CLI migrations (`prisma migrate`) | Direct connection (requires schema lock) |

---

## 03. High-Concurrency Roll Call (Prisma `createMany`)

```typescript
// src/features/attendance/server/attendance.service.ts
import { db } from "@/lib/db";
import { AttendanceStatus } from "@prisma/client";

interface StudentRosterEntry {
  studentId: string;
  status: AttendanceStatus;
}

export async function submitClassroomAttendance(
  recordedById: string,
  date: Date,
  roster: StudentRosterEntry[]
) {
  // Single-payload commit multiplexed in ~10 milliseconds
  const payload = roster.map((entry) => ({
    studentId: entry.studentId,
    recordedById,
    date,
    status: entry.status,
  }));

  return await db.attendance.createMany({
    data: payload,
    skipDuplicates: true,
  });
}
```

---

## 04. Additive Migration Directives

1. **Strictly Additive Changes:** Never rename, drop, or mutate existing database columns in production.
2. **Nullable First:** All newly introduced columns must be defined as optional (`?`) or provide a `@default(...)`.
3. **Execution Guard:** Autonomous agents are forbidden from executing `prisma db push --force-reset`.
