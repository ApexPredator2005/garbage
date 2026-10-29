import React, { useState } from 'react';
import { RoleType } from '../types';
import {
  GraduationCap,
  Shield,
  Lock,
  Mail,
  Building,
  KeyRound,
  FileCheck,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  X,
  Calendar,
  Users,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: RoleType; tenantId: string }) => void;
  onOpenPublicApply: () => void;
  onOpenPublicVerify: () => void;
  initialTenantId?: string;
}

const STAFF_ROLES: { id: RoleType; label: string; name: string; email: string }[] = [
  { id: 'PRINCIPAL', label: 'Principal / Campus Director', name: 'Dr. K. S. Sharma', email: 'principal@jssate.edu' },
  { id: 'FACULTY', label: 'Faculty / Classroom Instructor', name: 'Dr. Ramesh Kulkarni', email: 'ramesh.kulkarni@jssate.edu' },
  { id: 'ACCOUNTANT', label: 'Bursar & Accounts Officer', name: 'Vinod Nair', email: 'bursar.accounts@jssate.edu' },
  { id: 'HR_OFFICER', label: 'HR & Personnel Officer', name: 'Pooja Bhatt', email: 'hr.personnel@jssate.edu' },
  { id: 'EXAM_CONTROLLER', label: 'Controller of Examinations (COE)', name: 'Dr. S. K. Sundaram', email: 'coe.exams@jssate.edu' },
  { id: 'REGISTRAR', label: 'Institutional Registrar', name: 'K. R. Venkatraman', email: 'registrar@jssate.edu' },
  { id: 'HOD', label: 'Department Head (HOD)', name: 'Dr. Anand Joshi', email: 'hod.cse@jssate.edu' },
  { id: 'INSTITUTION_ADMIN', label: 'Institution Administrator', name: 'Arvind Nambiar', email: 'admin.ops@jssate.edu' },
  { id: 'SUPER_ADMIN', label: 'Central Platform Administrator', name: 'Platform Administrator', email: 'platform.root@devloft.io' },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenPublicApply,
  onOpenPublicVerify,
  initialTenantId = 't-1',
}) => {
  // Only two primary login options: Student or Staff
  const [portalType, setPortalType] = useState<'student' | 'staff'>('student');
  const [selectedTenant, setSelectedTenant] = useState(initialTenantId);

  // Student Form State
  const [studentIdInput, setStudentIdInput] = useState('rohan.verma@student.jssate.edu');
  const [studentPassword, setStudentPassword] = useState('••••••••••••');

  // Staff Form State
  const [selectedStaffRole, setSelectedStaffRole] = useState<RoleType>('PRINCIPAL');
  const [staffEmailInput, setStaffEmailInput] = useState('principal@jssate.edu');
  const [staffPassword, setStaffPassword] = useState('••••••••••••');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2FA TOTP Modal State (for privileged staff)
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<{
    name: string;
    email: string;
    role: RoleType;
    tenantId: string;
  } | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const tenantDomains: Record<string, { name: string; domain: string }> = {
    't-1': { name: 'JSS Academy of Technical Education (JSSATE)', domain: 'jssate.campus.edu' },
    't-2': { name: 'JSS College of Arts, Commerce & Science (JSSCACS)', domain: 'jsscacs.campus.edu' },
    't-3': { name: 'Devloft Institute of Technology (DIT)', domain: 'dit.campus.edu' },
  };

  const currentTenant = tenantDomains[selectedTenant] || tenantDomains['t-1'];

  const handleStaffRoleSelect = (role: RoleType) => {
    setSelectedStaffRole(role);
    const matched = STAFF_ROLES.find((r) => r.id === role);
    if (matched) {
      setStaffEmailInput(matched.email);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (portalType === 'student') {
        // Direct student login
        onLogin({
          name: 'Rohan Verma',
          email: studentIdInput,
          role: 'STUDENT',
          tenantId: selectedTenant,
        });
      } else {
        // Staff login
        const matched = STAFF_ROLES.find((r) => r.id === selectedStaffRole);
        const name = matched ? matched.name : 'Institutional Officer';

        // Privileged roles require 2FA TOTP verification per specification
        const requires2FA = [
          'PRINCIPAL',
          'SUPER_ADMIN',
          'INSTITUTION_ADMIN',
          'ACCOUNTANT',
          'HR_OFFICER',
          'EXAM_CONTROLLER',
        ].includes(selectedStaffRole);

        if (requires2FA) {
          setPendingUser({
            name,
            email: staffEmailInput,
            role: selectedStaffRole,
            tenantId: selectedTenant,
          });
          setTotpCode('');
          setTotpError(null);
          setShowTotpModal(true);
        } else {
          onLogin({
            name,
            email: staffEmailInput,
            role: selectedStaffRole,
            tenantId: selectedTenant,
          });
        }
      }
    }, 400);
  };

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length < 4) {
      setTotpError('Please enter a valid 6-digit TOTP authenticator code.');
      return;
    }

    if (pendingUser) {
      setShowTotpModal(false);
      onLogin(pendingUser);
    }
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccessMessage(`A single-use, 15-minute expiring reset link has been dispatched to ${resetEmail}.`);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetSuccessMessage(null);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#EDE7DD] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#F5C443] selection:text-[#242424]">
      {/* Outer Floating Rounded Container with soft shadow and bezel */}
      <div className="max-w-5xl w-full bg-[#FAF7F0] rounded-[36px] border border-[#DDD5C7] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* LEFT COLUMN: AUTHENTICATION FORM (Only Student or Staff) */}
        <div className="lg:col-span-6 p-8 sm:p-10 xl:p-12 flex flex-col justify-between space-y-6">
          {/* Top Row: Brand & Campus Subdomain Pill */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="px-4 py-1.5 rounded-full border border-[#D5CDC0] bg-white/80 text-xs font-bold text-[#4A4237] tracking-tight shadow-2xs">
              Devloft Campus
            </div>

            <div className="flex items-center gap-1.5 bg-[#F2EDE3] px-3 py-1.5 rounded-full border border-[#DDD5C7] text-xs">
              <Building className="w-3.5 h-3.5 text-[#682038]" />
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-[#242424] focus:outline-none cursor-pointer pr-1"
                aria-label="Select Campus Subdomain"
              >
                <option value="t-1">jssate.campus.edu</option>
                <option value="t-2">jsscacs.campus.edu</option>
                <option value="t-3">dit.campus.edu</option>
              </select>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-[#242424] tracking-tight">Sign in</h1>
            <p className="text-xs text-[#7A7267]">
              Welcome to <strong className="text-[#682038]">{currentTenant.name}</strong>
            </p>
          </div>

          {/* DUAL OPTIONS TOGGLE: STUDENT OR STAFF ONLY */}
          <div className="bg-[#EBE5DA] p-1.5 rounded-full flex gap-1 border border-[#DDD5C7]">
            <button
              type="button"
              onClick={() => setPortalType('student')}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                portalType === 'student'
                  ? 'bg-white text-[#242424] shadow-sm font-extrabold'
                  : 'text-[#6E6862] hover:text-[#242424]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#2563EB]" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setPortalType('staff')}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                portalType === 'staff'
                  ? 'bg-[#682038] text-white shadow-sm font-extrabold'
                  : 'text-[#6E6862] hover:text-[#242424]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#F5C443]" />
              <span>Staff</span>
            </button>
          </div>

          {/* CREDENTIALS FORM */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* If Staff: Select Staff Role Context */}
            {portalType === 'staff' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A4237] ml-2">Staff Designation</label>
                <div className="relative">
                  <select
                    value={selectedStaffRole}
                    onChange={(e) => handleStaffRoleSelect(e.target.value as RoleType)}
                    className="w-full px-5 py-3.5 rounded-full bg-[#F4EFE6] border border-[#DDD5C7] text-xs font-bold text-[#682038] focus:outline-none focus:ring-2 focus:ring-[#F5C443] cursor-pointer appearance-none"
                  >
                    {STAFF_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} ({r.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email / ID Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4A4237] ml-2">
                {portalType === 'student' ? 'Student Email / Roll Number' : 'Institutional Email'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={portalType === 'student' ? studentIdInput : staffEmailInput}
                  onChange={(e) =>
                    portalType === 'student'
                      ? setStudentIdInput(e.target.value)
                      : setStaffEmailInput(e.target.value)
                  }
                  placeholder={
                    portalType === 'student'
                      ? 'e.g. rohan.verma@student.jssate.edu'
                      : 'e.g. principal@jssate.edu'
                  }
                  className="w-full px-5 py-3.5 rounded-full bg-[#F4EFE6] border border-[#DDD5C7] text-xs text-[#242424] font-medium placeholder-[#A39B8F] focus:outline-none focus:ring-2 focus:ring-[#F5C443]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2">
                <label className="text-xs font-bold text-[#4A4237]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#7A7267] hover:text-[#682038] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={portalType === 'student' ? studentPassword : staffPassword}
                  onChange={(e) =>
                    portalType === 'student'
                      ? setStudentPassword(e.target.value)
                      : setStaffPassword(e.target.value)
                  }
                  placeholder="••••••••••••"
                  className="w-full px-5 py-3.5 pr-12 rounded-full bg-[#F4EFE6] border border-[#DDD5C7] text-xs text-[#242424] font-medium placeholder-[#A39B8F] focus:outline-none focus:ring-2 focus:ring-[#F5C443]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[#8A8175] hover:text-[#242424]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Pill Button (matching gold pill button in reference image) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#F5C443] hover:bg-[#E5B537] active:scale-[0.99] text-[#242424] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Submit'}</span>
            </button>
          </form>

          {/* Secondary Pill Buttons: Public Gateways (matching Apple / Google pill buttons in reference image) */}
          <div className="pt-2 border-t border-[#DDD5C7] space-y-2">
            <div className="text-[10px] font-bold text-[#8A8175] text-center uppercase tracking-wider">
              Public Institutional Gateways
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onOpenPublicApply}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-full border border-[#DDD5C7] bg-[#F7F3EB] hover:bg-[#EFE9DF] text-[11px] font-bold text-[#4A4237] transition-all"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#682038]" />
                <span className="truncate">Admissions Apply</span>
              </button>
              <button
                type="button"
                onClick={onOpenPublicVerify}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-full border border-[#DDD5C7] bg-[#F7F3EB] hover:bg-[#EFE9DF] text-[11px] font-bold text-[#4A4237] transition-all"
              >
                <Search className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="truncate">Verify QR / Cert</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[11px] text-[#8A8175] pt-1">
            <span>Zero-SMS Cost Policy: Active</span>
            <span className="hover:underline cursor-pointer">Terms &amp; Security</span>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO VISUAL PANEL WITH FLOATING WIDGETS (matching reference image) */}
        <div className="hidden lg:flex lg:col-span-6 m-3.5 rounded-[28px] overflow-hidden relative flex-col justify-between p-7 bg-slate-900 shadow-inner">
          {/* Background Photography (collaborative campus / study atmosphere) */}
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
            alt="Campus students collaborating"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Floating Element 1: Top Yellow Pill & Close Button */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="bg-[#F5C443] text-[#242424] px-4 py-2 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-bold">
              <div>
                <div className="leading-tight">Task Review With Team</div>
                <div className="text-[10px] font-normal text-[#4A3D18]">09:30am - 10:00am</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#242424] shrink-0" />
            </div>

            <div className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#242424] flex items-center justify-center shadow-md cursor-pointer transition-colors backdrop-blur-xs">
              <X className="w-4 h-4" />
            </div>
          </div>

          {/* Overlapping Floating Student Avatar Bubbles (matching reference image) */}
          <div className="absolute right-8 top-1/3 z-10 flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg -mb-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Pupil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-1">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                  alt="Pupil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
                  alt="Pupil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Floating Element 2 & 3: Calendar Strip & Roster Card at Bottom */}
          <div className="relative z-10 space-y-3">
            {/* Frosted Glass Weekly Calendar Strip */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3.5 text-white shadow-xl max-w-sm">
              <div className="grid grid-cols-7 text-center text-[10px] uppercase font-bold text-white/80 mb-1">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span className="text-[#F5C443]">Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="grid grid-cols-7 text-center text-sm font-extrabold text-white">
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span className="text-[#F5C443] relative">
                  25
                  <span className="w-1 h-1 rounded-full bg-[#F5C443] absolute -bottom-1 left-1/2 -translate-x-1/2" />
                </span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
              </div>
            </div>

            {/* Bottom White Floating Card: Daily Meeting / Class Roster with Avatar Stack */}
            <div className="bg-white rounded-2xl p-4 shadow-xl max-w-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#242424] flex items-center gap-1.5">
                  <span>Daily Lecture Roster</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5C443]" />
                </div>
                <div className="text-[10px] text-[#7A7267] font-medium">12:00pm - 01:00pm • LH-302</div>
                <div className="flex -space-x-1.5 mt-2">
                  <div className="w-5 h-5 rounded-full bg-[#682038] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                    RV
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                    AS
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                    DP
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#F5C443] text-[#242424] text-[8px] font-bold flex items-center justify-center border border-white">
                    +4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA TOTP Verification Modal */}
      {showTotpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5DFD7] p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#682038]/10 text-[#682038] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Two-Factor Authentication (TOTP)</h3>
                <p className="text-xs text-[#6E6862]">
                  Required for privileged role: <strong className="text-[#682038]">{pendingUser?.role}</strong> ({pendingUser?.name})
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6E6862]">
              Enter the 6-digit verification code from your authenticator app (Google Authenticator / YubiKey).
            </p>

            {totpError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{totpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-full border border-[#DDD5C7] bg-[#F5F2EC] font-bold text-[#242424] focus:outline-none focus:ring-2 focus:ring-[#F5C443]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTotpModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#F5C443] hover:bg-[#E5B537] text-[#242424] text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Verify &amp; Enter Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5DFD7] p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#682038]/10 text-[#682038] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Reset Institutional Password</h3>
                <p className="text-xs text-[#6E6862]">Single-use expiring email token dispatch</p>
              </div>
            </div>

            {resetSuccessMessage ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{resetSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#242424]">Enter Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. employee@jssate.edu"
                    className="w-full text-xs px-4 py-3 rounded-full border border-[#DDD5C7] bg-[#F5F2EC] focus:outline-none focus:ring-2 focus:ring-[#F5C443]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#F5C443] hover:bg-[#E5B537] text-[#242424] text-xs font-bold shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
