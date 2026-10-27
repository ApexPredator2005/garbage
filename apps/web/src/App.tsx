import React, { useState } from 'react';
import { RoleType } from './types';
import { Navbar } from './components/Navbar';
import { PresignedUploadModal } from './components/PresignedUploadModal';
import { ClaudeModulesModal } from './components/ClaudeModulesModal';
import { AdmissionsWorkspace } from './features/admissions/AdmissionsWorkspace';
import { AttendanceWorkspace } from './features/attendance/AttendanceWorkspace';
import { AcademicsWorkspace } from './features/academics/AcademicsWorkspace';
import { ExamsWorkspace } from './features/exams/ExamsWorkspace';
import { FeesWorkspace } from './features/fees/FeesWorkspace';
import { HrPayrollWorkspace } from './features/hr/HrPayrollWorkspace';
import { CommunicationWorkspace } from './features/communication/CommunicationWorkspace';
import { ReportsWorkspace } from './features/reports/ReportsWorkspace';
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
  Layers,
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

  const MODULES_NAV = [
    { id: 'admissions', label: '01. Admissions & SIS', icon: Users },
    { id: 'attendance', label: '02. Attendance & Condonation', icon: Fingerprint },
    { id: 'academics', label: '03. Academics & Timetables', icon: Calendar },
    { id: 'exams', label: '04. Exams & Moderation', icon: Award },
    { id: 'fees', label: '05. Fees & UTR Ledger', icon: CreditCard },
    { id: 'payroll', label: '06. HR & Payroll', icon: DollarSign },
    { id: 'communication', label: '07. Communication & SLA', icon: MessageSquare },
    { id: 'reports', label: '08. Reports & Regulatory', icon: BarChart3 },
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
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setIsClaudePromptsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Prompt Contracts Hub</span>
          </button>
        </div>

        {/* Active Workspace View */}
        <div className="transition-all duration-200">
          {activeTab === 'admissions' && <AdmissionsWorkspace />}
          {activeTab === 'attendance' && <AttendanceWorkspace />}
          {activeTab === 'academics' && <AcademicsWorkspace />}
          {activeTab === 'exams' && <ExamsWorkspace />}
          {activeTab === 'fees' && <FeesWorkspace />}
          {activeTab === 'payroll' && <HrPayrollWorkspace />}
          {activeTab === 'communication' && <CommunicationWorkspace />}
          {activeTab === 'reports' && <ReportsWorkspace />}
        </div>
      </main>

      {/* S3 Presigned Upload Modal */}
      <PresignedUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Claude Modular Prompts Modal */}
      <ClaudeModulesModal isOpen={isClaudePromptsOpen} onClose={() => setIsClaudePromptsOpen(false)} />
    </div>
  );
};
