import React, { useState } from 'react';
import { MOCK_TIMETABLE_SLOTS } from '../../mockData';
import { TimetableSlotItem, SubstitutionProposal } from '../../types';
import { Calendar, UserPlus, AlertCircle, CheckCircle, Clock, MapPin, Sparkles, BookOpen } from 'lucide-react';

export const AcademicsWorkspace: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlotItem[]>(MOCK_TIMETABLE_SLOTS);
  const [selectedSlotForSub, setSelectedSlotForSub] = useState<TimetableSlotItem | null>(null);
  const [substitutionProposals, setSubstitutionProposals] = useState<SubstitutionProposal[]>([]);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  // Trigger Smart Substitution Assistant
  const handleOpenSubstitutionAssistant = (slot: TimetableSlotItem) => {
    setSelectedSlotForSub(slot);
    setAssignedSuccess(null);

    // Collision Engine: query free faculty in same department & lowest weekly load
    const proposals: SubstitutionProposal[] = [
      {
        slotId: slot.id,
        originalFaculty: slot.facultyName,
        substituteFaculty: 'Prof. Rajesh Nair',
        substituteId: 'fac-sub-1',
        department: 'Computer Science & Engg',
        weeklyLoad: 12,
        period: slot.period,
        matchScore: 98,
      },
      {
        slotId: slot.id,
        originalFaculty: slot.facultyName,
        substituteFaculty: 'Dr. Meenakshi Sundaram',
        substituteId: 'fac-sub-2',
        department: 'Computer Science & Engg',
        weeklyLoad: 14,
        period: slot.period,
        matchScore: 91,
      },
    ];
    setSubstitutionProposals(proposals);
  };

  const handleConfirmSubstitution = (sub: SubstitutionProposal) => {
    // 1-Click atomic assignment without mutating master timetable slot
    setSlots((prev) =>
      prev.map((s) =>
        s.id === sub.slotId ? { ...s, facultyName: `${sub.substituteFaculty} (Sub)`, hasClash: false } : s
      )
    );
    setAssignedSuccess(`Substitution Duty atomically assigned to ${sub.substituteFaculty}. Master timetable preserved.`);
    setTimeout(() => {
      setSelectedSlotForSub(null);
      setAssignedSuccess(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#682038]/10 text-[#682038] text-xs font-bold font-mono">
              MODULE 03
            </span>
            <span className="text-xs font-semibold text-[#8B5E3C]">Choice-Based Credit System & Scheduling</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Academics, CBCS Timetable & Substitutions</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            Collision-free period builder, faculty workload balance, and real-time Smart Substitution Assistant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Collision Engine Active</span>
          </span>
        </div>
      </div>

      {/* Timetable Matrix Grid */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#682038]" />
            <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
              B.Tech CSE — Semester 4 (Section A) Schedule
            </h3>
          </div>
          <span className="text-xs text-[#6E6862]">Room LH-201 / Lab-3</span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all ${
                  slot.hasClash
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-400'
                    : 'bg-[#FAF7F2] border-[#E5DFD7] hover:border-[#682038]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-[#682038]">Period {slot.period}</span>
                  <span className="text-[11px] text-[#6E6862] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {slot.time}
                  </span>
                </div>

                <div className="text-sm font-bold text-[#242424] line-clamp-1">{slot.courseTitle}</div>
                <div className="text-[11px] font-mono font-semibold text-[#8B5E3C] mt-0.5">{slot.courseCode}</div>

                <div className="mt-3 pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#242424] text-[11px]">{slot.facultyName}</div>
                    <div className="text-[10px] text-[#6E6862] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#9B948D]" /> {slot.room}
                    </div>
                  </div>

                  {slot.hasClash ? (
                    <button
                      onClick={() => handleOpenSubstitutionAssistant(slot)}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Substitute</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubstitutionAssistant(slot)}
                      className="p-1 rounded text-[#9B948D] hover:text-[#682038] hover:bg-[#E5DFD7]/50"
                      title="Request Substitution"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {slot.hasClash && (
                  <div className="mt-2 text-[10px] text-amber-800 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Faculty on leave today • Substitute required</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Substitution Assistant Modal */}
      {selectedSlotForSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#8B5E3C]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Smart Substitution Assistant</h3>
                <p className="text-xs text-[#6E6862]">
                  Collision engine detects unassigned faculty in same wing/department.
                </p>
              </div>
            </div>

            {assignedSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto mb-3 animate-bounce" />
                <h4 className="text-base font-bold text-[#242424]">{assignedSuccess}</h4>
                <p className="text-xs text-[#6E6862] mt-1">Push notification dispatched to substitute faculty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs">
                  <div className="font-bold text-[#682038]">{selectedSlotForSub.courseTitle} ({selectedSlotForSub.courseCode})</div>
                  <div className="text-[#6E6862] mt-0.5">
                    Period {selectedSlotForSub.period} ({selectedSlotForSub.time}) • Room {selectedSlotForSub.room}
                  </div>
                  <div className="text-[#BA1A1A] font-semibold mt-1">
                    Absent Faculty: {selectedSlotForSub.facultyName}
                  </div>
                </div>

                <div className="text-xs font-bold text-[#682038] uppercase tracking-wider">
                  Ranked Free Faculty Proposals ({substitutionProposals.length} Found)
                </div>

                <div className="space-y-2.5">
                  {substitutionProposals.map((proposal) => (
                    <div
                      key={proposal.substituteId}
                      className="p-3.5 rounded-xl border border-[#E5DFD7] hover:border-[#682038] bg-white transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#242424] text-xs">{proposal.substituteFaculty}</div>
                        <div className="text-[11px] text-[#6E6862]">
                          {proposal.department} • Weekly load: {proposal.weeklyLoad} hrs
                        </div>
                        <div className="text-[10px] text-[#16A34A] font-semibold mt-0.5">
                          ✓ Free during Period {proposal.period} • No timetable clash
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfirmSubstitution(proposal)}
                        className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        1-Click Assign
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedSlotForSub(null)}
                    className="px-4 py-2 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                  >
                    Cancel
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
