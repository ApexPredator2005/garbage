import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  User,
  BookOpen,
  CreditCard,
  Calendar,
  Award,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { ModuleTab } from '../App';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (module: ModuleTab) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'Student' | 'Faculty' | 'Course' | 'Finance' | 'Module';
  subtitle: string;
  targetModule: ModuleTab;
}

const SEARCH_CATALOG: SearchItem[] = [
  { id: '1', title: 'Rohan Verma (EN2026-ECE-015)', category: 'Student', subtitle: 'B.Tech ECE Sem 4 (Sec B)', targetModule: 'admissions' },
  { id: '2', title: 'Aarav Sharma (EN2026-CSE-001)', category: 'Student', subtitle: 'B.Tech CSE Sem 4 (Sec A)', targetModule: 'admissions' },
  { id: '3', title: 'Diya Patel (EN2026-CSE-002)', category: 'Student', subtitle: 'B.Tech CSE Sem 4 (Sec A)', targetModule: 'admissions' },
  { id: '4', title: 'Dr. Ramesh Kulkarni', category: 'Faculty', subtitle: 'Dept of CSE • Algorithms & Data Structures', targetModule: 'academics' },
  { id: '5', title: 'Prof. Sunita Rao', category: 'Faculty', subtitle: 'Dept of CSE • Database Systems', targetModule: 'academics' },
  { id: '6', title: 'EC401 - Microprocessors & Microcontrollers', category: 'Course', subtitle: 'Semester 4 Theory • 4 Credits', targetModule: 'academics' },
  { id: '7', title: 'CS401 - Design & Analysis of Algorithms', category: 'Course', subtitle: 'Semester 4 Theory • 4 Credits', targetModule: 'academics' },
  { id: '8', title: 'Bursar UTR Verification Desk', category: 'Finance', subtitle: '2 Pending Bank Transactions for Clearance', targetModule: 'fees' },
  { id: '9', title: 'Payroll Run October 2026 (JV-2026-PAY-104)', category: 'Finance', subtitle: '₹6,14,700 Gross • Balanced Postings', targetModule: 'payroll' },
  { id: '10', title: 'Admissions & Seat Quota Matrix', category: 'Module', subtitle: 'Statutory 50% Open, 27% OBC, 15% SC, 7.5% ST', targetModule: 'admissions' },
  { id: '11', title: 'Attendance Condonation Desk', category: 'Module', subtitle: 'Medical Attendance Condonation & Exam Eligibility', targetModule: 'attendance' },
  { id: '12', title: 'Dual-Signoff Grade Moderation Console', category: 'Module', subtitle: 'Bell curve normalization & statistical analysis', targetModule: 'exams' },
  { id: '13', title: 'Accreditation Returns (NAAC, NBA, NIRF)', category: 'Module', subtitle: 'Standardized regulatory packages & parameterized SQL', targetModule: 'reports' },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateModule,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = SEARCH_CATALOG.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E5DFD7] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5DFD7] gap-3">
          <Search className="w-5 h-5 text-[#8B5E3C] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students, faculty, courses, vouchers, reports..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-[#242424] placeholder:text-[#6E6862]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E5DFD7]/50">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigateModule(item.targetModule);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-[#FAF7F2] cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#242424] group-hover:text-[#682038]">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6862]">{item.subtitle}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#682038] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[#6E6862]">
              No matching records found for &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2.5 bg-[#FAF7F2] border-t border-[#E5DFD7] flex items-center justify-between text-[11px] text-[#6E6862]">
          <span>Navigate with arrow keys or click</span>
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#E5DFD7]">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
