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
  const [subTab, setSubTab] = useState<'matrix' | 'condonation' | 'biometric'>('matrix');
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [condonations, setCondonations] = useState<CondonationRequest[]>(INITIAL_CONDONATIONS);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2);
  const [selectedSubject, setSelectedSubject] = useState('CS601 Distributed Systems');
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [isFlushing, setIsFlushing] = useState(false);
  const [lastFlushTime, setLastFlushTime] = useState<string | null>(null);

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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#682038]/10 text-[#682038]">
              Module 02
            </span>
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
                Per Devloft Section 3.2, hardware punch events streamed via TCP socket listeners are written directly to an append-only audit store. Attendance reconciliation records point to device punches without mutating raw event logs.
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
