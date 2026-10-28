import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle,
  Upload,
  User,
  GraduationCap,
  CreditCard,
  Building,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface PublicApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicApplicationModal: React.FC<PublicApplicationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    program: 'B.Tech Computer Science & Engineering',
    category: 'OPEN',
    quota: 'MERIT',
    fullName: '',
    email: '',
    phone: '',
    dob: '2008-05-14',
    parentName: '',
    tenthMarks: '94.2',
    twelfthMarks: '91.8',
    entranceScore: '96.5',
    uploadedFileName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppNo, setSubmittedAppNo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => Math.min(4, prev + 1));
  const handlePrev = () => setStep((prev) => Math.max(1, prev - 1));

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const appNo = `APP-2026-CSE-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedAppNo(appNo);
    }, 800);
  };

  const handleReset = () => {
    setSubmittedAppNo(null);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5DFD7]">
          <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#242424]">Online Undergraduate Admission Portal</h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                AY 2026-27 Open
              </span>
            </div>
            <p className="text-xs text-[#6E6862]">JSS Academy of Technical Education • Autonomous Admissions Cell</p>
          </div>
        </div>

        {submittedAppNo ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-[#242424]">Application Submitted Successfully!</h4>
              <p className="text-xs text-[#6E6862]">
                Your application has entered the deterministic merit allotment queue.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] max-w-sm mx-auto space-y-1">
              <span className="text-[10px] text-[#6E6862] uppercase font-bold">Unique Application Number</span>
              <div className="font-mono text-xl font-black text-[#682038]">{submittedAppNo}</div>
              <p className="text-[11px] text-[#6E6862]">Keep this number safe for merit round tracking.</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
              >
                Close &amp; Return to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-3">
            {/* Step Wizard Bar */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2 rounded-xl border ${step >= 1 ? 'bg-[#682038] text-white font-bold' : 'bg-[#FAF7F2] text-[#6E6862]'}`}>
                1. Program
              </div>
              <div className={`p-2 rounded-xl border ${step >= 2 ? 'bg-[#682038] text-white font-bold' : 'bg-[#FAF7F2] text-[#6E6862]'}`}>
                2. Personal Info
              </div>
              <div className={`p-2 rounded-xl border ${step >= 3 ? 'bg-[#682038] text-white font-bold' : 'bg-[#FAF7F2] text-[#6E6862]'}`}>
                3. Academics
              </div>
              <div className={`p-2 rounded-xl border ${step >= 4 ? 'bg-[#682038] text-white font-bold' : 'bg-[#FAF7F2] text-[#6E6862]'}`}>
                4. Pay &amp; Submit
              </div>
            </div>

            {/* STEP 1: PROGRAM CHOICE */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#242424]">Select Academic Degree Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                  >
                    <option>B.Tech Computer Science &amp; Engineering</option>
                    <option>B.Tech Electronics &amp; Communication</option>
                    <option>B.Tech Mechanical Engineering</option>
                    <option>B.Tech Information Science</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">Reservation Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                    >
                      <option value="OPEN">Open / General (50%)</option>
                      <option value="OBC_NCL">OBC-NCL (27%)</option>
                      <option value="SC">Scheduled Castes (SC - 15%)</option>
                      <option value="ST">Scheduled Tribes (ST - 7.5%)</option>
                      <option value="EWS">Economically Weaker Section (EWS - 10%)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">Seat Quota Channel</label>
                    <select
                      value={formData.quota}
                      onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                    >
                      <option value="MERIT">Government / State Merit Quota</option>
                      <option value="MGMT">Institutional Management Quota</option>
                      <option value="SPORTS">Sports &amp; Cultural Supernumerary</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] text-xs text-[#6E6862]">
                  Seat allotments follow deterministic ranking rules with tie-breaks based on entrance score, mathematics percentile, and date of birth.
                </div>
              </div>
            )}

            {/* STEP 2: PERSONAL INFO */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#242424]">Candidate Full Name (as per 10th Certificate)</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Siddharth Menon"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. siddharth@gmail.com"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">Parent / Guardian Name</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. K. Raghavan Menon"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACADEMICS & MARKS */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">10th / Secondary %</label>
                    <input
                      type="number"
                      value={formData.tenthMarks}
                      onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">12th / PUC %</label>
                    <input
                      type="number"
                      value={formData.twelfthMarks}
                      onChange={(e) => setFormData({ ...formData, twelfthMarks: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424]">CET / JEE Percentile</label>
                    <input
                      type="number"
                      value={formData.entranceScore}
                      onChange={(e) => setFormData({ ...formData, entranceScore: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-[#D5B3BC] rounded-xl text-center space-y-1 bg-[#FAF7F2]/50">
                  <Upload className="w-6 h-6 text-[#8B5E3C] mx-auto" />
                  <div className="text-xs font-bold text-[#242424]">
                    Upload 12th Marksheet &amp; Category Proof (PDF)
                  </div>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, uploadedFileName: e.target.files?.[0]?.name || 'marksheet_scanned.pdf' })
                    }
                    className="text-xs text-[#6E6862] mx-auto block mt-2"
                  />
                  {formData.uploadedFileName && (
                    <div className="text-xs font-bold text-emerald-700">
                      ✓ Attached: {formData.uploadedFileName}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: FEE PAYMENT & SUBMIT */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6E6862]">Online Application Processing Fee:</span>
                    <span className="text-base font-mono font-bold text-[#682038]">₹1,200.00</span>
                  </div>
                  <div className="text-[11px] text-[#6E6862]">
                    Program: <strong>{formData.program}</strong> • Category: <strong>{formData.category}</strong>
                  </div>
                  <div className="text-[11px] text-[#6E6862]">
                    Candidate: <strong>{formData.fullName || 'Prospective Applicant'}</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Razorpay / Cashfree Gateway Simulator: Instant Mock Payment Authorization</span>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5DFD7]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Application...' : 'Pay ₹1,200 & Submit Application'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
