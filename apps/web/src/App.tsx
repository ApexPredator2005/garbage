import React, { useState } from 'react';
import { RoleType } from './types';
import { Navbar } from './components/Navbar';
import { PresignedUploadModal } from './components/PresignedUploadModal';
import { ClaudeModulesModal } from './components/ClaudeModulesModal';
import { ModuleStagingPlaceholder } from './components/ModuleStagingPlaceholder';
import { AdmissionsWorkspace } from './features/admissions/AdmissionsWorkspace';
import { AcademicsWorkspace } from './features/academics/AcademicsWorkspace';
import { ExamsWorkspace } from './features/exams/ExamsWorkspace';
import { FeesWorkspace } from './features/fees/FeesWorkspace';
import {
  Users,
  Calendar,
  Award,
  CreditCard,
  Sparkles,
  Fingerprint,
  DollarSign,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

type ModuleTab =
  | 'admissions'
  | 'attendance'
  | 'academics'
  | 'exams'
  | 'fees'
  | 'payroll'
  | 'communication'
  | 'reports';

export const App: React.FC = () => {
  const [currentTenantId, setCurrentTenantId] = useState('t-1');
  const [currentRole, setCurrentRole] = useState<RoleType>('PRINCIPAL');
  const [activeTab, setActiveTab] = useState<ModuleTab>('academics');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isClaudePromptsOpen, setIsClaudePromptsOpen] = useState(false);

  // Staged prompts for modular workspaces
  const CLAUDE_PROMPTS = {
    attendance: `You are a Principal Frontend Architect building Module 02 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
apps/web/src/features/attendance/AttendanceWorkspace.tsx

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. Design System & Visual Language:
   - Institutional Palette: Primary Deep Burgundy (#682038), Background Cream (#FAF7F2), Accent Bronze (#8B5E3C), Card Surface (bg-white), Borders (#E5DFD7), Dark Text (#242424), Muted Text (#6E6862).
   - Font: Standard sans-serif for UI, JetBrains Mono (font-mono) for roll numbers, percentages, IP addresses, and timestamps.
2. Core Domain Workflows:
   - Period-Wise Attendance Matrix: Period 1 to 6, Class & Section selector, status toggles (PRESENT, ABSENT, LATE, ON_DUTY).
   - 1-Click "Mark All Present" & Batch Flush (<15ms latency simulation).
   - Session Lock Indicator: Displays lock status with "Request Session Unlock" modal for Dean approval.
   - Statutory 75% Attendance Gating: Highlights students <75% as BARRED / INELIGIBLE FOR HALL TICKET.
   - Condonation Application Desk: Medical certificate verification + ₹500 penalty UTR receipt; HOD approval restores hall ticket eligibility.
   - Raw Biometric Punch Reconciliation Table: Immutable device logs (BIO-GATE-01, IP, timestamp) with reconciliation status.
3. Imports: React, { useState, useMemo } from 'react', Lucide icons.
Export signature: export const AttendanceWorkspace: React.FC = () => { ... }`,

    payroll: `You are a Principal Frontend Architect building Module 06 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
apps/web/src/features/hr/HrPayrollWorkspace.tsx

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. Design System & Visual Language:
   - Institutional Palette: Primary Deep Burgundy (#682038), Background Cream (#FAF7F2), Accent Bronze (#8B5E3C), Card Surface (bg-white), Borders (#E5DFD7), Dark Text (#242424), Muted Text (#6E6862).
   - Font: JetBrains Mono (font-mono) for currency figures, employee IDs, and formulas.
2. Core Domain Workflows:
   - Employee Service Book: Master roster with Employee Code, Designation, Department, Date of Joining, Bank Account, PAN, Status.
   - Salary Structure & Formula Engine: Basic Pay, HRA (40%), DA (25%), PF (12%), PT (₹200), TDS, and sandboxed formula evaluation preview (no eval).
   - Monthly Payroll Run 3-Stage State Machine: DRAFT (editable LOP days with live net calculation) -> APPROVED (Finance signoff) -> LOCKED (General Ledger voucher posted & immutable watermark).
   - Interactive Payslip Modal: Institutional header, earnings vs deductions columns, net payable in words, PDF download simulation.
   - Banking Export: Generate NEFT bank batch payment file.
3. Imports: React, { useState, useMemo } from 'react', Lucide icons.
Export signature: export const HrPayrollWorkspace: React.FC = () => { ... }`,

    communication: `You are a Principal Frontend Architect building Module 07 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
apps/web/src/features/communication/CommunicationWorkspace.tsx

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. Design System & Visual Language:
   - Institutional Palette: Primary Deep Burgundy (#682038), Background Cream (#FAF7F2), Accent Bronze (#8B5E3C), Card Surface (bg-white), Borders (#E5DFD7).
2. Core Domain Workflows:
   - Cost-Optimized Communication Banner: Strict Zero-SMS & Zero-WhatsApp policy; WebSocket push & Enterprise Email only.
   - Targeted Notice Board: Audience filtering (All, Faculty, Student, Dept), Priority tags, read-receipt counters (842 / 1200 read).
   - SLA Grievance Helpdesk: Categories (Academic, Fee, Wi-Fi, Hostel), dynamic SLA countdown badges (4h urgent timer / Breached alert), resolution modal.
   - Multi-Party Approval Stepper: Horizontal 4-step approval tracker (Mentor -> HOD -> Dean -> Academic Office) with action buttons.
3. Imports: React, { useState, useMemo } from 'react', Lucide icons.
Export signature: export const CommunicationWorkspace: React.FC = () => { ... }`,

    reports: `You are a Principal Frontend Architect building Module 08 for the Devloft College Campus Management System.
Generate the complete, production-grade, self-contained React TypeScript file for:
apps/web/src/features/reports/ReportsWorkspace.tsx

### ARCHITECTURAL & COMPLIANCE REQUIREMENTS:
1. Design System & Visual Language:
   - Institutional Palette: Primary Deep Burgundy (#682038), Background Cream (#FAF7F2), Accent Bronze (#8B5E3C), Card Surface (bg-white), Borders (#E5DFD7).
   - Font: JetBrains Mono (font-mono) for SQL queries, metrics, and report identifiers.
2. Core Domain Workflows:
   - Materialized Read-Model KPI Dashboard: 4 summary cards from cached PostgreSQL views (Enrollment, Pass %, Fee Realization %, PhD Ratio).
   - Regulatory Returns 1-Click Exporters: Dedicated packages for NAAC (SSR), NBA (Tier-1 OBE), NIRF 2026, and AISHE with simulated download triggers.
   - Curated SQL Query Builder: Non-technical report creator with Entity picker, column checkboxes, parameter filters, safe SQL preview ($1, $2 bind parameters), and Anti-Injection security callout.
3. Imports: React, { useState, useMemo } from 'react', Lucide icons.
Export signature: export const ReportsWorkspace: React.FC = () => { ... }`,
  };

  const MODULES_NAV = [
    { id: 'admissions', label: '01. Admissions & SIS', icon: Users },
    { id: 'attendance', label: '02. Attendance & Condonation', icon: Fingerprint, isModular: true },
    { id: 'academics', label: '03. Academics & Timetables', icon: Calendar },
    { id: 'exams', label: '04. Exams & Moderation', icon: Award },
    { id: 'fees', label: '05. Fees & UTR Ledger', icon: CreditCard },
    { id: 'payroll', label: '06. HR & Payroll', icon: DollarSign, isModular: true },
    { id: 'communication', label: '07. Communication & SLA', icon: MessageSquare, isModular: true },
    { id: 'reports', label: '08. Reports & Regulatory', icon: BarChart3, isModular: true },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      {/* Top Navbar with Multi-Tenancy & Role Controls */}
      <Navbar
        currentTenantId={currentTenantId}
        onTenantChange={setCurrentTenantId}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenClaudePrompts={() => setIsClaudePromptsOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3 overflow-x-auto gap-4">
          <nav className="flex items-center gap-1.5 flex-wrap">
            {MODULES_NAV.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id as ModuleTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#682038] text-white shadow-sm'
                      : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mod.label}</span>
                  {mod.isModular && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Staged Modular Workspace" />
                  )}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setIsClaudePromptsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Claude Prompts Hub</span>
          </button>
        </div>

        {/* Active Workspace View */}
        <div className="transition-all duration-200">
          {activeTab === 'admissions' && <AdmissionsWorkspace />}
          {activeTab === 'academics' && <AcademicsWorkspace />}
          {activeTab === 'exams' && <ExamsWorkspace />}
          {activeTab === 'fees' && <FeesWorkspace />}

          {/* Staged Modular Workspaces */}
          {activeTab === 'attendance' && (
            <ModuleStagingPlaceholder
              moduleNumber="Module 02"
              moduleName="Attendance & Biometric Reconciliation Workspace"
              targetFilePath="apps/web/src/features/attendance/AttendanceWorkspace.tsx"
              workflows={[
                'Period-wise attendance marking (Period 1 to 6) with Present / Absent / Late / On-Duty toggles',
                'Statutory 75% attendance threshold dynamically gating Exam Hall Ticket eligibility',
                'Medical condonation application desk with statutory ₹500 fee receipt (UTR) verification',
                'Immutable raw biometric hardware punch audit log (BIO-GATE-01, IP, timestamp)',
                'Session lock indicator (>24h locked) with Academic Dean session edit request modal',
              ]}
              claudePrompt={CLAUDE_PROMPTS.attendance}
              onOpenClaudeModal={() => setIsClaudePromptsOpen(true)}
            />
          )}

          {activeTab === 'payroll' && (
            <ModuleStagingPlaceholder
              moduleNumber="Module 06"
              moduleName="HR & Payroll Lifecycle Workspace"
              targetFilePath="apps/web/src/features/hr/HrPayrollWorkspace.tsx"
              workflows={[
                'Employee Service Book with Designation, Department, Bank Account, and PAN details',
                'Sandboxed salary formula calculation (Basic, 40% HRA, 25% DA, 12% PF, PT ₹200, TDS)',
                '3-Phase Payroll lifecycle state machine: DRAFT -> APPROVED -> LOCKED',
                'Loss of Pay (LOP) deduction calculator with real-time net salary adjustments',
                'Institutional Payslip Modal with Burgundy header, net payable in words, and simulated PDF download',
              ]}
              claudePrompt={CLAUDE_PROMPTS.payroll}
              onOpenClaudeModal={() => setIsClaudePromptsOpen(true)}
            />
          )}

          {activeTab === 'communication' && (
            <ModuleStagingPlaceholder
              moduleNumber="Module 07"
              moduleName="Communication & SLA Helpdesk Workspace"
              targetFilePath="apps/web/src/features/communication/CommunicationWorkspace.tsx"
              workflows={[
                'Targeted Campus Notice Board with audience filtering (All, Faculty, Student, Department)',
                'Strict Zero-SMS & Zero-WhatsApp cost-optimization policy (WebSocket push & Email only)',
                'SLA Helpdesk grievance queue with live countdown timers and overdue breach badges',
                'Ticket resolution modal with internal staff remarks and simulated student notification email',
                'Visual 4-step multi-party approval workflow tracker (Mentor -> HOD -> Dean -> Academic Office)',
              ]}
              claudePrompt={CLAUDE_PROMPTS.communication}
              onOpenClaudeModal={() => setIsClaudePromptsOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <ModuleStagingPlaceholder
              moduleNumber="Module 08"
              moduleName="Reports & Regulatory Analytics Workspace"
              targetFilePath="apps/web/src/features/reports/ReportsWorkspace.tsx"
              workflows={[
                'PostgreSQL Materialized View KPI cards (Enrollment, Pass %, Fee Collection %, PhD Ratio)',
                '1-Click Regulatory Exporters: NAAC SSR, NBA Tier-1 OBE, NIRF 2026, and AISHE',
                'Curated SQL Query Builder with Entity selector, column checkboxes, and filter builder',
                'Strict Anti-Injection parameterized SQL code preview ($1, $2 bind parameters)',
                'Simulated tabular query execution preview with CSV dataset export trigger',
              ]}
              claudePrompt={CLAUDE_PROMPTS.reports}
              onOpenClaudeModal={() => setIsClaudePromptsOpen(true)}
            />
          )}
        </div>
      </main>

      {/* S3 Presigned Upload Modal */}
      <PresignedUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Claude Modular Prompts Modal */}
      <ClaudeModulesModal isOpen={isClaudePromptsOpen} onClose={() => setIsClaudePromptsOpen(false)} />
    </div>
  );
};
