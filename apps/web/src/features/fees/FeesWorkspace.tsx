import React, { useState } from 'react';
import { MOCK_FEE_DEMANDS, MOCK_UTR_SUBMISSIONS } from '../../mockData';
import { FeeDemandItem, UtrSubmissionItem } from '../../types';
import { CreditCard, CheckCircle, Shield, FileCheck, Lock, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export const FeesWorkspace: React.FC = () => {
  const [demands, setDemands] = useState<FeeDemandItem[]>(MOCK_FEE_DEMANDS);
  const [utrSubmissions, setUtrSubmissions] = useState<UtrSubmissionItem[]>(MOCK_UTR_SUBMISSIONS);
  const [selectedUtr, setSelectedUtr] = useState<UtrSubmissionItem | null>(null);

  // Idempotency simulation state
  const [idempotencyKey, setIdempotencyKey] = useState<string>('a9e1f57b-70dc-4a69-90d2-92c10319ef11');
  const [isLockActive, setIsLockActive] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(60);
  const [duplicateAttemptsBlocked, setDuplicateAttemptsBlocked] = useState(0);

  const handleSimulatePaymentWithIdempotency = () => {
    if (isLockActive) {
      // Duplicate click detected!
      setDuplicateAttemptsBlocked((prev) => prev + 1);
      return;
    }

    // Acquire atomic Redis lock (SET NX EX 60)
    setIsLockActive(true);
    setLockTimeRemaining(60);
    setDuplicateAttemptsBlocked(0);

    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLockActive(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleApproveUtr = (utr: UtrSubmissionItem) => {
    // 1. Mark UTR approved
    setUtrSubmissions((prev) =>
      prev.map((u) => (u.id === utr.id ? { ...u, status: 'APPROVED' } : u))
    );

    // 2. Atomically decrement student due balance
    setDemands((prev) =>
      prev.map((d) =>
        d.enrollmentNo === utr.enrollmentNo
          ? {
              ...d,
              paidAmount: d.paidAmount + utr.amount,
              dueAmount: Math.max(0, d.dueAmount - utr.amount),
              status: d.dueAmount - utr.amount <= 0 ? 'PAID' : 'PARTIAL',
            }
          : d
      )
    );

    setSelectedUtr(null);
  };

  const handleRejectUtr = (utr: UtrSubmissionItem) => {
    setUtrSubmissions((prev) =>
      prev.map((u) => (u.id === utr.id ? { ...u, status: 'REJECTED' } : u))
    );
    setSelectedUtr(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B5E3C]">Dual Collection & Double-Entry Ledger</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Fees, Payment Gateway & Manual UTR Audit</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            Automated gateway webhooks, Bursar manual bank reconciliation desk, and atomic Redis idempotency locks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Double-Entry Balanced Postings</span>
          </span>
        </div>
      </div>

      {/* Strict Idempotency Engine Simulation Callout */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D5B3BC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#682038] text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Strict Idempotency Engine Visualizer (`src/platform/idempotency.service.ts`)
              </h3>
              <p className="text-[11px] text-[#6E6862]">
                Guarantees zero duplicate fee records when parents on flaky mobile connections double-tap Submit.
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulatePaymentWithIdempotency}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ${
              isLockActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-[#682038] hover:bg-[#54192D] text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isLockActive ? 'Simulate Rapid Duplicate Click' : 'Simulate Parent Fee Submission'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
            <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Generated Idempotency Key</span>
            <span className="font-mono text-[11px] text-[#682038] truncate block font-bold mt-0.5">{idempotencyKey}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
            <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Atomic Redis Lock State</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isLockActive ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span className="font-mono font-bold text-[11px] text-[#242424]">
                {isLockActive ? `LOCKED (SET NX EX ${lockTimeRemaining}s)` : 'IDLE / AVAILABLE'}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
            <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Blocked Duplicate Attempts</span>
            <span className="font-mono font-bold text-[11px] text-[#BA1A1A] block mt-0.5">
              {duplicateAttemptsBlocked > 0 ? `${duplicateAttemptsBlocked} duplicate clicks defused safely` : '0 duplicate taps'}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Step Manual UTR Verification Desk */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
              Bursar Manual UTR Verification Desk ({utrSubmissions.length} Transactions)
            </h3>
            <span className="text-[11px] text-[#6E6862]">
              Student balance remains untouched until Bursar audits physical bank statement.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
            Audit Desk Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
              <tr>
                <th className="px-6 py-3.5">Student Details</th>
                <th className="px-6 py-3.5">Bank & Reference</th>
                <th className="px-6 py-3.5">Amount Declared</th>
                <th className="px-6 py-3.5">Submission Time</th>
                <th className="px-6 py-3.5">Audit Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9E1]">
              {utrSubmissions.map((utr) => (
                <tr key={utr.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#242424] text-sm">{utr.studentName}</div>
                    <div className="font-mono text-[11px] text-[#682038]">{utr.enrollmentNo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-[#242424]">{utr.utrReference}</div>
                    <div className="text-[11px] text-[#6E6862]">{utr.bankName}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-sm text-[#242424]">
                    ₹{utr.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-[#6E6862]">{utr.submittedAt}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        utr.status === 'APPROVED'
                          ? 'bg-[#E8F5E9] text-[#16A34A]'
                          : utr.status === 'REJECTED'
                          ? 'bg-[#FFEBEE] text-[#BA1A1A]'
                          : 'bg-[#FEF3C7] text-amber-800'
                      }`}
                    >
                      {utr.status === 'PENDING_VERIFICATION' ? 'Awaiting Audit' : utr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {utr.status === 'PENDING_VERIFICATION' ? (
                      <button
                        onClick={() => setSelectedUtr(utr)}
                        className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white font-semibold text-xs transition-colors"
                      >
                        Audit & Reconcile
                      </button>
                    ) : (
                      <span className="text-xs text-[#9B948D] italic">Ledger Updated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split-Screen Bursar Audit Modal */}
      {selectedUtr && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-[#682038]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Split-Screen UTR Bank Reconciliation Desk</h3>
                <p className="text-xs text-[#6E6862]">Verify UTR bank reference against campus bank statement before ledger cut.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Left: Transaction Details */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] space-y-2 text-xs">
                <div>
                  <span className="text-[#6E6862] block">Student Name:</span>
                  <span className="font-bold text-[#242424] text-sm">{selectedUtr.studentName}</span>
                </div>
                <div>
                  <span className="text-[#6E6862] block">Enrollment Number:</span>
                  <span className="font-mono font-bold text-[#682038]">{selectedUtr.enrollmentNo}</span>
                </div>
                <div>
                  <span className="text-[#6E6862] block">Amount to Credit:</span>
                  <span className="font-mono font-bold text-base text-[#16A34A]">₹{selectedUtr.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#6E6862] block">UTR Transaction Number:</span>
                  <span className="font-mono font-bold text-xs bg-white p-1 rounded border border-[#E5DFD7] block text-[#242424]">
                    {selectedUtr.utrReference}
                  </span>
                </div>
              </div>

              {/* Right: Simulated Receipt Preview */}
              <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#242424]">Receipt Screenshot Preview</div>
                <div className="text-[11px] text-[#6E6862] mt-0.5">Uploaded via 60s Presigned S3 Direct Stream</div>
                <a
                  href="#preview"
                  onClick={(e) => e.preventDefault()}
                  className="mt-3 px-3 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] font-semibold text-xs border border-[#E5DFD7] flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Zoom Document
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E5DFD7]">
              <button
                onClick={() => handleRejectUtr(selectedUtr)}
                className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-[#BA1A1A] text-xs font-bold transition-colors"
              >
                Reject Transaction
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUtr(null)}
                  className="px-4 py-2 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveUtr(selectedUtr)}
                  className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify & Credit Fee Balance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
