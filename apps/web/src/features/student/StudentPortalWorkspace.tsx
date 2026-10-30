import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Fingerprint,
  Award,
  CreditCard,
  Bell,
  CheckCircle,
  Clock,
  Download,
  FileText,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Building,
  User,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  Check,
  RefreshCw,
} from 'lucide-react';

interface StudentFineItem {
  id: string;
  category: 'ATTENDANCE_SHORTAGE' | 'LIBRARY' | 'REGISTRATION_LATE' | 'DISCIPLINARY';
  title: string;
  description: string;
  relatedEntity: string;
  assessedDate: string;
  assessedBy: string;
  amount: number;
  status: 'UNPAID' | 'PENDING_VERIFICATION' | 'CLEARED';
  utrRef?: string;
  clearedDate?: string;
  receiptNumber?: string;
}

const INITIAL_STUDENT_FINES: StudentFineItem[] = [
  {
    id: 'fn-att-01',
    category: 'ATTENDANCE_SHORTAGE',
    title: 'Attendance Shortage Condonation Fine (EC402 DSP)',
    description: 'Cumulative attendance in EC402 Digital Signal Processing is 68.4% (Threshold: 75%). Condonation fee levied per Academic Regulation §8.4. Clearing this fine and submitting medical justification is required for Semester Exam Hall Ticket issuance.',
    relatedEntity: 'EC402 Digital Signal Processing (68.4% / 75%)',
    assessedDate: '2026-10-22',
    assessedBy: 'Dean of Academic Affairs / Attendance Board',
    amount: 2500,
    status: 'UNPAID',
  },
  {
    id: 'fn-lib-01',
    category: 'LIBRARY',
    title: 'Central Library Overdue Book Fine',
    description: 'Book Accession #LIB-2024-8841 ("Digital Signal Processing: Principles, Algorithms & Applications", Proakis) returned 6 days past the 14-day borrowing period (@ ₹25/day per Library Circulation Rule 3.2).',
    relatedEntity: 'Accession: LIB-2024-8841 (Proakis)',
    assessedDate: '2026-10-24',
    assessedBy: 'Central Library Circulation Counter',
    amount: 150,
    status: 'UNPAID',
  },
  {
    id: 'fn-reg-01',
    category: 'REGISTRATION_LATE',
    title: 'Semester Course Registration Late Surcharge',
    description: 'CBCS elective subject registration and mentor sign-off submitted 2 days after institutional semester registration deadline.',
    relatedEntity: 'Semester 4 Registration Window',
    assessedDate: '2026-08-14',
    assessedBy: 'Office of the Registrar',
    amount: 500,
    status: 'CLEARED',
    utrRef: 'UTR-HDFC-992014',
    clearedDate: '2026-08-16',
    receiptNumber: 'RCP-LATE-2026-084',
  },
  {
    id: 'fn-disc-01',
    category: 'DISCIPLINARY',
    title: 'Laboratory Breakage & Disciplinary Assessment',
    description: 'No breakage, equipment damage, or disciplinary penalty logged across departmental laboratories.',
    relatedEntity: 'ECE Department Laboratories',
    assessedDate: '2026-10-26',
    assessedBy: 'Departmental Lab Superintendent',
    amount: 0,
    status: 'CLEARED',
  },
];

export const StudentPortalWorkspace: React.FC = () => {
  const [activeStudentTab, setActiveStudentTab] = useState<
    'profile' | 'timetable' | 'attendance' | 'fees' | 'exams' | 'notices'
  >('attendance');

  // Student Profile Data
  const student = {
    name: 'Rohan Verma',
    enrollmentNo: 'EN2026-ECE-015',
    rollNo: '26EC15',
    program: 'B.Tech in Electronics & Communication Engineering',
    semester: 4,
    section: 'B',
    batch: '2024 - 2028',
    campus: 'Main Campus (JSSATE)',
    facultyMentor: 'Dr. Priya Nambiar (Dept of ECE)',
    overallAttendance: 81.4,
    cgpa: 8.82,
    feeDues: 35000,
  };

  // Timetable
  const timetable = [
    { period: 1, time: '09:00 - 10:00 AM', course: 'EC401 - Microprocessors & Microcontrollers', faculty: 'Dr. Rajesh Rao', room: 'LH-302' },
    { period: 2, time: '10:00 - 11:00 AM', course: 'EC402 - Digital Signal Processing', faculty: 'Prof. Sunita Patil', room: 'LH-302' },
    { period: 3, time: '11:15 - 12:15 PM', course: 'EC403 - Linear Integrated Circuits', faculty: 'Dr. Anand Joshi', room: 'Lab-ECE-2' },
    { period: 4, time: '01:00 - 02:00 PM', course: 'EC404 - Electromagnetic Waves & Radiating Systems', faculty: 'Dr. Meera Iyer', room: 'LH-302' },
  ];

  // Subject-wise Attendance
  const subjectAttendance = [
    { code: 'EC401', name: 'Microprocessors & Microcontrollers', conducted: 42, attended: 36, percentage: 85.7, status: 'ELIGIBLE' },
    { code: 'EC402', name: 'Digital Signal Processing', conducted: 38, attended: 26, percentage: 68.4, status: 'SHORTAGE_CONDONATION_REQUIRED' },
    { code: 'EC403', name: 'Linear Integrated Circuits', conducted: 30, attended: 26, percentage: 86.7, status: 'ELIGIBLE' },
    { code: 'EC404', name: 'Electromagnetic Waves', conducted: 35, attended: 29, percentage: 82.9, status: 'ELIGIBLE' },
    { code: 'EC405L', name: 'DSP & Circuits Simulation Lab', conducted: 16, attended: 14, percentage: 87.5, status: 'ELIGIBLE' },
  ];

  // Examination Results
  const semesterResults = [
    { code: 'EC301', title: 'Electronic Circuits & Devices', credits: 4, internal: 26, external: 58, total: 84, grade: 'A+', points: 9.0 },
    { code: 'EC302', title: 'Signals, Systems & Transforms', credits: 4, internal: 28, external: 62, total: 90, grade: 'O', points: 10.0 },
    { code: 'EC303', title: 'Network Theory & Synthesis', credits: 3, internal: 24, external: 55, total: 79, grade: 'A', points: 8.0 },
    { code: 'EC304', title: 'Analog Communication Systems', credits: 4, internal: 27, external: 59, total: 86, grade: 'A+', points: 9.0 },
    { code: 'EC305L', title: 'Analog Circuits Laboratory', credits: 2, internal: 29, external: 65, total: 94, grade: 'O', points: 10.0 },
  ];

  const [fines, setFines] = useState<StudentFineItem[]>(INITIAL_STUDENT_FINES);
  const [payingFineModal, setPayingFineModal] = useState<StudentFineItem | null>(null);
  const [enteredFineUtr, setEnteredFineUtr] = useState<string>('');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const pendingFinesTotal = fines
    .filter((f) => f.status === 'UNPAID' || f.status === 'PENDING_VERIFICATION')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalBalancePayable = student.feeDues + pendingFinesTotal;

  const handleDownloadMarksheet = () => {
    setDownloadSuccessToast('Official watermarked transcript compiled and downloaded with SHA-256 seal!');
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  const handlePayFineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFineModal) return;
    const utr = enteredFineUtr.trim() || `UTR-STUDENT-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const rcp = `RCP-FIN-${Math.floor(100000 + Math.random() * 900000)}`;

    setFines((prev) =>
      prev.map((f) =>
        f.id === payingFineModal.id
          ? {
              ...f,
              status: 'PENDING_VERIFICATION',
              utrRef: utr,
              receiptNumber: rcp,
            }
          : f
      )
    );
    setDownloadSuccessToast(
      `Payment proof submitted for "${payingFineModal.title}" (UTR: ${utr}). Bursar receipt acknowledgment ${rcp} generated.`
    );
    setPayingFineModal(null);
    setEnteredFineUtr('');
    setTimeout(() => setDownloadSuccessToast(null), 5000);
  };

  const handleInstantDemoPayFine = (fineItem: StudentFineItem) => {
    const utr = `UPI-INSTANT-${Date.now().toString().slice(-6)}`;
    const rcp = `RCP-CLR-${Math.floor(100000 + Math.random() * 900000)}`;

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineItem.id
          ? {
              ...f,
              status: 'CLEARED',
              utrRef: utr,
              clearedDate: new Date().toISOString().split('T')[0],
              receiptNumber: rcp,
            }
          : f
      )
    );
    setPayingFineModal(null);
    setEnteredFineUtr('');
    setDownloadSuccessToast(
      `Instant Settlement Complete! "${fineItem.title}" has been cleared in your ledger. Official clearance receipt #${rcp} issued.`
    );
    setTimeout(() => setDownloadSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Role Context Callout */}
      <div className="bg-gradient-to-r from-[#682038] to-[#451424] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <GraduationCap className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              <User className="w-3.5 h-3.5" />
              <span>Student Self-Service Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-xs text-white/80">
              {student.enrollmentNo} • Roll No: {student.rollNo} • {student.program} (Sem {student.semester}, Sec {student.section})
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Overall Attendance</div>
              <div className="text-lg font-mono font-extrabold text-amber-300">{student.overallAttendance}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Current CGPA</div>
              <div className="text-lg font-mono font-extrabold text-emerald-300">{student.cgpa}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Total Outstanding Dues</div>
              <div className="text-lg font-mono font-extrabold text-rose-300">
                ₹{totalBalancePayable.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-amber-200 font-semibold">
                (Tuition ₹35k + Fines ₹{pendingFinesTotal.toLocaleString('en-IN')})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation for Student Portal */}
      <div className="flex items-center gap-1.5 border-b border-[#E5DFD7] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveStudentTab('attendance')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStudentTab === 'attendance'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>My Attendance ({student.overallAttendance}%)</span>
        </button>
        <button
          onClick={() => setActiveStudentTab('timetable')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStudentTab === 'timetable'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Class Timetable</span>
        </button>
        <button
          onClick={() => setActiveStudentTab('exams')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStudentTab === 'exams'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Results &amp; Transcripts</span>
        </button>
        <button
          onClick={() => setActiveStudentTab('fees')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStudentTab === 'fees'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fee Dues &amp; Fines (₹{totalBalancePayable.toLocaleString('en-IN')})</span>
          {pendingFinesTotal > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              ₹{pendingFinesTotal.toLocaleString('en-IN')} due
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveStudentTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStudentTab === 'profile'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile &amp; SIS</span>
        </button>
        <button
          onClick={() => setActiveStudentTab('notices')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStudentTab === 'notices'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Campus Notices</span>
        </button>
      </div>

      {downloadSuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{downloadSuccessToast}</span>
        </div>
      )}

      {/* 1. ATTENDANCE TAB */}
      {activeStudentTab === 'attendance' && (
        <div className="space-y-4">
          {/* Statutory Attendance Shortage Notice Banner */}
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-rose-700" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-rose-950 text-sm">
                    Subject Attendance Shortage Notice — Condonation Penalty Levied
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900 border border-rose-300">
                    EC402 DSP: 68.4% (&lt; 75%)
                  </span>
                </div>
                <button
                  onClick={() => setActiveStudentTab('fees')}
                  className="px-3 py-1.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-all flex items-center gap-1 self-start sm:self-auto shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Review &amp; Clear ₹2,500 Fine</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-rose-900/90 leading-relaxed">
                Your cumulative attendance in <strong>EC402 Digital Signal Processing is 68.4%</strong>, which is below the statutory 75% examination threshold. In accordance with Institutional Academic Bylaw §8.4, an <strong>Institutional Condonation Fine of ₹2,500</strong> has been applied to your ledger. To be unbarred and issued your Semester Exam Hall Ticket, you must:
                (1) Pay the ₹2,500 fine under the <strong>Fee Dues &amp; Receipts</strong> tab;
                (2) Submit your medical discharge certificate to the Dean of Academic Affairs for condonation approval.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-mono text-xl font-black shrink-0">
                {student.overallAttendance}%
              </div>
              <div>
                <span className="text-xs font-bold text-[#6E6862] uppercase tracking-wider">Overall Status</span>
                <h3 className="text-base font-bold text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Subject Shortage Present
                </h3>
                <p className="text-[11px] text-[#6E6862]">Overall 81.4%, but EC402 requires condonation.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-xs">
              <span className="text-xs font-bold text-[#6E6862] uppercase tracking-wider">Turnstile Log Today</span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-[#242424]">08:24 AM (Gate 1 Turnstile)</span>
              </div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Biometric turnstile verified on entry.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-xs">
              <span className="text-xs font-bold text-[#6E6862] uppercase tracking-wider">Leaves on Record</span>
              <div className="text-sm font-bold text-[#242424] mt-1">2 Approved Medical Leaves</div>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Credited as EXCUSED_LEAVE in register.</p>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E5DFD7] bg-[#FAF7F2] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#682038]">
                Subject-Wise Attendance Matrix &amp; Condonation Thresholds
              </h3>
              <span className="text-xs text-[#6E6862]">
                Statutory Minimum: <strong>75% per course</strong>
              </span>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-2.5 px-4">Subject Code &amp; Title</th>
                  <th className="py-2.5 px-4 text-center">Conducted</th>
                  <th className="py-2.5 px-4 text-center">Attended</th>
                  <th className="py-2.5 px-4 text-center">Percentage</th>
                  <th className="py-2.5 px-4 text-right">Exam Eligibility &amp; Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {subjectAttendance.map((sub) => {
                  const isShortage = sub.percentage < 75;
                  return (
                    <tr key={sub.code} className="hover:bg-[#FAF7F2]/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#242424]">{sub.name}</div>
                        <div className="font-mono text-[10px] text-[#8B5E3C]">{sub.code}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{sub.conducted}</td>
                      <td className={`py-3 px-4 text-center font-mono font-bold ${isShortage ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {sub.attended}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span className={!isShortage ? 'text-emerald-700' : 'text-rose-700'}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isShortage ? (
                          <div className="inline-flex flex-col items-end gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              DEBARRED (&lt;75%) • ₹2,500 Fine Levied
                            </span>
                            <button
                              onClick={() => setActiveStudentTab('fees')}
                              className="text-[10px] font-bold text-[#682038] hover:underline flex items-center gap-0.5"
                            >
                              <span>Clear Condonation Fine in Fees</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {sub.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TIMETABLE TAB */}
      {activeStudentTab === 'timetable' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div>
                <h3 className="text-sm font-bold text-[#242424]">Daily Class Schedule — Semester 4 (Section B)</h3>
                <p className="text-xs text-[#6E6862]">Room LH-302 / ECE Wing • Academic Year 2026</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Regular Timetable Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {timetable.map((t) => (
                <div key={t.period} className="p-4 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-[#682038] text-white px-2 py-0.5 rounded">
                      Period {t.period}
                    </span>
                    <span className="font-mono text-xs text-[#6E6862]">{t.time}</span>
                  </div>
                  <div className="font-bold text-xs text-[#242424] leading-snug">{t.course}</div>
                  <div className="text-[11px] text-[#6E6862]">
                    Instructor: <strong>{t.faculty}</strong>
                  </div>
                  <div className="text-[10px] font-mono text-[#8B5E3C] bg-white px-2 py-0.5 rounded border border-[#E5DFD7] inline-block">
                    Room: {t.room}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. EXAMS & RESULTS TAB */}
      {activeStudentTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#242424]">Semester 3 Official Terminal Marksheet</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  PUBLISHED &amp; LOCKED
                </span>
              </div>
              <p className="text-xs text-[#6E6862] mt-0.5">
                Controller of Examinations Seal • SGPA: <strong>8.85</strong> • Status:{' '}
                <strong className="text-emerald-700">PASS (FIRST CLASS WITH DISTINCTION)</strong>
              </p>
            </div>
            <button
              onClick={handleDownloadMarksheet}
              className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Marksheet</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4 text-center">Credits</th>
                  <th className="py-2.5 px-4 text-center">Internal (30)</th>
                  <th className="py-2.5 px-4 text-center">External (70)</th>
                  <th className="py-2.5 px-4 text-center">Total (100)</th>
                  <th className="py-2.5 px-4 text-center">Grade</th>
                  <th className="py-2.5 px-4 text-right">Grade Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {semesterResults.map((res) => (
                  <tr key={res.code} className="hover:bg-[#FAF7F2]/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#242424]">{res.title}</div>
                      <div className="font-mono text-[10px] text-[#8B5E3C]">{res.code}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{res.credits}</td>
                    <td className="py-3 px-4 text-center font-mono">{res.internal}</td>
                    <td className="py-3 px-4 text-center font-mono">{res.external}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#242424]">{res.total}</td>
                    <td className="py-3 px-4 text-center font-bold text-[#682038]">{res.grade}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{res.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. FEES & RECEIPTS TAB */}
      {activeStudentTab === 'fees' && (
        <div className="space-y-5">
          {/* Main Fee Ledger Card */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5DFD7]">
              <div>
                <h3 className="text-base font-bold text-[#242424]">Academic Fee &amp; Fines Assessment Ledger</h3>
                <p className="text-xs text-[#6E6862]">Bursar Accounts Division • Academic Year 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Pending Bursar UTR Verification
                </span>
                {pendingFinesTotal > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>₹{pendingFinesTotal.toLocaleString('en-IN')} Fines Pending</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Academic Tuition</span>
                <div className="text-base font-mono font-bold text-[#242424]">₹{student.feeDues.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-[#8B5E3C]">Base Semester 4 Demand</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Statutory Fines</span>
                <div className="text-base font-mono font-bold text-rose-600">₹{pendingFinesTotal.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-rose-800">Attendance &amp; Library Fines</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Fines Cleared</span>
                <div className="text-base font-mono font-bold text-emerald-700">₹500</div>
                <span className="text-[10px] text-emerald-700">Late Reg. Settled</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Total Dues Payable</span>
                <div className="text-base font-mono font-bold text-rose-700">₹{totalBalancePayable.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-[#6E6862]">Net Student Liability</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Base Tuition Payment on Desk (Pending Bank Scroll Verification)</span>
              </div>
              <p className="text-[11px] text-[#6E6862]">
                Transaction UTR: <span className="font-mono font-bold text-[#8B5E3C]">UTR20261025774129</span> via HDFC Bank Ltd.
                Tuition balance will update atomically once the campus bursar matches the physical bank scroll.
              </p>
            </div>
          </div>

          {/* Dedicated Statutory Fines & Institutional Penalties Section */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#8B5E3C]" />
                  <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    Statutory Institutional Fines &amp; Penalties Ledger
                  </h3>
                </div>
                <p className="text-xs text-[#6E6862] mt-0.5">
                  Itemized fines levied due to attendance shortages, library overdue books, registration lapses, and disciplinary audits.
                </p>
              </div>
              <div className="text-xs text-[#6E6862] font-medium">
                Mandatory Clearance for Hall Ticket Release
              </div>
            </div>

            <div className="divide-y divide-[#E5DFD7]">
              {fines.map((fine) => {
                const isAttendance = fine.category === 'ATTENDANCE_SHORTAGE';
                const isLibrary = fine.category === 'LIBRARY';
                const isCleared = fine.status === 'CLEARED';
                const isPending = fine.status === 'PENDING_VERIFICATION';
                const isUnpaid = fine.status === 'UNPAID';

                return (
                  <div key={fine.id} className="p-4 hover:bg-[#FAF7F2]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAttendance
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isLibrary
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : fine.category === 'REGISTRATION_LATE'
                              ? 'bg-slate-100 text-slate-800 border border-slate-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {fine.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs font-bold text-[#242424]">{fine.title}</h4>
                        {isAttendance && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-200 text-rose-950">
                            Hall Ticket Blocker
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#6E6862] leading-relaxed">
                        {fine.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#8B5E3C] pt-0.5 flex-wrap">
                        <span>Assessed By: <strong>{fine.assessedBy}</strong></span>
                        <span>• Date: {fine.assessedDate}</span>
                        {fine.utrRef && <span>• Ref: <strong className="font-mono text-[#242424]">{fine.utrRef}</strong></span>}
                        {fine.receiptNumber && <span>• Receipt: <strong className="font-mono text-emerald-800">{fine.receiptNumber}</strong></span>}
                      </div>
                    </div>

                    <div className="flex items-center md:flex-col md:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <div className={`text-base font-bold font-mono ${isCleared ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {fine.amount > 0 ? `₹${fine.amount.toLocaleString('en-IN')}` : '₹0 (Clear)'}
                        </div>
                        <div className="mt-0.5">
                          {isCleared ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>CLEARED &amp; SETTLED</span>
                            </span>
                          ) : isPending ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>PENDING BURSAR AUDIT</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200 inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-700" />
                              <span>UNPAID • ACTION REQUIRED</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        {isUnpaid && (
                          <>
                            <button
                              onClick={() => setPayingFineModal(fine)}
                              className="px-2.5 py-1 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-[11px] font-bold transition-all shadow-xs"
                            >
                              Pay via UTR
                            </button>
                            <button
                              onClick={() => handleInstantDemoPayFine(fine)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                              title="Instant UPI Payment Simulator"
                            >
                              <Check className="w-3 h-3" />
                              <span>Demo Pay</span>
                            </button>
                          </>
                        )}
                        {isPending && (
                          <button
                            onClick={() => handleInstantDemoPayFine(fine)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Simulate Fast Bursar Approval
                          </button>
                        )}
                        {isCleared && fine.amount > 0 && (
                          <button
                            onClick={() => {
                              setDownloadSuccessToast(`Downloaded official receipt #${fine.receiptNumber} with registrar digital watermark!`);
                              setTimeout(() => setDownloadSuccessToast(null), 3500);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] text-[11px] font-bold transition-all flex items-center gap-1"
                          >
                            <Download className="w-3 h-3 text-[#682038]" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fine Payment Modal Dialog */}
      {payingFineModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div>
                <h3 className="text-base font-bold text-[#242424]">Pay Institutional Fine</h3>
                <p className="text-xs text-[#6E6862]">{payingFineModal.title}</p>
              </div>
              <button
                onClick={() => setPayingFineModal(null)}
                className="w-7 h-7 rounded-lg text-[#6E6862] hover:bg-[#FAF7F2] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] flex items-center justify-between">
              <span className="text-xs text-[#6E6862] font-semibold">Fine Amount:</span>
              <span className="text-xl font-bold font-mono text-rose-700">₹{payingFineModal.amount.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2 text-xs text-[#6E6862] bg-amber-50 p-3 rounded-xl border border-amber-200">
              <p className="font-semibold text-amber-900">Virtual Account / UPI QR Details:</p>
              <div className="font-mono text-[11px] text-[#242424] space-y-0.5">
                <div>UPI ID: <strong className="text-[#682038]">campus.bursar@icici</strong></div>
                <div>Account: <strong>998201948123 (IFSC: ICIC0000102)</strong></div>
                <div>Beneficiary: <strong>JSSATE Institutional Bursar Account</strong></div>
              </div>
            </div>

            <form onSubmit={handlePayFineSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#242424]">
                  Enter Bank Transaction UTR / Ref Number:
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR20261030994182"
                  value={enteredFineUtr}
                  onChange={(e) => setEnteredFineUtr(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleInstantDemoPayFine(payingFineModal)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Instant Pay (Demo)</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Submit UTR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PROFILE & SIS TAB */}
      {activeStudentTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5DFD7]">
            <div className="w-12 h-12 rounded-full bg-[#682038] text-white flex items-center justify-center font-bold text-lg">
              RV
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424]">{student.name}</h3>
              <p className="text-xs text-[#6E6862]">
                Enrollment: {student.enrollmentNo} • Quota: Open Category • Status: Active
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
              <span className="text-[10px] text-[#6E6862] block">Program &amp; Department</span>
              <span className="font-bold text-[#242424]">{student.program}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
              <span className="text-[10px] text-[#6E6862] block">Current Semester &amp; Section</span>
              <span className="font-bold text-[#242424]">Semester {student.semester} (Section {student.section})</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
              <span className="text-[10px] text-[#6E6862] block">Faculty Mentor / Proctor</span>
              <span className="font-bold text-[#242424]">{student.facultyMentor}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
              <span className="text-[10px] text-[#6E6862] block">Campus Affiliation</span>
              <span className="font-bold text-[#242424]">{student.campus}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
              <span className="text-[10px] text-[#6E6862] block">Academic Batch</span>
              <span className="font-bold text-[#242424]">{student.batch}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
              <span className="text-[10px] text-[#6E6862] block">National DigiLocker ID</span>
              <span className="font-mono font-bold text-emerald-700">dl.edu.myschool.26ec15</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. CAMPUS NOTICES TAB */}
      {activeStudentTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <h3 className="text-sm font-bold text-[#242424]">Institution Notices &amp; Circulars</h3>
            <span className="text-xs text-[#6E6862]">Targeted to: B.Tech ECE Cohort</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#242424]">Semester 4 Mid-Term Assessment Schedule</span>
                <span className="text-[10px] text-[#6E6862]">26 Oct 2026</span>
              </div>
              <p className="text-xs text-[#6E6862]">
                The internal mid-term examinations for all Semester 4 engineering programs commence from November 10th. Detailed seating charts will be published on your student portal.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#242424]">National DigiLocker / NAD Credential Sync</span>
                <span className="text-[10px] text-[#6E6862]">22 Oct 2026</span>
              </div>
              <p className="text-xs text-[#6E6862]">
                All semester 1-3 grade sheets have been cryptographically dispatched to the Ministry of Education DigiLocker repository with SHA-256 verification stamps.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
