import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Fingerprint,
  Calendar,
  ShieldCheck,
  Download,
  Search,
  Check,
  Filter,
  RefreshCw,
  X,
  ChevronRight,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  Send,
  Mail,
  Eye,
  Bell,
  Sparkles,
  Phone,
} from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_DUTY';

interface StudentAttendance {
  id: string;
  rollNo: string;
  name: string;
  program: string;
  semester: string;
  attendedClasses: number;
  totalClasses: number;
  currentPeriodStatus: AttendanceStatus;
  isCondoned?: boolean;
}

interface CondonationRequest {
  id: string;
  studentId: string;
  name: string;
  rollNo: string;
  program: string;
  medicalCertRef: string;
  doctorHospital: string;
  condonationFeeUtr: string;
  feeAmount: number;
  claimedDays: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
}

interface BiometricPunchLog {
  id: string;
  deviceId: string;
  deviceLocation: string;
  ipAddress: string;
  identifier: string;
  name: string;
  role: 'STUDENT' | 'FACULTY';
  timestamp: string;
  matchedShift: string;
  status: 'ON_TIME' | 'GRACE_PERIOD' | 'LATE_IN';
}

interface ParentWarningItem {
  id: string;
  studentId: string;
  rollNo: string;
  name: string;
  program: string;
  attended: number;
  total: number;
  percentage: number;
  marginSessionsToDebarment: number;
  zone: 'AMBER_WARNING_78' | 'CRITICAL_BARRED_75';
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  warningDispatched: boolean;
  dispatchedAt?: string;
}

const INITIAL_PARENT_WARNINGS: ParentWarningItem[] = [
  {
    id: 'pw-01',
    studentId: 's-105',
    rollNo: '2023CSE045',
    name: 'Karthik Menon',
    program: 'B.Tech CSE Sem 6',
    attended: 46,
    total: 60,
    percentage: 76.6,
    marginSessionsToDebarment: 1,
    zone: 'AMBER_WARNING_78',
    parentName: 'Mr. Suresh Menon',
    parentEmail: 'suresh.menon@example.com',
    parentPhone: '+91 98450 12345',
    warningDispatched: false,
  },
  {
    id: 'pw-02',
    studentId: 's-107',
    rollNo: '2023CSE047',
    name: 'Zaid Al-Mansoor',
    program: 'B.Tech CSE Sem 6',
    attended: 47,
    total: 60,
    percentage: 78.3,
    marginSessionsToDebarment: 2,
    zone: 'AMBER_WARNING_78',
    parentName: 'Mr. Tariq Al-Mansoor',
    parentEmail: 'tariq.mansoor@example.com',
    parentPhone: '+91 98450 67890',
    warningDispatched: false,
  },
  {
    id: 'pw-03',
    studentId: 's-102',
    rollNo: '2023CSE042',
    name: 'Sneha Patel',
    program: 'B.Tech CSE Sem 6',
    attended: 41,
    total: 60,
    percentage: 68.3,
    marginSessionsToDebarment: 0,
    zone: 'CRITICAL_BARRED_75',
    parentName: 'Dr. Kirit Patel',
    parentEmail: 'kirit.patel@example.com',
    parentPhone: '+91 98450 54321',
    warningDispatched: true,
    dispatchedAt: 'Today, 10:14 AM',
  },
  {
    id: 'pw-04',
    studentId: 's-104',
    rollNo: '2023CSE044',
    name: 'Ananya Iyer',
    program: 'B.Tech CSE Sem 6',
    attended: 43,
    total: 60,
    percentage: 71.6,
    marginSessionsToDebarment: 0,
    zone: 'CRITICAL_BARRED_75',
    parentName: 'Mrs. Radha Iyer',
    parentEmail: 'radha.iyer@example.com',
    parentPhone: '+91 98450 77665',
    warningDispatched: true,
    dispatchedAt: 'Yesterday, 04:30 PM',
  },
];

const INITIAL_STUDENTS: StudentAttendance[] = [
  {
    id: 's-101',
    rollNo: '2023CSE041',
    name: 'Rahul Sharma',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 52,
    totalClasses: 60,
    currentPeriodStatus: 'PRESENT',
  },
  {
    id: 's-102',
    rollNo: '2023CSE042',
    name: 'Sneha Patel',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 41,
    totalClasses: 60, // 68.3% defaulter
    currentPeriodStatus: 'ABSENT',
  },
  {
    id: 's-103',
    rollNo: '2023CSE043',
    name: 'Vikramaditya Verma',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 56,
    totalClasses: 60,
    currentPeriodStatus: 'PRESENT',
  },
  {
    id: 's-104',
    rollNo: '2023CSE044',
    name: 'Ananya Iyer',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 43,
    totalClasses: 60, // 71.6% defaulter
    currentPeriodStatus: 'PRESENT',
  },
  {
    id: 's-105',
    rollNo: '2023CSE045',
    name: 'Karthik Menon',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 48,
    totalClasses: 60,
    currentPeriodStatus: 'ON_DUTY',
  },
  {
    id: 's-106',
    rollNo: '2023CSE046',
    name: 'Pooja Deshmukh',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 58,
    totalClasses: 60,
    currentPeriodStatus: 'PRESENT',
  },
  {
    id: 's-107',
    rollNo: '2023CSE047',
    name: 'Zaid Al-Mansoor',
    program: 'B.Tech CSE',
    semester: 'Sem 6',
    attendedClasses: 49,
    totalClasses: 60,
    currentPeriodStatus: 'LATE',
  },
];

const INITIAL_CONDONATIONS: CondonationRequest[] = [
  {
    id: 'cnd-01',
    studentId: 's-102',
    name: 'Sneha Patel',
    rollNo: '2023CSE042',
    program: 'B.Tech CSE',
    medicalCertRef: 'MED-APOLLO-9841',
    doctorHospital: 'Apollo Hospital (Dengue Admission 6d)',
    condonationFeeUtr: 'UTR-AXIS-992019482',
    feeAmount: 500,
    claimedDays: 6,
    status: 'PENDING',
    submittedDate: '2026-10-24',
  },
  {
    id: 'cnd-02',
    studentId: 's-104',
    name: 'Ananya Iyer',
    rollNo: '2023CSE044',
    program: 'B.Tech CSE',
    medicalCertRef: 'MED-AIIMS-4412',
    doctorHospital: 'AIIMS Outpatient (Ligament Tear)',
    condonationFeeUtr: 'UTR-HDFC-88192001',
    feeAmount: 500,
    claimedDays: 4,
    status: 'PENDING',
    submittedDate: '2026-10-25',
  },
];

const BIOMETRIC_LOGS: BiometricPunchLog[] = [
  {
    id: 'bio-101',
    deviceId: 'BIO-GATE-01',
    deviceLocation: 'Main Campus East Turnstile',
    ipAddress: '192.168.10.45',
    identifier: '2023CSE041',
    name: 'Rahul Sharma',
    role: 'STUDENT',
    timestamp: '08:24:12 AM',
    matchedShift: 'Morning Period 1 (08:30)',
    status: 'ON_TIME',
  },
  {
    id: 'bio-102',
    deviceId: 'BIO-GATE-01',
    deviceLocation: 'Main Campus East Turnstile',
    ipAddress: '192.168.10.45',
    identifier: 'EMP-CSE-004',
    name: 'Dr. Aris Thorne',
    role: 'FACULTY',
    timestamp: '08:28:44 AM',
    matchedShift: 'Faculty Shift (08:30)',
    status: 'ON_TIME',
  },
  {
    id: 'bio-103',
    deviceId: 'BIO-DEPT-03',
    deviceLocation: 'Computer Science Wing Gate 2',
    ipAddress: '192.168.12.18',
    identifier: '2023CSE047',
    name: 'Zaid Al-Mansoor',
    role: 'STUDENT',
    timestamp: '08:37:02 AM',
    matchedShift: 'Morning Period 1 (08:30)',
    status: 'GRACE_PERIOD',
  },
  {
    id: 'bio-104',
    deviceId: 'BIO-DEPT-03',
    deviceLocation: 'Computer Science Wing Gate 2',
    ipAddress: '192.168.12.18',
    identifier: '2023CSE045',
    name: 'Karthik Menon',
    role: 'STUDENT',
    timestamp: '08:44:19 AM',
    matchedShift: 'Morning Period 1 (08:30)',
    status: 'LATE_IN',
  },
];

export const AttendanceWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'matrix' | 'condonation' | 'biometric' | 'radar'>('matrix');
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [condonations, setCondonations] = useState<CondonationRequest[]>(INITIAL_CONDONATIONS);
  const [parentWarnings, setParentWarnings] = useState<ParentWarningItem[]>(INITIAL_PARENT_WARNINGS);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2);
  const [selectedSubject, setSelectedSubject] = useState('CS601 Distributed Systems');
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [isFlushing, setIsFlushing] = useState(false);
  const [lastFlushTime, setLastFlushTime] = useState<string | null>(null);
  const [activePreviewNotice, setActivePreviewNotice] = useState<ParentWarningItem | null>(null);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [radarFilter, setRadarFilter] = useState<'ALL' | 'AMBER_78' | 'BARRED_75'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDispatchParentWarning = (warningId: string) => {
    setDispatchingId(warningId);
    setTimeout(() => {
      setParentWarnings((prev) =>
        prev.map((item) =>
          item.id === warningId
            ? { ...item, warningDispatched: true, dispatchedAt: 'Just now via SMTP & In-App' }
            : item
        )
      );
      setDispatchingId(null);
      showToast('Automated 78% Threshold Notice successfully sent to Parent Portal & Email! (Zero-SMS: ₹0.28 saved)');
    }, 800);
  };

  const handleBulkDispatchAmberWarnings = () => {
    setDispatchingId('bulk');
    setTimeout(() => {
      setParentWarnings((prev) =>
        prev.map((item) =>
          item.zone === 'AMBER_WARNING_78'
            ? { ...item, warningDispatched: true, dispatchedAt: 'Just now (Bulk Batch)' }
            : item
        )
      );
      setDispatchingId(null);
      showToast('Dispatched 78% Defaulter Warning emails & parent portal push notifications to all Amber Zone parents.');
    }, 1200);
  };

  // Stats calculation
  const totalStudents = students.length;
  const presentCount = students.filter(
    (s) => s.currentPeriodStatus === 'PRESENT' || s.currentPeriodStatus === 'ON_DUTY'
  ).length;
  const absentCount = students.filter((s) => s.currentPeriodStatus === 'ABSENT').length;
  const lateCount = students.filter((s) => s.currentPeriodStatus === 'LATE').length;
  const periodPercentage = Math.round((presentCount / totalStudents) * 100);

  // Status toggle handler
  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    if (isSessionLocked) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        // recalculate attended count if changing to/from PRESENT
        const wasPresent = s.currentPeriodStatus === 'PRESENT' || s.currentPeriodStatus === 'ON_DUTY';
        const isNowPresent = newStatus === 'PRESENT' || newStatus === 'ON_DUTY';
        let attendedDelta = 0;
        if (!wasPresent && isNowPresent) attendedDelta = 1;
        if (wasPresent && !isNowPresent) attendedDelta = -1;

        return {
          ...s,
          currentPeriodStatus: newStatus,
          attendedClasses: Math.max(0, s.attendedClasses + attendedDelta),
        };
      })
    );
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    if (isSessionLocked) return;
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        currentPeriodStatus: 'PRESENT',
        attendedClasses:
          s.currentPeriodStatus === 'PRESENT' || s.currentPeriodStatus === 'ON_DUTY'
            ? s.attendedClasses
            : s.attendedClasses + 1,
      }))
    );
  };

  // Flush attendance batch
  const handleFlushAttendance = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
      setLastFlushTime(new Date().toLocaleTimeString());
    }, 600);
  };

  // Approve condonation
  const handleApproveCondonation = (cndId: string, studentId: string, claimedDays: number) => {
    setCondonations((prev) =>
      prev.map((c) => (c.id === cndId ? { ...c, status: 'APPROVED' } : c))
    );
    // dynamically condone student attendance
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          attendedClasses: s.attendedClasses + claimedDays,
          isCondoned: true,
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Biometric Engine & Condonation Desk
            </span>
            {isSessionLocked ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <Lock className="w-3 h-3 text-rose-700" />
                Session Locked (&gt;24h)
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Unlock className="w-3 h-3 text-emerald-700" />
                Active Recording Session
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Attendance & Exam Eligibility Console</h1>
          <p className="text-xs text-[#6E6862]">
            Period-wise attendance marking with statutory 75% hall ticket gating, raw biometric turnstile audits, and medical condonation fee verification.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DFD7]">
          <button
            onClick={() => setSubTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'matrix'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Period Matrix</span>
          </button>
          <button
            onClick={() => setSubTab('condonation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'condonation'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Condonation Desk</span>
            {condonations.filter((c) => c.status === 'PENDING').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {condonations.filter((c) => c.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setSubTab('biometric')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'biometric'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Biometric Audit</span>
          </button>
          <button
            onClick={() => setSubTab('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'radar'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>78% Parent Radar</span>
            {parentWarnings.filter((w) => w.zone === 'AMBER_WARNING_78' && !w.warningDispatched).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-mono">
                {parentWarnings.filter((w) => w.zone === 'AMBER_WARNING_78' && !w.warningDispatched).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PERIOD ATTENDANCE MATRIX */}
      {subTab === 'matrix' && (
        <div className="space-y-6">
          {/* Controls & Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Enrolled Students</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-[#242424]">{totalStudents}</span>
                <span className="text-xs text-[#8B5E3C] font-semibold">CSE Sem 6 - Sec A</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Present in Period {selectedPeriod}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-600">{presentCount}</span>
                <span className="text-xs text-emerald-700 font-bold">{periodPercentage}% Attendance</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Absent / Late</span>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono text-rose-600">{absentCount}</span>
                  <span className="text-xs text-[#6E6862]">absent</span>
                  <span className="text-sm font-bold font-mono text-amber-600">({lateCount} late)</span>
                </div>
                <span className="text-[10px] text-[#6E6862]">Automatic SMS suppressed</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Hall Ticket Defaulters (&lt;75%)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-rose-700">
                  {students.filter((s) => Math.round((s.attendedClasses / s.totalClasses) * 100) < 75).length}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  Barred from Hall Ticket
                </span>
              </div>
            </div>
          </div>

          {/* Period Bar & Actions Bar */}
          <div className="bg-white rounded-xl border border-[#E5DFD7] p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-[#242424]">
                <span>Period:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPeriod(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                        selectedPeriod === p
                          ? 'bg-[#682038] text-white shadow-sm'
                          : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                      }`}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-4 w-[1px] bg-[#E5DFD7] hidden md:block" />

              <div className="text-xs text-[#6E6862] flex items-center gap-2">
                <span className="font-semibold text-[#242424]">{selectedSubject}</span>
                <span>• Hall: CS-Lab 04</span>
                <span>• 10:15 AM - 11:10 AM</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsSessionLocked(!isSessionLocked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSessionLocked
                    ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    : 'bg-[#FAF7F2] text-[#6E6862] border-[#E5DFD7] hover:bg-[#F4ECE2]'
                }`}
                title="Toggle session lock to simulate 24-hour expiration"
              >
                {isSessionLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isSessionLocked ? 'Locked (>24h)' : 'Simulate 24h Lock'}</span>
              </button>

              {isSessionLocked && (
                <button
                  onClick={() => setIsUnlockModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Request Session Edit</span>
                </button>
              )}

              <button
                onClick={handleMarkAllPresent}
                disabled={isSessionLocked}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-xs font-bold border border-[#E5DFD7] disabled:opacity-50 transition-all"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleFlushAttendance}
                disabled={isSessionLocked || isFlushing}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
                <span>{isFlushing ? 'Flushing...' : 'Flush to Ledger'}</span>
              </button>
            </div>
          </div>

          {/* Latency & Persistence Banner */}
          {lastFlushTime && (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Attendance batch flushed to PostgreSQL at <strong>{lastFlushTime}</strong></span>
              </span>
              <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                ⚡ 12.4ms payload commit
              </span>
            </div>
          )}

          {/* Roster Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8B5E3C]" />
                <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                  Period Attendance Roster & Eligibility Gating
                </h3>
              </div>
              <span className="text-xs text-[#6E6862]">
                Statutory Requirement: <strong>75% Minimum Cumulative Attendance</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Roll Number</th>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold text-center">Cumulative %</th>
                    <th className="py-3 px-4 font-semibold">Hall Ticket Status</th>
                    <th className="py-3 px-4 font-semibold text-center">Period {selectedPeriod} Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {students.map((student) => {
                    const cumPct = Math.round((student.attendedClasses / student.totalClasses) * 100);
                    const isBarred = cumPct < 75;

                    return (
                      <tr key={student.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#242424]">
                          {student.rollNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#242424] flex items-center gap-2">
                            <span>{student.name}</span>
                            {student.isCondoned && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                Condoned
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6E6862]">
                            {student.program} • {student.semester}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-16 bg-[#E5DFD7] rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isBarred ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, cumPct)}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold ${
                                isBarred ? 'text-rose-600' : 'text-emerald-700'
                              }`}
                            >
                              {cumPct}%
                            </span>
                          </div>
                          <div className="text-[10px] text-[#6E6862] font-mono mt-0.5">
                            {student.attendedClasses} / {student.totalClasses} sessions
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {isBarred ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>BARRED (Shortage: {75 - cumPct}%)</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Hall Ticket Eligible</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleStatusChange(student.id, 'PRESENT')}
                              disabled={isSessionLocked}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                student.currentPeriodStatus === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'ABSENT')}
                              disabled={isSessionLocked}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                student.currentPeriodStatus === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'LATE')}
                              disabled={isSessionLocked}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                student.currentPeriodStatus === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'ON_DUTY')}
                              disabled={isSessionLocked}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                student.currentPeriodStatus === 'ON_DUTY'
                                  ? 'bg-[#682038] text-white shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                              }`}
                            >
                              OD
                            </button>
                          </div>
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

      {/* SUB-TAB 2: CONDONATION APPLICATION DESK */}
      {subTab === 'condonation' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-900">
              <h3 className="font-bold text-sm">Medical Condonation & Examination Shortage Clearance Desk</h3>
              <p>
                Students with attendance between 65% and 74.9% may apply for medical condonation by submitting authentic hospital discharge certificates and paying the statutory <strong>₹500 Condonation Fee</strong> per university bylaws. Approval restores hall ticket generation rights.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Pending Condonation Requests ({condonations.length})
              </h3>
              <span className="text-xs text-[#6E6862]">Mandatory Bursar UTR Verification</span>
            </div>

            <div className="divide-y divide-[#E5DFD7]">
              {condonations.map((req) => (
                <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F2]/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#682038] text-sm">{req.rollNo}</span>
                      <span className="font-bold text-[#242424] text-sm">{req.name}</span>
                      <span className="text-xs text-[#6E6862]">({req.program})</span>
                      {req.status === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Approved & Restored
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          Awaiting HOD Signoff
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#6E6862]">
                      <div>
                        <span className="font-medium text-[#242424]">Hospital Certificate: </span>
                        <span className="font-mono text-[#8B5E3C]">{req.medicalCertRef}</span>
                        <div className="text-[11px]">{req.doctorHospital}</div>
                      </div>
                      <div>
                        <span className="font-medium text-[#242424]">Statutory Penalty Fee: </span>
                        <span className="font-bold text-[#242424]">₹{req.feeAmount}</span>
                        <div className="font-mono text-[11px] text-[#6E6862]">{req.condonationFeeUtr}</div>
                      </div>
                      <div>
                        <span className="font-medium text-[#242424]">Attendance Credit Claimed: </span>
                        <span className="font-bold text-emerald-700">+{req.claimedDays} Sessions</span>
                        <div className="text-[11px]">Submitted on {req.submittedDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApproveCondonation(req.id, req.studentId, req.claimedDays)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Grant Hall Ticket</span>
                        </button>
                        <button
                          onClick={() =>
                            setCondonations((prev) =>
                              prev.map((c) => (c.id === req.id ? { ...c, status: 'REJECTED' } : c))
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-rose-50 text-rose-700 text-xs font-bold border border-[#E5DFD7] transition-all"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Granted by Academic Dean</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BIOMETRIC HARDWARE AUDIT TABLE */}
      {subTab === 'biometric' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-5 flex items-start gap-3">
            <Fingerprint className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#242424]">
              <h3 className="font-bold text-sm">Immutable Raw Biometric Device Ingestion Pipeline</h3>
              <p className="text-[#6E6862]">
                Per System Architecture Section 3.2, hardware punch events streamed via TCP socket listeners are written directly to an append-only audit store. Attendance reconciliation records point to device punches without mutating raw event logs.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Raw Biometric Turnstile Logs (Append-Only)
              </h3>
              <span className="font-mono text-xs text-[#6E6862]">Port :4433 Socket Worker Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Device ID & Location</th>
                    <th className="py-3 px-4 font-semibold">Machine IP</th>
                    <th className="py-3 px-4 font-semibold">ID / Name</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Punch Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Matched Shift</th>
                    <th className="py-3 px-4 font-semibold">Ingestion Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {BIOMETRIC_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#242424]">{log.deviceId}</div>
                        <div className="text-[11px] text-[#6E6862]">{log.deviceLocation}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#6E6862]">{log.ipAddress}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#242424]">{log.name}</div>
                        <div className="font-mono text-[11px] text-[#8B5E3C]">{log.identifier}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.role === 'FACULTY'
                              ? 'bg-[#682038]/10 text-[#682038]'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {log.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#242424]">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 text-[#6E6862]">{log.matchedShift}</td>
                      <td className="py-3.5 px-4">
                        {log.status === 'ON_TIME' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            On Time
                          </span>
                        )}
                        {log.status === 'GRACE_PERIOD' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            Grace Period (7m)
                          </span>
                        )}
                        {log.status === 'LATE_IN' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Late In (14m)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AUTOMATED PARENT DEFAULTER THRESHOLD WARNING (78% BUFFER RADAR) */}
      {subTab === 'radar' && (
        <div className="space-y-6">
          {/* Statutory Policy & Zero-SMS Banner */}
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1 text-xs text-[#242424]">
                <h3 className="font-bold text-sm">Automated 78% Buffer Early-Warning Radar</h3>
                <p className="text-[#6E6862]">
                  Statutory debarment from autonomous examinations is strictly enforced at &lt;75% attendance. The 78% buffer triggers proactive early intervention (1–2 absences prior to debarment).
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-[#8B5E3C] font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Zero-SMS Policy: In-App Push &amp; SMTP Email Only
                  </span>
                  <span>•</span>
                  <span>Statutory Condonation Window: 65%–74.9% with ₹500 fee</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleBulkDispatchAmberWarnings}
                disabled={dispatchingId === 'bulk' || parentWarnings.filter((w) => w.zone === 'AMBER_WARNING_78' && !w.warningDispatched).length === 0}
                className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {dispatchingId === 'bulk' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting Batch...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch All Amber Warnings ({parentWarnings.filter((w) => w.zone === 'AMBER_WARNING_78' && !w.warningDispatched).length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-1 bg-gradient-to-br from-amber-50/50 to-white">
              <span className="text-xs font-semibold text-amber-900">78% Buffer Warning Zone</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-amber-700">
                  {parentWarnings.filter((w) => w.zone === 'AMBER_WARNING_78').length}
                </span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  1–2 Absences Left
                </span>
              </div>
              <p className="text-[10px] text-[#6E6862]">Proactive warning triggered before debarment</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm space-y-1 bg-gradient-to-br from-rose-50/50 to-white">
              <span className="text-xs font-semibold text-rose-900">Hard Debarred (&lt;75%)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-rose-700">
                  {parentWarnings.filter((w) => w.zone === 'CRITICAL_BARRED_75').length}
                </span>
                <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                  Hall Ticket Barred
                </span>
              </div>
              <p className="text-[10px] text-[#6E6862]">Referred to Medical Condonation Desk</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Cohort Average Attendance</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-[#242424]">81.4%</span>
                <span className="text-xs text-emerald-600 font-bold">Above 75% Par</span>
              </div>
              <p className="text-[10px] text-[#6E6862]">60 Total Statutory Periods Delivered</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm space-y-1 bg-gradient-to-br from-emerald-50/50 to-white">
              <span className="text-xs font-semibold text-emerald-900">Zero-SMS Cost Saved</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-700">₹8,400.00</span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ₹0.28 / SMS Saved
                </span>
              </div>
              <p className="text-[10px] text-[#6E6862]">In-App Push + Institutional SMTP Routing</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-[#E5DFD7] p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6E6862] flex items-center gap-1.5 pl-1">
                <Filter className="w-3.5 h-3.5" />
                Filter Defaulters:
              </span>
              <button
                onClick={() => setRadarFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  radarFilter === 'ALL'
                    ? 'bg-[#682038] text-white shadow-xs'
                    : 'text-[#6E6862] hover:bg-[#FAF7F2]'
                }`}
              >
                All Defaulters ({parentWarnings.length})
              </button>
              <button
                onClick={() => setRadarFilter('AMBER_78')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  radarFilter === 'AMBER_78'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                Amber 78% Buffer ({parentWarnings.filter((w) => w.zone === 'AMBER_WARNING_78').length})
              </button>
              <button
                onClick={() => setRadarFilter('BARRED_75')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  radarFilter === 'BARRED_75'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-800 bg-rose-50 hover:bg-rose-100'
                }`}
              >
                Barred &lt;75% ({parentWarnings.filter((w) => w.zone === 'CRITICAL_BARRED_75').length})
              </button>
            </div>

            <div className="text-[11px] font-mono text-[#6E6862]">
              Auto-sync with biometric logs enabled
            </div>
          </div>

          {/* Defaulter Radar Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student &amp; Roll No</th>
                    <th className="py-3 px-4 font-semibold">Program</th>
                    <th className="py-3 px-4 font-semibold">Attendance Ratio</th>
                    <th className="py-3 px-4 font-semibold">Risk &amp; Margin</th>
                    <th className="py-3 px-4 font-semibold">Parent Contact</th>
                    <th className="py-3 px-4 font-semibold">Dispatch Audit</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {parentWarnings
                    .filter((w) => {
                      if (radarFilter === 'AMBER_78') return w.zone === 'AMBER_WARNING_78';
                      if (radarFilter === 'BARRED_75') return w.zone === 'CRITICAL_BARRED_75';
                      return true;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#242424]">{item.name}</div>
                          <div className="font-mono text-[11px] text-[#8B5E3C]">{item.rollNo}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#6E6862]">{item.program}</td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-mono font-bold text-[#242424]">
                                {item.attended} / {item.total}
                              </span>
                              <span
                                className={`font-mono font-bold ${
                                  item.zone === 'AMBER_WARNING_78' ? 'text-amber-700' : 'text-rose-700'
                                }`}
                              >
                                {item.percentage}%
                              </span>
                            </div>
                            <div className="w-28 h-1.5 rounded-full bg-[#E5DFD7] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.zone === 'AMBER_WARNING_78' ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.zone === 'AMBER_WARNING_78' ? (
                            <div className="space-y-0.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                78% Amber Buffer
                              </span>
                              <div className="text-[11px] font-semibold text-amber-700">
                                {item.marginSessionsToDebarment === 1
                                  ? '⚠️ Only 1 absence left before debarment!'
                                  : `⚠️ ${item.marginSessionsToDebarment} absences left before debarment`}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
                                Barred from Hall Ticket
                              </span>
                              <div className="text-[11px] font-semibold text-rose-700">
                                Deficit: {Math.ceil(item.total * 0.75) - item.attended} classes short
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#242424]">{item.parentName}</div>
                          <div className="text-[11px] text-[#6E6862] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#8B5E3C]" />
                            <span>{item.parentEmail}</span>
                          </div>
                          <div className="text-[11px] text-[#6E6862] flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-[#8B5E3C]" />
                            <span>{item.parentPhone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.warningDispatched ? (
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Notice Sent
                              </span>
                              <div className="text-[10px] text-[#6E6862]">{item.dispatchedAt || 'Today'}</div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-amber-700 font-medium">Pending Dispatch</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActivePreviewNotice(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#8B5E3C] border border-[#E5DFD7] text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Preview Official Notice"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Notice</span>
                            </button>
                            <button
                              onClick={() => handleDispatchParentWarning(item.id)}
                              disabled={dispatchingId === item.id || item.warningDispatched}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                item.warningDispatched
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                                  : 'bg-[#682038] hover:bg-[#54192D] text-white shadow-xs'
                              }`}
                            >
                              {dispatchingId === item.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : item.warningDispatched ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Sent</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Dispatch Warning</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#242424] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs border border-white/10 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Official Parent Notice Preview Modal */}
      {activePreviewNotice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#682038]" />
                <h3 className="font-bold text-sm text-[#242424]">Official Parent Notice Preview</h3>
              </div>
              <button
                onClick={() => setActivePreviewNotice(null)}
                className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letterhead Preview Box */}
            <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E5DFD7] space-y-3 font-sans">
              <div className="text-center pb-2 border-b border-[#E5DFD7] space-y-0.5">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#682038] font-helvetica">
                  MYSCHOOL AUTONOMOUS INSTITUTE OF TECHNOLOGY
                </h4>
                <p className="text-[10px] text-[#6E6862]">
                  Office of the Controller of Examinations &amp; Academic Dean
                </p>
                <span className="inline-block text-[9px] font-mono px-2 py-0.5 bg-white rounded border border-[#E5DFD7] text-[#8B5E3C]">
                  DISPATCH REF: ACAD-ATT-2026/SEC-78/{activePreviewNotice.rollNo}
                </span>
              </div>

              <div className="text-xs space-y-2 text-[#242424] leading-relaxed">
                <p>
                  <strong>To:</strong> {activePreviewNotice.parentName}
                  <br />
                  <strong>Re:</strong> Attendance Threshold Warning for Ward:{' '}
                  <strong>
                    {activePreviewNotice.name} ({activePreviewNotice.rollNo})
                  </strong>
                </p>

                <p className="text-[11px] text-[#6E6862]">
                  This is an automated regulatory notification to alert you that your ward's attendance in{' '}
                  <strong>{activePreviewNotice.program}</strong> stands at{' '}
                  <span className="font-bold text-rose-700 font-mono">
                    {activePreviewNotice.percentage}%
                  </span>{' '}
                  ({activePreviewNotice.attended} of {activePreviewNotice.total} periods attended).
                </p>

                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Statutory University Regulation Clause 7.2:</span>
                  </div>
                  <p>
                    Students with attendance strictly below <strong>75%</strong> are debarred from appearing in autonomous end-semester theory and laboratory examinations.
                  </p>
                  {activePreviewNotice.zone === 'AMBER_WARNING_78' ? (
                    <p className="font-bold text-amber-800">
                      Margin Warning: Your ward is within <strong>{activePreviewNotice.marginSessionsToDebarment} absence(s)</strong> of automatic debarment.
                    </p>
                  ) : (
                    <p className="font-bold text-rose-800">
                      Debarred: Your ward is currently ineligible for exam hall ticket generation.
                    </p>
                  )}
                </div>

                <p className="text-[10px] text-[#6E6862]">
                  If the shortage is due to hospitalization or certified medical reasons, submit a condonation application accompanied by medical certificate and statutory ₹500 fee UTR on the Student/Parent Portal within 3 working days.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5DFD7] flex items-center justify-between text-[10px] text-[#6E6862] font-sans">
                <span>Channel: Encrypted SMTP &amp; Parent App Push</span>
                <span className="font-mono text-emerald-700 font-bold">Zero-SMS Verified (Cost: ₹0.00)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setActivePreviewNotice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDispatchParentWarning(activePreviewNotice.id);
                  setActivePreviewNotice(null);
                }}
                disabled={activePreviewNotice.warningDispatched}
                className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{activePreviewNotice.warningDispatched ? 'Already Dispatched' : 'Dispatch Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Session Request Modal */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#682038]" />
                <h3 className="font-bold text-sm text-[#242424]">Request Session Unlock</h3>
              </div>
              <button
                onClick={() => setIsUnlockModalOpen(false)}
                className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6E6862]">
              Per Academic Bylaw Sec 4.1, attendance sessions locked after 24 hours require written justification approved by the Academic Dean.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#242424]">Dean Justification / Audit Trace:</label>
              <textarea
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="e.g. Student Rahul Sharma was marked absent erroneously while representing college at Inter-University Robotics Summit..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsUnlockModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsSessionLocked(false);
                  setIsUnlockModalOpen(false);
                }}
                disabled={!unlockReason.trim()}
                className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm disabled:opacity-50"
              >
                Submit & Unlock Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
