import React, { useState } from 'react';
import { X, CloudUpload, CheckCircle, ShieldCheck, Cpu } from 'lucide-react';

interface PresignedUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresignedUploadModal: React.FC<PresignedUploadModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('STUDENT_DOCUMENT');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleReset = () => {
    setFile(null);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center">
            <CloudUpload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#242424]">Presigned S3 Direct Upload Zone</h3>
            <p className="text-xs text-[#6E6862]">Zero Server CPU & RAM Burden (Short-Lived 60s HMAC Direct Stream)</p>
          </div>
        </div>

        {/* Server RAM Metrics Callout */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#16A34A]" />
            <div>
              <div className="text-[10px] text-[#6E6862] uppercase tracking-wider font-semibold">Server Memory Usage</div>
              <div className="text-sm font-mono font-bold text-[#16A34A]">0.0 MB (Bypassed)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#682038]" />
            <div>
              <div className="text-[10px] text-[#6E6862] uppercase tracking-wider font-semibold">Signed Token Expiry</div>
              <div className="text-sm font-mono font-bold text-[#682038]">60 Seconds HMAC</div>
            </div>
          </div>
        </div>

        {uploadSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto mb-3 animate-bounce" />
            <h4 className="text-base font-bold text-[#242424]">Direct Stream Upload Completed!</h4>
            <p className="text-xs text-[#6E6862] max-w-xs mx-auto mt-1 mb-5">
              The file payload was streamed directly from your browser to Cloudflare R2 / S3 without touching API memory buffers.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-semibold shadow-sm"
            >
              Upload Another File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#682038] mb-1">Document Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-medium bg-[#FAF7F2] border border-[#E5DFD7] rounded-lg p-2.5 focus:outline-none focus:border-[#682038]"
              >
                <option value="STUDENT_DOCUMENT">Statutory Student Document (TC / Marksheet)</option>
                <option value="PAYMENT_RECEIPT">Fee Bank Deposit Receipt (UTR Screenshot)</option>
                <option value="EXIT_CERTIFICATE">Campus No-Dues Exit Clearance</option>
                <option value="FACULTY_DOCUMENT">Staff Appointment & Service Record</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-[#D5B3BC] rounded-xl p-6 text-center hover:bg-[#FAF7F2] transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <CloudUpload className="w-8 h-8 text-[#8B5E3C] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#242424]">
                {file ? file.name : 'Click to select or drag & drop document (Max 15MB)'}
              </div>
              <div className="text-[11px] text-[#6E6862] mt-0.5">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for presign direct stream` : 'PDF, PNG, JPG accepted'}
              </div>
            </div>

            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono font-medium">
                  <span className="text-[#682038]">Streaming direct to S3...</span>
                  <span className="text-[#242424] font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#E5DFD7] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#16A34A] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!file || isUploading}
                onClick={handleSimulateUpload}
                className="px-4 py-2 rounded-lg bg-[#682038] hover:bg-[#54192D] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Initiate S3 Direct Stream</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
