import React, { useState } from 'react';
import { MOCK_MARKS } from '../../mockData';
import { MarkRecord } from '../../types';
import { Award, Sliders, CheckCircle2, Lock, ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';

export const ExamsWorkspace: React.FC = () => {
  const [marks, setMarks] = useState<MarkRecord[]>(MOCK_MARKS);
  const [graceAdjustment, setGraceAdjustment] = useState<number>(0);
  const [moderationNotes, setModerationNotes] = useState('Standard bell-curve normalization for CS401 semester exam.');
  const [isModerating, setIsModerating] = useState(false);
  const [moderationComplete, setModerationComplete] = useState(false);

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
    setModerationComplete(true);
    setIsModerating(false);
  };

  const handleLockResults = () => {
    setMarks((prev) => prev.map((m) => ({ ...m, status: 'LOCKED' })));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#682038]/10 text-[#682038] text-xs font-bold font-mono">
              MODULE 04
            </span>
            <span className="text-xs font-semibold text-[#8B5E3C]">Assessment, Grading & Moderation</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Examination, Results & Grade Moderation</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            Internal/external evaluations, dummy script coding, and Dual-Signoff Grade Moderation pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModerating(!isModerating)}
            className="px-3.5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Dual-Signoff Moderation Console</span>
          </button>
          <button
            onClick={handleLockResults}
            className="px-3.5 py-2 rounded-xl border border-[#D5B3BC] text-[#682038] hover:bg-[#F4ECEE] text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Results & Publish</span>
          </button>
        </div>
      </div>

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
              ? 'LOCKED'
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
  );
};
