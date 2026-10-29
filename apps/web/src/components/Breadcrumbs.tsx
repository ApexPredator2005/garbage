import React from 'react';
import { ChevronRight, Home, Building } from 'lucide-react';
import { RoleType } from '../types';
import { ModuleTab } from '../App';

interface BreadcrumbsProps {
  currentTenantName: string;
  currentRole: RoleType;
  activeModule?: ModuleTab;
  studentSubTab?: string;
  parentSubTab?: string;
  onNavigateHome: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentTenantName,
  currentRole,
  activeModule,
  onNavigateHome,
}) => {
  const moduleLabels: Record<ModuleTab, string> = {
    admissions: 'Admissions & SIS Registry',
    attendance: 'Attendance & Condonation Desk',
    academics: 'Academics & Timetable Matrix',
    exams: 'Examinations & Grade Moderation',
    fees: 'Fees & Bursar UTR Verification',
    payroll: 'HR & 3-Stage Payroll Engine',
    placement: 'Training & Placement Cell (T&P)',
    library: 'Library & Information Center (OPAC)',
    communication: 'Communication & SLA Helpdesk',
    reports: 'Reports & Accreditation KPIs',
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#6E6862] flex-wrap" aria-label="Breadcrumb">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-[#682038] font-medium transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Campus</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-[#E5DFD7] shrink-0" />
      <span className="font-medium text-[#242424] truncate max-w-[200px]" title={currentTenantName}>
        {currentTenantName.split(' ')[0]} {currentTenantName.split(' ')[1] || ''}
      </span>

      <ChevronRight className="w-3.5 h-3.5 text-[#E5DFD7] shrink-0" />
      {currentRole === 'STUDENT' ? (
        <span className="font-bold text-[#2563EB]">Student Self-Service Portal</span>
      ) : currentRole === 'PARENT' ? (
        <span className="font-bold text-[#8B5E3C]">Multi-Ward Parent Hub</span>
      ) : activeModule ? (
        <span className="font-bold text-[#682038]">{moduleLabels[activeModule]}</span>
      ) : (
        <span className="font-bold text-[#682038]">Overview</span>
      )}
    </nav>
  );
};
