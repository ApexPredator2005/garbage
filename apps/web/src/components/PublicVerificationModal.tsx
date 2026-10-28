import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle,
  Search,
  ShieldCheck,
  QrCode,
  Building,
  AlertTriangle,
  Download,
} from 'lucide-react';

interface PublicVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({ isOpen, onClose }) => {
  const [queryCode, setQueryCode] = useState('SHA256:deg-789a01-44bf19');
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<{
    found: boolean;
    docTitle: string;
    studentName: string;
    enrollmentNo: string;
    degreeName: string;
    issueDate: string;
    authority: string;
    hash: string;
  } | null>({
    found: true,
    docTitle: 'Bachelor of Technology Degree Certificate',
    studentName: 'Devraj Mukherjee',
    enrollmentNo: '2022CSE001',
    degreeName: 'B.Tech in Computer Science & Engineering (Honors)',
    issueDate: '24 June 2026',
    authority: 'Registrar & Chancellor Office, JSS Academy',
    hash: 'SHA256:deg-789a01-44bf19',
  });

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCode.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (queryCode.includes('rohan') || queryCode.includes('26EC15') || queryCode.includes('ECE')) {
        setVerifiedResult({
          found: true,
          docTitle: 'Statutory Transfer Certificate (TC)',
          studentName: 'Rohan Verma',
          enrollmentNo: 'EN2026-ECE-015',
          degreeName: 'B.Tech Electronics & Communication Engineering',
          issueDate: '28 October 2026',
          authority: 'Central Registrar Office & Directorate of Technical Education',
          hash: 'SHA256:tc-984e2-rohan-2026',
        });
      } else {
        setVerifiedResult({
          found: true,
          docTitle: 'Official Degree & Academic Transcript',
          studentName: 'Devraj Mukherjee',
          enrollmentNo: '2022CSE001',
          degreeName: 'B.Tech in Computer Science & Engineering (Honors)',
          issueDate: '24 June 2026',
          authority: 'Registrar & Chancellor Office, JSS Academy',
          hash: queryCode,
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5DFD7]">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#242424]">Public Document &amp; Marksheet Verification</h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                GET /documents/:id/verify
              </span>
            </div>
            <p className="text-xs text-[#6E6862]">Cryptographic Verification against Institutional Blockchain &amp; Ledger</p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleVerify} className="space-y-3 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#242424]">Enter QR Verification Code or Document Hash:</label>
            <div className="relative">
              <input
                type="text"
                required
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value)}
                placeholder="e.g. SHA256:deg-789a01-44bf19 or CERT-EN2026-ECE-015"
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6E6862]">Try sample:</span>
              <button
                type="button"
                onClick={() => setQueryCode('SHA256:deg-789a01-44bf19')}
                className="text-[10px] font-mono text-[#682038] underline"
              >
                Deg. Cert
              </button>
              <button
                type="button"
                onClick={() => setQueryCode('SHA256:tc-984e2-rohan-2026')}
                className="text-[10px] font-mono text-[#682038] underline"
              >
                Rohan TC
              </button>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Verifying Ledger...' : 'Authenticate Document'}</span>
            </button>
          </div>
        </form>

        {/* Verification Result Display */}
        {verifiedResult && (
          <div className="mt-5 p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold text-xs text-emerald-900">VERIFIED GENUINE &amp; AUTHENTIC RECORD</span>
              </div>
              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Status: VALID
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-[#242424] text-sm">{verifiedResult.docTitle}</div>
              <div className="text-[#6E6862]">
                Issued to: <strong className="text-[#242424]">{verifiedResult.studentName}</strong> (Enrollment:{' '}
                <span className="font-mono">{verifiedResult.enrollmentNo}</span>)
              </div>
              <div className="text-[#6E6862]">
                Program: <strong>{verifiedResult.degreeName}</strong>
              </div>
              <div className="text-[#6E6862]">
                Issuing Authority: <strong>{verifiedResult.authority}</strong> • Date: {verifiedResult.issueDate}
              </div>
            </div>

            <div className="p-2 rounded bg-white border border-emerald-200 flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#6E6862]">SHA-256 Stamp:</span>
              <span className="text-emerald-800 font-bold">{verifiedResult.hash}</span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#E5DFD7] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
          >
            Close Verifier
          </button>
        </div>
      </div>
    </div>
  );
};
