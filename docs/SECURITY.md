# Security & Access Control (SECURITY.md)
> **MYSchool ERP — JSS School**  
> *Role-based clearances, identity matrix, cryptographic tokens, and institutional data isolation.*

---

## 01. Complete Identity Hierarchy (All Roles)

```
                    ┌─────────────────────────┐
                    │       Super Admin       │ (JSS Central Board)
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│     Branch Admin        │ (Principal) │       Management        │ (Bursar & Operations)
└────────────┬────────────┘             └────────────┬────────────┘
             │                                       │
             ▼                                       ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│     Department Head     │ (Wing HOD)  │    Parent / Guardian    │ (Multi-Ward Scope)
└────────────┬────────────┘             └────────────┬────────────┘
             │                                       │
             ▼                                       ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│      Class Teacher      │ (Faculty)   │         Student         │ (Enrolled Pupil)
└─────────────────────────┘             └─────────────────────────┘
```

### Role Scope Definitions:
1. **`SUPER_ADMIN` (Central Board):** Unrestricted multi-campus visibility. Accesses `/all/all/analytics` for consolidated trust audits, group-wide fee policies, and enrollment analytics.
2. **`BRANCH_ADMIN` (Campus Principal):** Scoped strictly to physical campus (`User.branchId`). Oversees campus admissions, staff allocations, academic cycle promotions, and post-11:00 AM attendance overrides.
3. **`DEPT_HEAD` (Academic Wing HOD):** Scoped to specific academic wing (`branchId` + `departmentId`). Assigns daily period substitutions, reviews student leave escalations, and approves terminal grade books.
4. **`TEACHER` (Classroom Instructor):** Scoped to assigned classroom & section. Submits 8:15–11:00 AM morning attendance matrix, reviews class medical leaves, and enters exam marks.
5. **`MANAGEMENT` (Campus Bursar & Records Officer):** Dedicated financial and administrative clearance. Operates UTR verification queue, executes fee ledger adjustments, issues digital receipts, and audits admission & exit certificates.
6. **`PARENT` (Pupil Guardian):** Scoped to family wards across campuses. Persistent top navbar dropdown toggles between enrolled children; submits fee UTRs and medical leave requests.
7. **`STUDENT` (Enrolled Pupil):** Scoped to personal profile. Inspects timetables, exam dates, fee dues, and enjoys permanent lifetime access to download past grade transcripts.

---

## 02. Comprehensive Permissions Matrix

| Functional Capability | Super Admin | Principal (Branch Admin) | Dept Head (HOD) | Class Teacher | Management (Bursar) | Parent / Student |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cross-Branch Toggling** | Unrestricted | Campus Locked | Campus Locked | Campus Locked | Campus Locked | Ward Locked |
| **Class Attendance Submit** | View / Audit | View / Override | View / Override | Submit Assigned | None | View Own |
| **Attendance Lock Override** | Full Override | Permitted (>11 AM) | With Audit Note | None (Frozen) | None | None |
| **Fee Structure Config** | Global Policy | Campus Level | None | None | Create / Modify | None |
| **UTR Verification & Ledger** | Full Audit | View Only | None | None | Approve / Reject | Submit UTR |
| **Student Leave Approvals** | Full Override | Campus Level | Department Level | Assigned Class | None | Submit Leave |
| **Batch Admit Card Printing** | Permitted | Permitted | Permitted | None | None | None |
| **Permanent Student Deletion** | Sign-off Only | Execute (Exit Cert) | Blocked | Blocked | Blocked | Blocked |
| **Lifetime Grade Downloads** | Full Trust | Campus Level | Department Level | Class Level | None | View / Download |

---

## 03. Route-Based Clearance & Parameter Scoping

Every database query MUST be strictly scoped by the active route segments:
```
GET /[branchSlug]/[departmentCode]/[module]
```

### Context Engine Rules:
* **Middleware Verification:** Resolves `branchSlug` $\rightarrow$ `branchId` and `departmentCode` $\rightarrow$ `departmentId`. Non-super-admins attempting to access unauthorized branches receive an immediate `403 Forbidden`.
* **Sub-Path Preservation:** When an authorized administrator switches from `Main Campus → Secondary` to `North Campus → Secondary`, the active leaf route (e.g. `/attendance`) is preserved, navigating directly to `/north/sec/attendance`.
* **Consolidated Trust View:** `/all/all/analytics` is cryptographically restricted to `SUPER_ADMIN` JWT claims, bypassing campus boundaries for group-wide rollups.

---

## 04. Attendance Time-Lock State Machine

```
┌─────────────────────────────────┐
│ 1. DRAFT (< 8:15 AM)            │ Untouched; pre-populated with approved `EXCUSED_LEAVE`.
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ 2. ACTIVE (8:15 AM – 11:00 AM)  │ Live editable window for class teacher; single `createMany` commit.
└───────────────┬─────────────────┘
                │
                ▼ (11:00 AM Daily System Cron)
┌─────────────────────────────────┐
│ 3. FROZEN / LOCKED              │ Teacher editing barred; register locked against retroactive tampering.
└───────────────┬─────────────────┘
                │
                ├─────────────────────────────────────────┐
                ▼                                         ▼
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│ 4. PRINCIPAL OVERRIDE           │     │ 5. HISTORICALLY ARCHIVED        │
│ Permitted with mandatory audit  │     │ Read-only cold storage at close │
│ reason and Principal Admin ID.  │     │ of annual academic cycle.       │
└─────────────────────────────────┘     └─────────────────────────────────┘
```

---

## 05. Statutory Exit Document Barrier & Purge Protection

Hard programmatic blocker on student deletion. Deletion API halts if any required certificate is missing or unverified:

1. **Transfer Certificate (TC):** Valid serial registration number and formal school seal.
2. **Character / Conduct Certificate:** Conduct assessment signed by Department Head.
3. **Migration Certificate:** State / Central education board eligibility slip.
4. **No-Dues Clearance:** Confirmation of ₹0 balance from Management and library clearance.

* **Purge Execution:** Requires typing the student's full Admission ID (`ADM-JSS-2026-XXXX`), selecting a mandatory departure category, and compiling an immutable cold-storage ZIP archive in Supabase Private Storage prior to cascade deletion.

---

## 06. Pre-Signed Storage Tokens

* **Direct Uploads:** Client requests a 60-second HMAC pre-signed S3 upload URL. Next.js server RAM is protected from large binary file streams.
* **Confidential Downloads:** Student report cards, birth certificates, and fee receipts are stored in private buckets and delivered via 24-hour signed download tickets.
