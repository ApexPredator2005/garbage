import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../../mockData';
import { StudentRecord } from '../../types';
import { ShieldAlert, CheckCircle, XCircle, Search, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export const AdmissionsWorkspace: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForExit, setSelectedStudentForExit] = useState<StudentRecord | null>(null);
  const [typedAdmissionNo, setTypedAdmissionNo] = useState('');
  const [exitError, setExitError] = useState<string | null>(null);
  const [exitSuccess, setExitSuccess] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#682038]/10 text-[#682038] text-xs font-bold font-mono">
              MODULE 01
            </span>
            <span className="text-xs font-semibold text-[#8B5E3C]">Devloft Student Information System</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Admissions & SIS Master Registry</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            Student lifecycle management, merit seat matrix, and Statutory Exit Barrier protection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9B948D] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or enrollment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#682038] w-64"
            />
          </div>
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
                const clearedCount = [certs.transferCert, certs.characterCert, certs.migrationCert, certs.noDuesSlip].filter(Boolean).length;
                const isFullyCleared = clearedCount === 4;

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
                        <span className="text-xs text-[#9B948D] italic font-medium">Archived to Cold Storage</span>
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
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs">
                  <div className="font-bold text-[#242424]">{selectedStudentForExit.name}</div>
                  <div className="font-mono text-[#682038]">{selectedStudentForExit.enrollmentNo}</div>
                  <div className="text-[#6E6862] mt-0.5">{selectedStudentForExit.program}</div>
                </div>

                {/* Statutory Checklist Status */}
                <div>
                  <div className="text-xs font-bold text-[#682038] mb-2 uppercase tracking-wider">
                    Statutory Clearance Status (4 Required by Law)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedStudentForExit.exitClearance.transferCert ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-red-50/50 border-red-200 text-red-800'}`}>
                      <span>Transfer Cert (TC)</span>
                      {selectedStudentForExit.exitClearance.transferCert ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedStudentForExit.exitClearance.characterCert ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-red-50/50 border-red-200 text-red-800'}`}>
                      <span>Character Certificate</span>
                      {selectedStudentForExit.exitClearance.characterCert ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedStudentForExit.exitClearance.migrationCert ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-red-50/50 border-red-200 text-red-800'}`}>
                      <span>Migration Certificate</span>
                      {selectedStudentForExit.exitClearance.migrationCert ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedStudentForExit.exitClearance.noDuesSlip ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-red-50/50 border-red-200 text-red-800'}`}>
                      <span>Library & Fee No-Dues</span>
                      {selectedStudentForExit.exitClearance.noDuesSlip ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </div>

                {exitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{exitError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    To authorize exit, re-type enrollment number: <strong className="font-mono text-[#682038]">{selectedStudentForExit.enrollmentNo}</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter enrollment number exactly..."
                    value={typedAdmissionNo}
                    onChange={(e) => setTypedAdmissionNo(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-[#FAF7F2] border border-[#E5DFD7] rounded-lg focus:outline-none focus:border-[#682038]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedStudentForExit(null)}
                    className="px-4 py-2 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="px-4 py-2 rounded-lg bg-[#BA1A1A] hover:bg-[#9B1313] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Enforce Exit Barrier & Execute
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
