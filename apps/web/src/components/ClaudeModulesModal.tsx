import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen, AlertCircle, FileCode } from 'lucide-react';

interface ClaudeModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClaudeModulesModal: React.FC<ClaudeModulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'payroll' | 'communication' | 'reports'>('payroll');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const CLAUDE_PROMPTS = {
    attendance: `You are a Principal Frontend Architect building Module 02 for the Institutional College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
\`apps/web/src/features/attendance/AttendanceWorkspace.tsx\`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (\`#682038\`), Background Cream (\`#FAF7F2\`), Accent Bronze (\`#8B5E3C\`), Card Surface (\`bg-white\`), Borders (\`#E5DFD7\`), Dark Text (\`#242424\`), Muted Text (\`#6E6862\`).
   - Font: Standard sans-serif for UI, JetBrains Mono (\`font-mono\`) for roll numbers, percentages, IP addresses, and timestamps.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (\`transition-all duration-200\`).

2. **Core Domain Workflows to Implement:**
   - **Period-Wise Attendance Matrix:**
     - Select Class/Section (e.g., "BE Computer Science - Semester 6 - Section A"), Subject ("CS601 Distributed Systems"), and Period (Period 1 to Period 6).
     - Roster grid of 6-8 realistic students with photo avatars, Roll Numbers, Cumulative Attendance %, and Status buttons: \`PRESENT\` (green), \`ABSENT\` (red), \`LATE\` (amber), \`ON_DUTY\` (blue).
     - "Mark All Present" 1-click batch action.
     - "Flush Attendance" button with simulated latency indicator badge (\`⚡ 14ms batch flush\`).
   - **Session Lock Indicator:**
     - Displays session lock status. If marked > 24 hours ago, mark as LOCKED with padlock icon.
     - "Request Session Unlock" button opening an interactive modal with mandatory Dean justification field and audit trace preview.
   - **Statutory 75% Attendance Gating for Hall Tickets:**
     - Cumulative percentage gauge for each student.
     - Any student strictly below 75% gets a prominent red warning badge: \`BARRED / INELIGIBLE FOR HALL TICKET\` showing exact session shortage count.
   - **Condonation Application Desk (Interactive Tab/Drawer):**
     - Lists medical condonation requests for students under 75% (e.g., Hospital admission certificate + ₹500 statutory condonation fee UTR reference).
     - Actions: HOD "Approve Condonation" or "Reject".
     - Approving recalculates adjusted attendance (e.g. 68% -> 76% condoned) and dynamically flips the student from \`BARRED\` to \`HALL TICKET ELIGIBLE\`.
   - **Raw Biometric Punch Reconciliation Table (Interactive Tab):**
     - Displays raw hardware punch logs: Device ID (\`BIO-GATE-01\`), IP (\`192.168.10.45\`), Employee/Student ID, Timestamp, Shift Match, and Status (\`ON_TIME\`, \`GRACE_PERIOD\`, \`LATE_IN\`).
     - Includes compliance banner: "Raw hardware punch logs are immutable append-only records per Section 3.2. Manual adjustments create reconciliation audit vouchers without mutating raw device logs."

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     \`import React, { useState, useMemo } from 'react';\`
     \`import { Users, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, Lock, Unlock, Fingerprint, Calendar, ShieldCheck, Download, Search, Check, Filter, RefreshCw, X, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';\`
   - Complete TypeScript interfaces defined at top of file: \`StudentAttendance\`, \`AttendanceStatus\`, \`CondonationRequest\`, \`BiometricPunchLog\`.
   - Embedded realistic mock datasets.
   - Export signature: \`export const AttendanceWorkspace: React.FC = () => { ... }\`.
   - Strictly NO placeholder comments like \`// implement here\`. Return the full, working component code.`,

    payroll: `You are a Principal Frontend Architect building Module 06 for the Institutional College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
\`apps/web/src/features/hr/HrPayrollWorkspace.tsx\`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (\`#682038\`), Background Cream (\`#FAF7F2\`), Accent Bronze (\`#8B5E3C\`), Card Surface (\`bg-white\`), Borders (\`#E5DFD7\`), Dark Text (\`#242424\`), Muted Text (\`#6E6862\`).
   - Font: Standard sans-serif for UI, JetBrains Mono (\`font-mono\`) for currency figures, employee IDs, and formulas.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (\`transition-all duration-200\`).

2. **Core Domain Workflows to Implement:**
   - **Employee Service Book (Master Roster):**
     - 6-8 realistic faculty and administrative staff (e.g. Dr. Aris Thorne - Prof & HOD CSE, Prof. Sunita Rao - Assoc Prof AI&DS, Rajesh K - Senior Lab Tech, etc.).
     - Details: Employee Code, Designation, Department, Date of Joining, Bank Account, PAN Number, Status (\`ACTIVE\`, \`ON_LEAVE\`, \`PROBATION\`).
     - Search and Department filter.
   - **Salary Structure & Formula Engine:**
     - Breakdown components: Basic Pay, HRA (40% of Basic), DA (25% of Basic), Special Allowance, Provident Fund (12% of Basic), Professional Tax (₹200 fixed), Income Tax (TDS), Loss of Pay (LOP) deduction.
     - Sandboxed formula evaluation preview card explaining the computation without using unsafe \`eval()\`.
   - **Monthly Payroll Run 3-Stage State Machine:**
     - Visual lifecycle bar: \`DRAFT\` -> \`APPROVED\` -> \`LOCKED\`.
     - In \`DRAFT\` mode: HR can edit LOP (Loss of Pay) days (e.g. 0 to 5 days). The net salary recomputes dynamically in real-time (\`Gross - Deductions - (Gross/30 * LOPDays)\`).
     - In \`APPROVED\` mode: Finance Officer approves the cycle; fields lock.
     - In \`LOCKED\` mode: Entire cycle is frozen, displays balanced General Ledger Voucher Number (\`JV-2026-PAY-104\`) and immutable watermark badge.
   - **Interactive Payslip Modal:**
     - Clicking "View Payslip" opens a formal institutional slip.
     - Features: Formal Header ("College of Engineering & Technology"), Employee Details, Itemized Earnings vs. Deductions columns, Net Payable in numbers and written in words (\`Rupees Eighty-Two Thousand Four Hundred Only\`), Registrar Signature stamp placeholder, and simulated "Download PDF" / "Print" triggers.
   - **Banking Export Trigger:**
     - "Generate NEFT Bank Batch File" button with confirmation alert.

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     \`import React, { useState, useMemo } from 'react';\`
     \`import { DollarSign, Users, FileText, CheckCircle2, Lock, ArrowUpRight, Download, Calculator, Calendar, ShieldCheck, Printer, AlertCircle, Building, Search, Eye, X, ChevronRight, Check } from 'lucide-react';\`
   - Complete TypeScript interfaces defined at top of file: \`EmployeeRecord\`, \`SalaryStructure\`, \`PayrollCycleItem\`, \`PayrollRunState\`.
   - Embedded realistic mock datasets.
   - Export signature: \`export const HrPayrollWorkspace: React.FC = () => { ... }\`.
   - Strictly NO placeholder comments like \`// implement here\`. Return the full, working component code.`,

    communication: `You are a Principal Frontend Architect building Module 07 for the Institutional College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
\`apps/web/src/features/communication/CommunicationWorkspace.tsx\`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (\`#682038\`), Background Cream (\`#FAF7F2\`), Accent Bronze (\`#8B5E3C\`), Card Surface (\`bg-white\`), Borders (\`#E5DFD7\`), Dark Text (\`#242424\`), Muted Text (\`#6E6862\`).
   - Font: Standard sans-serif for UI, JetBrains Mono (\`font-mono\`) for ticket numbers, SLAs, and timestamps.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (\`transition-all duration-200\`).

2. **Core Domain Workflows to Implement:**
   - **Cost-Optimized Communication Architecture Banner:**
     - Highlighting the strict Zero-SMS & Zero-WhatsApp policy: "All institutional communications are transmitted via In-App WebSocket Push & Enterprise Email, completely eliminating third-party SMS gateway tolls."
   - **Targeted Campus Notice Board:**
     - Audience filtering: \`ALL_CAMPUS\`, \`FACULTY_ONLY\`, \`STUDENT_ONLY\`, \`DEPT_CSE\`.
     - Notice cards displaying Category (Academic, Examination, Fee Reminder, Administrative), Title, Author, Date, Priority badge (\`NORMAL\`, \`URGENT\`, \`CRITICAL\`), and Read-Receipt progress bar (e.g. \`842 / 1,200 Acknowledged (70%)\`).
     - "Publish Circular" modal with recipient targeting and attachment preview.
   - **SLA Grievance & Helpdesk Queue:**
     - Categories: Academic Evaluation, Fee Ledger Recheck, Wi-Fi & Infrastructure, Hostel Affairs.
     - Live SLA timer countdown badges:
       - Urgent: 4h SLA (shows remaining time in amber e.g. \`2h 15m remaining\`, or \`BREACHED / OVERDUE\` in red).
       - High: 24h SLA.
       - Normal: 72h SLA.
     - Ticket Detail Drawer/Modal: View student inquiry, post internal staff resolution remarks, reassign to department, and toggle status (\`OPEN\`, \`IN_PROGRESS\`, \`RESOLVED\`).
     - "Resolve Ticket" action updates SLA timer and triggers simulated email delivery toast.
   - **Multi-Party Approval Workflow Stepper:**
     - Visual horizontal 4-step approval tracker for student on-duty or concession requests: \`Step 1: Mentor (Approved)\` -> \`Step 2: Head of Department (Approved)\` -> \`Step 3: Dean Student Affairs (Pending)\` -> \`Step 4: Academic Office\`.
     - Action buttons: "Approve Step" / "Reject with Reason".

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     \`import React, { useState, useMemo } from 'react';\`
     \`import { Bell, Mail, MessageSquare, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Filter, Send, User, ChevronRight, Check, Plus, Paperclip, FileText, Smartphone, X, Search, AlertCircle, ArrowUpRight } from 'lucide-react';\`
   - Complete TypeScript interfaces defined at top of file: \`NoticeItem\`, \`HelpdeskTicket\`, \`ApprovalStep\`, \`ApprovalWorkflowItem\`.
   - Embedded realistic mock datasets.
   - Export signature: \`export const CommunicationWorkspace: React.FC = () => { ... }\`.
   - Strictly NO placeholder comments like \`// implement here\`. Return the full, working component code.`,

    reports: `You are a Principal Frontend Architect building Module 08 for the Institutional College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
\`apps/web/src/features/reports/ReportsWorkspace.tsx\`

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. **Design System & Visual Language:**
   - Institutional Palette: Primary Deep Burgundy (\`#682038\`), Background Cream (\`#FAF7F2\`), Accent Bronze (\`#8B5E3C\`), Card Surface (\`bg-white\`), Borders (\`#E5DFD7\`), Dark Text (\`#242424\`), Muted Text (\`#6E6862\`).
   - Font: Standard sans-serif for UI, JetBrains Mono (\`font-mono\`) for SQL queries, metrics, and report identifiers.
   - High-density academic layout with clear visual hierarchy, accessible tap targets, and micro-animations (\`transition-all duration-200\`).

2. **Core Domain Workflows to Implement:**
   - **Materialized Read-Model KPI Dashboard:**
     - 4 top-level analytical cards reading from cached PostgreSQL summary views:
       1. Total Enrolled Students (2,480 across 6 academic programs).
       2. Autonomous Pass Rate (92.4% in latest End-Semester exams).
       3. Cumulative Fee Realization (94.6% - ₹18.42 Cr collected / ₹19.47 Cr demand).
       4. Doctorate Faculty Ratio (64.2% - 112 PhDs among 174 faculty).
     - Each card displays month-over-month trend and last cached timestamp (\`Refreshed 4m ago\`).
   - **Regulatory Returns 1-Click Exporters:**
     - Dedicated compliance packages for the 4 core Indian higher-ed bodies:
       1. **NAAC (SSR Package):** Criterion 1-7 aggregated metrics, Student-Faculty ratio (1:14.2), Average teaching experience.
       2. **NBA (Tier-1 Return):** Outcome-Based Education (OBE) course outcome attainment matrices and program educational objectives.
       3. **NIRF (Ranking Dossier):** TLR, RPC, GO (Graduation Outcomes), and Outreach metrics.
       4. **AISHE (Annual Institutional Survey):** Statutory data sheets.
     - Interactive "Generate SSR Dossier" button: Shows simulated live progress bar (0% -> 100% in 1.5s), generates simulated CSV/Excel download, and stamps a verification hash.
   - **Curated SQL Query Builder (Anti-Injection & Safe Exploration):**
     - Non-technical interactive report creator:
       - Entity selector: \`Students & Academics\`, \`Fee Collections & Arrears\`, \`Exam Marks & CGPA\`, \`Faculty Workloads\`.
       - Column picker checkboxes (e.g. \`roll_no\`, \`student_name\`, \`program\`, \`cgpa\`, \`fee_balance\`).
       - Parameterized filters: Department selector, minimum CGPA input, fee status toggle.
       - Parameterized SQL Code Box: Displays live, syntax-highlighted SQL showing safe bind parameters (\`SELECT s.roll_no, s.full_name, g.cgpa FROM students s JOIN grades g ON s.id = g.student_id WHERE s.department = $1 AND g.cgpa >= $2;\`).
       - Anti-Injection Security Callout: "System strictly executes parameterized queries against curated view catalogs. Arbitrary user raw SQL injection is strictly blocked at the API gateway layer per Section 4.3."
       - "Run Curated Query" button: Instantly loads a dynamic table of mock query results with total record count and an "Export Result to CSV" button.

3. **Technical Contract & Imports:**
   - Use only React and Lucide icons:
     \`import React, { useState, useMemo } from 'react';\`
     \`import { BarChart3, FileSpreadsheet, Download, Database, Filter, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Eye, Sparkles, BookOpen, Table, Search, ChevronRight, X, Check, ArrowUpRight } from 'lucide-react';\`
   - Complete TypeScript interfaces defined at top of file: \`RegulatoryReport\`, \`CuratedEntity\`, \`CuratedColumn\`, \`MaterializedKpi\`, \`QueryResultRow\`.
   - Embedded realistic mock datasets.
   - Export signature: \`export const ReportsWorkspace: React.FC = () => { ... }\`.
   - Strictly NO placeholder comments like \`// implement here\`. Return the full, working component code.`,
  };

  const handleCopy = (key: 'attendance' | 'payroll' | 'communication' | 'reports', content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#682038] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#242424]">Exhaustive Engineering Prompts for Claude</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#682038]/10 text-[#682038]">
                  Zero-Hallucination Contracts
                </span>
              </div>
              <p className="text-xs text-[#6E6862]">
                Copy these contract-dense prompts into Claude to generate 100% production-ready, drop-in workspaces.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 pt-4 pb-3 border-b border-[#E5DFD7] overflow-x-auto">
          {[
            { id: 'attendance', label: '02. Attendance & Condonation' },
            { id: 'payroll', label: '06. HR & Payroll Lifecycle' },
            { id: 'communication', label: '07. Communication & SLA' },
            { id: 'reports', label: '08. Reports & NAAC/NIRF' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#682038] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Info Callout */}
        <div className="mt-3 px-3.5 py-2 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Drop-in Guarantee:</strong> Each prompt contains complete TypeScript contracts, state machines, institutional color tokens, and realistic data so Claude outputs a single complete file with zero missing dependencies.
          </span>
        </div>

        {/* Prompt Content Viewer */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="relative">
            <button
              onClick={() => handleCopy(activeTab, CLAUDE_PROMPTS[activeTab])}
              className="sticky top-2 float-right mr-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD7] text-xs font-semibold text-[#682038] hover:bg-[#FAF7F2] shadow-sm z-10 transition-all"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span className="text-[#16A34A]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Prompt</span>
                </>
              )}
            </button>
            <pre className="bg-[#FAF7F2] p-4 rounded-xl text-xs font-mono text-[#242424] overflow-x-auto whitespace-pre-wrap leading-relaxed border border-[#E5DFD7]">
              {CLAUDE_PROMPTS[activeTab]}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs text-[#6E6862]">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#8B5E3C]" />
            <span>Targeting <code className="text-[#682038] font-bold">apps/web/src/features/</code> with zero extra npm packages</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeTab, CLAUDE_PROMPTS[activeTab])}
              className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] font-bold text-xs border border-[#E5DFD7] transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Selected</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
