import React from 'react';
import { MOCK_TENANTS } from '../mockData';
import { RoleType } from '../types';
import {
  Building2,
  Users2,
  Shield,
  Bell,
  Search,
  LogOut,
  FileCheck,
  ExternalLink,
  FileText,
} from 'lucide-react';

interface NavbarProps {
  currentTenantId: string;
  onTenantChange: (id: string) => void;
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  onOpenPublicApply: () => void;
  onOpenPublicVerify: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTenantId,
  onTenantChange,
  currentRole,
  onRoleChange,
  onOpenUpload,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 3,
  userName = 'Dr. K. S. Sharma',
  userEmail = 'principal@jssate.edu',
  onLogout,
  onOpenPublicApply,
  onOpenPublicVerify,
}) => {
  const currentTenant = MOCK_TENANTS.find((t) => t.id === currentTenantId) || MOCK_TENANTS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5DFD7] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Tenant Subdomain Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#682038] text-white flex items-center justify-center font-bold text-base shadow-xs">
              C
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#682038] tracking-tight leading-tight">
                CAMPUS ERP
              </div>
              <div className="text-[11px] font-mono text-[#8B5E3C] leading-none">
                {currentTenant.subdomain}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-[#F4ECE2] rounded-lg p-1 border border-[#E5DFD7]">
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

        {/* Center: Global Search Command Palette Button */}
        <div className="hidden md:flex flex-1 max-w-xs mx-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] text-xs text-[#6E6862] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>Search records...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E5DFD7]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Role Selector, User Menu, and Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search on Mobile */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl text-[#6E6862] hover:bg-[#F4ECE2]"
            title="Search (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>


          {/* Link to Master Specification Document */}
          <a
            href="../docs/"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4ECE2] hover:bg-[#EAE1D3] border border-[#E5DFD7] text-xs font-bold text-[#682038] transition-colors"
            title="Open Master Specification & Architecture Document Suite"
          >
            <FileText className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>Spec Doc</span>
          </a>

          {/* Role Switcher (11 Roles) */}
          <div className="flex items-center bg-[#F4ECE2] rounded-xl px-2.5 py-1.5 border border-[#E5DFD7]">
            <Shield className="w-3.5 h-3.5 text-[#682038] mr-1.5 shrink-0" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as RoleType)}
              className="bg-transparent text-xs font-bold text-[#682038] focus:outline-none cursor-pointer"
            >
              <option value="PRINCIPAL">Role: Principal</option>
              <option value="STUDENT">Role: Student</option>
              <option value="PARENT">Role: Parent</option>
              <option value="FACULTY">Role: Faculty</option>
              <option value="ACCOUNTANT">Role: Accountant</option>
              <option value="HR_OFFICER">Role: HR Officer</option>
              <option value="EXAM_CONTROLLER">Role: Exam Controller</option>
              <option value="REGISTRAR">Role: Registrar</option>
              <option value="HOD">Role: Department Head</option>
              <option value="SUPER_ADMIN">Role: Super Admin</option>
              <option value="INSTITUTION_ADMIN">Role: Inst. Admin</option>
            </select>
          </div>

          {/* Notification Bell with Real-Time Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#6E6862] hover:bg-[#F4ECE2] transition-colors"
            title="Notification Center (WebSocket)"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#BA1A1A] text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Pill & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-[#E5DFD7]">
            <div className="hidden xl:block text-right text-xs pr-1">
              <div className="font-bold text-[#242424] leading-tight truncate max-w-[130px]">{userName}</div>
              <div className="text-[10px] text-[#6E6862] leading-none truncate max-w-[130px]">{userEmail}</div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-xl text-[#6E6862] hover:text-[#BA1A1A] hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center gap-1"
              title="Sign Out / Return to Login Screen"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
