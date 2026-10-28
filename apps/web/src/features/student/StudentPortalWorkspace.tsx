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
} from 'lucide-react';

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
    overallAttendance: 84.5,
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
    { code: 'EC402', name: 'Digital Signal Processing', conducted: 38, attended: 31, percentage: 81.6, status: 'ELIGIBLE' },
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

  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleDownloadMarksheet = () => {
    setDownloadSuccessToast('Official watermarked transcript compiled and downloaded with SHA-256 seal!');
    setTimeout(() => setDownloadSuccessToast(null), 3500);
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
              <div className="text-lg font-mono font-extrabold text-emerald-300">{student.overallAttendance}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Current CGPA</div>
              <div className="text-lg font-mono font-extrabold text-amber-300">{student.cgpa}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Fee Dues</div>
              <div className="text-lg font-mono font-extrabold text-rose-300">₹{student.feeDues.toLocaleString('en-IN')}</div>
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
          <span>Fee Dues &amp; Receipts</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xl font-black shrink-0">
                {student.overallAttendance}%
              </div>
              <div>
                <span className="text-xs font-bold text-[#6E6862] uppercase tracking-wider">Overall Status</span>
                <h3 className="text-base font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Eligible for Semester Exams
                </h3>
                <p className="text-[11px] text-[#6E6862]">Mandatory regulatory threshold is 75%.</p>
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
            <div className="px-5 py-3 border-b border-[#E5DFD7] bg-[#FAF7F2]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#682038]">
                Subject-Wise Attendance Matrix &amp; Condonation Thresholds
              </h3>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-2.5 px-4">Subject Code &amp; Title</th>
                  <th className="py-2.5 px-4 text-center">Conducted</th>
                  <th className="py-2.5 px-4 text-center">Attended</th>
                  <th className="py-2.5 px-4 text-center">Percentage</th>
                  <th className="py-2.5 px-4 text-right">Exam Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {subjectAttendance.map((sub) => (
                  <tr key={sub.code} className="hover:bg-[#FAF7F2]/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#242424]">{sub.name}</div>
                      <div className="font-mono text-[10px] text-[#8B5E3C]">{sub.code}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{sub.conducted}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{sub.attended}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={sub.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}>
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5DFD7]">
              <div>
                <h3 className="text-base font-bold text-[#242424]">Academic Fee Assessment Ledger</h3>
                <p className="text-xs text-[#6E6862]">Bursar Accounts Division • Academic Year 2026</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Pending Bursar UTR Verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Total Assessed</span>
                <div className="text-base font-mono font-bold text-[#242424]">₹35,000</div>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Paid to Date</span>
                <div className="text-base font-mono font-bold text-emerald-700">₹0</div>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold">Balance Outstanding</span>
                <div className="text-base font-mono font-bold text-rose-700">₹35,000</div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Submitted Payment on Desk (Pending Verification)</span>
              </div>
              <p className="text-[11px] text-[#6E6862]">
                Transaction UTR: <span className="font-mono font-bold text-[#8B5E3C]">UTR20261025774129</span> via HDFC Bank Ltd.
                Student balance is protected and will update atomically once the campus bursar matches the physical bank scroll.
              </p>
            </div>
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
