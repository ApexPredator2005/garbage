import React, { useState, useEffect } from 'react';
import { RoleType } from '../types';
import { getStaffDirectory, StaffMember } from '../services/staffDirectory';
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
  Sparkles,
  ArrowRight,
  Check,
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
  { id: 'REGISTRAR', label: 'Dean & Academic Registrar', name: 'K. R. Venkatraman', email: 'registrar@jssate.edu' },
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
  // STRICTLY ONLY TWO LOGIN OPTIONS: Student or Staff
  const [portalType, setPortalType] = useState<'student' | 'staff'>('student');
  const [selectedTenant, setSelectedTenant] = useState(initialTenantId);

  // Dynamic Staff Directory from persistent service
  const [staffDirectory, setStaffDirectory] = useState<StaffMember[]>(() => getStaffDirectory());
  const [selectedStaffId, setSelectedStaffId] = useState<string>(() => {
    const dir = getStaffDirectory();
    const principal = dir.find((s) => s.role === 'PRINCIPAL' && s.status === 'ACTIVE');
    return principal ? principal.id : dir[0]?.id || 'emp-principal';
  });

  // Student Form State
  const [studentIdInput, setStudentIdInput] = useState('rohan.verma@student.jssate.edu');
  const [studentPassword, setStudentPassword] = useState('••••••••••••');

  // Staff Form State
  const [selectedStaffRole, setSelectedStaffRole] = useState<RoleType>('PRINCIPAL');
  const [staffEmailInput, setStaffEmailInput] = useState('principal@jssate.edu');
  const [staffPassword, setStaffPassword] = useState('••••••••••••');

  // Synchronize staff directory whenever toggled or on mount
  useEffect(() => {
    const updatedDir = getStaffDirectory();
    setStaffDirectory(updatedDir);
    const activePrincipal = updatedDir.find((s) => s.role === 'PRINCIPAL' && s.status === 'ACTIVE');
    if (activePrincipal && !updatedDir.some((s) => s.id === selectedStaffId)) {
      setSelectedStaffId(activePrincipal.id);
      setSelectedStaffRole(activePrincipal.role);
      setStaffEmailInput(activePrincipal.email);
    }
  }, [portalType]);

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

  // Password Reset Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const tenantDomains: Record<string, { name: string; domain: string }> = {
    't-1': { name: 'JSS Academy of Technical Education (JSSATE)', domain: 'jssate.campus.edu' },
    't-2': { name: 'JSS College of Arts, Commerce & Science (JSSCACS)', domain: 'jsscacs.campus.edu' },
    't-3': { name: 'Devloft Institute of Technology (DIT)', domain: 'dit.campus.edu' },
  };

  const currentTenant = tenantDomains[selectedTenant] || tenantDomains['t-1'];

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    const matched = staffDirectory.find((s) => s.id === staffId);
    if (matched) {
      setSelectedStaffRole(matched.role);
      setStaffEmailInput(matched.email);
      if (matched.temporaryPassword) {
        setStaffPassword(matched.temporaryPassword);
      }
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
        // Staff login - matched directly against active directory & succession incumbent
        const matched = staffDirectory.find((s) => s.id === selectedStaffId) || staffDirectory.find((s) => s.role === selectedStaffRole);
        const name = matched ? matched.name : 'Institutional Officer';
        const role = matched ? matched.role : selectedStaffRole;
        const email = staffEmailInput || (matched ? matched.email : 'staff@jssate.edu');

        // Privileged roles require 2FA TOTP verification per specification
        const requires2FA = [
          'PRINCIPAL',
          'SUPER_ADMIN',
          'INSTITUTION_ADMIN',
          'ACCOUNTANT',
          'HR_OFFICER',
          'EXAM_CONTROLLER',
        ].includes(role);

        if (requires2FA) {
          setPendingUser({
            name,
            email,
            role,
            tenantId: selectedTenant,
          });
          setTotpCode('');
          setTotpError(null);
          setShowTotpModal(true);
        } else {
          onLogin({
            name,
            email,
            role,
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
    <div className="min-h-screen bg-gradient-to-br from-[#DFE3E6] via-[#EAE6DF] to-[#FED7AA] p-3 sm:p-6 lg:p-10 flex items-center justify-center font-sans relative overflow-hidden selection:bg-[#F97316] selection:text-white">
      {/* Atmospheric Soft Light Aura behind Card */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-white/40 blur-[130px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-[#F97316]/20 blur-[140px] pointer-events-none -z-0" />

      {/* Main Floating Card Container (Directly modeled on the reference image) */}
      <div className="w-full max-w-6xl bg-[#FAF8F5]/92 backdrop-blur-2xl rounded-[40px] border border-white/80 shadow-[0_30px_70px_-15px_rgba(30,20,10,0.15)] p-5 sm:p-8 lg:p-10 relative overflow-hidden z-10">
        {/* Top Right Floating Close Button (Matching circle close button in reference) */}
        <button
          type="button"
          aria-label="Close portal window"
          className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white border border-[#E2DDD5] backdrop-blur-md flex items-center justify-center text-[#242424] hover:text-[#682038] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: Authentication Form (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col justify-between min-h-[580px] pr-0 lg:pr-4">
            {/* Top Brand Pill (Matching the Crextio pill badge) */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D5CDC0] bg-white/90 text-xs text-[#242424] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#682038]" />
                <span className="font-bold text-[#682038]">Devloft Campus</span>
                <span className="text-[#8B8276]">•</span>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="bg-transparent text-[11px] font-semibold text-[#242424] focus:outline-none cursor-pointer pr-1"
                  aria-label="Campus Subdomain"
                >
                  <option value="t-1">jssate.campus.edu</option>
                  <option value="t-2">jsscacs.campus.edu</option>
                  <option value="t-3">dit.campus.edu</option>
                </select>
              </div>
            </div>

            {/* Centered Typography: Title & Subtitle */}
            <div className="text-center my-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#242424] mb-1 font-sans">
                Sign in to portal
              </h1>
              <p className="text-xs text-[#7A7267]">
                Welcome to <strong className="text-[#682038]">{currentTenant.name}</strong>
              </p>
            </div>

            {/* DUAL ROLE TOGGLE (STRICTLY STUDENT OR STAFF ONLY) */}
            <div className="bg-[#EFEAE1] p-1 rounded-full flex max-w-xs mx-auto mb-4 border border-[#DDD5C7] w-full">
              <button
                type="button"
                onClick={() => setPortalType('student')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portalType === 'student'
                    ? 'bg-white text-[#242424] shadow-sm font-extrabold'
                    : 'text-[#7A7267] hover:text-[#242424]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#682038]" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setPortalType('staff')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portalType === 'staff'
                    ? 'bg-[#682038] text-white shadow-sm font-extrabold'
                    : 'text-[#7A7267] hover:text-[#242424]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#FB923C]" />
                <span>Staff</span>
              </button>
            </div>

            {/* Form Fields: Smooth Pill Contours & Inset Labels */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 max-w-md mx-auto w-full">
              {/* Dynamic Identity Input (Student vs Staff) */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#7A7267] ml-4">
                  {portalType === 'student' ? 'Student Email / Roll number' : 'Official Institutional Email'}
                </label>
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
                      ? 'rohan.verma@student.jssate.edu'
                      : 'principal@jssate.edu'
                  }
                  className="w-full px-5 py-3.5 rounded-full bg-white border border-[#E5DFD7] text-xs font-medium text-[#242424] placeholder-[#A39B8F] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/40 shadow-2xs transition-all"
                />
              </div>

              {/* Staff Designation Select (Reveals dynamically when Staff is active) */}
              {portalType === 'staff' && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between ml-4 mr-2">
                    <label className="block text-xs font-medium text-[#7A7267]">
                      Staff Profile &amp; Role
                    </label>
                    <span className="text-[10px] text-[#F97316] font-semibold">
                      {staffDirectory.filter((s) => s.status === 'ACTIVE').length} Active Profiles
                    </span>
                  </div>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => handleStaffSelect(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full bg-white border border-[#E5DFD7] text-xs font-bold text-[#682038] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/40 appearance-none shadow-2xs transition-all cursor-pointer"
                  >
                    {staffDirectory
                      .filter((s) => s.status === 'ACTIVE')
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.designation} — {s.name} [{s.role}]
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Password Input with Trailing Eye Reveal */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-4">
                  <label className="text-xs font-medium text-[#7A7267]">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-[#7A7267] hover:text-[#682038] hover:underline cursor-pointer"
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
                    placeholder="••••••••••••••••••••"
                    className="w-full px-5 py-3.5 pr-12 rounded-full bg-white border border-[#E5DFD7] text-xs font-medium text-[#242424] placeholder-[#A39B8F] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/40 shadow-2xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-[#8A8175] hover:text-[#242424] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button: Vibrant Sunset Orange Pill */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? 'Verifying Credentials...'
                      : portalType === 'student'
                      ? 'Submit'
                      : 'Submit'}
                  </span>
                </button>
              </div>

              {/* Secondary Actions: Dual Rounded Pills (Matching Apple & Google in reference) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenPublicApply}
                  className="w-full py-2.5 px-4 rounded-full border border-[#DDD5C7] bg-white hover:bg-[#FAF7F2] text-[#242424] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5 text-[#682038]" />
                  <span className="truncate">Admissions Apply</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenPublicVerify}
                  className="w-full py-2.5 px-4 rounded-full border border-[#DDD5C7] bg-white hover:bg-[#FAF7F2] text-[#242424] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span className="truncate">Verify QR / Cert</span>
                </button>
              </div>
            </form>

            {/* Bottom Links (Matching "Have any account? Sing in" & "Terms & Conditions" in reference) */}
            <div className="flex items-center justify-between text-xs text-[#7A7267] pt-4 px-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="hover:text-[#242424] cursor-pointer"
              >
                Have any account? <span className="underline font-semibold text-[#242424]">Sign in</span>
              </button>
              <span className="hover:text-[#242424] cursor-pointer">Terms &amp; Conditions</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Campus Image Frame with ALL 4 Floating Widgets from the Reference Pic */}
          <div className="hidden lg:block lg:col-span-6 relative h-[580px]">
            {/* Image Container with Rounded Corners */}
            <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-md border border-[#DDD5C7] group">
              <img
                alt="University scholars and colleagues collaborating"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                className="w-full h-full object-cover object-center filter saturate-[1.05] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />

              {/* Subtle Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

              {/* WIDGET 1: Top-Left Stacked Pills (Dark pill behind + Orange pill in front with dots) */}
              <div className="absolute top-5 left-5 z-20">
                {/* Dark Pill Behind */}
                <div className="absolute top-3 left-6 z-10 px-3.5 py-1.5 rounded-2xl bg-neutral-900/90 text-white/80 text-[10px] font-medium shadow-md flex items-center gap-2 whitespace-nowrap">
                  <span>09:30am-10:00am</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                </div>

                {/* Orange Pill in Front with White Dot */}
                <div className="relative z-20 px-4 py-2.5 rounded-2xl bg-[#F97316] text-white shadow-xl shadow-orange-500/20 flex items-center justify-between gap-3 border border-[#EA580C] min-w-[200px]">
                  <div>
                    <div className="text-xs font-bold leading-tight">Task Review With Team</div>
                    <div className="text-[10px] font-medium text-white/80">09:30am-10:00am</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                </div>
              </div>

              {/* WIDGET 2: Triangular Avatar Cluster on Right (Exact match to reference pic) */}
              <div className="absolute top-[34%] right-8 z-20 flex flex-col items-center select-none">
                {/* Top Avatar Circle */}
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl -mb-2 z-10">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Scholar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Bottom 2 Avatar Circles */}
                <div className="flex -space-x-1">
                  <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Scholar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                      alt="Scholar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* WIDGET 3: Frosted Glass Calendar Strip with Diagonal Stripes (Exact match to reference pic) */}
              <div className="absolute bottom-24 right-6 z-10 w-72 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden text-white select-none">
                {/* Top Row: Days & Numbers */}
                <div className="p-3 pb-2">
                  <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-white/85 mb-1">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span className="text-[#FB923C] font-extrabold">Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm font-bold text-white">
                    <span>22</span>
                    <span>23</span>
                    <span>24</span>
                    <span className="relative text-[#FB923C] font-extrabold">
                      25
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FB923C] shadow-xs" />
                    </span>
                    <span>26</span>
                    <span>27</span>
                    <span>28</span>
                  </div>
                </div>

                {/* Bottom Diagonal Striped Frosted Texture */}
                <div
                  className="h-14 w-full border-t border-white/20"
                  style={{
                    background:
                      'repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.22) 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 9px)',
                  }}
                />
              </div>

              {/* WIDGET 4: White Daily Meeting Card Overlapping Bottom-Left (Exact match to reference pic) */}
              <div className="absolute bottom-8 left-8 z-20 w-60 rounded-2xl bg-white p-4 shadow-2xl border border-white/80 select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#242424]">Daily Meeting</h4>
                    <p className="text-[10px] text-[#7A7267] font-medium mt-0.5">12:00pm-01:00pm</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                </div>
                {/* 4 Overlapping Avatar Bubbles in Horizontal Row */}
                <div className="flex -space-x-1.5 mt-3">
                  <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80"
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA TOTP Verification Modal (Frosted Glass Translucent Window) */}
      {showTotpModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/80 p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
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
              <div className="p-2.5 rounded-xl bg-rose-50/80 backdrop-blur-xs border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
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
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-full border border-white/80 bg-white/60 backdrop-blur-md font-bold text-[#242424] focus:outline-none focus:bg-white/90 focus:ring-2 focus:ring-[#F97316]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTotpModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6E6862] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Verify &amp; Enter Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal (Frosted Glass Translucent Window) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/80 p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
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
              <div className="p-3 rounded-xl bg-emerald-50/80 backdrop-blur-xs border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
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
                    className="w-full text-xs px-4 py-3 rounded-full border border-white/80 bg-white/60 backdrop-blur-md focus:outline-none focus:bg-white/90 focus:ring-2 focus:ring-[#F97316]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6E6862] hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-xs cursor-pointer"
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
