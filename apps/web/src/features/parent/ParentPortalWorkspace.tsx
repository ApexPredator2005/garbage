import React, { useState } from 'react';
import {
  Users2,
  Calendar,
  Fingerprint,
  CreditCard,
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Clock,
  Send,
  Building,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface WardData {
  id: string;
  name: string;
  enrollmentNo: string;
  program: string;
  semester: number;
  section: string;
  attendancePercent: number;
  todayStatus: string;
  turnstileTime: string;
  totalFee: number;
  paidFee: number;
  dueFee: number;
  utrPending?: string;
  cgpa: number;
}

const WARDS: Record<string, WardData> = {
  'ward-1': {
    id: 'ward-1',
    name: 'Aarav Sharma',
    enrollmentNo: 'EN2026-CSE-001',
    program: 'B.Tech Computer Science & Engg.',
    semester: 4,
    section: 'A',
    attendancePercent: 91.2,
    todayStatus: 'PRESENT',
    turnstileTime: '08:21 AM (Gate 1 Biometric)',
    totalFee: 75000,
    paidFee: 75000,
    dueFee: 0,
    cgpa: 9.15,
  },
  'ward-2': {
    id: 'ward-2',
    name: 'Diya Patel',
    enrollmentNo: 'EN2026-CSE-002',
    program: 'B.Tech Computer Science & Engg.',
    semester: 4,
    section: 'A',
    attendancePercent: 78.4,
    todayStatus: 'PRESENT',
    turnstileTime: '08:27 AM (Gate 1 Biometric)',
    totalFee: 78000,
    paidFee: 40000,
    dueFee: 38000,
    utrPending: 'UTR20261026987114',
    cgpa: 8.64,
  },
};

export const ParentPortalWorkspace: React.FC = () => {
  const [selectedWardId, setSelectedWardId] = useState<'ward-1' | 'ward-2'>('ward-1');
  const [activeParentTab, setActiveParentTab] = useState<'overview' | 'attendance' | 'fees' | 'leaves' | 'results'>('overview');

  const activeWard = WARDS[selectedWardId];

  // Leave Form State
  const [leaveType, setLeaveType] = useState('MEDICAL');
  const [fromDate, setFromDate] = useState('2026-10-30');
  const [toDate, setToDate] = useState('2026-10-31');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [leaveToast, setLeaveToast] = useState<string | null>(null);

  // Fee Payment UTR State
  const [enteredUtr, setEnteredUtr] = useState('');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [feeToast, setFeeToast] = useState<string | null>(null);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    setLeaveSubmitted(true);
    setLeaveToast(`Leave application submitted for ${activeWard.name}. Class Teacher will review and tag register as EXCUSED_LEAVE.`);
    setTimeout(() => {
      setLeaveToast(null);
      setLeaveReason('');
      setLeaveSubmitted(false);
    }, 4000);
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredUtr.trim()) return;

    setPaymentSubmitted(true);
    setFeeToast(`Payment reference ${enteredUtr} submitted to Campus Bursar desk. Balance will decrement upon bank statement verification.`);
    setTimeout(() => {
      setFeeToast(null);
      setEnteredUtr('');
      setPaymentSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Parent Header & Multi-Ward Sibling Switcher */}
      <div className="bg-gradient-to-r from-[#8B5E3C] to-[#682038] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              <Users2 className="w-3.5 h-3.5" />
              <span>Multi-Ward Parent &amp; Guardian Hub</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Active Ward: {activeWard.name}</h1>
            <p className="text-xs text-white/80">
              {activeWard.enrollmentNo} • {activeWard.program} (Semester {activeWard.semester}, Section {activeWard.section})
            </p>
          </div>

          {/* Sibling Toggle Control */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/20">
            <span className="text-xs font-semibold px-2 text-white/90">Switch Ward:</span>
            <button
              onClick={() => setSelectedWardId('ward-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedWardId === 'ward-1'
                  ? 'bg-white text-[#682038] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Aarav Sharma
            </button>
            <button
              onClick={() => setSelectedWardId('ward-2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedWardId === 'ward-2'
                  ? 'bg-white text-[#682038] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Diya Patel
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Parent Hub */}
      <div className="flex items-center gap-1.5 border-b border-[#E5DFD7] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveParentTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeParentTab === 'overview'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Academic Overview</span>
        </button>
        <button
          onClick={() => setActiveParentTab('attendance')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeParentTab === 'attendance'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Duty-of-Care Attendance ({activeWard.attendancePercent}%)</span>
        </button>
        <button
          onClick={() => setActiveParentTab('fees')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeParentTab === 'fees'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fee Dues &amp; UTR Submission</span>
        </button>
        <button
          onClick={() => setActiveParentTab('leaves')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeParentTab === 'leaves'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Apply Student Leave</span>
        </button>
        <button
          onClick={() => setActiveParentTab('results')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeParentTab === 'results'
              ? 'bg-[#682038] text-white shadow-xs'
              : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Grade Cards &amp; Performance</span>
        </button>
      </div>

      {leaveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{leaveToast}</span>
        </div>
      )}

      {feeToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{feeToast}</span>
        </div>
      )}

      {/* 1. OVERVIEW TAB */}
      {activeParentTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD7] shadow-xs">
              <span className="text-[10px] font-bold text-[#6E6862] uppercase tracking-wider">Attendance Percentage</span>
              <div className="text-2xl font-mono font-black text-emerald-700 mt-1">{activeWard.attendancePercent}%</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Compliant with 75% threshold</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD7] shadow-xs">
              <span className="text-[10px] font-bold text-[#6E6862] uppercase tracking-wider">Today's Morning Roll Call</span>
              <div className="text-base font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{activeWard.todayStatus}</span>
              </div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">{activeWard.turnstileTime}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD7] shadow-xs">
              <span className="text-[10px] font-bold text-[#6E6862] uppercase tracking-wider">Outstanding Dues</span>
              <div
                className={`text-2xl font-mono font-black mt-1 ${
                  activeWard.dueFee === 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                ₹{activeWard.dueFee.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">
                {activeWard.dueFee === 0 ? 'No pending balance' : 'Pending UTR on Desk'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD7] shadow-xs">
              <span className="text-[10px] font-bold text-[#6E6862] uppercase tracking-wider">Cumulative GPA</span>
              <div className="text-2xl font-mono font-black text-[#682038] mt-1">{activeWard.cgpa}</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">First Class with Distinction</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE TAB */}
      {activeParentTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <div>
              <h3 className="text-sm font-bold text-[#242424]">Legal Duty-of-Care Morning Attendance Log</h3>
              <p className="text-xs text-[#6E6862]">Ward: {activeWard.name} • 8:30 AM Roster &amp; Hardware Turnstile</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Verified Present
            </span>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#242424]">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Biometric Entrance Check: {activeWard.turnstileTime}</span>
            </div>
            <p className="text-xs text-[#6E6862] leading-relaxed">
              In accordance with legal duty-of-care guidelines, unexcused absence alerts are dispatched asynchronously via in-app push and verified email notifications only. No SMS gateway delays.
            </p>
          </div>
        </div>
      )}

      {/* 3. FEES TAB */}
      {activeParentTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <div>
              <h3 className="text-sm font-bold text-[#242424]">Online Fee Payment &amp; UTR Submission</h3>
              <p className="text-xs text-[#6E6862]">Direct Two-Step Bursar Verification Queue</p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeWard.dueFee === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              ₹{activeWard.dueFee.toLocaleString('en-IN')} Due
            </span>
          </div>

          {activeWard.dueFee > 0 ? (
            <form onSubmit={handleSubmitUtr} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#242424]">
                  Enter Bank Transaction Reference (UTR / IMPS / UPI Ref):
                </label>
                <input
                  type="text"
                  required
                  value={enteredUtr}
                  onChange={(e) => setEnteredUtr(e.target.value)}
                  placeholder="e.g. UTR20261028994101"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
                <span className="text-[10px] text-[#6E6862]">
                  Balance is frozen until campus bursar matches physical bank statement.
                </span>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit UTR for Bursar Clearance</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>All semester fees for {activeWard.name} are fully settled (₹0.00 outstanding).</span>
            </div>
          )}
        </div>
      )}

      {/* 4. LEAVES TAB */}
      {activeParentTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E5DFD7]">
            <h3 className="text-sm font-bold text-[#242424]">Apply for Student Leave</h3>
            <p className="text-xs text-[#6E6862]">
              Approved leaves automatically credit to class register as EXCUSED_LEAVE.
            </p>
          </div>

          <form onSubmit={handleSubmitLeave} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#242424]">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                >
                  <option value="MEDICAL">Medical Leave</option>
                  <option value="CASUAL">Casual / Family Emergency</option>
                  <option value="ON_DUTY">On-Duty Academic Event</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#242424]">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#242424]">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#242424]">Reason / Medical Description</label>
              <textarea
                required
                rows={3}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Explain the reason for absence..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Leave Request to Class Teacher</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. RESULTS TAB */}
      {activeParentTab === 'results' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <div>
              <h3 className="text-sm font-bold text-[#242424]">Ward Academic Performance &amp; CGPA</h3>
              <p className="text-xs text-[#6E6862]">Terminal Exam Records • Controller of Examinations</p>
            </div>
            <span className="font-mono text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              CGPA: {activeWard.cgpa}
            </span>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#242424]">Semester 3 Grade Card (Class of 2026)</div>
              <div className="text-[11px] text-[#6E6862]">Result Status: FIRST CLASS WITH DISTINCTION</div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-[#682038] text-white text-xs font-bold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
