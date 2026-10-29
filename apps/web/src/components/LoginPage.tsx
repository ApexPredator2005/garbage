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
    <div className="min-h-screen bg-[#FAF7F2] text-[#242424] antialiased flex flex-col justify-between selection:bg-[#682038] selection:text-white relative font-sans overflow-hidden">
      {/* Atmospheric Glowing Ambient Aura Blobs (Creating the slightly blurry transparent frosted depth) */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#F5C443]/25 to-[#E5B537]/15 blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-12 right-1/4 translate-x-1/3 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-[#682038]/20 to-[#8B5E3C]/15 blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[440px] rounded-full bg-[#E7DCCB]/35 blur-[130px] pointer-events-none -z-0" />

      {/* Subtle Top Atmospheric Brand Ribbon */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-xs text-[#6E6862] z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#682038] flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
            JS
          </div>
          <span className="text-sm font-bold tracking-tight text-[#682038]">
            JSSATE Academic Portal
          </span>
          <span className="hidden md:inline-block w-1 h-1 rounded-full bg-[#E5DFD7]" />
          <span className="hidden md:inline-block text-[11px] font-mono tracking-wider text-[#8B5E3C] uppercase">
            Collegiate ERP v4.8
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#242424]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">SSL Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Canvas / Central Floating Translucent Card */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center flex-1 z-10">
        <div className="w-full max-w-6xl mx-auto rounded-[36px] border border-white/60 bg-white/65 backdrop-blur-2xl shadow-[0_24px_70px_-15px_rgba(40,25,20,0.12)] overflow-hidden relative ring-1 ring-[#682038]/5">
          {/* Top Right Floating Frosted Close Button */}
          <button
            type="button"
            aria-label="Close portal window"
            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/40 hover:bg-white/80 border border-white/60 backdrop-blur-xl flex items-center justify-center text-[#242424] hover:text-[#682038] transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 2-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            {/* LEFT COLUMN: Form & Institutional Authentication (6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between space-y-6 bg-white/40 backdrop-blur-xl border-r border-[#E7DCCB]/40">
              <div>
                {/* Top Badges Cluster */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  {/* Oval Pill Badge: Devloft Campus */}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#682038]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs tracking-wide border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5C443]" />
                    <span>Devloft Campus</span>
                  </span>

                  {/* Subdomain Pill with Server Indicator */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[#242424] text-[11px] font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <select
                      value={selectedTenant}
                      onChange={(e) => setSelectedTenant(e.target.value)}
                      className="bg-transparent text-[11px] font-bold text-[#682038] focus:outline-none cursor-pointer pr-1"
                      aria-label="Campus Subdomain"
                    >
                      <option value="t-1">jssate.campus.edu</option>
                      <option value="t-2">jsscacs.campus.edu</option>
                      <option value="t-3">dit.campus.edu</option>
                    </select>
                  </div>
                </div>

                {/* Typography & Welcome Header */}
                <div className="mb-6">
                  <h1 className="text-4xl font-extrabold tracking-tight text-[#242424] leading-tight mb-1.5">
                    Sign in
                  </h1>
                  <p className="text-xs text-[#6E6862]">
                    Welcome to <strong className="text-[#682038]">{currentTenant.name}</strong>
                  </p>
                </div>

                {/* SEGMENTED DUAL ROLE TOGGLE (STRICTLY STUDENT OR STAFF ONLY) */}
                <div className="relative bg-black/[0.04] backdrop-blur-md p-1 rounded-full flex items-center mb-6 max-w-xs border border-white/60 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setPortalType('student')}
                    className={`relative z-10 w-1/2 py-2 text-center text-xs font-bold transition-all rounded-full flex items-center justify-center gap-1.5 ${
                      portalType === 'student'
                        ? 'bg-[#682038] text-white shadow-md'
                        : 'text-[#6E6862] hover:text-[#242424] hover:bg-white/40'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-[#F5C443]" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortalType('staff')}
                    className={`relative z-10 w-1/2 py-2 text-center text-xs font-bold transition-all rounded-full flex items-center justify-center gap-1.5 ${
                      portalType === 'staff'
                        ? 'bg-[#682038] text-white shadow-md'
                        : 'text-[#6E6862] hover:text-[#242424] hover:bg-white/40'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-[#F5C443]" />
                    <span>Staff</span>
                  </button>
                </div>

                {/* Authentication Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Dynamic Identity Field (Student vs Staff) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#242424] ml-2">
                      {portalType === 'student' ? 'Student Email / Roll Number' : 'Staff ID / Official Institutional Email'}
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 absolute left-4 text-[#8B5E3C] pointer-events-none" />
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
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[#242424] text-xs font-medium placeholder-[#8B857E] focus:outline-none focus:bg-white/90 focus:border-[#682038] focus:ring-2 focus:ring-[#F5C443]/40 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Staff Designation Selector (Reveals dynamically when Staff is active) */}
                  {portalType === 'staff' && (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <label className="block text-xs font-bold text-[#242424] ml-2">
                        Executive Designation
                      </label>
                      <div className="relative flex items-center">
                        <Building className="w-4 h-4 absolute left-4 text-[#8B5E3C] pointer-events-none" />
                        <select
                          value={selectedStaffRole}
                          onChange={(e) => handleStaffRoleSelect(e.target.value as RoleType)}
                          className="w-full pl-11 pr-10 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[#682038] text-xs font-bold focus:outline-none focus:bg-white/90 focus:border-[#682038] focus:ring-2 focus:ring-[#F5C443]/40 appearance-none transition-all shadow-2xs cursor-pointer"
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

                  {/* Password Input with Trailing Reveal Toggle */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#242424] ml-2">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 absolute left-4 text-[#8B5E3C] pointer-events-none" />
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
                        className="w-full pl-11 pr-12 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[#242424] text-xs font-medium placeholder-[#8B857E] focus:outline-none focus:bg-white/90 focus:border-[#682038] focus:ring-2 focus:ring-[#F5C443]/40 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#8B857E] hover:text-[#242424] focus:outline-none p-1 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between px-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#6E6862]">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded-[6px] border border-white/80 bg-white/60 text-[#682038] focus:ring-[#F5C443] transition-colors cursor-pointer"
                      />
                      <span>Remember identifier</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-[#682038] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Primary Submit Button: Rich Amber Pill (Matching reference image) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-full bg-[#F5C443] hover:bg-[#E5B537] active:scale-[0.99] text-[#242424] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {isSubmitting
                          ? 'Verifying Credentials...'
                          : portalType === 'student'
                          ? 'Enter Portal →'
                          : 'Authenticate Staff Portal →'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Secondary Actions Row: Public Gateways (Matching Apple / Google pills in reference) */}
                <div className="mt-5 pt-4 border-t border-[#E7DCCB]/60 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onOpenPublicApply}
                    className="w-full py-2.5 px-4 rounded-full border border-white/70 hover:border-[#682038]/40 bg-white/50 hover:bg-white/80 backdrop-blur-md text-[#682038] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#682038]" />
                    <span className="truncate">Admissions Apply</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenPublicVerify}
                    className="w-full py-2.5 px-4 rounded-full border border-white/70 hover:border-[#682038]/40 bg-white/50 hover:bg-white/80 backdrop-blur-md text-[#242424] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span className="truncate">Verify QR / Cert</span>
                  </button>
                </div>
              </div>

              {/* Academic Footer Authentication Guarantee */}
              <div className="pt-4 border-t border-[#E7DCCB]/60 flex flex-wrap items-center justify-between text-[11px] text-[#7E7972] gap-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#682038]" />
                  <span>ISO 27001 Institutional Vault</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hover:text-[#682038] cursor-pointer">Zero-SMS Policy</span>
                  <span>•</span>
                  <span className="hover:text-[#682038] cursor-pointer">Privacy &amp; Governance</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Campus Visual & Floating Archival Frosted Glass Widgets (6 Cols) */}
            <div className="hidden lg:flex lg:col-span-6 p-4 md:p-6 bg-transparent items-center relative min-h-[500px]">
              {/* Hero Frame with Image */}
              <div className="relative w-full h-full min-h-[540px] rounded-[28px] overflow-hidden shadow-inner border border-white/40 group">
                {/* High Aesthetic Campus Students Image from Stitch */}
                <img
                  alt="JSSATE scholars collaborating in university library atrium"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtp9hLhChZ__gRAqdGfZcVrdjRQRj8tgpKNdGLa40mQbpUe5BUuo8b0T8XBS9UPwdBRgIH3ZVZizqA3Nsm7hmtoybHzxypWK8iMWUTg6BBySCfUhPUNoNohN7sTxL8RBrHCe-4TeISpNYumcwE46MyWMixOC4jf8oJImIJE2fXttFMubKXtDpKOgPrSQNgFkYin1w_uV5q5jlD7PluCg_V1HMl00kvoM5fULYP4LlbPPFdT7aT8yxqATjj-0GIIgOfVS_CjLqbyYio"
                  className="w-full h-full object-cover object-center filter saturate-[1.05] brightness-[0.96] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                {/* Warm Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 pointer-events-none" />

                {/* Floating Widget 1: Top Floating Golden Task Pill */}
                <div className="absolute top-5 left-5 z-20">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#F5C443]/90 hover:bg-[#F5C443] backdrop-blur-xl text-[#242424] shadow-lg shadow-black/20 border border-white/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#242424] animate-pulse" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Task Review With Team</div>
                      <div className="text-[10px] font-medium text-[#4A3D18]">09:30am - 10:00am</div>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 2: Overlapping Circular Avatar Bubbles on Top Right */}
                <div className="absolute top-5 right-5 z-20 flex -space-x-2 bg-black/35 backdrop-blur-xl p-1.5 rounded-full border border-white/25 shadow-lg">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#682038] text-white flex items-center justify-center text-[10px] font-bold">
                    KA
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#8B5E3C] text-white flex items-center justify-center text-[10px] font-bold">
                    MC
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">
                    DR
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F5C443] text-[#242424] flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                    +4
                  </div>
                </div>

                {/* Floating Widget 3: Frosted Glass Weekly Calendar Strip (Center/Upper Overlay) */}
                <div className="absolute top-24 left-5 right-5 z-20 hidden sm:block">
                  <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-4 border border-white/40 shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-2.5 px-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-white drop-shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-[#F5C443]" />
                        <span>Academic Cycle: Fall 2026</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#F5C443] font-bold drop-shadow-xs">Term Week 8</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 text-center select-none">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => {
                        const dayNum = 22 + i;
                        const isWed = d === 'Wed';
                        return (
                          <div
                            key={d}
                            className={`py-2 rounded-xl transition-all ${
                              isWed
                                ? 'bg-[#682038]/90 text-white shadow-lg ring-2 ring-[#F5C443] backdrop-blur-md'
                                : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 shadow-xs'
                            }`}
                          >
                            <p
                              className={`text-[9px] uppercase font-bold tracking-wider ${
                                isWed ? 'text-[#F5C443]' : 'text-white/80'
                              }`}
                            >
                              {d}
                            </p>
                            <p className="text-xs font-extrabold">{dayNum}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Floating Widget 4: Translucent Frosted Card at Bottom: Daily Lecture Roster */}
                <div className="absolute bottom-5 left-5 right-5 z-20">
                  <div className="bg-white/75 backdrop-blur-2xl rounded-[24px] p-4 border border-white/60 shadow-2xl">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/60 flex items-center justify-center text-[#682038] shadow-xs">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#242424] leading-tight">Daily Lecture Roster</h4>
                          <p className="text-[10px] text-[#6E6862] font-medium">12:00pm - 01:00pm • Lecture Hall LH-302</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30 text-emerald-900 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        <span>In Progress</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-black/[0.06] text-[11px] text-[#6E6862]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#242424]">Faculty Roster:</span>
                        <div className="flex -space-x-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#682038] text-white text-[8px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            RV
                          </span>
                          <span className="w-5 h-5 rounded-full bg-[#8B5E3C] text-white text-[8px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            AS
                          </span>
                          <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[8px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            DP
                          </span>
                          <span className="w-5 h-5 rounded-full bg-[#F5C443] text-[#242424] text-[8px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            +4
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#682038]">CS401: Algorithms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Grounding Editorial Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-t border-[#E5DFD7]/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#6E6862]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#682038]">JSS Academy of Technical Education</span>
          <span>•</span>
          <span>© 2026 All rights reserved. Collegiate ERP System.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="hover:text-[#682038] cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#682038] cursor-pointer">Security Architecture</span>
          <span className="hover:text-[#682038] cursor-pointer text-[#682038] font-bold">Academic Accreditations</span>
        </div>
      </footer>

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
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-full border border-white/80 bg-white/60 backdrop-blur-md font-bold text-[#242424] focus:outline-none focus:bg-white/90 focus:ring-2 focus:ring-[#F5C443]"
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
                  className="px-5 py-2.5 rounded-full bg-[#F5C443] hover:bg-[#E5B537] text-[#242424] text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
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
                    className="w-full text-xs px-4 py-3 rounded-full border border-white/80 bg-white/60 backdrop-blur-md focus:outline-none focus:bg-white/90 focus:ring-2 focus:ring-[#F5C443]"
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
                    className="px-5 py-2.5 rounded-full bg-[#F5C443] hover:bg-[#E5B537] text-[#242424] text-xs font-bold shadow-xs cursor-pointer"
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
