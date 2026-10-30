import React, { useState } from 'react';
import { MOCK_MARKS } from '../../mockData';
import { MarkRecord } from '../../types';
import {
  Award,
  Sliders,
  CheckCircle2,
  Lock,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Key,
  QrCode,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Layers,
  GraduationCap,
  Clock,
  Printer,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

type ExamTab =
  | 'schemes'
  | 'timetable_seating'
  | 'hall_tickets'
  | 'dummy_coding'
  | 'marks_moderation'
  | 'results_obe';

interface AssessmentComponent {
  code: string;
  name: string;
  maxMarks: number;
  weightage: number; // percentage
  minPassMarks: number;
  type: 'CIE' | 'SEE';
}

interface GradeBand {
  grade: string;
  points: number;
  minMarks: number;
  maxMarks: number;
  description: string;
}

interface ExamScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  shift: 'FORENOON (09:30 - 12:30)' | 'AFTERNOON (14:00 - 17:00)';
  hall: string;
  enrolledStudents: number;
  invigilator: string;
}

interface SeatingBench {
  benchNo: string;
  seatA: { rollNo: string; studentName: string; courseCode: string };
  seatB: { rollNo: string; studentName: string; courseCode: string };
}

interface HallTicketRecord {
  id: string;
  rollNo: string;
  studentName: string;
  program: string;
  semester: string;
  attendancePct: number;
  feeDues: number;
  isEligible: boolean;
  blockReason?: string;
  hallTicketNumber?: string;
  verificationHash?: string;
}

interface DummyScriptMapping {
  scriptId: string;
  realRollNo: string;
  studentName: string;
  courseCode: string;
  dummyCode: string;
  evaluatorScore: number | null;
  status: 'CODED' | 'EVALUATED' | 'DECODED';
}

interface RevaluationRequest {
  id: string;
  rollNo: string;
  studentName: string;
  courseCode: string;
  originalMarks: number;
  originalGrade: string;
  revisedMarks?: number;
  revisedGrade?: string;
  feePaid: boolean;
  status: 'APPLIED' | 'UNDER_REVALUATION' | 'REVISED' | 'RETAINED';
}

const INITIAL_GRADE_BANDS: GradeBand[] = [
  { grade: 'O', points: 10, minMarks: 90, maxMarks: 100, description: 'Outstanding / Exceptional' },
  { grade: 'A+', points: 9, minMarks: 80, maxMarks: 89, description: 'Excellent' },
  { grade: 'A', points: 8, minMarks: 70, maxMarks: 79, description: 'Very Good' },
  { grade: 'B+', points: 7, minMarks: 60, maxMarks: 69, description: 'Good' },
  { grade: 'B', points: 6, minMarks: 55, maxMarks: 59, description: 'Above Average' },
  { grade: 'C', points: 5, minMarks: 50, maxMarks: 54, description: 'Average' },
  { grade: 'P', points: 4, minMarks: 40, maxMarks: 49, description: 'Pass' },
  { grade: 'F', points: 0, minMarks: 0, maxMarks: 39, description: 'Fail / Arrear' },
];

const INITIAL_SCHEDULE: ExamScheduleItem[] = [
  {
    id: 'sch-1',
    courseCode: 'CS401',
    courseTitle: 'Design and Analysis of Algorithms',
    date: '2026-11-18',
    shift: 'FORENOON (09:30 - 12:30)',
    hall: 'Examination Hall A (LH-301)',
    enrolledStudents: 64,
    invigilator: 'Dr. Aris Thorne (Assoc. Prof)',
  },
  {
    id: 'sch-2',
    courseCode: 'CS402',
    courseTitle: 'Database Management Systems',
    date: '2026-11-20',
    shift: 'FORENOON (09:30 - 12:30)',
    hall: 'Examination Hall B (LH-302)',
    enrolledStudents: 64,
    invigilator: 'Prof. Ramesh K. (Asst. Prof)',
  },
  {
    id: 'sch-3',
    courseCode: 'CS403',
    courseTitle: 'Operating Systems & Concurrency',
    date: '2026-11-23',
    shift: 'AFTERNOON (14:00 - 17:00)',
    hall: 'Examination Hall A (LH-301)',
    enrolledStudents: 60,
    invigilator: 'Dr. Sarah Jenkins (Prof)',
  },
];

const INITIAL_BENCHES: SeatingBench[] = [
  {
    benchNo: 'B-01',
    seatA: { rollNo: '2024CSE001', studentName: 'Aarav Sharma', courseCode: 'CS401' },
    seatB: { rollNo: '2024ECE014', studentName: 'Priya Nambiar', courseCode: 'EC401' },
  },
  {
    benchNo: 'B-02',
    seatA: { rollNo: '2024CSE002', studentName: 'Aditi Rao', courseCode: 'CS401' },
    seatB: { rollNo: '2024ECE015', studentName: 'Rohan Mehra', courseCode: 'EC401' },
  },
  {
    benchNo: 'B-03',
    seatA: { rollNo: '2024CSE003', studentName: 'Rohan Kulkarni', courseCode: 'CS401' },
    seatB: { rollNo: '2024ECE016', studentName: 'Ananya Verma', courseCode: 'EC401' },
  },
  {
    benchNo: 'B-04',
    seatA: { rollNo: '2024CSE004', studentName: 'Meera Nair', courseCode: 'CS401' },
    seatB: { rollNo: '2024ECE017', studentName: 'Kunal Kapoor', courseCode: 'EC401' },
  },
];

const INITIAL_HALL_TICKETS: HallTicketRecord[] = [
  {
    id: 'ht-1',
    rollNo: '2024CSE001',
    studentName: 'Aarav Sharma',
    program: 'B.Tech CSE',
    semester: 'Sem 4',
    attendancePct: 91.2,
    feeDues: 0,
    isEligible: true,
    hallTicketNumber: 'HT-2026-CS4-001',
    verificationHash: 'SHA256:8f20b3...a1',
  },
  {
    id: 'ht-2',
    rollNo: '2024CSE002',
    studentName: 'Aditi Rao',
    program: 'B.Tech CSE',
    semester: 'Sem 4',
    attendancePct: 88.5,
    feeDues: 0,
    isEligible: true,
    hallTicketNumber: 'HT-2026-CS4-002',
    verificationHash: 'SHA256:7c19d4...e3',
  },
  {
    id: 'ht-3',
    rollNo: '2024CSE003',
    studentName: 'Rohan Kulkarni',
    program: 'B.Tech CSE',
    semester: 'Sem 4',
    attendancePct: 71.4,
    feeDues: 0,
    isEligible: false,
    blockReason: 'Attendance Shortage (71.4% < 75.0% statutory threshold)',
  },
  {
    id: 'ht-4',
    rollNo: '2024CSE004',
    studentName: 'Meera Nair',
    program: 'B.Tech CSE',
    semester: 'Sem 4',
    attendancePct: 94.0,
    feeDues: 18500,
    isEligible: false,
    blockReason: 'Unpaid Semester Tuition Dues (₹18,500 pending)',
  },
  {
    id: 'ht-5',
    rollNo: '2024CSE005',
    studentName: 'Vikramaditya Verma',
    program: 'B.Tech CSE',
    semester: 'Sem 4',
    attendancePct: 96.5,
    feeDues: 0,
    isEligible: true,
    hallTicketNumber: 'HT-2026-CS4-005',
    verificationHash: 'SHA256:2d99b1...c7',
  },
];

const INITIAL_DUMMY_CODES: DummyScriptMapping[] = [
  { scriptId: 'SC-401-01', realRollNo: '2024CSE001', studentName: 'Aarav Sharma', courseCode: 'CS401', dummyCode: 'DM-7821-CS', evaluatorScore: 42, status: 'EVALUATED' },
  { scriptId: 'SC-401-02', realRollNo: '2024CSE002', studentName: 'Aditi Rao', courseCode: 'CS401', dummyCode: 'DM-9943-CS', evaluatorScore: 46, status: 'EVALUATED' },
  { scriptId: 'SC-401-03', realRollNo: '2024CSE003', studentName: 'Rohan Kulkarni', courseCode: 'CS401', dummyCode: 'DM-1102-CS', evaluatorScore: 33, status: 'EVALUATED' },
  { scriptId: 'SC-401-04', realRollNo: '2024CSE005', studentName: 'Vikramaditya Verma', courseCode: 'CS401', dummyCode: 'DM-5542-CS', evaluatorScore: 49, status: 'EVALUATED' },
];

const INITIAL_REVALUATIONS: RevaluationRequest[] = [
  { id: 'rev-1', rollNo: '2024CSE003', studentName: 'Rohan Kulkarni', courseCode: 'CS401', originalMarks: 58, originalGrade: 'B', revisedMarks: 64, revisedGrade: 'B+', feePaid: true, status: 'REVISED' },
  { id: 'rev-2', rollNo: '2024CSE012', studentName: 'Pooja Hegde', courseCode: 'CS402', originalMarks: 48, originalGrade: 'P', revisedMarks: 48, revisedGrade: 'P', feePaid: true, status: 'RETAINED' },
  { id: 'rev-3', rollNo: '2024CSE019', studentName: 'Tanya Sengupta', courseCode: 'CS401', originalMarks: 37, originalGrade: 'F', feePaid: true, status: 'UNDER_REVALUATION' },
];

export const ExamsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ExamTab>('marks_moderation');
  const [marks, setMarks] = useState<MarkRecord[]>(MOCK_MARKS);
  const [graceAdjustment, setGraceAdjustment] = useState<number>(0);
  const [moderationNotes, setModerationNotes] = useState('Standard bell-curve normalization for CS401 semester exam.');
  const [isModerating, setIsModerating] = useState(false);
  const [selectedHallTicket, setSelectedHallTicket] = useState<HallTicketRecord | null>(null);
  const [coePasskey, setCoePasskey] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [revaluations, setRevaluations] = useState<RevaluationRequest[]>(INITIAL_REVALUATIONS);

  // Compute live statistics
  const totalStudents = marks.length;
  const currentAverage = (
    marks.reduce((acc, m) => acc + (m.moderatedMarks + graceAdjustment), 0) / totalStudents
  ).toFixed(1);
  const passCount = marks.filter((m) => m.moderatedMarks + graceAdjustment >= 50).length;
  const passPercentage = ((passCount / totalStudents) * 100).toFixed(0);

  const handleApplyModeration = () => {
    setMarks((prev) =>
      prev.map((m) => ({
        ...m,
        moderatedMarks: Math.min(100, m.moderatedMarks + graceAdjustment),
        status: 'MODERATED',
      }))
    );
    setIsModerating(false);
  };

  const handleLockResults = () => {
    setMarks((prev) => prev.map((m) => ({ ...m, status: 'LOCKED' })));
  };

  const handleUnlockVault = () => {
    if (coePasskey === 'COE2026' || coePasskey === 'SUPERADMIN') {
      setIsVaultUnlocked(true);
    } else {
      alert('Invalid Controller of Examinations Security Key. Access logged for audit.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B5E3C]">Module 04: Assessment, Grading & Academic Evaluation</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#682038] border border-[#E5DFD7]">
              R-2026 Autonomous & Affiliated
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Examination, Results & OBE Attainment</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            End-to-end evaluation pipeline: assessment schemes, interleaved seating plans, anonymous dummy coding, dual-signoff moderation, and SGPA/CGPA result snapshotting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsModerating(!isModerating)}
            className="px-3.5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Dual-Signoff Moderation</span>
          </button>
          <button
            onClick={handleLockResults}
            className="px-3.5 py-2 rounded-xl border border-[#D5B3BC] text-[#682038] hover:bg-[#F4ECEE] text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Lock className="w-4 h-4" />
            <span>Lock & Snapshot</span>
          </button>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'schemes'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Assessment Schemes & Bands</span>
        </button>

        <button
          onClick={() => setActiveTab('timetable_seating')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'timetable_seating'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>2. Timetable & Interleaved Seating</span>
        </button>

        <button
          onClick={() => setActiveTab('hall_tickets')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hall_tickets'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Eligibility & Hall Tickets</span>
        </button>

        <button
          onClick={() => setActiveTab('dummy_coding')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'dummy_coding'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Key className="w-4 h-4 text-amber-600" />
          <span>4. Anonymous Dummy Coding Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('marks_moderation')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'marks_moderation'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>5. Marks Entry & Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('results_obe')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'results_obe'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>6. Results, SGPA/CGPA & OBE</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ASSESSMENT SCHEMES & GRADING REGULATIONS               */}
      {/* ============================================================== */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase block">CIE : SEE Evaluation Ratio</span>
              <div className="text-2xl font-bold font-mono text-[#242424] mt-1">50 : 50</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Continuous Internal 50 Marks, Semester End Exam 50 Marks</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#16A34A] uppercase block">Minimum Qualifying Threshold</span>
              <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">40% SEE / 50% Agg.</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Mandatory min. 20/50 in End Exam + 50/100 composite to pass</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#682038] uppercase block">Active Regulation Standard</span>
              <div className="text-2xl font-bold font-mono text-[#682038] mt-1">R-2026 CBCS</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">UGC 10-Point Absolute Scale with Letter Grades</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  UGC 10-Point Letter Grading Scale (Regulation R-2026)
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Versioned schema referenced by deterministic SGPA / CGPA calculation engine.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                Immutable Master Definition
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Letter Grade</th>
                    <th className="px-4 py-3 text-center">Grade Points (G_i)</th>
                    <th className="px-4 py-3 text-center">Mark Range (%)</th>
                    <th className="px-4 py-3">Academic Classification</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_GRADE_BANDS.map((band) => (
                    <tr key={band.grade} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3 font-mono font-bold text-[#682038] text-sm">
                        {band.grade}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-sm text-[#242424]">
                        {band.points}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs">
                        {band.minMarks} - {band.maxMarks}%
                      </td>
                      <td className="px-4 py-3 font-medium text-[#242424]">
                        {band.description}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            band.points >= 4
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {band.points >= 4 ? 'CREDIT EARNED' : 'ARREAR / BACKLOG'}
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

      {/* ============================================================== */}
      {/* TAB 2: EXAM TIMETABLE & INTERLEAVED SEATING                    */}
      {/* ============================================================== */}
      {activeTab === 'timetable_seating' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Semester End Examination Timetable & Invigilation Roster
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Published schedule with room capacity enforcement and automated faculty clash check.
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D] flex items-center gap-1.5 self-start">
                <Printer className="w-3.5 h-3.5" />
                <span>Export Timetable PDF</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Course Code & Title</th>
                    <th className="px-4 py-3">Date & Shift</th>
                    <th className="px-4 py-3">Examination Hall</th>
                    <th className="px-4 py-3 text-center">Enrolled</th>
                    <th className="px-4 py-3">Faculty Invigilator</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_SCHEDULE.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-[#682038]">{item.courseCode}</div>
                        <div className="text-xs text-[#242424] font-medium">{item.courseTitle}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#242424]">{item.date}</div>
                        <div className="text-[10px] text-[#6E6862] font-mono">{item.shift}</div>
                      </td>
                      <td className="px-4 py-3 text-[#242424] font-medium">
                        {item.hall}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold">
                        {item.enrolledStudents}
                      </td>
                      <td className="px-4 py-3 text-[#682038] font-medium">
                        {item.invigilator}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          PUBLISHED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interleaved Anti-Malpractice Seating Plan */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#D5B3BC] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD7] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#682038]" />
                  <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                    Interleaved Anti-Cheating Seating Plan (LH-301)
                  </h3>
                </div>
                <p className="text-xs text-[#6E6862]">
                  Alternates candidates from different programs (CSE & ECE) on adjacent seats to eliminate visual cheating.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#682038] text-white text-[11px] font-bold">
                Bench Interleaving Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_BENCHES.map((bench) => (
                <div key={bench.benchNo} className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-2 mb-3">
                    <span className="font-mono font-bold text-xs text-[#682038] bg-[#FAF7F2] px-2 py-0.5 rounded">
                      Bench {bench.benchNo}
                    </span>
                    <span className="text-[10px] text-[#6E6862] font-semibold">2 Seats Allotted</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-800 block">Seat 1 (Course: {bench.seatA.courseCode})</span>
                      <div className="font-bold text-[#242424] mt-0.5">{bench.seatA.studentName}</div>
                      <div className="font-mono text-[10px] text-blue-900">{bench.seatA.rollNo}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-800 block">Seat 2 (Course: {bench.seatB.courseCode})</span>
                      <div className="font-bold text-[#242424] mt-0.5">{bench.seatB.studentName}</div>
                      <div className="font-mono text-[10px] text-amber-900">{bench.seatB.rollNo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ELIGIBILITY & HALL TICKETS                             */}
      {/* ============================================================== */}
      {activeTab === 'hall_tickets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Automated Examination Eligibility Guard & Hall Ticket Desk
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Enforces dual-lock prerequisite: &ge; 75.0% subject attendance threshold AND zero outstanding tuition dues.
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D] flex items-center gap-1.5 self-start">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run Batch Eligibility Audit</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Student Name & Roll No</th>
                    <th className="px-4 py-3 text-center">Attendance %</th>
                    <th className="px-4 py-3 text-center">Fee Dues</th>
                    <th className="px-4 py-3">Eligibility State</th>
                    <th className="px-4 py-3">Hall Ticket Number</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_HALL_TICKETS.map((ht) => (
                    <tr key={ht.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#242424] text-sm">{ht.studentName}</div>
                        <div className="font-mono text-[11px] text-[#682038]">{ht.rollNo} &bull; {ht.program}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span
                          className={`font-bold ${
                            ht.attendancePct >= 75 ? 'text-[#16A34A]' : 'text-[#BA1A1A]'
                          }`}
                        >
                          {ht.attendancePct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {ht.feeDues === 0 ? (
                          <span className="text-emerald-700 font-bold">₹0 (Nil Dues)</span>
                        ) : (
                          <span className="text-red-700 font-bold">₹{ht.feeDues.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {ht.isEligible ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>ELIGIBLE / ISSUED</span>
                          </span>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>BLOCKED</span>
                            </span>
                            <div className="text-[10px] text-red-600 mt-0.5">{ht.blockReason}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {ht.hallTicketNumber ? (
                          <span className="font-bold text-[#242424]">{ht.hallTicketNumber}</span>
                        ) : (
                          <span className="text-[#9B948D] italic">Withheld</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ht.isEligible ? (
                          <button
                            onClick={() => setSelectedHallTicket(ht)}
                            className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#682038] text-[#682038] hover:text-white border border-[#E5DFD7] text-[11px] font-bold transition-all"
                          >
                            View Hall Ticket
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#9B948D] italic">Action Required</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Card for Hall Ticket Preview */}
          {selectedHallTicket && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#682038]" />
                    <h3 className="font-bold text-[#242424] text-base">Digital Hall Ticket & E-Admit Card</h3>
                  </div>
                  <button
                    onClick={() => setSelectedHallTicket(null)}
                    className="text-[#6E6862] hover:text-[#242424] text-xs font-bold px-2 py-1"
                  >
                    Close
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#D5B3BC] bg-[#FAF7F2] space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Candidate Name</span>
                      <span className="text-base font-bold text-[#242424]">{selectedHallTicket.studentName}</span>
                      <div className="font-mono text-[#682038] font-bold">{selectedHallTicket.rollNo}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E5DFD7] text-center">
                      <QrCode className="w-12 h-12 text-[#682038] mx-auto" />
                      <span className="text-[9px] font-mono text-[#6E6862] block mt-1">VERIFIED_SEAL</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5DFD7]">
                    <div>
                      <span className="text-[10px] text-[#6E6862] uppercase block">Hall Ticket No:</span>
                      <span className="font-mono font-bold text-[#242424]">{selectedHallTicket.hallTicketNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6E6862] uppercase block">Exam Center:</span>
                      <span className="font-bold text-[#242424]">Campus Main Exam Hall LH-301</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6E6862] uppercase block">Attendance Certified:</span>
                      <span className="font-mono font-bold text-emerald-700">{selectedHallTicket.attendancePct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6E6862] uppercase block">Bursar Fee Clearance:</span>
                      <span className="font-mono font-bold text-emerald-700">PAID & VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setSelectedHallTicket(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862]"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      alert(`Printing official Hall Ticket for ${selectedHallTicket.studentName}`);
                      setSelectedHallTicket(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF with Seal</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ANONYMOUS DUMMY CODING VAULT                            */}
      {/* ============================================================== */}
      {activeTab === 'dummy_coding' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D5B3BC] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#682038] text-white flex items-center justify-center shadow-sm">
                  <Key className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    Controller-Restricted Dummy Coding Enclave
                  </h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Protects student identity during external evaluation by substituting real roll numbers with random dummy barcodes.
                  </p>
                </div>
              </div>

              {!isVaultUnlocked ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="Enter COE Passkey (COE2026)"
                    value={coePasskey}
                    onChange={(e) => setCoePasskey(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E5DFD7] rounded-lg focus:outline-none focus:border-[#682038]"
                  />
                  <button
                    onClick={handleUnlockVault}
                    className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold"
                  >
                    Unlock De-Anonymization Vault
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Vault Unlocked (Session Audited)</span>
                  </span>
                  <button
                    onClick={() => setIsVaultUnlocked(false)}
                    className="px-3 py-1 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-white"
                  >
                    Lock Vault
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                Script Anonymous Mapping Registry ({INITIAL_DUMMY_CODES.length} Answer Booklets)
              </h3>
              <span className="text-xs text-[#6E6862]">External Valuers only see Dummy Code</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Script Barcode</th>
                    <th className="px-6 py-3.5">Assigned Dummy Code</th>
                    <th className="px-6 py-3.5">Candidate Identity</th>
                    <th className="px-6 py-3.5 text-center">Evaluator Score (50)</th>
                    <th className="px-6 py-3.5 text-right">Coding State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_DUMMY_CODES.map((item) => (
                    <tr key={item.scriptId} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4 font-mono font-bold text-[#242424]">
                        {item.scriptId}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded bg-[#682038]/10 font-mono font-bold text-xs text-[#682038] border border-[#682038]/20">
                          {item.dummyCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isVaultUnlocked ? (
                          <div>
                            <div className="font-bold text-[#242424]">{item.studentName}</div>
                            <div className="font-mono text-[11px] text-[#682038]">{item.realRollNo}</div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#9B948D] italic font-mono">
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>[ENCRYPTED • RESTRICTED ACCESS]</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-[#242424]">
                        {item.evaluatorScore ? `${item.evaluatorScore} / 50` : 'Pending Valuation'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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

      {/* ============================================================== */}
      {/* TAB 5: MARKS ENTRY, MODERATION & CURVE                        */}
      {/* ============================================================== */}
      {activeTab === 'marks_moderation' && (
        <div className="space-y-6">
          {/* KPI Cards: Live Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Class Pass Percentage</span>
                <TrendingUp className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="text-2xl font-bold text-[#242424] mt-1 font-mono">{passPercentage}%</div>
              <div className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
                {passCount} of {totalStudents} students meeting passing threshold
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Normalized Class Average</span>
                <BarChart3 className="w-4 h-4 text-[#682038]" />
              </div>
              <div className="text-2xl font-bold text-[#682038] mt-1 font-mono">{currentAverage} / 100</div>
              <div className="text-[11px] text-[#6E6862] mt-0.5">
                Includes +{graceAdjustment} grace moderation adjustment
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Moderation Sign-off State</span>
                <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
              </div>
              <div className="text-2xl font-bold text-[#242424] mt-1 font-mono">
                {marks.every((m) => m.status === 'LOCKED')
                  ? 'LOCKED & SNAPSHOTTED'
                  : marks.some((m) => m.status === 'MODERATED')
                  ? 'HOD SIGNED'
                  : 'DRAFT'}
              </div>
              <div className="text-[11px] text-[#8B5E3C] font-semibold mt-0.5">
                Tier 2: HOD & Controller Approval
              </div>
            </div>
          </div>

          {/* Interactive Moderation Console Panel */}
          {isModerating && (
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#D5B3BC] shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#682038]" />
                  <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                    HOD Grade Moderation Console (CS401 Algorithms)
                  </h3>
                </div>
                <span className="text-xs text-[#6E6862]">Dual-Signoff Workflow</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#242424]">Grace / Curve Adjustment:</span>
                    <span className="font-mono text-[#682038] font-bold">+{graceAdjustment} Marks</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={graceAdjustment}
                    onChange={(e) => setGraceAdjustment(Number(e.target.value))}
                    className="w-full accent-[#682038] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#9B948D] font-mono">
                    <span>0 Marks (Raw)</span>
                    <span>+2 Marks (Standard)</span>
                    <span>+5 Marks (Maximum Grace)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">HOD Moderation Commentary</label>
                  <input
                    type="text"
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#E5DFD7] rounded-xl focus:outline-none focus:border-[#682038]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-[#E5DFD7]">
                <button
                  onClick={() => setIsModerating(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyModeration}
                  className="px-4 py-2 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Apply HOD Sign-off & Recalculate SGPA</span>
                </button>
              </div>
            </div>
          )}

          {/* Marks Registry Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                CS401 Semester Marks Registry ({marks.length} Students)
              </h3>
              <span className="text-xs text-[#6E6862]">Internal (50) + External (50) = Total (100)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Student Details</th>
                    <th className="px-6 py-3.5 text-center">Internal (50)</th>
                    <th className="px-6 py-3.5 text-center">External (50)</th>
                    <th className="px-6 py-3.5 text-center">Moderated Marks</th>
                    <th className="px-6 py-3.5 text-center">Grade & Points</th>
                    <th className="px-6 py-3.5 text-right">Moderation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {marks.map((m) => (
                    <tr key={m.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{m.studentName}</div>
                        <div className="font-mono text-[11px] text-[#682038]">{m.enrollmentNo}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-medium">{m.internalMarks}</td>
                      <td className="px-6 py-4 text-center font-mono font-medium">{m.externalMarks}</td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-[#682038] text-sm">
                        {Math.min(100, m.moderatedMarks + (isModerating ? graceAdjustment : 0))}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] font-semibold font-mono text-xs border border-[#E5DFD7]">
                          {m.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            m.status === 'LOCKED'
                              ? 'bg-[#E8F5E9] text-[#16A34A]'
                              : m.status === 'MODERATED'
                              ? 'bg-[#FEF3C7] text-amber-800'
                              : 'bg-[#F4ECEE] text-[#682038]'
                          }`}
                        >
                          {m.status}
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

      {/* ============================================================== */}
      {/* TAB 6: RESULTS, SGPA/CGPA, REVALUATION & OBE ATTAINMENT        */}
      {/* ============================================================== */}
      {activeTab === 'results_obe' && (
        <div className="space-y-6">
          {/* Revaluation & Photocopy Desk */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Post-Result Revaluation & Script Photocopy Desk
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Independent re-marking by second examiner. Grade revised if variance &ge; 5 marks.
                </p>
              </div>
              <button
                onClick={() => {
                  alert('Opening revaluation application portal for students');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D] flex items-center gap-1.5 self-start"
              >
                <span>New Revaluation Entry</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Applicant & Roll No</th>
                    <th className="px-4 py-3">Course Code</th>
                    <th className="px-4 py-3 text-center">Original Marks</th>
                    <th className="px-4 py-3 text-center">Revised Marks</th>
                    <th className="px-4 py-3">Revaluation Fee</th>
                    <th className="px-4 py-3 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {revaluations.map((rev) => (
                    <tr key={rev.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#242424]">{rev.studentName}</div>
                        <div className="font-mono text-[10px] text-[#682038]">{rev.rollNo}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#242424]">
                        {rev.courseCode}
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span className="font-bold text-[#242424]">{rev.originalMarks}</span> ({rev.originalGrade})
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {rev.revisedMarks ? (
                          <span className="font-bold text-[#16A34A]">{rev.revisedMarks} ({rev.revisedGrade})</span>
                        ) : (
                          <span className="text-[#9B948D] italic">Evaluating...</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ₹500 PAID
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rev.status === 'REVISED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rev.status === 'RETAINED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outcome-Based Education (OBE) & CO-PO Attainment Calculator */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#D5B3BC] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD7] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#682038]" />
                  <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                    NBA Outcome-Based Education: Course Outcome (CO) Attainment
                  </h3>
                </div>
                <p className="text-xs text-[#6E6862]">
                  Computes % of class scoring &ge; 60% in questions mapped to each Bloom's taxonomy Course Outcome.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                Target Threshold: 2.50 / 3.00 (Level 3 Attained)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { co: 'CO1', desc: 'Asymptotic Complexity', targetPct: 78, attainmentLevel: 'Level 3 (82%)', color: 'border-emerald-200 bg-emerald-50/50' },
                { co: 'CO2', desc: 'Divide & Conquer', targetPct: 75, attainmentLevel: 'Level 3 (79%)', color: 'border-emerald-200 bg-emerald-50/50' },
                { co: 'CO3', desc: 'Dynamic Programming', targetPct: 65, attainmentLevel: 'Level 2 (68%)', color: 'border-amber-200 bg-amber-50/50' },
                { co: 'CO4', desc: 'Greedy Algorithms', targetPct: 80, attainmentLevel: 'Level 3 (85%)', color: 'border-emerald-200 bg-emerald-50/50' },
                { co: 'CO5', desc: 'NP-Completeness', targetPct: 60, attainmentLevel: 'Level 2 (63%)', color: 'border-amber-200 bg-amber-50/50' },
              ].map((coItem) => (
                <div key={coItem.co} className={`p-4 rounded-xl border ${coItem.color} shadow-sm space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#682038]">{coItem.co}</span>
                    <span className="text-[10px] font-bold text-[#6E6862]">NBA OBE</span>
                  </div>
                  <div className="text-xs font-semibold text-[#242424] truncate">{coItem.desc}</div>
                  <div className="font-mono font-bold text-sm text-[#242424] mt-1">{coItem.attainmentLevel}</div>
                  <div className="w-full bg-[#E5DFD7] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-[#682038] h-full rounded-full"
                      style={{ width: `${coItem.targetPct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
