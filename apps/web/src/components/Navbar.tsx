import React from 'react';
import { MOCK_TENANTS } from '../mockData';
import { RoleType } from '../types';
import { Building2, Users2, Shield, Bell, Cloud, Code2 } from 'lucide-react';

interface NavbarProps {
  currentTenantId: string;
  onTenantChange: (id: string) => void;
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onOpenUpload: () => void;
  onOpenClaudePrompts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTenantId,
  onTenantChange,
  currentRole,
  onRoleChange,
  onOpenUpload,
  onOpenClaudePrompts,
}) => {
  const currentTenant = MOCK_TENANTS.find((t) => t.id === currentTenantId) || MOCK_TENANTS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5DFD7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Tenant Subdomain Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#682038] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              D
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#682038] tracking-tight leading-tight">
                DEVLOFT CMS
              </div>
              <div className="text-[11px] font-mono text-[#8B5E3C] leading-none">
                {currentTenant.subdomain}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-[#F4ECE2] rounded-lg p-1 border border-[#E5DFD7]">
            <Building2 className="w-3.5 h-3.5 text-[#682038] ml-2 mr-1" />
            <select
              value={currentTenantId}
              onChange={(e) => onTenantChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#242424] focus:outline-none pr-2 cursor-pointer"
            >
              {MOCK_TENANTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: User Features (Ward Switcher, Upload, Claude Prompts, Role Selector) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Claude Modular Prompts Pill */}
          <button
            onClick={onOpenClaudePrompts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
            title="Open copy-paste prompts for Claude to build complementary modules"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Claude Prompts</span>
          </button>

          {/* Presigned S3 Direct Upload Quick-Action */}
          <button
            onClick={onOpenUpload}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] text-xs font-semibold transition-colors"
            title="Direct Browser S3 Upload (0MB Server RAM)"
          >
            <Cloud className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>S3 Presign Upload</span>
          </button>

          {/* Multi-Ward Switcher (Active when Parent role selected) */}
          {currentRole === 'PARENT' && (
            <div className="flex items-center bg-[#F4ECE2] rounded-lg px-2.5 py-1.5 border border-[#E5DFD7] text-xs font-medium text-[#682038]">
              <Users2 className="w-3.5 h-3.5 mr-1.5 text-[#8B5E3C]" />
              <span className="font-semibold mr-1">Ward:</span>
              <select className="bg-transparent font-bold focus:outline-none cursor-pointer">
                <option>Aarav Sharma (B.Tech CSE - Sem 4)</option>
                <option>Diya Patel (B.Tech CSE - Sem 4)</option>
              </select>
            </div>
          )}

          {/* Role Switcher (11 Roles) */}
          <div className="flex items-center bg-[#F4ECE2] rounded-lg px-2.5 py-1.5 border border-[#E5DFD7]">
            <Shield className="w-3.5 h-3.5 text-[#682038] mr-1.5" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as RoleType)}
              className="bg-transparent text-xs font-bold text-[#682038] focus:outline-none cursor-pointer"
            >
              <option value="SUPER_ADMIN">Role: Super Admin</option>
              <option value="INSTITUTION_ADMIN">Role: Institution Admin</option>
              <option value="PRINCIPAL">Role: Principal</option>
              <option value="REGISTRAR">Role: Registrar</option>
              <option value="HOD">Role: Department Head (HOD)</option>
              <option value="FACULTY">Role: Faculty</option>
              <option value="EXAM_CONTROLLER">Role: Exam Controller</option>
              <option value="ACCOUNTANT">Role: Accountant / Bursar</option>
              <option value="HR_OFFICER">Role: HR Officer</option>
              <option value="STUDENT">Role: Student</option>
              <option value="PARENT">Role: Parent</option>
            </select>
          </div>

          {/* Notification Bell */}
          <div className="relative p-2 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2] cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#BA1A1A] rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
