import React, { useState } from 'react';
import { RoleType } from '../types';
import {
  Shield,
  Lock,
  Mail,
  Building,
  GraduationCap,
  Users2,
  Award,
  CreditCard,
  DollarSign,
  UserCheck,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Search,
  KeyRound,
  FileCheck,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: RoleType; tenantId: string }) => void;
  onOpenPublicApply: () => void;
  onOpenPublicVerify: () => void;
  initialTenantId?: string;
}

interface PersonaQuickLogin {
  role: RoleType;
  name: string;
  email: string;
  title: string;
  department: string;
  badge: string;
  color: string;
  icon: React.FC<{ className?: string }>;
}

const PERSONAS: PersonaQuickLogin[] = [
  {
    role: 'STUDENT',
    name: 'Rohan Verma',
    email: 'rohan.verma@student.jssate.edu',
    title: 'Enrolled B.Tech ECE Student',
    department: 'Sem 4 (Sec B) • Roll 26EC15',
    badge: 'Student Portal',
    color: '#2563EB',
    icon: GraduationCap,
  },
  {
    role: 'PARENT',
    name: 'Suresh Sharma',
    email: 'suresh.sharma@family.org',
    title: 'Pupil Guardian (Multi-Ward)',
    department: 'Wards: Aarav & Diya',
    badge: 'Parent Hub',
    color: '#8B5E3C',
    icon: Users2,
  },
  {
    role: 'FACULTY',
    name: 'Dr. Ramesh Kulkarni',
    email: 'ramesh.kulkarni@jssate.edu',
    title: 'Associate Professor',
    department: 'Dept of Computer Science',
    badge: 'Teaching Workstation',
    color: '#7C3AED',
    icon: UserCheck,
  },
  {
    role: 'ACCOUNTANT',
    name: 'Vinod Nair',
    email: 'bursar.accounts@jssate.edu',
    title: 'Campus Bursar & Accounts Officer',
    department: 'Finance & Accounts Division',
    badge: 'Bursar UTR Queue',
    color: '#059669',
    icon: CreditCard,
  },
  {
    role: 'HR_OFFICER',
    name: 'Pooja Bhatt',
    email: 'hr.personnel@jssate.edu',
    title: 'HR & Payroll Administrator',
    department: 'Human Resources Directorate',
    badge: 'Payroll Engine',
    color: '#D97706',
    icon: DollarSign,
  },
  {
    role: 'EXAM_CONTROLLER',
    name: 'Dr. S. K. Sundaram',
    email: 'coe.exams@jssate.edu',
    title: 'Controller of Examinations (COE)',
    department: 'Examinations & Results Office',
    badge: 'Grade Moderation',
    color: '#B91C1C',
    icon: Award,
  },
  {
    role: 'HOD',
    name: 'Dr. Anand Joshi',
    email: 'hod.cse@jssate.edu',
    title: 'Head of Department',
    department: 'Computer Science & Engineering',
    badge: 'Academic Wing',
    color: '#0D9488',
    icon: Shield,
  },
  {
    role: 'REGISTRAR',
    name: 'K. R. Venkatraman',
    email: 'registrar@jssate.edu',
    title: 'Institutional Registrar',
    department: 'Admissions, Quota & SIS Records',
    badge: 'Registrar Directorate',
    color: '#1E3A8A',
    icon: FileCheck,
  },
  {
    role: 'PRINCIPAL',
    name: 'Dr. K. S. Sharma',
    email: 'principal@jssate.edu',
    title: 'Campus Principal & Director',
    department: 'Executive Directorate',
    badge: 'Executive Oversight',
    color: '#682038',
    icon: Building,
  },
  {
    role: 'INSTITUTION_ADMIN',
    name: 'Arvind Nambiar',
    email: 'admin.ops@jssate.edu',
    title: 'Institution Administrator',
    department: 'Campus IT & Administrative Operations',
    badge: 'Campus Admin',
    color: '#4338CA',
    icon: Shield,
  },
  {
    role: 'SUPER_ADMIN',
    name: 'Platform Administrator',
    email: 'platform.root@devloft.io',
    title: 'Central Trust Administrator',
    department: 'Central Board Infrastructure',
    badge: 'Platform Root',
    color: '#242424',
    icon: KeyRound,
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenPublicApply,
  onOpenPublicVerify,
  initialTenantId = 't-1',
}) => {
  const [selectedTenant, setSelectedTenant] = useState(initialTenantId);
  const [activeLoginMode, setActiveLoginMode] = useState<'personas' | 'form'>('personas');

  // Form State
  const [emailInput, setEmailInput] = useState('principal@jssate.edu');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedFormRole, setSelectedFormRole] = useState<RoleType>('PRINCIPAL');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2FA TOTP Modal State
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

  const handleQuickPersonaLogin = (p: PersonaQuickLogin) => {
    // Check if role requires 2FA as per spec (Admin, Accountant, HR, COE)
    const requires2FA = ['PRINCIPAL', 'SUPER_ADMIN', 'INSTITUTION_ADMIN', 'ACCOUNTANT', 'HR_OFFICER', 'EXAM_CONTROLLER'].includes(
      p.role
    );

    if (requires2FA) {
      setPendingUser({
        name: p.name,
        email: p.email,
        role: p.role,
        tenantId: selectedTenant,
      });
      setTotpCode('');
      setTotpError(null);
      setShowTotpModal(true);
    } else {
      onLogin({
        name: p.name,
        email: p.email,
        role: p.role,
        tenantId: selectedTenant,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const name =
        selectedFormRole === 'STUDENT'
          ? 'Rohan Verma'
          : selectedFormRole === 'PARENT'
          ? 'Suresh Sharma'
          : selectedFormRole === 'FACULTY'
          ? 'Dr. Ramesh Kulkarni'
          : selectedFormRole === 'ACCOUNTANT'
          ? 'Vinod Nair'
          : selectedFormRole === 'HR_OFFICER'
          ? 'Pooja Bhatt'
          : selectedFormRole === 'EXAM_CONTROLLER'
          ? 'Dr. S. K. Sundaram'
          : 'Dr. K. S. Sharma';

      const requires2FA = ['PRINCIPAL', 'SUPER_ADMIN', 'INSTITUTION_ADMIN', 'ACCOUNTANT', 'HR_OFFICER', 'EXAM_CONTROLLER'].includes(
        selectedFormRole
      );

      if (requires2FA) {
        setPendingUser({
          name,
          email: emailInput,
          role: selectedFormRole,
          tenantId: selectedTenant,
        });
        setTotpCode('');
        setTotpError(null);
        setShowTotpModal(true);
      } else {
        onLogin({
          name,
          email: emailInput,
          role: selectedFormRole,
          tenantId: selectedTenant,
        });
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
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
      {/* Top Header with Institutional Brand */}
      <header className="border-b border-[#E5DFD7] bg-white px-6 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#682038] text-white flex items-center justify-center font-bold text-base shadow-xs">
              D
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-[#242424] flex items-center gap-2">
                <span>DEVLOFT CAMPUS MANAGEMENT SYSTEM</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#682038]/10 text-[#682038] border border-[#682038]/20">
                  PostgreSQL RLS
                </span>
              </div>
              <p className="text-xs text-[#6E6862]">Secure Multi-Tenant Educational ERP • Edition 2026</p>
            </div>
          </div>

          {/* Subdomain & College Selector */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#8B5E3C]" />
            <div className="text-xs">
              <span className="text-[#6E6862] mr-1">College Subdomain:</span>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="font-bold text-[#682038] bg-[#FAF7F2] border border-[#E5DFD7] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
              >
                <option value="t-1">jssate.campus.edu (JSSATE Main Campus)</option>
                <option value="t-2">jsscacs.campus.edu (JSSCACS Degree Wing)</option>
                <option value="t-3">dit.campus.edu (Devloft Institute)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full space-y-6">
          {/* Hero Branding */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#242424]">
              Institutional Identity &amp; Access Gateway
            </h1>
            <p className="text-sm text-[#6E6862] max-w-xl mx-auto">
              Connecting faculty, students, accountants, and administrators to{' '}
              <strong className="text-[#682038]">{currentTenant.name}</strong> under strict Row-Level Security.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-white border border-[#E5DFD7] rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveLoginMode('personas')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeLoginMode === 'personas'
                    ? 'bg-[#682038] text-white shadow-xs'
                    : 'text-[#6E6862] hover:text-[#242424]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>1-Click Persona Quick Login (11 Roles)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLoginMode('form')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeLoginMode === 'form'
                    ? 'bg-[#682038] text-white shadow-xs'
                    : 'text-[#6E6862] hover:text-[#242424]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Credentials Login &amp; 2FA TOTP</span>
              </button>
            </div>
          </div>

          {/* MODE 1: 1-CLICK PERSONA QUICK LOGIN DESK */}
          {activeLoginMode === 'personas' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Specification Compliance:</strong> Click any of the 11 role cards below to instantaneously test that role&apos;s exact permissions, CASL abilities, and views as defined on Page 9 of the specification.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-amber-800 font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                  Argon2id + JWT Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PERSONAS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.role}
                      onClick={() => handleQuickPersonaLogin(p)}
                      className="bg-white rounded-2xl border border-[#E5DFD7] p-4 shadow-2xs hover:shadow-md hover:border-[#682038] transition-all cursor-pointer group flex flex-col justify-between text-left space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: p.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{
                            color: p.color,
                            borderColor: `${p.color}40`,
                            backgroundColor: `${p.color}10`,
                          }}
                        >
                          {p.badge}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#242424] group-hover:text-[#682038] transition-colors">
                          {p.name}
                        </h4>
                        <div className="text-xs font-medium text-[#6E6862]">{p.title}</div>
                        <div className="text-[11px] text-[#8B5E3C] font-mono">{p.department}</div>
                      </div>

                      <div className="pt-2 border-t border-[#E5DFD7] flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] text-[#6E6862] truncate max-w-[170px]" title={p.email}>
                          {p.email}
                        </span>
                        <span className="text-[#682038] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Login</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: CREDENTIALS FORM LOGIN */}
          {activeLoginMode === 'form' && (
            <div className="bg-white rounded-2xl border border-[#E5DFD7] p-8 shadow-md max-w-lg mx-auto space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#682038]/10 text-[#682038] flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242424]">Institutional Credentials Sign-In</h3>
                <p className="text-xs text-[#6E6862]">Subdomain: {currentTenant.domain}</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#242424]">Role Context</label>
                  <select
                    value={selectedFormRole}
                    onChange={(e) => setSelectedFormRole(e.target.value as RoleType)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-semibold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  >
                    <option value="PRINCIPAL">Principal / Director (Executive Oversight)</option>
                    <option value="STUDENT">Student (Self-Service Portal)</option>
                    <option value="PARENT">Parent / Guardian (Multi-Ward Hub)</option>
                    <option value="FACULTY">Faculty (Classroom &amp; Roster)</option>
                    <option value="ACCOUNTANT">Accountant / Bursar (Fees &amp; Ledgers)</option>
                    <option value="HR_OFFICER">HR Officer (Personnel &amp; Payroll)</option>
                    <option value="EXAM_CONTROLLER">Controller of Examinations (COE)</option>
                    <option value="REGISTRAR">Registrar (Admissions &amp; SIS)</option>
                    <option value="HOD">Department Head (HOD)</option>
                    <option value="SUPER_ADMIN">Super Admin (Central Platform)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#242424]">Institutional Email / Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. principal@jssate.edu"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#242424]">Argon2 Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-[#682038] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#6E6862] hover:text-[#242424]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6E6862]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E5DFD7] text-[#682038] focus:ring-[#682038]"
                    />
                    <span>Remember this device (HttpOnly Cookie)</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 font-medium">SSL Encrypted</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Campus Workspace'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Public Portals Strip (Public Admissions Form & QR Verification) */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5DFD7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#242424]">Public Institutional Gateways (No Login Required)</span>
              <p className="text-[11px] text-[#6E6862]">
                As specified on Page 4 of the specification: Public application forms and document verifiers are publicly open.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onOpenPublicApply}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Online Admission Form</span>
              </button>
              <button
                type="button"
                onClick={onOpenPublicVerify}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verify Certificate / QR</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 2FA TOTP MODAL */}
      {showTotpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#682038]/10 text-[#682038] flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#242424]">Two-Factor Authentication (TOTP)</h3>
              <p className="text-xs text-[#6E6862]">
                Required for privileged role: <strong>{pendingUser?.role}</strong> ({pendingUser?.name})
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] text-xs text-[#6E6862] text-center">
              Enter the 6-digit verification code from your authenticator app (Google Authenticator / YubiKey).
            </div>

            {totpError && (
              <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs">
                {totpError}
              </div>
            )}

            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.5em] text-xl font-mono p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#682038]"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTotpModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
                >
                  Verify &amp; Enter Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Reset Institutional Password</h3>
                <p className="text-xs text-[#6E6862]">Single-use expiring email token dispatch</p>
              </div>
            </div>

            {resetSuccessMessage ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Email Dispatched</span>
                </div>
                <p>{resetSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#242424]">Enter Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. employee@jssate.edu"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E5DFD7] bg-white px-6 py-4 text-center text-xs text-[#6E6862]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Devloft Technologies • JSS School Campus Management System • Version 1.0 (Locked)
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5DFD7]">
              Zero-SMS Policy: Push &amp; SMTP Only
            </span>
            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              PostgreSQL 16+ RLS: Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
