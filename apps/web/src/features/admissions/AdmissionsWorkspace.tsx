import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../../mockData';
import { StudentRecord } from '../../types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Search,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  PieChart,
  Award,
  Layers,
  Sparkles,
  QrCode,
  Download,
  ExternalLink,
  RefreshCw,
  Check,
  Building,
  GraduationCap,
} from 'lucide-react';

interface QuotaBucket {
  code: string;
  name: string;
  percentage: number;
  sanctioned: number;
  filled: number;
  vacant: number;
  color: string;
  isSupernumerary?: boolean;
}

interface AllottedApplicant {
  rank: number;
  name: string;
  score: number;
  quota: string;
  seatCode: string;
  status: 'CONFIRMED' | 'PROVISIONAL' | 'SLIDING_ROUND';
}

const INITIAL_QUOTAS: QuotaBucket[] = [
  { code: 'OPEN', name: 'Open / General Category', percentage: 50.0, sanctioned: 90, filled: 88, vacant: 2, color: '#682038' },
  { code: 'OBC_NCL', name: 'Other Backward Classes (OBC-NCL)', percentage: 27.0, sanctioned: 48, filled: 46, vacant: 2, color: '#8B5E3C' },
  { code: 'SC', name: 'Scheduled Castes (SC)', percentage: 15.0, sanctioned: 27, filled: 24, vacant: 3, color: '#1E3A8A' },
  { code: 'ST', name: 'Scheduled Tribes (ST)', percentage: 7.5, sanctioned: 13, filled: 11, vacant: 2, color: '#065F46' },
  { code: 'EWS', name: 'Economically Weaker Section (EWS)', percentage: 10.0, sanctioned: 18, filled: 16, vacant: 2, color: '#D97706', isSupernumerary: true },
  { code: 'MGMT_NRI', name: 'Institutional / Management Quota', percentage: 15.0, sanctioned: 27, filled: 27, vacant: 0, color: '#4C1D95' },
];

const INITIAL_ALLOTMENTS: AllottedApplicant[] = [
  { rank: 1, name: 'Vikramaditya Verma', score: 98.4, quota: 'OPEN', seatCode: 'CSE-OP-01', status: 'CONFIRMED' },
  { rank: 2, name: 'Pooja Deshmukh', score: 96.2, quota: 'OPEN', seatCode: 'CSE-OP-02', status: 'CONFIRMED' },
  { rank: 3, name: 'Rahul Sharma', score: 94.0, quota: 'OBC_NCL', seatCode: 'CSE-OBC-01', status: 'CONFIRMED' },
  { rank: 4, name: 'Sneha Patel', score: 91.5, quota: 'OPEN', seatCode: 'CSE-OP-03', status: 'CONFIRMED' },
  { rank: 5, name: 'Ananya Iyer', score: 89.2, quota: 'SC', seatCode: 'CSE-SC-01', status: 'CONFIRMED' },
  { rank: 8, name: 'Zaid Al-Mansoor', score: 84.5, quota: 'EWS', seatCode: 'CSE-EWS-01', status: 'SLIDING_ROUND' },
];

interface AlumniRecord {
  id: string;
  name: string;
  enrollmentNo: string;
  degreeName: string;
  graduationYear: string;
  cgpa: number;
  exitCleared: boolean;
  digiLockerSynced: boolean;
  digiLockerUri?: string;
  verificationHash?: string;
}

const INITIAL_ALUMNI: AlumniRecord[] = [
  {
    id: 'alm-1',
    name: 'Devraj Mukherjee',
    enrollmentNo: '2022CSE001',
    degreeName: 'B.Tech in Computer Science & Engineering (Honors)',
    graduationYear: 'Class of 2026',
    cgpa: 9.62,
    exitCleared: true,
    digiLockerSynced: true,
    digiLockerUri: 'in.gov.digilocker.edu.myschool.deg.2022cse001',
    verificationHash: 'SHA256:deg-789a01-44bf19',
  },
  {
    id: 'alm-2',
    name: 'Meera Nambiar',
    enrollmentNo: '2022CSE014',
    degreeName: 'B.Tech in Computer Science & Engineering',
    graduationYear: 'Class of 2026',
    cgpa: 8.94,
    exitCleared: true,
    digiLockerSynced: false,
  },
];

export const AdmissionsWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'registry' | 'seat_matrix' | 'digilocker'>('registry');
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForExit, setSelectedStudentForExit] = useState<StudentRecord | null>(null);
  const [typedAdmissionNo, setTypedAdmissionNo] = useState('');
  const [exitError, setExitError] = useState<string | null>(null);
  const [exitSuccess, setExitSuccess] = useState(false);

  // Quota Seat Matrix State
  const [quotas, setQuotas] = useState<QuotaBucket[]>(INITIAL_QUOTAS);
  const [allotments, setAllotments] = useState<AllottedApplicant[]>(INITIAL_ALLOTMENTS);
  const [selectedProgram, setSelectedProgram] = useState('CSE');
  const [isSlidingRoundExecuting, setIsSlidingRoundExecuting] = useState(false);
  const [slidingToast, setSlidingToast] = useState<string | null>(null);

  // Alumni & DigiLocker State
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(INITIAL_ALUMNI);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [viewQrAlumni, setViewQrAlumni] = useState<AlumniRecord | null>(null);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenExitModal = (student: StudentRecord) => {
    setSelectedStudentForExit(student);
    setTypedAdmissionNo('');
    setExitError(null);
    setExitSuccess(false);
  };

  const handleConfirmExit = () => {
    if (!selectedStudentForExit) return;

    // Statutory Exit Barrier Guard Validation
    const certs = selectedStudentForExit.exitClearance;
    const isCleared = certs.transferCert && certs.characterCert && certs.migrationCert && certs.noDuesSlip;

    if (!isCleared) {
      setExitError(
        'STATUTORY BARRIER REJECTED (HTTP 403): Cannot process student withdrawal or deletion. One or more mandatory clearance certificates (TC, Character, Migration, No-Dues) are missing or unverified.'
      );
      return;
    }

    if (typedAdmissionNo.trim() !== selectedStudentForExit.enrollmentNo) {
      setExitError(`Confirmation mismatch: Please type the exact enrollment number "${selectedStudentForExit.enrollmentNo}" to authorize permanent exit.`);
      return;
    }

    // Success: Update status to WITHDRAWN
    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudentForExit.id ? { ...s, status: 'WITHDRAWN' } : s))
    );
    setExitSuccess(true);
    setExitError(null);
  };

  // Feature 1: Execute Sliding Round Reallocation
  const handleExecuteSlidingRound = () => {
    setIsSlidingRoundExecuting(true);
    setTimeout(() => {
      setIsSlidingRoundExecuting(false);
      setQuotas((prev) =>
        prev.map((q) => {
          if (q.code === 'OPEN') return { ...q, filled: q.filled + 1, vacant: Math.max(0, q.vacant - 1) };
          if (q.code === 'SC') return { ...q, filled: q.filled + 1, vacant: Math.max(0, q.vacant - 1) };
          return q;
        })
      );
      setSlidingToast('Sliding Round 3 executed: 2 merit waitlist candidates promoted to Open/General quota.');
      setTimeout(() => setSlidingToast(null), 3500);
    }, 1000);
  };

  // Feature 2: Push Degree to DigiLocker / NAD
  const handlePushDigiLocker = (alumniId: string) => {
    setSyncingId(alumniId);
    setTimeout(() => {
      setSyncingId(null);
      setAlumniList((prev) =>
        prev.map((a) => {
          if (a.id !== alumniId) return a;
          const hash = `SHA256:deg-${Date.now()}-c4890`;
          const uri = `in.gov.digilocker.edu.myschool.deg.${a.enrollmentNo.toLowerCase()}`;
          return {
            ...a,
            digiLockerSynced: true,
            digiLockerUri: uri,
            verificationHash: hash,
          };
        })
      );
    }, 1200);
  };

  const totalSeats = quotas.reduce((acc, q) => acc + q.sanctioned, 0);
  const totalFilled = quotas.reduce((acc, q) => acc + q.filled, 0);
  const totalVacant = quotas.reduce((acc, q) => acc + q.vacant, 0);
  const occupancyPct = Math.round((totalFilled / totalSeats) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B5E3C]">Devloft Student Information System</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Admissions, Seat Matrix & SIS Registry</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            Statutory Exit Barrier Guard, Quota Reservation Seat Matrix visualizer, and National DigiLocker / NAD alumni vault.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DFD7] overflow-x-auto">
          <button
            onClick={() => setSubTab('registry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'registry'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Master Registry & Exit Barrier</span>
          </button>

          <button
            onClick={() => setSubTab('seat_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'seat_matrix'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Quota Seat Matrix ({totalVacant} Vacant)</span>
          </button>

          <button
            onClick={() => setSubTab('digilocker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'digilocker'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Alumni DigiLocker Vault</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MASTER REGISTRY & STATUTORY EXIT BARRIER GUARD */}
      {subTab === 'registry' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5DFD7]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#9B948D] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or enrollment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#682038] w-full"
              />
            </div>
            <div className="text-xs text-[#6E6862]">
              Enforces <strong>Statutory Student Exit Barrier Guard</strong> (4 verified certificates mandatory)
            </div>
          </div>

          {/* Student Directory Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                Enrolled Student Records ({filteredStudents.length})
              </h3>
              <span className="text-xs text-[#6E6862]">Enforces Statutory Student Exit Barrier Guard</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Student Details</th>
                    <th className="px-6 py-3.5">Program & Cohort</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Statutory Exit Slips (4 Required)</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {filteredStudents.map((s) => {
                    const certs = s.exitClearance;
                    return (
                      <tr key={s.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#242424] text-sm">{s.name}</div>
                          <div className="font-mono text-[11px] text-[#682038]">{s.enrollmentNo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#242424]">{s.program}</div>
                          <div className="text-[11px] text-[#6E6862]">Semester {s.semester} • Section {s.section}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              s.status === 'ACTIVE'
                                ? 'bg-[#E8F5E9] text-[#16A34A]'
                                : s.status === 'WITHDRAWN'
                                ? 'bg-[#F4ECEE] text-[#682038]'
                                : 'bg-[#FFEBEE] text-[#BA1A1A]'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.transferCert ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.transferCert ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} TC
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.characterCert ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.characterCert ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Conduct
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.migrationCert ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.migrationCert ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Migration
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.noDuesSlip ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.noDuesSlip ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} No-Dues
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {s.status === 'WITHDRAWN' ? (
                            <span className="text-xs text-[#9B948D] italic font-medium">Archived to Alumni Vault</span>
                          ) : (
                            <button
                              onClick={() => handleOpenExitModal(s)}
                              className="px-3 py-1.5 rounded-lg border border-[#D5B3BC] text-[#682038] hover:bg-[#F4ECEE] font-semibold text-xs transition-colors inline-flex items-center gap-1"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-[#BA1A1A]" />
                              <span>Process Exit / TC</span>
                            </button>
                          )}
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

      {/* SUB-TAB 2: QUOTA RESERVATION SEAT MATRIX VISUALIZER */}
      {subTab === 'seat_matrix' && (
        <div className="space-y-6">
          {slidingToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{slidingToast}</span>
            </div>
          )}

          {/* Program Capacity & Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Sanctioned Intake</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-[#242424]">{totalSeats}</span>
                <span className="text-xs text-[#8B5E3C] font-semibold">AICTE Approved</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Confirmed Allotments</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-600">{totalFilled}</span>
                <span className="text-xs text-emerald-700 font-bold">{occupancyPct}% Filled</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Vacant Seat Pool</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-amber-600">{totalVacant}</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                  Round 3 Sliding
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-medium text-[#6E6862]">Sliding Reallocation</span>
              <button
                onClick={handleExecuteSlidingRound}
                disabled={isSlidingRoundExecuting || totalVacant === 0}
                className="w-full py-2 px-3 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSlidingRoundExecuting ? 'animate-spin' : ''}`} />
                <span>{isSlidingRoundExecuting ? 'Reallocating...' : 'Run Sliding Round'}</span>
              </button>
            </div>
          </div>

          {/* Quota Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotas.map((quota) => {
              const quotaOccupancy = Math.round((quota.filled / quota.sanctioned) * 100);

              return (
                <div key={quota.code} className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${quota.color}15`, color: quota.color }}>
                      {quota.code}
                    </span>
                    <span className="text-xs font-semibold text-[#6E6862]">
                      {quota.percentage}% Statutory Quota
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#242424]">{quota.name}</h4>
                    <div className="flex items-baseline justify-between mt-2 text-xs">
                      <span className="text-[#6E6862]">Seats: <strong className="text-[#242424]">{quota.filled}</strong> / {quota.sanctioned}</span>
                      <span className={`font-bold font-mono ${quota.vacant > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {quota.vacant} Vacant
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#E5DFD7] rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${quotaOccupancy}%`, backgroundColor: quota.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Candidate Allotments Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Confirmed Quota Allotments (Merit Order)
              </h3>
              <span className="text-xs text-[#6E6862]">Deterministic Tie-Break Rules Applied</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Merit Rank</th>
                    <th className="py-3 px-4 font-semibold">Candidate Name</th>
                    <th className="py-3 px-4 font-semibold text-right">Entrance %</th>
                    <th className="py-3 px-4 font-semibold">Allotted Quota</th>
                    <th className="py-3 px-4 font-semibold">Seat Number</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {allotments.map((allot) => (
                    <tr key={allot.rank} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#682038]">#{allot.rank}</td>
                      <td className="py-3.5 px-4 font-bold text-[#242424]">{allot.name}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#242424]">{allot.score.toFixed(1)}%</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#8B5E3C]">{allot.quota}</td>
                      <td className="py-3.5 px-4 font-mono text-[#242424]">{allot.seatCode}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${allot.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                          {allot.status}
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

      {/* SUB-TAB 3: ALUMNI & DIGILOCKER / NAD VAULT */}
      {subTab === 'digilocker' && (
        <div className="space-y-6">
          {/* DigiLocker Official Government Banner */}
          <div className="bg-[#003366] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  DigiLocker & NAD Integration
                </span>
                <span className="text-xs text-amber-300 font-semibold">National Academic Depository (nad.gov.in)</span>
              </div>
              <h3 className="text-base font-bold">Permanent Cryptographic Degree Vault</h3>
              <p className="text-xs text-white/80 max-w-xl">
                Graduating students who clear the Statutory Exit Barrier Guard have their degrees and marksheets digitally signed with institutional private keys and published directly to their DigiLocker National Vault.
              </p>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0">
              <div className="font-mono text-xl font-bold text-amber-300">ORG-DEVLOFT-2026</div>
              <div className="text-[10px] text-white/70">Authorized NAD Issuer ID</div>
            </div>
          </div>

          {/* Alumni Records */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Graduated Alumni Credentials Vault
              </h3>
              <span className="text-xs text-[#6E6862]">Tamper-Proof SHA-256 Hashes</span>
            </div>

            <div className="divide-y divide-[#E5DFD7]">
              {alumniList.map((alumni) => (
                <div key={alumni.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F2]/30 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#682038]">{alumni.enrollmentNo}</span>
                      <h4 className="font-bold text-sm text-[#242424]">{alumni.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                        {alumni.graduationYear}
                      </span>
                    </div>

                    <div className="text-xs text-[#242424] font-medium">{alumni.degreeName}</div>

                    <div className="flex items-center gap-4 text-xs text-[#6E6862] flex-wrap">
                      <span>Cumulative CGPA: <strong className="text-emerald-700 font-mono">{alumni.cgpa.toFixed(2)}</strong></span>
                      {alumni.digiLockerSynced ? (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Check className="w-3 h-3 text-[#003366]" />
                          <span>URI: {alumni.digiLockerUri}</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Awaiting DigiLocker Dispatch
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alumni.digiLockerSynced ? (
                      <>
                        <button
                          onClick={() => setViewQrAlumni(alumni)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#003366] hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-all flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View NAD QR</span>
                        </button>
                        <button
                          onClick={() => alert(`Simulating permanent degree transcript download for ${alumni.name}`)}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-xs font-bold border border-[#E5DFD7] transition-all flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Degree PDF</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePushDigiLocker(alumni.id)}
                        disabled={syncingId === alumni.id}
                        className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{syncingId === alumni.id ? 'Publishing...' : 'Push to DigiLocker'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DigiLocker QR Modal */}
      {viewQrAlumni && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E5DFD7] text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-[#003366]">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#242424]">DigiLocker Verifiable QR Code</h4>
              <p className="text-xs text-[#6E6862]">{viewQrAlumni.name} ({viewQrAlumni.enrollmentNo})</p>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl flex flex-col items-center justify-center space-y-2">
              <div className="w-36 h-36 bg-white border border-[#E5DFD7] rounded-lg p-2 flex items-center justify-center shadow-inner">
                <div className="w-full h-full border-2 border-dashed border-[#003366] flex flex-col items-center justify-center text-[10px] font-mono text-[#003366]">
                  <span>[NAD QR CODE]</span>
                  <span className="text-[8px] text-[#6E6862] mt-1">{viewQrAlumni.verificationHash}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#6E6862]">{viewQrAlumni.digiLockerUri}</span>
            </div>

            <button
              onClick={() => setViewQrAlumni(null)}
              className="w-full py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Statutory Exit Barrier Guard Modal */}
      {selectedStudentForExit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#BA1A1A] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Statutory Student Exit Barrier Guard</h3>
                <p className="text-xs text-[#6E6862]">Mandatory Compliance Barrier (Prevents Accidental Purging)</p>
              </div>
            </div>

            {exitSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#242424]">Student Exit Approved & Archived</h4>
                <p className="text-xs text-[#6E6862] mt-1 mb-5">
                  All 4 statutory exit certificates were verified. The student record has been formally transitioned to WITHDRAWN status.
                </p>
                <button
                  onClick={() => setSelectedStudentForExit(null)}
                  className="px-4 py-2 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] text-xs">
                  <span className="font-semibold text-[#242424]">Student: </span>
                  <span className="font-bold text-[#682038]">{selectedStudentForExit.name}</span> (
                  <span className="font-mono">{selectedStudentForExit.enrollmentNo}</span>)
                </div>

                {exitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{exitError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#242424]">
                    Type Enrollment Number to Confirm Permanent Exit:
                  </label>
                  <input
                    type="text"
                    value={typedAdmissionNo}
                    onChange={(e) => setTypedAdmissionNo(e.target.value)}
                    placeholder={`e.g. ${selectedStudentForExit.enrollmentNo}`}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedStudentForExit(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
                  >
                    Execute Permanent Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
