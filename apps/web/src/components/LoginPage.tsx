import React, { useState } from 'react';
import { RoleType } from '../types';
import {
  Shield,
  Lock,
  Mail,
  Building,
  KeyRound,
  FileCheck,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: RoleType; tenantId: string }) => void;
  onOpenPublicApply: () => void;
  onOpenPublicVerify: () => void;
  initialTenantId?: string;
}

const ROLE_DISPLAY_NAMES: Record<RoleType, string> = {
  PRINCIPAL: 'Dr. K. S. Sharma',
  STUDENT: 'Rohan Verma',
  PARENT: 'Suresh Sharma',
  FACULTY: 'Dr. Ramesh Kulkarni',
  ACCOUNTANT: 'Vinod Nair',
  HR_OFFICER: 'Pooja Bhatt',
  EXAM_CONTROLLER: 'Dr. S. K. Sundaram',
  REGISTRAR: 'K. R. Venkatraman',
  HOD: 'Dr. Anand Joshi',
  INSTITUTION_ADMIN: 'Arvind Nambiar',
  SUPER_ADMIN: 'Platform Administrator',
};

const ROLE_DEFAULT_EMAILS: Record<RoleType, string> = {
  PRINCIPAL: 'principal@jssate.edu',
  STUDENT: 'rohan.verma@student.jssate.edu',
  PARENT: 'suresh.sharma@family.org',
  FACULTY: 'ramesh.kulkarni@jssate.edu',
  ACCOUNTANT: 'bursar.accounts@jssate.edu',
  HR_OFFICER: 'hr.personnel@jssate.edu',
  EXAM_CONTROLLER: 'coe.exams@jssate.edu',
  REGISTRAR: 'registrar@jssate.edu',
  HOD: 'hod.cse@jssate.edu',
  INSTITUTION_ADMIN: 'admin.ops@jssate.edu',
  SUPER_ADMIN: 'platform.root@devloft.io',
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenPublicApply,
  onOpenPublicVerify,
  initialTenantId = 't-1',
}) => {
  const [selectedTenant, setSelectedTenant] = useState(initialTenantId);

  // Form State
  const [selectedFormRole, setSelectedFormRole] = useState<RoleType>('PRINCIPAL');
  const [emailInput, setEmailInput] = useState(ROLE_DEFAULT_EMAILS['PRINCIPAL']);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
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

  const handleRoleChange = (newRole: RoleType) => {
    setSelectedFormRole(newRole);
    setEmailInput(ROLE_DEFAULT_EMAILS[newRole] || '');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const name = ROLE_DISPLAY_NAMES[selectedFormRole] || 'Authorized User';

      // Privileged roles require 2FA TOTP verification as per Page 9 of specification
      const requires2FA = [
        'PRINCIPAL',
        'SUPER_ADMIN',
        'INSTITUTION_ADMIN',
        'ACCOUNTANT',
        'HR_OFFICER',
        'EXAM_CONTROLLER',
      ].includes(selectedFormRole);

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
      {/* Top Header with Institutional Brand & Tenant Subdomain Selector */}
      <header className="border-b border-[#E5DFD7] bg-white px-6 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#682038] text-white flex items-center justify-center font-bold text-base shadow-xs">
              D
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#682038] tracking-tight leading-tight">
                DEVLOFT CAMPUS MANAGEMENT SYSTEM
              </div>
              <div className="text-[11px] text-[#6E6862] flex items-center gap-2">
                <span>PostgreSQL RLS</span>
                <span>•</span>
                <span>Secure Multi-Tenant Educational ERP • Edition 2026</span>
              </div>
            </div>
          </div>

          {/* Subdomain Switcher */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DFD7]">
            <Building className="w-4 h-4 text-[#682038] ml-2" />
            <span className="text-xs font-bold text-[#6E6862]">College Subdomain:</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="bg-white border border-[#E5DFD7] rounded-lg px-2.5 py-1 text-xs font-bold text-[#242424] focus:outline-none cursor-pointer"
            >
              <option value="t-1">jssate.campus.edu (JSSATE Main Campus)</option>
              <option value="t-2">jsscacs.campus.edu (JSSCACS Degree Wing)</option>
              <option value="t-3">dit.campus.edu (Devloft Institute)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Authentication Area */}
      <main className="flex-1 flex flex-col justify-center max-w-xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E5DFD7] p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#682038]/10 text-[#682038] flex items-center justify-center mx-auto mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#242424] tracking-tight">
              Institutional Identity &amp; Access Gateway
            </h1>
            <p className="text-xs text-[#6E6862]">
              Accessing <strong className="text-[#682038]">{currentTenant.name}</strong> under PostgreSQL Row-Level Security (<code className="font-mono text-[11px]">{currentTenant.domain}</code>).
            </p>
          </div>

          {/* Institutional Credentials Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#242424]">Role Context</label>
              <select
                value={selectedFormRole}
                onChange={(e) => handleRoleChange(e.target.value as RoleType)}
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
                <option value="INSTITUTION_ADMIN">Institution Administrator (Campus IT &amp; Ops)</option>
                <option value="SUPER_ADMIN">Super Admin (Central Platform Root)</option>
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
              className="w-full py-2.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Campus Workspace'}</span>
            </button>
          </form>

          {/* Public Gateways (Spec Page 4: No Login Required) */}
          <div className="pt-4 border-t border-[#E5DFD7] space-y-2.5">
            <div className="text-[11px] font-bold text-[#6E6862] uppercase tracking-wider text-center">
              Public Gateways (No Login Required)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onOpenPublicApply}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] text-xs font-bold text-[#682038] transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#682038]" />
                <span>Online Admission Form</span>
              </button>
              <button
                type="button"
                onClick={onOpenPublicVerify}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] text-xs font-bold text-[#682038] transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Verify Certificate / QR</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 2FA TOTP Verification Modal */}
      {showTotpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center shrink-0">
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
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-bold text-[#242424] focus:outline-none focus:ring-2 focus:ring-[#682038]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTotpModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
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
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center shrink-0">
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
                    className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Institutional Legal & Security Footer */}
      <footer className="border-t border-[#E5DFD7] bg-white px-6 py-4 text-xs text-[#6E6862]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2026 Devloft Technologies • JSS School Campus Management System • Version 1.0 (Locked)</div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#682038] font-semibold">Zero-SMS Policy: Push &amp; SMTP Only</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">PostgreSQL 16+ RLS: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
