import React, { useState, useEffect } from 'react';
import { RoleType } from './types';
import { MOCK_TENANTS } from './mockData';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { Breadcrumbs } from './components/Breadcrumbs';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationCenterDrawer } from './components/NotificationCenterDrawer';
import { PublicApplicationModal } from './components/PublicApplicationModal';
import { PublicVerificationModal } from './components/PublicVerificationModal';
import { PresignedUploadModal } from './components/PresignedUploadModal';
import { AdmissionsWorkspace } from './features/admissions/AdmissionsWorkspace';
import { AttendanceWorkspace } from './features/attendance/AttendanceWorkspace';
import { AcademicsWorkspace } from './features/academics/AcademicsWorkspace';
import { ExamsWorkspace } from './features/exams/ExamsWorkspace';
import { FeesWorkspace } from './features/fees/FeesWorkspace';
import { HrPayrollWorkspace } from './features/hr/HrPayrollWorkspace';
import { CommunicationWorkspace } from './features/communication/CommunicationWorkspace';
import { ReportsWorkspace } from './features/reports/ReportsWorkspace';
import { StudentPortalWorkspace } from './features/student/StudentPortalWorkspace';
import { ParentPortalWorkspace } from './features/parent/ParentPortalWorkspace';
import { PlacementWorkspace } from './features/placement/PlacementWorkspace';
import { LibraryWorkspace } from './features/library/LibraryWorkspace';
import {
  Users,
  Calendar,
  Award,
  CreditCard,
  Fingerprint,
  DollarSign,
  MessageSquare,
  BarChart3,
  Shield,
  Lock,
  GraduationCap,
  Users2,
  Briefcase,
  BookOpen,
} from 'lucide-react';

export type ModuleTab =
  | 'admissions'
  | 'attendance'
  | 'academics'
  | 'exams'
  | 'fees'
  | 'payroll'
  | 'placement'
  | 'library'
  | 'communication'
  | 'reports';

export interface LoggedInUser {
  name: string;
  email: string;
  role: RoleType;
  tenantId: string;
}

const ROLE_METADATA: Record<
  RoleType,
  {
    title: string;
    badge: string;
    scope: string;
    allowedModules: ModuleTab[];
    color: string;
  }
> = {
  SUPER_ADMIN: {
    title: 'Super Administrator',
    badge: 'Platform Root Authority',
    scope: 'Multi-Tenant Cross-Campus Trust Engine & Infrastructure Configuration',
    allowedModules: ['admissions', 'attendance', 'academics', 'exams', 'fees', 'payroll', 'placement', 'library', 'communication', 'reports'],
    color: '#682038',
  },
  INSTITUTION_ADMIN: {
    title: 'Institution Administrator',
    badge: 'Campus Root Authority',
    scope: 'Campus Operational Administration, Department Scopes & Module Configuration',
    allowedModules: ['admissions', 'attendance', 'academics', 'exams', 'fees', 'payroll', 'placement', 'library', 'communication', 'reports'],
    color: '#4338CA',
  },
  PRINCIPAL: {
    title: 'Principal / Campus Director',
    badge: 'Executive Oversight',
    scope: 'Campus Executive Governance, Multi-Tier Approvals, and NAAC/NIRF Regulatory Returns',
    allowedModules: ['reports', 'admissions', 'attendance', 'academics', 'exams', 'fees', 'placement', 'library', 'communication'],
    color: '#682038',
  },
  REGISTRAR: {
    title: 'Registrar',
    badge: 'Admissions & University Records Office',
    scope: 'Student Enrolment, Faculty Appointment Registry, Curriculum & Timetable Sanctions, Course Catalogs, Library Oversight',
    allowedModules: ['admissions', 'academics', 'payroll', 'library', 'exams', 'attendance', 'fees', 'placement', 'reports'],
    color: '#1E3A8A',
  },
  HOD: {
    title: 'Department Head (HOD)',
    badge: 'Academic Wing Authority',
    scope: 'Departmental Timetables, Smart Period Substitutions, Syllabus Pacing & Exam Moderation',
    allowedModules: ['academics', 'attendance', 'exams', 'placement', 'library', 'communication'],
    color: '#0D9488',
  },
  FACULTY: {
    title: 'Faculty / Classroom Instructor',
    badge: 'Instructional Roster',
    scope: 'Class Roster Attendance Marking (8:30 AM), Marks Entry for Assigned Courses, Teaching Schedules',
    allowedModules: ['attendance', 'academics', 'exams', 'placement', 'library', 'communication'],
    color: '#7C3AED',
  },
  EXAM_CONTROLLER: {
    title: 'Controller of Examinations (COE)',
    badge: 'Examinations Directorate',
    scope: 'Exam Schemes, Hall Ticket Eligibility, Dual-Signoff Moderation, and Cryptographic Results',
    allowedModules: ['exams', 'academics', 'reports'],
    color: '#B91C1C',
  },
  ACCOUNTANT: {
    title: 'Campus Bursar & Accountant',
    badge: 'Finance & Accounts Division',
    scope: 'Two-Step Manual UTR Verification Desk, Fee Demands, Balanced Double-Entry Ledgers, and No-Dues',
    allowedModules: ['fees', 'reports', 'communication'],
    color: '#059669',
  },
  HR_OFFICER: {
    title: 'Human Resources Officer',
    badge: 'HR & Personnel Office',
    scope: 'Staff Service Books, Recruitment, Policy-Driven Leave, and 3-Stage Monthly Payroll Lifecycle',
    allowedModules: ['payroll', 'communication', 'reports'],
    color: '#D97706',
  },
  STUDENT: {
    title: 'Student Self-Service Portal',
    badge: 'Enrolled Pupil Access',
    scope: 'Personal Timetable, Subject-Wise Attendance %, Fee Dues & Cryptographic Digital Marksheets',
    allowedModules: [],
    color: '#2563EB',
  },
  PARENT: {
    title: 'Multi-Ward Parent & Guardian Hub',
    badge: 'Guardian Access',
    scope: 'Single-Parent Multi-Ward Sibling Switcher, Real-Time Turnstile Attendance, UTR Payment Desk',
    allowedModules: [],
    color: '#8B5E3C',
  },
};

const ALL_MODULES_NAV: { id: ModuleTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'admissions', label: 'Admissions & SIS', icon: Users },
  { id: 'attendance', label: 'Attendance & Condonation', icon: Fingerprint },
  { id: 'academics', label: 'Academics & Timetables', icon: Calendar },
  { id: 'exams', label: 'Exams & Moderation', icon: Award },
  { id: 'fees', label: 'Fees & UTR Ledger', icon: CreditCard },
  { id: 'payroll', label: 'HR & Payroll', icon: DollarSign },
  { id: 'placement', label: 'Placements & T&P', icon: Briefcase },
  { id: 'library', label: 'Library & OPAC', icon: BookOpen },
  { id: 'communication', label: 'Communication & SLA', icon: MessageSquare },
  { id: 'reports', label: 'Reports & Regulatory', icon: BarChart3 },
];

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(() => {
    const saved = localStorage.getItem('devloft_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentTenantId, setCurrentTenantId] = useState(currentUser?.tenantId || 't-1');
  const [currentRole, setCurrentRole] = useState<RoleType>(currentUser?.role || 'PRINCIPAL');
  const [activeTab, setActiveTab] = useState<ModuleTab>('reports');

  // Modal & Drawer States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isPublicApplyOpen, setIsPublicApplyOpen] = useState(false);
  const [isPublicVerifyOpen, setIsPublicVerifyOpen] = useState(false);

  // Global Keyboard Shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const roleMeta = ROLE_METADATA[currentRole];
  const currentTenant = MOCK_TENANTS.find((t) => t.id === currentTenantId) || MOCK_TENANTS[0];

  // Filter modules strictly based on active user role (CASL / RBAC enforcement)
  const visibleNavModules = ALL_MODULES_NAV.filter((mod) =>
    roleMeta.allowedModules.includes(mod.id)
  );

  const handleLogin = (user: LoggedInUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setCurrentTenantId(user.tenantId);
    localStorage.setItem('devloft_user_session', JSON.stringify(user));
    const meta = ROLE_METADATA[user.role];
    if (meta.allowedModules.length > 0) {
      setActiveTab(meta.allowedModules[0]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('devloft_user_session');
  };

  const handleRoleChange = (newRole: RoleType) => {
    setCurrentRole(newRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      localStorage.setItem('devloft_user_session', JSON.stringify(updated));
    }
    const meta = ROLE_METADATA[newRole];
    if (meta.allowedModules.length > 0 && !meta.allowedModules.includes(activeTab)) {
      setActiveTab(meta.allowedModules[0]);
    }
  };

  const handleTenantChange = (newTenantId: string) => {
    setCurrentTenantId(newTenantId);
    if (currentUser) {
      const updated = { ...currentUser, tenantId: newTenantId };
      setCurrentUser(updated);
      localStorage.setItem('devloft_user_session', JSON.stringify(updated));
    }
  };

  // If unauthenticated, render the full institutional login page with tenant switch,
  // 11 persona quick-logins, credentials form, TOTP modal, and public portal triggers.
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans">
        <LoginPage
          onLogin={handleLogin}
          onOpenPublicApply={() => setIsPublicApplyOpen(true)}
          onOpenPublicVerify={() => setIsPublicVerifyOpen(true)}
          initialTenantId={currentTenantId}
        />

        {/* Public Admissions Application Modal */}
        <PublicApplicationModal
          isOpen={isPublicApplyOpen}
          onClose={() => setIsPublicApplyOpen(false)}
        />

        {/* Public Document & Marksheet QR Verification Desk Modal */}
        <PublicVerificationModal
          isOpen={isPublicVerifyOpen}
          onClose={() => setIsPublicVerifyOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      {/* Top Navbar with Multi-Tenancy & Role Controls */}
      <Navbar
        currentTenantId={currentTenantId}
        onTenantChange={handleTenantChange}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onLogout={handleLogout}
        onOpenPublicApply={() => setIsPublicApplyOpen(true)}
        onOpenPublicVerify={() => setIsPublicVerifyOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Breadcrumb Navigation Trail */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Breadcrumbs
            currentTenantName={currentTenant.name}
            currentRole={currentRole}
            activeModule={activeTab}
            onNavigateHome={() => {
              if (roleMeta.allowedModules.length > 0) {
                setActiveTab(roleMeta.allowedModules[0]);
              }
            }}
          />
        </div>

        {/* Role Persona & CASL Scope Clearance Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5DFD7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs"
              style={{ backgroundColor: roleMeta.color }}
            >
              {currentRole === 'STUDENT' ? (
                <GraduationCap className="w-5 h-5" />
              ) : currentRole === 'PARENT' ? (
                <Users2 className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#242424]">{roleMeta.title}</span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    color: roleMeta.color,
                    borderColor: `${roleMeta.color}40`,
                    backgroundColor: `${roleMeta.color}15`,
                  }}
                >
                  {roleMeta.badge}
                </span>
              </div>
              <p className="text-xs text-[#6E6862] line-clamp-1">{roleMeta.scope}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6E6862] shrink-0 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E5DFD7]">
            <Lock className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>
              CASL Role Permission:{' '}
              <strong className="text-[#242424]">
                {currentRole === 'STUDENT'
                  ? 'Student Portal Mode'
                  : currentRole === 'PARENT'
                  ? 'Parent Hub Mode'
                  : `${roleMeta.allowedModules.length} Modules Permitted`}
              </strong>
            </span>
          </div>
        </div>

        {/* Role-Filtered Navigation Tabs Bar (Shown for staff, hidden for student/parent with dedicated portals) */}
        {currentRole !== 'STUDENT' && currentRole !== 'PARENT' && (
          <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3 overflow-x-auto gap-4">
            <nav className="flex items-center gap-1.5 flex-wrap">
              {visibleNavModules.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeTab === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveTab(mod.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#682038] text-white shadow-xs'
                        : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mod.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Active Role-Specific Workspace View */}
        <div className="transition-all duration-200">
          {currentRole === 'STUDENT' && <StudentPortalWorkspace />}
          {currentRole === 'PARENT' && <ParentPortalWorkspace />}
          {currentRole !== 'STUDENT' && currentRole !== 'PARENT' && (
            <>
              {activeTab === 'admissions' && <AdmissionsWorkspace />}
              {activeTab === 'attendance' && <AttendanceWorkspace currentRole={currentRole} />}
              {activeTab === 'academics' && <AcademicsWorkspace currentRole={currentRole} />}
              {activeTab === 'exams' && <ExamsWorkspace />}
              {activeTab === 'fees' && <FeesWorkspace />}
              {activeTab === 'payroll' && <HrPayrollWorkspace />}
              {activeTab === 'placement' && <PlacementWorkspace />}
              {activeTab === 'library' && <LibraryWorkspace />}
              {activeTab === 'communication' && <CommunicationWorkspace />}
              {activeTab === 'reports' && <ReportsWorkspace />}
            </>
          )}
        </div>
      </main>

      {/* S3 Presigned Direct Upload Modal */}
      <PresignedUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Cmd+K Global Search Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateModule={(mod) => {
          setActiveTab(mod);
          setIsSearchOpen(false);
        }}
      />

      {/* Slide-over Notification Center Drawer */}
      <NotificationCenterDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        unreadCount={unreadCount}
        onMarkAllRead={() => setUnreadCount(0)}
      />

      {/* Public Admissions Application Modal */}
      <PublicApplicationModal
        isOpen={isPublicApplyOpen}
        onClose={() => setIsPublicApplyOpen(false)}
      />

      {/* Public Document & Marksheet QR Verification Desk Modal */}
      <PublicVerificationModal
        isOpen={isPublicVerifyOpen}
        onClose={() => setIsPublicVerifyOpen(false)}
      />
    </div>
  );
};
