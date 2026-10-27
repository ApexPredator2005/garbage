# Exhaustive Claude Engineering Prompts for MYSchool ERP
> **Target Framework:** React 18 + Vite + TypeScript + Tailwind CSS + Lucide React  
> **Institutional Theme:** Deep Burgundy (`#682038`), Warm Cream (`#FAF7F2`), Bronze (`#8B5E3C`), Slate Borders (`#E5DFD7`)  
> **Repository Context:** Monorepo (`apps/web`), zero external UI library dependencies (uses pure Tailwind and Lucide icons).

---

## Why Exhaustive Prompts Are Required

High-level summary prompts cause LLMs to:
1. Hallucinate arbitrary data shapes and missing TypeScript types.
2. Violate institutional design tokens (using random blue/purple Tailwind classes instead of the college's Burgundy `#682038` and Cream `#FAF7F2`).
3. Omit domain business rules (e.g. sandboxed payroll formula math without `eval()`, 75% attendance threshold gating exam hall tickets, strict zero-SMS/zero-WhatsApp cost-optimization, and curated parameterized SQL generation).
4. Leave placeholders like `// TODO: implement table` or omit state transitions.

The prompts below are **contract-dense, fully specified, and self-contained**. When copied directly into Claude, each prompt instructs Claude to generate an entire, ready-to-run `.tsx` workspace file with zero missing dependencies.

---

## Prompt 1: Module 02 — Attendance & Biometric Reconciliation Workspace

```markdown
You are a Principal Frontend Architect building Module 02 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
`apps/web/src/features/attendance/AttendanceWorkspace.tsx`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (`#682038`), Background Cream (`#FAF7F2`), Accent Bronze (`#8B5E3C`), Card Surface (`bg-white`), Borders (`#E5DFD7`), Dark Text (`#242424`), Muted Text (`#6E6862`).
   - Font: Standard sans-serif for UI, JetBrains Mono (`font-mono`) for roll numbers, percentages, IP addresses, and timestamps.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (`transition-all duration-200`).

2. **Core Domain Workflows to Implement:**
   - **Period-Wise Attendance Matrix:**
     - Select Class/Section (e.g., "BE Computer Science - Semester 6 - Section A"), Subject ("CS601 Distributed Systems"), and Period (Period 1 to Period 6).
     - Roster grid of 6-8 realistic students with photo avatars, Roll Numbers, Cumulative Attendance %, and Status buttons: `PRESENT` (green), `ABSENT` (red), `LATE` (amber), `ON_DUTY` (blue).
     - "Mark All Present" 1-click batch action.
     - "Flush Attendance" button with simulated latency indicator badge (`⚡ 14ms batch flush`).
   - **Session Lock Indicator:**
     - Displays session lock status. If marked > 24 hours ago, mark as LOCKED with padlock icon.
     - "Request Session Unlock" button opening an interactive modal with mandatory Dean justification field and audit trace preview.
   - **Statutory 75% Attendance Gating for Hall Tickets:**
     - Cumulative percentage gauge for each student.
     - Any student strictly below 75% gets a prominent red warning badge: `BARRED / INELIGIBLE FOR HALL TICKET` showing exact session shortage count.
   - **Condonation Application Desk (Interactive Tab/Drawer):**
     - Lists medical condonation requests for students under 75% (e.g., Hospital admission certificate + ₹500 statutory condonation fee UTR reference).
     - Actions: HOD "Approve Condonation" or "Reject".
     - Approving recalculates adjusted attendance (e.g. 68% -> 76% condoned) and dynamically flips the student from `BARRED` to `HALL TICKET ELIGIBLE`.
   - **Raw Biometric Punch Reconciliation Table (Interactive Tab):**
     - Displays raw hardware punch logs: Device ID (`BIO-GATE-01`), IP (`192.168.10.45`), Employee/Student ID, Timestamp, Shift Match, and Status (`ON_TIME`, `GRACE_PERIOD`, `LATE_IN`).
     - Includes compliance banner: "Raw hardware punch logs are immutable append-only records per Section 3.2. Manual adjustments create reconciliation audit vouchers without mutating raw device logs."

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     `import React, { useState, useMemo } from 'react';`
     `import { Users, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, Lock, Unlock, Fingerprint, Calendar, ShieldCheck, Download, Search, Check, Filter, RefreshCw, X, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';`
   - Complete TypeScript interfaces defined at top of file: `StudentAttendance`, `AttendanceStatus`, `CondonationRequest`, `BiometricPunchLog`.
   - Embedded realistic mock datasets.
   - Export signature: `export const AttendanceWorkspace: React.FC = () => { ... }`.
   - Strictly NO placeholder comments like `// implement here`. Return the full, working component code.
```

---

## Prompt 2: Module 06 — HR & Payroll Lifecycle Workspace

```markdown
You are a Principal Frontend Architect building Module 06 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
`apps/web/src/features/hr/HrPayrollWorkspace.tsx`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (`#682038`), Background Cream (`#FAF7F2`), Accent Bronze (`#8B5E3C`), Card Surface (`bg-white`), Borders (`#E5DFD7`), Dark Text (`#242424`), Muted Text (`#6E6862`).
   - Font: Standard sans-serif for UI, JetBrains Mono (`font-mono`) for currency figures, employee IDs, and formulas.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (`transition-all duration-200`).

2. **Core Domain Workflows to Implement:**
   - **Employee Service Book (Master Roster):**
     - 6-8 realistic faculty and administrative staff (e.g. Dr. Aris Thorne - Prof & HOD CSE, Prof. Sunita Rao - Assoc Prof AI&DS, Rajesh K - Senior Lab Tech, etc.).
     - Details: Employee Code, Designation, Department, Date of Joining, Bank Account, PAN Number, Status (`ACTIVE`, `ON_LEAVE`, `PROBATION`).
     - Search and Department filter.
   - **Salary Structure & Formula Engine:**
     - Breakdown components: Basic Pay, HRA (40% of Basic), DA (25% of Basic), Special Allowance, Provident Fund (12% of Basic), Professional Tax (₹200 fixed), Income Tax (TDS), Loss of Pay (LOP) deduction.
     - Sandboxed formula evaluation preview card explaining the computation without using unsafe `eval()`.
   - **Monthly Payroll Run 3-Stage State Machine:**
     - Visual lifecycle bar: `DRAFT` -> `APPROVED` -> `LOCKED`.
     - In `DRAFT` mode: HR can edit LOP (Loss of Pay) days (e.g. 0 to 5 days). The net salary recomputes dynamically in real-time (`Gross - Deductions - (Gross/30 * LOPDays)`).
     - In `APPROVED` mode: Finance Officer approves the cycle; fields lock.
     - In `LOCKED` mode: Entire cycle is frozen, displays balanced General Ledger Voucher Number (`JV-2026-PAY-104`) and immutable watermark badge.
   - **Interactive Payslip Modal:**
     - Clicking "View Payslip" opens a formal institutional slip.
     - Features: Formal Header ("Devloft College of Engineering & Technology"), Employee Details, Itemized Earnings vs. Deductions columns, Net Payable in numbers and written in words (`Rupees Eighty-Two Thousand Four Hundred Only`), Registrar Signature stamp placeholder, and simulated "Download PDF" / "Print" triggers.
   - **Banking Export Trigger:**
     - "Generate NEFT Bank Batch File" button with confirmation alert.

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     `import React, { useState, useMemo } from 'react';`
     `import { DollarSign, Users, FileText, CheckCircle2, Lock, ArrowUpRight, Download, Calculator, Calendar, ShieldCheck, Printer, AlertCircle, Building, Search, Eye, X, ChevronRight, Check } from 'lucide-react';`
   - Complete TypeScript interfaces defined at top of file: `EmployeeRecord`, `SalaryStructure`, `PayrollCycleItem`, `PayrollRunState`.
   - Embedded realistic mock datasets.
   - Export signature: `export const HrPayrollWorkspace: React.FC = () => { ... }`.
   - Strictly NO placeholder comments like `// implement here`. Return the full, working component code.
```

---

## Prompt 3: Module 07 — Communication & SLA Helpdesk Workspace

```markdown
You are a Principal Frontend Architect building Module 07 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
`apps/web/src/features/communication/CommunicationWorkspace.tsx`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (`#682038`), Background Cream (`#FAF7F2`), Accent Bronze (`#8B5E3C`), Card Surface (`bg-white`), Borders (`#E5DFD7`), Dark Text (`#242424`), Muted Text (`#6E6862`).
   - Font: Standard sans-serif for UI, JetBrains Mono (`font-mono`) for ticket numbers, SLAs, and timestamps.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (`transition-all duration-200`).

2. **Core Domain Workflows to Implement:**
   - **Cost-Optimized Communication Architecture Banner:**
     - Highlighting the strict Zero-SMS & Zero-WhatsApp policy: "All institutional communications are transmitted via In-App WebSocket Push & Enterprise Email, completely eliminating third-party SMS gateway tolls."
   - **Targeted Campus Notice Board:**
     - Audience filtering: `ALL_CAMPUS`, `FACULTY_ONLY`, `STUDENT_ONLY`, `DEPT_CSE`.
     - Notice cards displaying Category (Academic, Examination, Fee Reminder, Administrative), Title, Author, Date, Priority badge (`NORMAL`, `URGENT`, `CRITICAL`), and Read-Receipt progress bar (e.g. `842 / 1,200 Acknowledged (70%)`).
     - "Publish Circular" modal with recipient targeting and attachment preview.
   - **SLA Grievance & Helpdesk Queue:**
     - Categories: Academic Evaluation, Fee Ledger Recheck, Wi-Fi & Infrastructure, Hostel Affairs.
     - Live SLA timer countdown badges:
       - Urgent: 4h SLA (shows remaining time in amber e.g. `2h 15m remaining`, or `BREACHED / OVERDUE` in red).
       - High: 24h SLA.
       - Normal: 72h SLA.
     - Ticket Detail Drawer/Modal: View student inquiry, post internal staff resolution remarks, reassign to department, and toggle status (`OPEN`, `IN_PROGRESS`, `RESOLVED`).
     - "Resolve Ticket" action updates SLA timer and triggers simulated email delivery toast.
   - **Multi-Party Approval Workflow Stepper:**
     - Visual horizontal 4-step approval tracker for student on-duty or concession requests: `Step 1: Mentor (Approved)` -> `Step 2: Head of Department (Approved)` -> `Step 3: Dean Student Affairs (Pending)` -> `Step 4: Academic Office`.
     - Action buttons: "Approve Step" / "Reject with Reason".

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     `import React, { useState, useMemo } from 'react';`
     `import { Bell, Mail, MessageSquare, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Filter, Send, User, ChevronRight, Check, Plus, Paperclip, FileText, Smartphone, X, Search, AlertCircle, ArrowUpRight } from 'lucide-react';`
   - Complete TypeScript interfaces defined at top of file: `NoticeItem`, `HelpdeskTicket`, `ApprovalStep`, `ApprovalWorkflowItem`.
   - Embedded realistic mock datasets.
   - Export signature: `export const CommunicationWorkspace: React.FC = () => { ... }`.
   - Strictly NO placeholder comments like `// implement here`. Return the full, working component code.
```

---

## Prompt 4: Module 08 — Reports & Regulatory Analytics Workspace

```markdown
You are a Principal Frontend Architect building Module 08 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
`apps/web/src/features/reports/ReportsWorkspace.tsx`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (`#682038`), Background Cream (`#FAF7F2`), Accent Bronze (`#8B5E3C`), Card Surface (`bg-white`), Borders (`#E5DFD7`), Dark Text (`#242424`), Muted Text (`#6E6862`).
   - Font: Standard sans-serif for UI, JetBrains Mono (`font-mono`) for SQL queries, metrics, and report identifiers.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (`transition-all duration-200`).

2. **Core Domain Workflows to Implement:**
   - **Materialized Read-Model KPI Dashboard:**
     - 4 top-level analytical cards reading from cached PostgreSQL summary views:
       1. Total Enrolled Students (2,480 across 6 academic programs).
       2. Autonomous Pass Rate (92.4% in latest End-Semester exams).
       3. Cumulative Fee Realization (94.6% - ₹18.42 Cr collected / ₹19.47 Cr demand).
       4. Doctorate Faculty Ratio (64.2% - 112 PhDs among 174 faculty).
     - Each card displays month-over-month trend and last cached timestamp (`Refreshed 4m ago`).
   - **Regulatory Returns 1-Click Exporters:**
     - Dedicated compliance packages for the 4 core Indian higher-ed bodies:
       1. **NAAC (SSR Package):** Criterion 1-7 aggregated metrics, Student-Faculty ratio (1:14.2), Average teaching experience.
       2. **NBA (Tier-1 Return):** Outcome-Based Education (OBE) course outcome attainment matrices and program educational objectives.
       3. **NIRF (Ranking Dossier):** TLR, RPC, GO (Graduation Outcomes), and Outreach metrics.
       4. **AISHE (Annual Institutional Survey):** Statutory data sheets.
     - Interactive "Generate SSR Dossier" button: Shows simulated live progress bar (0% -> 100% in 1.5s), generates simulated CSV/Excel download, and stamps a verification hash.
   - **Curated SQL Query Builder (Anti-Injection & Safe Exploration):**
     - Non-technical interactive report creator:
       - Entity selector: `Students & Academics`, `Fee Collections & Arrears`, `Exam Marks & CGPA`, `Faculty Workloads`.
       - Column picker checkboxes (e.g. `roll_no`, `student_name`, `program`, `cgpa`, `fee_balance`).
       - Parameterized filters: Department selector, minimum CGPA input, fee status toggle.
       - Parameterized SQL Code Box: Displays live, syntax-highlighted SQL showing safe bind parameters (`SELECT s.roll_no, s.full_name, g.cgpa FROM students s JOIN grades g ON s.id = g.student_id WHERE s.department = $1 AND g.cgpa >= $2;`).
       - Anti-Injection Security Callout: "System strictly executes parameterized queries against curated view catalogs. Arbitrary user raw SQL injection is strictly blocked at the API gateway layer per Section 4.3."
       - "Run Curated Query" button: Instantly loads a dynamic table of mock query results with total record count and an "Export Result to CSV" button.

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     `import React, { useState, useMemo } from 'react';`
     `import { BarChart3, FileSpreadsheet, Download, Database, Filter, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Eye, Sparkles, BookOpen, Table, Search, ChevronRight, X, Check, ArrowUpRight } from 'lucide-react';`
   - Complete TypeScript interfaces defined at top of file: `RegulatoryReport`, `CuratedEntity`, `CuratedColumn`, `MaterializedKpi`, `QueryResultRow`.
   - Embedded realistic mock datasets.
   - Export signature: `export const ReportsWorkspace: React.FC = () => { ... }`.
   - Strictly NO placeholder comments like `// implement here`. Return the full, working component code.
```
