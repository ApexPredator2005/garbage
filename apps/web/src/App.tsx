import React, { useState } from 'react';
import { RoleType } from './types';
import { Navbar } from './components/Navbar';
import { PresignedUploadModal } from './components/PresignedUploadModal';
import { ClaudeModulesModal } from './components/ClaudeModulesModal';
import { AdmissionsWorkspace } from './features/admissions/AdmissionsWorkspace';
import { AcademicsWorkspace } from './features/academics/AcademicsWorkspace';
import { ExamsWorkspace } from './features/exams/ExamsWorkspace';
import { FeesWorkspace } from './features/fees/FeesWorkspace';
import { Users, Calendar, Award, CreditCard, Sparkles, Building, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTenantId, setCurrentTenantId] = useState('t-1');
  const [currentRole, setCurrentRole] = useState<RoleType>('PRINCIPAL');
  const [activeTab, setActiveTab] = useState<'admissions' | 'academics' | 'exams' | 'fees'>('academics');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isClaudePromptsOpen, setIsClaudePromptsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      {/* Top Navbar with Multi-Tenancy & Role Controls */}
      <Navbar
        currentTenantId={currentTenantId}
        onTenantChange={setCurrentTenantId}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenClaudePrompts={() => setIsClaudePromptsOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3 overflow-x-auto gap-4">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('admissions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admissions'
                  ? 'bg-[#682038] text-white shadow-sm'
                  : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>01. Admissions & SIS</span>
            </button>

            <button
              onClick={() => setActiveTab('academics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'academics'
                  ? 'bg-[#682038] text-white shadow-sm'
                  : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>03. Academics & Timetables</span>
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'exams'
                  ? 'bg-[#682038] text-white shadow-sm'
                  : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>04. Exams & Moderation</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fees'
                  ? 'bg-[#682038] text-white shadow-sm'
                  : 'bg-white text-[#6E6862] hover:bg-[#F4ECE2] border border-[#E5DFD7]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>05. Fees & UTR Ledger</span>
            </button>
          </nav>

          <button
            onClick={() => setIsClaudePromptsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Generate Claude Prompts for Modules 02, 06, 07, 08</span>
          </button>
        </div>

        {/* Active Workspace View */}
        <div className="transition-all duration-200">
          {activeTab === 'admissions' && <AdmissionsWorkspace />}
          {activeTab === 'academics' && <AcademicsWorkspace />}
          {activeTab === 'exams' && <ExamsWorkspace />}
          {activeTab === 'fees' && <FeesWorkspace />}
        </div>
      </main>

      {/* S3 Presigned Upload Modal */}
      <PresignedUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Claude Modular Prompts Modal */}
      <ClaudeModulesModal isOpen={isClaudePromptsOpen} onClose={() => setIsClaudePromptsOpen(false)} />
    </div>
  );
};
