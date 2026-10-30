import React, { useState, useMemo, useEffect } from 'react';
import { RoleType } from '../../types';
import {
  StaffMember,
  HandoverRecord,
  WelcomeMemo,
  OutgoingDisposition,
  getStaffDirectory,
  saveStaffDirectory,
  getHandoverAuditLogs,
  getIncumbentForRole,
  onboardStaff,
  executeRoleSuccession,
  SINGLE_INCUMBENT_ROLES,
  ROLE_PRIVILEGE_MAP,
} from '../../services/staffDirectory';
import {
  DollarSign,
  Users,
  FileText,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Download,
  Calculator,
  Calendar,
  ShieldCheck,
  Printer,
  AlertCircle,
  Building,
  Search,
  Eye,
  X,
  ChevronRight,
  Check,
  CreditCard,
  Percent,
  TrendingUp,
  UserPlus,
  ArrowRightLeft,
  Copy,
  ShieldAlert,
  History,
  Sparkles,
  KeyRound,
  Shield,
  FileSpreadsheet,
  Briefcase,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
} from 'lucide-react';

type PayrollStatus = 'DRAFT' | 'APPROVED' | 'LOCKED';
type WorkspaceTab =
  | 'payroll'
  | 'directory'
  | 'recruitment'
  | 'leave_engine'
  | 'pbas_appraisal'
  | 'exit_settlement'
  | 'succession';

interface JobVacancy {
  id: string;
  position: string;
  department: string;
  openings: number;
  applicantsCount: number;
  deadline: string;
  status: 'OPEN' | 'INTERVIEW_STAGE' | 'SELECTION_BOARD' | 'CLOSED';
}

interface LeaveRecord {
  id: string;
  employeeName: string;
  employeeCode: string;
  leaveType: 'CASUAL' | 'EARNED' | 'MEDICAL' | 'ON_DUTY';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  lopApplied: boolean;
  status: 'APPROVED' | 'PENDING_HOD';
}

interface FacultyPbas {
  id: string;
  facultyName: string;
  department: string;
  designation: string;
  teachingScore: number;
  researchScore: number;
  serviceScore: number;
  totalApi: number;
  publicationsCount: number;
  patentsCount: number;
  status: 'VERIFIED' | 'UNDER_REVIEW';
}

interface ExitSettlement {
  id: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  resignationDate: string;
  lastWorkingDay: string;
  libraryCleared: boolean;
  labCleared: boolean;
  accountsCleared: boolean;
  adminCleared: boolean;
  settlementAmount: number;
  status: 'IN_CLEARANCE' | 'SETTLEMENT_APPROVED';
}

const INITIAL_VACANCIES: JobVacancy[] = [
  { id: 'vac-1', position: 'Professor & Head (AI & Data Science)', department: 'Computer Science', openings: 1, applicantsCount: 18, deadline: '2026-11-15', status: 'INTERVIEW_STAGE' },
  { id: 'vac-2', position: 'Associate Professor (Embedded Systems / IoT)', department: 'Electronics & Comm.', openings: 2, applicantsCount: 24, deadline: '2026-11-20', status: 'OPEN' },
  { id: 'vac-3', position: 'Assistant Professor (Robotics & Automation)', department: 'Mechanical & Robotics', openings: 2, applicantsCount: 31, deadline: '2026-11-10', status: 'SELECTION_BOARD' },
];

const INITIAL_LEAVES: LeaveRecord[] = [
  { id: 'lv-1', employeeName: 'Dr. Aris Thorne', employeeCode: 'FAC-CSE-001', leaveType: 'ON_DUTY', startDate: '2026-11-04', endDate: '2026-11-06', days: 3, reason: 'Keynote Speaker at IEEE International Conference', lopApplied: false, status: 'APPROVED' },
  { id: 'lv-2', employeeName: 'Prof. Ramesh K.', employeeCode: 'FAC-CSE-003', leaveType: 'CASUAL', startDate: '2026-10-31', endDate: '2026-10-31', days: 1, reason: 'Personal family emergency', lopApplied: false, status: 'APPROVED' },
  { id: 'lv-3', employeeName: 'Dr. Sarah Jenkins', employeeCode: 'FAC-ECE-001', leaveType: 'MEDICAL', startDate: '2026-10-24', endDate: '2026-10-27', days: 4, reason: 'Viral fever with medical certificate', lopApplied: false, status: 'APPROVED' },
  { id: 'lv-4', employeeName: 'Kavita Sundaram', employeeCode: 'STAFF-LIB-002', leaveType: 'CASUAL', startDate: '2026-11-02', endDate: '2026-11-03', days: 2, reason: 'Out of town travel', lopApplied: false, status: 'PENDING_HOD' },
];

const INITIAL_PBAS: FacultyPbas[] = [
  { id: 'pbas-1', facultyName: 'Dr. Aris Thorne', department: 'Computer Science', designation: 'Professor & HOD', teachingScore: 92, researchScore: 145, serviceScore: 48, totalApi: 285, publicationsCount: 14, patentsCount: 2, status: 'VERIFIED' },
  { id: 'pbas-2', facultyName: 'Dr. Sarah Jenkins', department: 'Electronics & Comm.', designation: 'Professor', teachingScore: 88, researchScore: 130, serviceScore: 45, totalApi: 263, publicationsCount: 11, patentsCount: 1, status: 'VERIFIED' },
  { id: 'pbas-3', facultyName: 'Prof. Ramesh K.', department: 'Computer Science', designation: 'Assistant Professor', teachingScore: 85, researchScore: 68, serviceScore: 40, totalApi: 193, publicationsCount: 4, patentsCount: 0, status: 'UNDER_REVIEW' },
];

const INITIAL_EXITS: ExitSettlement[] = [
  { id: 'exit-1', employeeName: 'Suresh Babu', employeeCode: 'STAFF-ADM-004', department: 'Administration', resignationDate: '2026-09-15', lastWorkingDay: '2026-10-31', libraryCleared: true, labCleared: true, accountsCleared: true, adminCleared: true, settlementAmount: 142500, status: 'SETTLEMENT_APPROVED' },
  { id: 'exit-2', employeeName: 'Meenakshi Iyer', employeeCode: 'FAC-MATH-002', department: 'Mathematics & Science', resignationDate: '2026-10-01', lastWorkingDay: '2026-11-15', libraryCleared: true, labCleared: false, accountsCleared: true, adminCleared: false, settlementAmount: 98000, status: 'IN_CLEARANCE' },
];

// Sandboxed formula calculation without eval
function calculateSalaryComponents(basic: number, special: number, lopDays: number) {
  const hra = Math.round(basic * 0.4); // 40% of Basic
  const da = Math.round(basic * 0.25); // 25% of Basic
  const grossEarnings = basic + hra + da + special;

  const pf = Math.round(basic * 0.12); // 12% of Basic
  const pt = 200; // Fixed professional tax
  const tds = grossEarnings > 100000 ? Math.round(grossEarnings * 0.1) : Math.round(grossEarnings * 0.05);

  const dailyRate = Math.round(grossEarnings / 30);
  const lopDeduction = dailyRate * lopDays;

  const totalDeductions = pf + pt + tds + lopDeduction;
  const netPayable = grossEarnings - totalDeductions;

  return {
    basic,
    hra,
    da,
    special,
    grossEarnings,
    pf,
    pt,
    tds,
    dailyRate,
    lopDeduction,
    totalDeductions,
    netPayable,
  };
}

export const HrPayrollWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('payroll');
  const [staffList, setStaffList] = useState<StaffMember[]>(() => getStaffDirectory());
  const [handoverLogs, setHandoverLogs] = useState<HandoverRecord[]>(() => getHandoverAuditLogs());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [payrollStatus, setPayrollStatus] = useState<PayrollStatus>('DRAFT');
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<StaffMember | null>(null);
  const [isNeftGenerated, setIsNeftGenerated] = useState(false);

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [welcomeMemo, setWelcomeMemo] = useState<WelcomeMemo | null>(null);
  const [copiedMemoField, setCopiedMemoField] = useState<string | null>(null);

  // Onboarding Form State
  const [onboardName, setOnboardName] = useState('');
  const [onboardDept, setOnboardDept] = useState('Computer Science');
  const [onboardDesignation, setOnboardDesignation] = useState('Professor & Head of Department');
  const [onboardRole, setOnboardRole] = useState<RoleType>('HOD');
  const [onboardEmail, setOnboardEmail] = useState('');
  const [onboardBasic, setOnboardBasic] = useState<number>(95000);
  const [onboardSpecial, setOnboardSpecial] = useState<number>(18000);
  const [onboardJoiningDate, setOnboardJoiningDate] = useState('2026-11-01');
  const [onboardBankAccount, setOnboardBankAccount] = useState('992817263541');
  const [onboardBankName, setOnboardBankName] = useState('HDFC Bank');
  const [onboardPan, setOnboardPan] = useState('ABCDE1234F');

  // Succession Handover Options inside Onboarding
  const [successionDisposition, setSuccessionDisposition] = useState<OutgoingDisposition>('REASSIGN_FACULTY');
  const [successionApprovalRef, setSuccessionApprovalRef] = useState('BOG-RES-2026-104');
  const [successionNotes, setSuccessionNotes] = useState('Routine institutional succession and executive leadership transition approved by Governing Council.');

  // Standalone Handover Modal State
  const [standaloneRole, setStandaloneRole] = useState<RoleType>('HOD');
  const [standaloneOutgoingId, setStandaloneOutgoingId] = useState('');
  const [standaloneIncomingId, setStandaloneIncomingId] = useState('');
  const [standaloneDisposition, setStandaloneDisposition] = useState<OutgoingDisposition>('REASSIGN_FACULTY');
  const [standaloneApprovalRef, setStandaloneApprovalRef] = useState('BOG-RES-2026-118');
  const [standaloneNotes, setStandaloneNotes] = useState('');

  // Auto-generate suggested email on name or dept change
  useEffect(() => {
    if (onboardName) {
      const parts = onboardName.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/);
      const emailLocal = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0] || 'staff';
      setOnboardEmail(`${emailLocal}@jssate.edu`);
    }
  }, [onboardName]);

  // Detected Incumbent for the selected role & department
  const detectedIncumbent = useMemo(() => {
    if (!SINGLE_INCUMBENT_ROLES.includes(onboardRole)) return undefined;
    return getIncumbentForRole(onboardRole, onboardRole === 'HOD' ? onboardDept : undefined);
  }, [onboardRole, onboardDept, staffList]);

  // Filtered employees for table
  const filteredEmployees = useMemo(() => {
    return staffList.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [staffList, searchQuery, selectedDept]);

  // Active employees for payroll calculations
  const activeEmployees = useMemo(() => {
    return staffList.filter((emp) => emp.status === 'ACTIVE');
  }, [staffList]);

  // Aggregate Payroll Totals
  const payrollTotals = useMemo(() => {
    return activeEmployees.reduce(
      (acc, emp) => {
        const comp = calculateSalaryComponents(emp.basicSalary, emp.specialAllowance, emp.lopDays);
        acc.gross += comp.grossEarnings;
        acc.deductions += comp.totalDeductions;
        acc.net += comp.netPayable;
        acc.pf += comp.pf;
        acc.tds += comp.tds;
        return acc;
      },
      { gross: 0, deductions: 0, net: 0, pf: 0, tds: 0 }
    );
  }, [activeEmployees]);

  // Update LOP days
  const handleLopChange = (id: string, delta: number) => {
    if (payrollStatus !== 'DRAFT') return;
    const updated = staffList.map((emp) => {
      if (emp.id !== id) return emp;
      return {
        ...emp,
        lopDays: Math.max(0, Math.min(15, emp.lopDays + delta)),
      };
    });
    setStaffList(updated);
    saveStaffDirectory(updated);
  };

  // Submit Onboarding
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let successionConfig;
    if (detectedIncumbent) {
      successionConfig = {
        outgoingStaffId: detectedIncumbent.id,
        disposition: successionDisposition,
        approvalRef: successionApprovalRef,
        notes: successionNotes,
      };
    }

    const result = onboardStaff(
      {
        name: onboardName,
        designation: onboardDesignation,
        department: onboardDept,
        role: onboardRole,
        email: onboardEmail,
        basicSalary: Number(onboardBasic),
        specialAllowance: Number(onboardSpecial),
        dateOfJoining: onboardJoiningDate,
        bankAccount: onboardBankAccount,
        bankName: onboardBankName,
        panNumber: onboardPan,
      },
      successionConfig
    );

    // Refresh state
    setStaffList(getStaffDirectory());
    setHandoverLogs(getHandoverAuditLogs());
    setIsOnboardModalOpen(false);
    setWelcomeMemo(result.welcomeMemo);

    // Reset onboarding form fields
    setOnboardName('');
    setOnboardEmail('');
  };

  // Submit Standalone Handover
  const handleStandaloneHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!standaloneOutgoingId || !standaloneIncomingId) {
      alert('Please select both outgoing and incoming officers');
      return;
    }

    try {
      executeRoleSuccession(
        standaloneRole,
        standaloneOutgoingId,
        standaloneIncomingId,
        standaloneDisposition,
        standaloneApprovalRef,
        standaloneNotes
      );
      setStaffList(getStaffDirectory());
      setHandoverLogs(getHandoverAuditLogs());
      setIsHandoverModalOpen(false);
      alert('Role succession and credential authority transition successfully executed and recorded in the audit register.');
    } catch (err: any) {
      alert(err.message || 'Error executing role succession');
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMemoField(fieldKey);
    setTimeout(() => setCopiedMemoField(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Directorate of Human Resources &amp; Personnel
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                payrollStatus === 'DRAFT'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : payrollStatus === 'APPROVED'
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              Cycle Status: {payrollStatus}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Staff Onboarding, Role Succession &amp; Payroll Desk</h1>
          <p className="text-xs text-[#6E6862]">
            Provision institutional credentials, execute executive role successions with immutable handover logs, and run statutory 3-stage monthly payroll.
          </p>
        </div>

        {/* Global Action Desk */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Onboard New Staff</span>
          </button>

          <button
            onClick={() => setIsHandoverModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#682038] text-xs font-bold border border-[#E5DFD7] shadow-2xs transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Role Succession Handover</span>
          </button>

          {/* Payroll Action States */}
          {payrollStatus === 'DRAFT' && (
            <button
              onClick={() => setPayrollStatus('APPROVED')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Cycle (Finance Officer)</span>
            </button>
          )}

          {payrollStatus === 'APPROVED' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPayrollStatus('DRAFT')}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#FAF7F2] border border-[#E5DFD7]"
              >
                Back to Draft
              </button>
              <button
                onClick={() => setPayrollStatus('LOCKED')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock &amp; Post JV</span>
              </button>
            </div>
          )}

          {payrollStatus === 'LOCKED' && (
            <button
              onClick={() => setIsNeftGenerated(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-xs font-bold border border-[#E5DFD7] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate NEFT Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* Workspace Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'payroll'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#FB923C]" />
          <span>1. Monthly Payroll</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'directory'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Users className="w-4 h-4 text-[#FB923C]" />
          <span>2. Service Books ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recruitment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'recruitment'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#FB923C]" />
          <span>3. Recruitment Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('leave_engine')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'leave_engine'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#FB923C]" />
          <span>4. Leave &amp; LOP Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('pbas_appraisal')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pbas_appraisal'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Award className="w-4 h-4 text-[#FB923C]" />
          <span>5. PBAS / API Appraisal</span>
        </button>

        <button
          onClick={() => setActiveTab('exit_settlement')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'exit_settlement'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <FileCheck className="w-4 h-4 text-[#FB923C]" />
          <span>6. Separation &amp; F&amp;F</span>
        </button>

        <button
          onClick={() => setActiveTab('succession')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'succession'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <History className="w-4 h-4 text-[#FB923C]" />
          <span>7. Succession &amp; Handover</span>
        </button>
      </div>

      {/* NEFT Batch Download Toast */}
      {isNeftGenerated && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Bank NEFT Batch generated: <strong>NEFT_SALARY_OCT2026_TOTAL_₹{payrollTotals.net.toLocaleString('en-IN')}.csv</strong> (Encrypted SHA-256 for Corporate Banking Portal).
            </span>
          </div>
          <button
            onClick={() => setIsNeftGenerated(false)}
            className="text-emerald-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Active Teaching &amp; Admin Staff</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">{activeEmployees.length}</span>
            <span className="text-xs text-[#8B5E3C] font-semibold">{staffList.length - activeEmployees.length} Relieved/Archived</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Total Gross Payroll (Monthly)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">
              ₹{payrollTotals.gross.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">100% Calculated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Statutory Deductions (PF/PT/TDS)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-600">
              ₹{payrollTotals.deductions.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#6E6862]">PF: ₹{payrollTotals.pf.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Net Bank Disbursement</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              ₹{payrollTotals.net.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              Ready for NEFT
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: PAYROLL SHEET */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          {/* Formula Specification Callout */}
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-4 flex items-start gap-3">
            <Calculator className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#242424]">
              <span className="font-bold text-sm">Deterministic Sandboxed Salary Formula Engine:</span>
              <p className="text-[#6E6862]">
                Gross = Basic + HRA (40% Basic) + DA (25% Basic) + Special Allowance. Deductions = PF (12% Basic) + PT (₹200) + TDS (5-10% slab) + LOP [Daily Rate = Gross / 30 × LOP Days].
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#8B5E3C]" />
                <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                  Active Faculty &amp; Staff Monthly Payroll Sheet
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6E6862]" />
                  <input
                    type="text"
                    placeholder="Search staff, code, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#E5DFD7] bg-white focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="py-1.5 px-3 rounded-lg text-xs border border-[#E5DFD7] bg-white text-[#242424] focus:outline-none"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Executive Directorate">Executive Directorate</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Examination Branch">Examination Branch</option>
                  <option value="Academic Affairs">Academic Affairs</option>
                  <option value="Campus Operations">Campus Operations</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Emp Code</th>
                    <th className="py-3 px-4 font-semibold">Staff Particulars</th>
                    <th className="py-3 px-4 font-semibold text-right">Basic Pay</th>
                    <th className="py-3 px-4 font-semibold text-right">Gross Earnings</th>
                    <th className="py-3 px-4 font-semibold text-center">LOP Days</th>
                    <th className="py-3 px-4 font-semibold text-right">Deductions</th>
                    <th className="py-3 px-4 font-semibold text-right">Net Payable</th>
                    <th className="py-3 px-4 font-semibold text-center">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {filteredEmployees
                    .filter((e) => e.status === 'ACTIVE')
                    .map((emp) => {
                      const comp = calculateSalaryComponents(emp.basicSalary, emp.specialAllowance, emp.lopDays);

                      return (
                        <tr key={emp.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#682038]">
                            {emp.empCode}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#242424]">{emp.name}</span>
                              {emp.isIncumbent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  {emp.role}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#6E6862]">
                              {emp.designation} • {emp.department}
                            </div>
                            <div className="text-[10px] text-[#6E6862] font-mono">
                              {emp.email} • {emp.bankName} (···{emp.bankAccount.slice(-4)})
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-medium text-[#242424]">
                            ₹{emp.basicSalary.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#242424]">
                            ₹{comp.grossEarnings.toLocaleString('en-IN')}
                            <div className="text-[10px] text-[#6E6862] font-normal">
                              HRA: ₹{comp.hra.toLocaleString('en-IN')} • DA: ₹{comp.da.toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleLopChange(emp.id, -1)}
                                disabled={payrollStatus !== 'DRAFT' || emp.lopDays === 0}
                                className="w-5 h-5 rounded bg-[#FAF7F2] border border-[#E5DFD7] text-[#6E6862] hover:bg-[#F4ECE2] disabled:opacity-30 font-bold flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-rose-700 w-4 text-center">
                                {emp.lopDays}
                              </span>
                              <button
                                onClick={() => handleLopChange(emp.id, 1)}
                                disabled={payrollStatus !== 'DRAFT'}
                                className="w-5 h-5 rounded bg-[#FAF7F2] border border-[#E5DFD7] text-[#6E6862] hover:bg-[#F4ECE2] disabled:opacity-30 font-bold flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                            {comp.lopDeduction > 0 && (
                              <div className="text-[10px] text-rose-600 font-mono">
                                -₹{comp.lopDeduction.toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                            ₹{comp.totalDeductions.toLocaleString('en-IN')}
                            <div className="text-[10px] text-[#6E6862]">
                              PF: ₹{comp.pf.toLocaleString('en-IN')} • TDS: ₹{comp.tds.toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                            ₹{comp.netPayable.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedPayslipEmp(emp)}
                              className="p-1.5 rounded-lg text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] transition-all"
                              title="View Official Payslip"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF SERVICE BOOKS & CREDENTIAL DESK */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Institutional Staff Service Register &amp; Credential Directory
              </h3>
            </div>

            <button
              onClick={() => setIsOnboardModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#F97316] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#EA580C]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Provision New Employee</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Employee ID</th>
                  <th className="py-3 px-4 font-semibold">Name &amp; Designation</th>
                  <th className="py-3 px-4 font-semibold">System Role</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Official Email</th>
                  <th className="py-3 px-4 font-semibold">Date of Joining</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Handover / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {staffList.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#682038]">{emp.empCode}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#242424]">{emp.name}</div>
                      <div className="text-[11px] text-[#6E6862]">{emp.designation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#682038] border border-[#E5DFD7]">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#242424]">{emp.department}</td>
                    <td className="py-3 px-4 font-mono text-[#6E6862]">{emp.email}</td>
                    <td className="py-3 px-4 text-[#6E6862]">{emp.dateOfJoining}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : emp.status === 'RELIEVED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {SINGLE_INCUMBENT_ROLES.includes(emp.role) && emp.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            setStandaloneRole(emp.role);
                            setStandaloneOutgoingId(emp.id);
                            setIsHandoverModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-[11px] font-bold border border-[#E5DFD7] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-[#F97316]" />
                          <span>Handover</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#A39B8F]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FACULTY & STAFF RECRUITMENT PIPELINE */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase block">Open Requisitions</span>
              <div className="text-2xl font-bold font-mono text-[#242424] mt-1">{INITIAL_VACANCIES.length} Positions</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Across CSE, ECE &amp; Mechanical</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#16A34A] uppercase block">Total Applications</span>
              <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">73 Resumes</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Scrutiny ratio 4.2 : 1</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#682038] uppercase block">Interviews Scheduled</span>
              <div className="text-2xl font-bold font-mono text-[#682038] mt-1">12 Candidates</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Includes teaching demo lectures</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-blue-700 uppercase block">Offers Issued (YTD)</span>
              <div className="text-2xl font-bold font-mono text-blue-900 mt-1">6 Offers</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">100% acceptance rate</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Faculty &amp; Staff Recruitment Pipeline &amp; Scrutiny Board
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Manages academic requisitions, qualification scrutiny, demo lectures, and selection committee approvals.
                </p>
              </div>
              <button
                onClick={() => alert('New Faculty Requisition Form opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold self-start"
              >
                + Post New Vacancy
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Position &amp; Specialization</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5 text-center">Sanctioned Openings</th>
                    <th className="px-6 py-3.5 text-center">Applications Received</th>
                    <th className="px-6 py-3.5">Application Deadline</th>
                    <th className="px-6 py-3.5 text-right">Hiring Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_VACANCIES.map((vac) => (
                    <tr key={vac.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4 font-bold text-[#242424] text-sm">
                        {vac.position}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#6E6862]">
                        {vac.department}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-[#242424]">
                        {vac.openings}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-[#682038]">
                        {vac.applicantsCount}
                      </td>
                      <td className="px-6 py-4 font-mono text-[#6E6862]">
                        {vac.deadline}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            vac.status === 'SELECTION_BOARD'
                              ? 'bg-purple-100 text-purple-800'
                              : vac.status === 'INTERVIEW_STAGE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {vac.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE POLICY, BALANCES & LOSS-OF-PAY (LOP) ENGINE */}
      {activeTab === 'leave_engine' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase block">Casual Leave (CL)</span>
              <div className="text-2xl font-bold font-mono text-[#242424] mt-1">12 Days / Yr</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Maximum 3 days consecutive</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#16A34A] uppercase block">Earned Leave (EL)</span>
              <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">30 Days / Yr</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Encashable up to 300 days on exit</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#682038] uppercase block">Medical Leave (ML)</span>
              <div className="text-2xl font-bold font-mono text-[#682038] mt-1">10 Days / Yr</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Requires registered medical certificate</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-blue-700 uppercase block">On-Duty Leave (OD)</span>
              <div className="text-2xl font-bold font-mono text-blue-900 mt-1">15 Days / Yr</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">For conferences, valuation &amp; PhD</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Staff Leave Approvals &amp; LOP Salary Deduction Link
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Approved leaves automatically feed into payroll run to prevent improper loss-of-pay deductions.
                </p>
              </div>
              <button
                onClick={() => alert('New Staff Leave Application opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold self-start"
              >
                + Apply Staff Leave
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Staff Name &amp; Code</th>
                    <th className="px-6 py-3.5">Leave Type</th>
                    <th className="px-6 py-3.5">Duration &amp; Days</th>
                    <th className="px-6 py-3.5">Reason</th>
                    <th className="px-6 py-3.5 text-center">Payroll LOP Applied?</th>
                    <th className="px-6 py-3.5 text-right">Approval State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_LEAVES.map((lv) => (
                    <tr key={lv.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{lv.employeeName}</div>
                        <div className="font-mono text-[11px] text-[#682038]">{lv.employeeCode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5DFD7] font-mono text-[10px] font-bold text-[#682038]">
                          {lv.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424]">{lv.days} Day(s)</div>
                        <div className="text-[10px] text-[#6E6862] font-mono">{lv.startDate} to {lv.endDate}</div>
                      </td>
                      <td className="px-6 py-4 text-[#242424] max-w-xs truncate">
                        {lv.reason}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {lv.lopApplied ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                            YES (Salary Cut)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            NO (Paid Leave)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            lv.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FACULTY PBAS / API APPRAISAL & RESEARCH DESK */}
      {activeTab === 'pbas_appraisal' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D5B3BC] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#682038] text-white flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    UGC / AICTE Career Advancement Scheme (CAS) - PBAS API Scoring
                  </h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Performance Based Appraisal System measuring Category I (Teaching: 100), Category II (Governance: 50), and Category III (Research &amp; Publications: 150).
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Faculty Self-Appraisal Submission opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shrink-0"
              >
                + Submit Annual Appraisal
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                Faculty API Score Registry &amp; Research Portfolio (AY 2025-26)
              </h3>
              <span className="text-xs text-[#6E6862]">Min Qualifying API: 200 points for Associate Prof</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Faculty Name &amp; Role</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5 text-center">Teaching (Max 100)</th>
                    <th className="px-6 py-3.5 text-center">Research (Max 150)</th>
                    <th className="px-6 py-3.5 text-center">Service (Max 50)</th>
                    <th className="px-6 py-3.5 text-center">Total API Score</th>
                    <th className="px-6 py-3.5 text-right">Scrutiny State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_PBAS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{item.facultyName}</div>
                        <div className="text-[11px] text-[#6E6862]">{item.designation}</div>
                        <div className="text-[10px] text-[#8B5E3C] mt-0.5">
                          {item.publicationsCount} Scopus papers &bull; {item.patentsCount} Patents
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#242424]">
                        {item.department}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-[#242424]">
                        {item.teachingScore}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-[#16A34A]">
                        {item.researchScore}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-[#682038]">
                        {item.serviceScore}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-base text-[#682038]">
                        {item.totalApi} pts
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EMPLOYEE SEPARATION & FULL-AND-FINAL (F&F) SETTLEMENT */}
      {activeTab === 'exit_settlement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Employee Resignation, 4-Way Statutory Clearance &amp; F&amp;F Ledger
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Enforces mandatory clearance across Library, Department Lab, Accounts Bursar, and Administration before releasing gratuity.
                </p>
              </div>
              <button
                onClick={() => alert('New Resignation Notification Form opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold self-start"
              >
                + Log Resignation
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Employee Name &amp; Code</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5">Exit Dates</th>
                    <th className="px-6 py-3.5 text-center">4-Dept Clearance State</th>
                    <th className="px-6 py-3.5 text-right">Computed F&amp;F Amount</th>
                    <th className="px-6 py-3.5 text-right">Settlement State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_EXITS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{item.employeeName}</div>
                        <div className="font-mono text-[11px] text-[#682038]">{item.employeeCode}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#242424]">
                        {item.department}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] text-[#242424]">LWD: {item.lastWorkingDay}</div>
                        <div className="text-[10px] text-[#6E6862]">Resigned: {item.resignationDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            title="Library Clearance"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              item.libraryCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            LIB {item.libraryCleared ? '✓' : '✗'}
                          </span>
                          <span
                            title="Lab Clearance"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              item.labCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            LAB {item.labCleared ? '✓' : '✗'}
                          </span>
                          <span
                            title="Accounts Clearance"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              item.accountsCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            ACC {item.accountsCleared ? '✓' : '✗'}
                          </span>
                          <span
                            title="Admin Clearance"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              item.adminCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            ADM {item.adminCleared ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-sm text-[#16A34A]">
                        ₹{item.settlementAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'SETTLEMENT_APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ROLE SUCCESSION & HANDOVER AUDIT REGISTER */}
      {activeTab === 'succession' && (
        <div className="space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#242424]">
              <span className="font-bold text-sm">Institutional Role Succession &amp; Handover Governance:</span>
              <p className="text-[#6E6862]">
                Whenever an executive role (Principal, HOD, Registrar, Bursar, COE, HR Officer) is reassigned or replaced, this immutable ledger records the governing council approval reference, outgoing officer disposition, transferred cryptographic clearance tokens, and timestamps.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#8B5E3C]" />
                <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                  Official Role Handover &amp; Succession Audit Trail
                </h3>
              </div>
              <button
                onClick={() => setIsHandoverModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#682038] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#54192D]"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#FB923C]" />
                <span>Execute Succession Handover</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Handover ID</th>
                    <th className="py-3 px-4 font-semibold">Role &amp; Department</th>
                    <th className="py-3 px-4 font-semibold">Outgoing Incumbent</th>
                    <th className="py-3 px-4 font-semibold">Incoming Appointee</th>
                    <th className="py-3 px-4 font-semibold">Approval Ref</th>
                    <th className="py-3 px-4 font-semibold">Effective Date</th>
                    <th className="py-3 px-4 font-semibold">Transferred Privileges</th>
                    <th className="py-3 px-4 font-semibold">Audit Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {handoverLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#682038]">{log.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#242424] block">{log.role}</span>
                        <span className="text-[11px] text-[#6E6862]">{log.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#242424]">{log.outgoingStaffName}</div>
                        <div className="text-[10px] font-mono text-[#6E6862]">{log.outgoingEmpCode}</div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {log.outgoingDisposition}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-emerald-800">{log.incomingStaffName}</div>
                        <div className="text-[10px] font-mono text-[#6E6862]">{log.incomingEmpCode}</div>
                        <div className="text-[10px] text-[#6E6862]">{log.incomingEmail}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-[#242424]">
                        {log.approvalRef}
                      </td>
                      <td className="py-3 px-4 text-[#6E6862]">{log.effectiveDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {log.transferredPrivileges.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-[#6E6862]">
                        <code className="text-[#682038]">{log.auditHash.substring(0, 18)}...</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: STAFF ONBOARDING & CREDENTIAL PROVISIONING */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
              <div>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#F97316]" />
                  <h3 className="font-bold text-base text-[#242424]">Institutional Staff Onboarding &amp; Credential Issuance</h3>
                </div>
                <p className="text-xs text-[#6E6862]">
                  Registers employee service record, computes deterministic compensation, provisions portal credentials, and executes role succession handovers.
                </p>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              {/* Personal & Appointment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Legal Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Meera Kulkarni"
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-medium text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Department *</label>
                  <select
                    value={onboardDept}
                    onChange={(e) => setOnboardDept(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-medium text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  >
                    <option value="Computer Science">Computer Science &amp; Engineering</option>
                    <option value="Electronics & Comm">Electronics &amp; Communication</option>
                    <option value="Executive Directorate">Executive Directorate</option>
                    <option value="Finance & Accounts">Finance &amp; Accounts</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Examination Branch">Examination Branch</option>
                    <option value="Academic Affairs">Academic Affairs</option>
                    <option value="Campus Operations">Campus Operations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Academic / Admin Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professor & Head of Department"
                    value={onboardDesignation}
                    onChange={(e) => setOnboardDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-medium text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Institutional System Role *</label>
                  <select
                    value={onboardRole}
                    onChange={(e) => setOnboardRole(e.target.value as RoleType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-bold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  >
                    <option value="HOD">Department Head (HOD)</option>
                    <option value="FACULTY">Faculty / Instructor</option>
                    <option value="ACCOUNTANT">Bursar &amp; Accounts Officer</option>
                    <option value="HR_OFFICER">HR &amp; Personnel Officer</option>
                    <option value="EXAM_CONTROLLER">Controller of Examinations (COE)</option>
                    <option value="REGISTRAR">Dean &amp; Academic Registrar</option>
                    <option value="PRINCIPAL">Principal / Campus Director</option>
                    <option value="INSTITUTION_ADMIN">Institution Administrator</option>
                  </select>
                </div>
              </div>

              {/* Official Credentials Provisioning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7]">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Official University Email (Auto-Generated)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={onboardEmail}
                    onChange={(e) => setOnboardEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-mono font-medium text-[#242424] bg-white focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  />
                  <span className="text-[10px] text-[#6E6862] block">
                    Domain authorized by Campus IT Directorate.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    <span>Effective Date of Joining</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={onboardJoiningDate}
                    onChange={(e) => setOnboardJoiningDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs text-[#242424] bg-white focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
              </div>

              {/* ROLE SUCCESSION & INCUMBENT DETECTION INTERLOCK */}
              {detectedIncumbent && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">
                        Executive Role Succession Handover Required
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Role <strong className="font-mono text-[#682038]">{onboardRole}</strong> in{' '}
                        <strong>{detectedIncumbent.department}</strong> is currently held by{' '}
                        <strong>{detectedIncumbent.name}</strong> ({detectedIncumbent.empCode}).
                        Appointing <strong className="text-[#242424]">{onboardName || 'this new staff member'}</strong> will execute an official handover.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-900">
                        Outgoing Officer Disposition Plan *
                      </label>
                      <select
                        value={successionDisposition}
                        onChange={(e) => setSuccessionDisposition(e.target.value as OutgoingDisposition)}
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold text-[#242424]"
                      >
                        <option value="REASSIGN_FACULTY">
                          Reassign Outgoing to Senior Faculty (Keep Active &amp; Pay)
                        </option>
                        <option value="TRANSFER_DEPT">
                          Transfer to Academic Liaison / Research Unit
                        </option>
                        <option value="RELIEVE_ARCHIVE">
                          Relieve Outgoing Staff (Retirement / Relinquish Access)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-900">
                        Governing Council Resolution Ref *
                      </label>
                      <input
                        type="text"
                        required
                        value={successionApprovalRef}
                        onChange={(e) => setSuccessionApprovalRef(e.target.value)}
                        placeholder="e.g. BOG-RES-2026-104"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-mono font-medium text-[#242424]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-amber-900">
                      Transferred Executive Privileges &amp; Authority Seals
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(ROLE_PRIVILEGE_MAP[onboardRole] || []).map((priv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-amber-900 border border-amber-300 shadow-2xs"
                        >
                          ✓ {priv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Compensation & Statutory Banking */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Basic Pay (₹ / month) *</label>
                  <input
                    type="number"
                    required
                    value={onboardBasic}
                    onChange={(e) => setOnboardBasic(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5DFD7] text-xs font-mono font-bold text-[#242424]"
                  />
                  <span className="text-[10px] text-[#6E6862]">HRA 40% &amp; DA 25% computed automatically</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Special Allowance (₹) *</label>
                  <input
                    type="number"
                    required
                    value={onboardSpecial}
                    onChange={(e) => setOnboardSpecial(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5DFD7] text-xs font-mono font-bold text-[#242424]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">PAN Card Number *</label>
                  <input
                    type="text"
                    required
                    value={onboardPan}
                    onChange={(e) => setOnboardPan(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5DFD7] text-xs font-mono text-[#242424]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Salary Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={onboardBankName}
                    onChange={(e) => setOnboardBankName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5DFD7] text-xs text-[#242424]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Bank Account Number *</label>
                  <input
                    type="text"
                    required
                    value={onboardBankAccount}
                    onChange={(e) => setOnboardBankAccount(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5DFD7] text-xs font-mono text-[#242424]"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#FAF7F2] border border-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Complete Onboarding &amp; Provision Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WELCOME SLIP & PROVISIONED CREDENTIAL MEMO */}
      {welcomeMemo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Memo Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E5DFD7]">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#682038]" />
                  <span className="font-extrabold text-sm text-[#242424]">Campus Directorate &amp; Human Resources</span>
                </div>
                <h3 className="text-base font-bold text-[#682038] mt-1">
                  Staff Onboarding Welcome Slip &amp; Credential Memo
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-[#6E6862] mt-0.5">
                  <span>Ref: <strong className="font-mono text-[#242424]">{welcomeMemo.memoNumber}</strong></span>
                  <span>Issued: {welcomeMemo.issuedAt}</span>
                </div>
              </div>
              <button
                onClick={() => setWelcomeMemo(null)}
                className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Appointee Particulars */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#6E6862] block">Employee Code:</span>
                <span className="font-mono font-bold text-[#682038]">{welcomeMemo.empCode}</span>
              </div>
              <div>
                <span className="text-[#6E6862] block">Appointee Name:</span>
                <span className="font-bold text-[#242424]">{welcomeMemo.name}</span>
              </div>
              <div>
                <span className="text-[#6E6862] block">Department:</span>
                <span className="text-[#242424] font-medium">{welcomeMemo.department}</span>
              </div>
              <div>
                <span className="text-[#6E6862] block">Role &amp; Designation:</span>
                <span className="font-bold text-[#F97316]">{welcomeMemo.role}</span>
                <span className="text-[10px] text-[#6E6862] block">{welcomeMemo.designation}</span>
              </div>
            </div>

            {/* Provisioned Secure Credentials Desk */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#242424] flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#F97316]" />
                  <span>Provisioned Institutional Access Credentials</span>
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Temporary 24h Passcode
                </span>
              </div>

              {/* Login Email */}
              <div className="p-3 bg-white rounded-xl border border-[#E5DFD7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6E6862] block">Official Login Email</span>
                  <span className="text-xs font-mono font-bold text-[#242424]">{welcomeMemo.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(welcomeMemo.email, 'email')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] flex items-center gap-1 cursor-pointer"
                >
                  {copiedMemoField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMemoField === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Temporary Password */}
              <div className="p-3 bg-white rounded-xl border border-[#E5DFD7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6E6862] block">One-Time Temporary Password</span>
                  <span className="text-xs font-mono font-bold text-[#F97316]">{welcomeMemo.temporaryPassword}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(welcomeMemo.temporaryPassword, 'pwd')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] flex items-center gap-1 cursor-pointer"
                >
                  {copiedMemoField === 'pwd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMemoField === 'pwd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* 2FA TOTP Provisioning Key */}
              <div className="p-3 bg-white rounded-xl border border-[#E5DFD7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6E6862] block">2FA Authenticator Seed (Google / MS Authenticator)</span>
                  <span className="text-xs font-mono font-bold text-[#242424]">{welcomeMemo.totpSecret}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(welcomeMemo.totpSecret, 'totp')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] flex items-center gap-1 cursor-pointer"
                >
                  {copiedMemoField === 'totp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMemoField === 'totp' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{welcomeMemo.securityNotice}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#6E6862]">Authorized: {welcomeMemo.authoritySignoff}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Official Campus Credential Memo\nEmployee: ${welcomeMemo.name} (${welcomeMemo.empCode})\nRole: ${welcomeMemo.role} - ${welcomeMemo.department}\nEmail: ${welcomeMemo.email}\nTemp Password: ${welcomeMemo.temporaryPassword}\n2FA Seed: ${welcomeMemo.totpSecret}`;
                    copyToClipboard(text, 'all');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedMemoField === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMemoField === 'all' ? 'All Credentials Copied' : 'Copy All'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWelcomeMemo(null);
                    setActiveTab('directory');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
                >
                  Done &amp; View Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: STANDALONE ROLE SUCCESSION HANDOVER */}
      {isHandoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-[#F97316]" />
                  <h3 className="font-bold text-base text-[#242424]">Executive Role Succession &amp; Handover Desk</h3>
                </div>
                <p className="text-xs text-[#6E6862]">
                  Formally reassign an executive single-holder institutional role from an outgoing incumbent to a successor.
                </p>
              </div>
              <button
                onClick={() => setIsHandoverModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStandaloneHandoverSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#242424]">Executive Role Under Succession *</label>
                <select
                  value={standaloneRole}
                  onChange={(e) => {
                    const r = e.target.value as RoleType;
                    setStandaloneRole(r);
                    const inc = getIncumbentForRole(r);
                    if (inc) setStandaloneOutgoingId(inc.id);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-bold text-[#682038]"
                >
                  <option value="HOD">Department Head (HOD)</option>
                  <option value="ACCOUNTANT">Bursar &amp; Accounts Officer</option>
                  <option value="EXAM_CONTROLLER">Controller of Examinations (COE)</option>
                  <option value="REGISTRAR">Dean &amp; Academic Registrar</option>
                  <option value="PRINCIPAL">Principal / Campus Director</option>
                  <option value="HR_OFFICER">HR &amp; Personnel Officer</option>
                  <option value="INSTITUTION_ADMIN">Institution Administrator</option>
                </select>
              </div>

              {/* Outgoing & Incoming Officers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-rose-700">Outgoing Incumbent Officer *</label>
                  <select
                    value={standaloneOutgoingId}
                    onChange={(e) => setStandaloneOutgoingId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 text-xs font-semibold text-[#242424]"
                  >
                    <option value="">Select Outgoing Officer...</option>
                    {staffList
                      .filter((s) => s.status === 'ACTIVE')
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.empCode} • {s.designation})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-700">Incoming Appointee / Successor *</label>
                  <select
                    value={standaloneIncomingId}
                    onChange={(e) => setStandaloneIncomingId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs font-semibold text-[#242424]"
                  >
                    <option value="">Select Incoming Successor...</option>
                    {staffList
                      .filter((s) => s.status === 'ACTIVE' && s.id !== standaloneOutgoingId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.empCode} • {s.department})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Disposition Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Outgoing Officer Disposition Action *</label>
                  <select
                    value={standaloneDisposition}
                    onChange={(e) => setStandaloneDisposition(e.target.value as OutgoingDisposition)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-medium text-[#242424]"
                  >
                    <option value="REASSIGN_FACULTY">Reassign to Senior Faculty (Retains Employment)</option>
                    <option value="TRANSFER_DEPT">Transfer to Academic Liaison Unit</option>
                    <option value="RELIEVE_ARCHIVE">Relieve / Revoke Executive Access</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#242424]">Governing Resolution Ref *</label>
                  <input
                    type="text"
                    required
                    value={standaloneApprovalRef}
                    onChange={(e) => setStandaloneApprovalRef(e.target.value)}
                    placeholder="e.g. BOG-RES-2026-118"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs font-mono font-medium text-[#242424]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#242424]">Handover Notes &amp; Statutory Transition Summary</label>
                <textarea
                  rows={2}
                  value={standaloneNotes}
                  onChange={(e) => setStandaloneNotes(e.target.value)}
                  placeholder="e.g. Handover of grade moderation cryptographic tokens and bank portal authorization keys."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DFD7] text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                />
              </div>

              {/* Transferred Privileges */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] space-y-1.5">
                <span className="text-[11px] font-bold text-[#8B5E3C] block">
                  Authorities &amp; Crypto Keys Transferred:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(ROLE_PRIVILEGE_MAP[standaloneRole] || []).map((priv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#242424] border border-[#E5DFD7]"
                    >
                      ✓ {priv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsHandoverModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#FAF7F2] border border-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span>Execute &amp; Record Handover</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: OFFICIAL PAYSLIP MODAL */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Payslip Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#682038]" />
                  <h3 className="font-bold text-base text-[#242424]">Academy College of Engineering &amp; Technology</h3>
                </div>
                <p className="text-xs text-[#6E6862]">
                  Salary Slip for the Month of <strong>October 2026</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedPayslipEmp(null)}
                className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Particulars Grid */}
            {(() => {
              const comp = calculateSalaryComponents(
                selectedPayslipEmp.basicSalary,
                selectedPayslipEmp.specialAllowance,
                selectedPayslipEmp.lopDays
              );

              return (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] text-xs">
                    <div>
                      <span className="text-[#6E6862] block">Employee Name:</span>
                      <span className="font-bold text-[#242424]">{selectedPayslipEmp.name}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Emp Code / Dept:</span>
                      <span className="font-mono font-bold text-[#682038]">{selectedPayslipEmp.empCode}</span>
                      <span className="text-[10px] text-[#6E6862] block">{selectedPayslipEmp.department}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Designation:</span>
                      <span className="font-semibold text-[#242424]">{selectedPayslipEmp.designation}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Bank Account:</span>
                      <span className="font-mono text-[#242424]">
                        {selectedPayslipEmp.bankName} (···{selectedPayslipEmp.bankAccount.slice(-4)})
                      </span>
                      <span className="text-[10px] text-[#6E6862] block font-mono">PAN: {selectedPayslipEmp.panNumber}</span>
                    </div>
                  </div>

                  {/* Dual Column Earnings & Deductions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Earnings */}
                    <div className="border border-[#E5DFD7] rounded-xl overflow-hidden">
                      <div className="bg-[#FAF7F2] p-2.5 font-bold text-xs text-[#242424] border-b border-[#E5DFD7]">
                        Earnings
                      </div>
                      <div className="divide-y divide-[#E5DFD7] text-xs">
                        <div className="p-2.5 flex justify-between">
                          <span>Basic Pay</span>
                          <span className="font-mono font-bold">₹{comp.basic.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>House Rent Allowance (HRA 40%)</span>
                          <span className="font-mono font-bold">₹{comp.hra.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Dearness Allowance (DA 25%)</span>
                          <span className="font-mono font-bold">₹{comp.da.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Special Allowance</span>
                          <span className="font-mono font-bold">₹{comp.special.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between bg-emerald-50 text-emerald-900 font-bold">
                          <span>Total Gross Earnings</span>
                          <span className="font-mono">₹{comp.grossEarnings.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="border border-[#E5DFD7] rounded-xl overflow-hidden">
                      <div className="bg-[#FAF7F2] p-2.5 font-bold text-xs text-[#242424] border-b border-[#E5DFD7]">
                        Deductions
                      </div>
                      <div className="divide-y divide-[#E5DFD7] text-xs">
                        <div className="p-2.5 flex justify-between">
                          <span>Provident Fund (PF 12%)</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.pf.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Professional Tax (PT)</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.pt.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>TDS / Income Tax</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.tds.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Loss of Pay (LOP {selectedPayslipEmp.lopDays} days)</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.lopDeduction.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between bg-rose-50 text-rose-900 font-bold">
                          <span>Total Deductions</span>
                          <span className="font-mono">₹{comp.totalDeductions.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Payable Banner */}
                  <div className="bg-[#682038] text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-amber-200">Net Payable Amount</span>
                      <div className="text-xl font-bold font-mono">₹{comp.netPayable.toLocaleString('en-IN')}</div>
                    </div>
                    <span className="text-xs text-white/80">Direct Electronic Bank Credit</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#6E6862]">
                      System-generated slip • Verification Hash: <code className="font-mono text-[#682038]">SHA256:d8a2..f0</code>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPayslipEmp(null)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => alert(`Simulating PDF download for ${selectedPayslipEmp.name}`)}
                        className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Signed PDF</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
