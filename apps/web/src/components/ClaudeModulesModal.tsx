import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface ClaudeModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClaudeModulesModal: React.FC<ClaudeModulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'payroll' | 'communication' | 'reports' | 'attendance'>('payroll');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const CLAUDE_PROMPTS = {
    payroll: `### CLAUDE PROMPT: Build Module 06 (HR & Payroll Workspace)
Role: Senior Full-Stack Engineer implementing Devloft Campus Management System.
Repository Context: Turborepo + React 18 + Vite + Tailwind CSS + Lucide React.
Target File to Create: \`apps/web/src/features/hr/HrPayrollWorkspace.tsx\`

SPECIFICATION REQUIREMENTS (From Devloft Developer Guide, Page 18-20):
1. **Employee Service Book:** Master list of faculty & staff with Employee Code, Designation, Department, Joining Date, and Status (Active/On-Leave).
2. **Salary Structure & Formula Engine:** Display components (Basic, HRA, DA, Special Allowance, PF, ESI, Professional Tax, TDS). Support sandboxed formula preview (e.g. HRA = Basic * 0.40).
3. **Monthly Payroll Run State Machine:**
   - Visual states: \`DRAFT\` -> \`APPROVED\` -> \`LOCKED\`.
   - Calculate gross salary, loss-of-pay (LOP) days, net payable amount.
   - Once locked, payroll is immutable and posts a balanced voucher to accounting.
4. **Payslip Modal:** Render an institutional payslip preview with institutional header (Burgundy/Cream), breakdown table, and simulated PDF download button.
5. **Styling & Tokens:** Use Tailwind color tokens: Deep Burgundy (#682038), Warm Cream (#FAF7F2), Bronze (#8B5E3C). Accessible buttons, JetBrains Mono for numbers.

Return clean, self-contained React TypeScript code with mock data ready to drop into \`apps/web/src/features/hr/HrPayrollWorkspace.tsx\`.`,

    communication: `### CLAUDE PROMPT: Build Module 07 (Communication & SLA Helpdesk Workspace)
Role: Senior Full-Stack Engineer implementing Devloft Campus Management System.
Repository Context: Turborepo + React 18 + Vite + Tailwind CSS + Lucide React.
Target File to Create: \`apps/web/src/features/communication/CommunicationWorkspace.tsx\`

SPECIFICATION REQUIREMENTS (From Devloft Developer Guide, Page 20-21):
1. **Targeted Notice Board:**
   - Filter circulars by audience (All Campus, Faculty Only, Department-specific, Student-only).
   - Display circular details with author, date, priority tag, and read-receipt count.
2. **Strict Communication Rule:**
   - Strictly NO SMS or WhatsApp. The system communicates via In-App WebSocket notifications and Email only. Add a prominent badge indicating "Cost-Saving: In-App & Email Channels Active".
3. **SLA Helpdesk Ticketing System:**
   - Ticket categories: Academic Query, Fee Dispute, IT/LMS Support, Hostel/Campus Grievance.
   - Interactive SLA timer badge (e.g., "4h remaining" in amber, "Overdue" in red).
   - Ticket detail panel with priority escalation and status toggles (\`OPEN\`, \`IN_PROGRESS\`, \`RESOLVED\`).
4. **Approval Workflow Engine:**
   - Mini visual tracker for multi-step approvals (e.g., Student Leave Request: Mentor -> HOD -> Principal).

Return clean, self-contained React TypeScript code with mock data ready to drop into \`apps/web/src/features/communication/CommunicationWorkspace.tsx\`.`,

    reports: `### CLAUDE PROMPT: Build Module 08 (Reports & Regulatory Analytics Workspace)
Role: Senior Full-Stack Engineer implementing Devloft Campus Management System.
Repository Context: Turborepo + React 18 + Vite + Tailwind CSS + Lucide React.
Target File to Create: \`apps/web/src/features/reports/ReportsWorkspace.tsx\`

SPECIFICATION REQUIREMENTS (From Devloft Developer Guide, Page 21-22):
1. **Regulatory Returns One-Click Exporters:**
   - High-priority compliance tabs: NAAC (SSR metrics), NBA (Tier-1 outcome-based returns), NIRF (Faculty-Student ratio, Graduation outcomes), and AISHE.
   - Export buttons with progress indicators for Excel, CSV, and PDF formats.
2. **Custom SQL Report Builder (Curated Catalog):**
   - Non-technical interactive query builder allowing staff to select Entity (Students, Exam Results, Fee Collections, Faculty Workload), select allowed Columns, apply Range Filters, and run the report.
   - Rule: Parameterized SQL generation from curated catalog; never accepts raw SQL input.
3. **Materialized Read-Model Visualizer:**
   - Interactive KPI cards reading from summary views: Total Enrollment, Campus Pass Rate, Fee Collection vs. Dues Ratio, Faculty Publications.

Return clean, self-contained React TypeScript code with mock data ready to drop into \`apps/web/src/features/reports/ReportsWorkspace.tsx\`.`,

    attendance: `### CLAUDE PROMPT: Build Module 02 (Attendance & Biometric Reconciliation Workspace)
Role: Senior Full-Stack Engineer implementing Devloft Campus Management System.
Repository Context: Turborepo + React 18 + Vite + Tailwind CSS + Lucide React.
Target File to Create: \`apps/web/src/features/attendance/AttendanceWorkspace.tsx\`

SPECIFICATION REQUIREMENTS (From Devloft Developer Guide, Page 13-14):
1. **Period-Wise Attendance Matrix:**
   - Roster grid for period attendance marking (Present, Absent, Late, On-Duty).
   - "Mark All Present" toggle and 1-click batch submission (<15ms payload simulation).
   - Session Lock Indicator: Displays lock status with "Request Session Edit" modal.
2. **Exam Eligibility & Shortage Gating:**
   - Automatic percentage gauge per student (Threshold: 75%).
   - Students under 75% highlighted in red with "Defaulter / Ineligible for Hall Ticket".
3. **Condonation Application Desk:**
   - Process student medical leave condonation requests with attached fee penalty receipts.
   - Once condonation is approved, mark student eligible for that specific examination.
4. **Biometric Device Punch Import Reconciliation:**
   - Raw punch audit table showing device ID, timestamp, employee ID.
   - Reconcile punches against shift timings without ever modifying raw logs.

Return clean, self-contained React TypeScript code with mock data ready to drop into \`apps/web/src/features/attendance/AttendanceWorkspace.tsx\`.`,
  };

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#682038] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424]">Modular Prompts for Claude</h3>
              <p className="text-xs text-[#6E6862]">
                Copy these self-contained prompts to have Claude build complementary modules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 pt-4 pb-3 border-b border-[#E5DFD7] overflow-x-auto">
          {[
            { id: 'payroll', label: 'Module 06: HR & Payroll' },
            { id: 'communication', label: 'Module 07: Communication & SLA' },
            { id: 'reports', label: 'Module 08: Reports & NAAC/NIRF' },
            { id: 'attendance', label: 'Module 02: Attendance & Condonation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#682038] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Prompt Content Viewer */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="relative">
            <button
              onClick={() => handleCopy(activeTab, CLAUDE_PROMPTS[activeTab])}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD7] text-xs font-semibold text-[#682038] hover:bg-[#F4ECE2] shadow-sm z-10 transition-all"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span className="text-[#16A34A]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
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
            <span>Strictly aligned with Devloft CMS Specification & Shared Contracts</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
