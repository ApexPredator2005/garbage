import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Users,
  FileText,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Download,
  Calculator,
  Calendar,
  ShieldCheck,
  Printer,
  AlertCircle,
  Building,
  Search,
  Eye,
  X,
  ChevronRight,
  Check,
  CreditCard,
  Percent,
  TrendingUp,
} from 'lucide-react';

interface EmployeeRecord {
  id: string;
  empCode: string;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  bankAccount: string;
  bankName: string;
  panNumber: string;
  basicSalary: number;
  specialAllowance: number;
  lopDays: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'PROBATION';
}

type PayrollStatus = 'DRAFT' | 'APPROVED' | 'LOCKED';

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-1',
    empCode: 'EMP-CSE-004',
    name: 'Dr. Aris Thorne',
    designation: 'Professor & HOD',
    department: 'Computer Science',
    dateOfJoining: '2019-06-15',
    bankAccount: '992019283412',
    bankName: 'HDFC Bank',
    panNumber: 'ABCDE1234F',
    basicSalary: 95000,
    specialAllowance: 18000,
    lopDays: 0,
    status: 'ACTIVE',
  },
  {
    id: 'emp-2',
    empCode: 'EMP-CSE-012',
    name: 'Prof. Sunita Rao',
    designation: 'Associate Professor',
    department: 'Computer Science',
    dateOfJoining: '2021-01-10',
    bankAccount: '112039482711',
    bankName: 'State Bank of India',
    panNumber: 'BWKPE9912K',
    basicSalary: 72000,
    specialAllowance: 12000,
    lopDays: 1,
    status: 'ACTIVE',
  },
  {
    id: 'emp-3',
    empCode: 'EMP-ECE-008',
    name: 'Dr. Rajesh Deshmukh',
    designation: 'Associate Professor',
    department: 'Electronics & Comm',
    dateOfJoining: '2020-08-01',
    bankAccount: '445910283918',
    bankName: 'ICICI Bank',
    panNumber: 'PLMKO4819M',
    basicSalary: 74000,
    specialAllowance: 14000,
    lopDays: 0,
    status: 'ACTIVE',
  },
  {
    id: 'emp-4',
    empCode: 'EMP-ADM-002',
    name: 'Meenakshi Sundaram',
    designation: 'Senior Registrar Officer',
    department: 'Administration',
    dateOfJoining: '2018-03-20',
    bankAccount: '882910394819',
    bankName: 'Canara Bank',
    panNumber: 'ZXCVB5678Q',
    basicSalary: 55000,
    specialAllowance: 8000,
    lopDays: 2,
    status: 'ACTIVE',
  },
  {
    id: 'emp-5',
    empCode: 'EMP-LAB-019',
    name: 'Rameshwar Naik',
    designation: 'Senior Systems Admin',
    department: 'IT & Infrastructure',
    dateOfJoining: '2022-04-11',
    bankAccount: '334910294812',
    bankName: 'Axis Bank',
    panNumber: 'QWERT9012R',
    basicSalary: 42000,
    specialAllowance: 5000,
    lopDays: 0,
    status: 'ACTIVE',
  },
];

// Sandboxed formula calculation without eval
function calculateSalaryComponents(basic: number, special: number, lopDays: number) {
  const hra = Math.round(basic * 0.4); // 40% of Basic
  const da = Math.round(basic * 0.25); // 25% of Basic
  const grossEarnings = basic + hra + da + special;

  const pf = Math.round(basic * 0.12); // 12% of Basic
  const pt = 200; // Fixed professional tax
  const tds = grossEarnings > 100000 ? Math.round(grossEarnings * 0.1) : Math.round(grossEarnings * 0.05);

  const dailyRate = Math.round(grossEarnings / 30);
  const lopDeduction = dailyRate * lopDays;

  const totalDeductions = pf + pt + tds + lopDeduction;
  const netPayable = grossEarnings - totalDeductions;

  return {
    basic,
    hra,
    da,
    special,
    grossEarnings,
    pf,
    pt,
    tds,
    dailyRate,
    lopDeduction,
    totalDeductions,
    netPayable,
  };
}

export const HrPayrollWorkspace: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [payrollStatus, setPayrollStatus] = useState<PayrollStatus>('DRAFT');
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<EmployeeRecord | null>(null);
  const [isNeftGenerated, setIsNeftGenerated] = useState(false);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDept]);

  // Aggregate Payroll Totals
  const payrollTotals = useMemo(() => {
    return employees.reduce(
      (acc, emp) => {
        const comp = calculateSalaryComponents(emp.basicSalary, emp.specialAllowance, emp.lopDays);
        acc.gross += comp.grossEarnings;
        acc.deductions += comp.totalDeductions;
        acc.net += comp.netPayable;
        acc.pf += comp.pf;
        acc.tds += comp.tds;
        return acc;
      },
      { gross: 0, deductions: 0, net: 0, pf: 0, tds: 0 }
    );
  }, [employees]);

  // Update LOP days
  const handleLopChange = (id: string, delta: number) => {
    if (payrollStatus !== 'DRAFT') return;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== id) return emp;
        return {
          ...emp,
          lopDays: Math.max(0, Math.min(15, emp.lopDays + delta)),
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#682038]/10 text-[#682038]">
              Module 06
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Service Book & Formula Engine
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                payrollStatus === 'DRAFT'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : payrollStatus === 'APPROVED'
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              Cycle Status: {payrollStatus}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">HR & Monthly Payroll Lifecycle Engine</h1>
          <p className="text-xs text-[#6E6862]">
            Statutory salary structure (40% HRA, 25% DA, 12% PF, PT, TDS), dynamic Loss-of-Pay (LOP) recalculations, and 3-stage accounting signoff.
          </p>
        </div>

        {/* State Machine Transition Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {payrollStatus === 'DRAFT' && (
            <button
              onClick={() => setPayrollStatus('APPROVED')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Payroll (Finance Officer)</span>
            </button>
          )}

          {payrollStatus === 'APPROVED' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPayrollStatus('DRAFT')}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#FAF7F2] border border-[#E5DFD7]"
              >
                Back to Draft
              </button>
              <button
                onClick={() => setPayrollStatus('LOCKED')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock & Post GL Voucher</span>
              </button>
            </div>
          )}

          {payrollStatus === 'LOCKED' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Posted: JV-2026-PAY-104</span>
              </span>
              <button
                onClick={() => setIsNeftGenerated(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-xs font-bold border border-[#E5DFD7] transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate NEFT Batch</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NEFT Batch Download Toast */}
      {isNeftGenerated && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Bank NEFT Batch generated: <strong>NEFT_SALARY_OCT2026_TOTAL_₹{payrollTotals.net.toLocaleString('en-IN')}.csv</strong> (Encrypted SHA-256 for Corporate Banking Portal).
            </span>
          </div>
          <button
            onClick={() => setIsNeftGenerated(false)}
            className="text-emerald-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Total Gross Payroll</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">
              ₹{payrollTotals.gross.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#8B5E3C] font-semibold">{employees.length} Staff</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Statutory Deductions (PF/PT/TDS)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-600">
              ₹{payrollTotals.deductions.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#6E6862]">PF: ₹{payrollTotals.pf.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Net Bank Disbursement</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              ₹{payrollTotals.net.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              Ready for NEFT
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Cycle Lifecycle Stage</span>
          <div className="flex items-center gap-1.5 pt-1">
            <div className={`h-2 flex-1 rounded-full ${payrollStatus !== 'DRAFT' ? 'bg-blue-600' : 'bg-amber-500'}`} />
            <div className={`h-2 flex-1 rounded-full ${payrollStatus === 'LOCKED' ? 'bg-emerald-600' : 'bg-[#E5DFD7]'}`} />
            <span className="text-xs font-mono font-bold text-[#682038] ml-1">{payrollStatus}</span>
          </div>
          <div className="text-[10px] text-[#6E6862]">
            {payrollStatus === 'LOCKED' ? 'Voucher posted to General Ledger' : 'Awaiting final signoff'}
          </div>
        </div>
      </div>

      {/* Formula Specification Callout */}
      <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-4 flex items-start gap-3">
        <Calculator className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#242424]">
          <span className="font-bold text-sm">Deterministic Sandboxed Salary Formula Engine (No eval):</span>
          <p className="text-[#6E6862]">
            Gross = Basic + HRA (40% Basic) + DA (25% Basic) + Special Allowance. Deductions = PF (12% Basic) + PT (₹200) + TDS (5-10% slab) + LOP [Daily Rate = Gross / 30 × LOP Days].
          </p>
        </div>
      </div>

      {/* Employee Master Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8B5E3C]" />
            <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Faculty & Staff Monthly Payroll Sheet (October 2026)
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6E6862]" />
              <input
                type="text"
                placeholder="Search staff or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#E5DFD7] bg-white focus:outline-none focus:ring-1 focus:ring-[#682038]"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-3 rounded-lg text-xs border border-[#E5DFD7] bg-white text-[#242424] focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Administration">Administration</option>
              <option value="IT & Infrastructure">IT & Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
              <tr>
                <th className="py-3 px-4 font-semibold">Emp Code</th>
                <th className="py-3 px-4 font-semibold">Staff Particulars</th>
                <th className="py-3 px-4 font-semibold text-right">Basic Pay</th>
                <th className="py-3 px-4 font-semibold text-right">Gross Earnings</th>
                <th className="py-3 px-4 font-semibold text-center">LOP Days</th>
                <th className="py-3 px-4 font-semibold text-right">Deductions</th>
                <th className="py-3 px-4 font-semibold text-right">Net Payable</th>
                <th className="py-3 px-4 font-semibold text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD7]">
              {filteredEmployees.map((emp) => {
                const comp = calculateSalaryComponents(emp.basicSalary, emp.specialAllowance, emp.lopDays);

                return (
                  <tr key={emp.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#682038]">
                      {emp.empCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#242424]">{emp.name}</div>
                      <div className="text-[11px] text-[#6E6862]">
                        {emp.designation} • {emp.department}
                      </div>
                      <div className="text-[10px] text-[#6E6862] font-mono">
                        Bank: {emp.bankName} (···{emp.bankAccount.slice(-4)})
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-[#242424]">
                      ₹{emp.basicSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#242424]">
                      ₹{comp.grossEarnings.toLocaleString('en-IN')}
                      <div className="text-[10px] text-[#6E6862] font-normal">
                        HRA: ₹{comp.hra.toLocaleString('en-IN')} • DA: ₹{comp.da.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleLopChange(emp.id, -1)}
                          disabled={payrollStatus !== 'DRAFT' || emp.lopDays === 0}
                          className="w-5 h-5 rounded bg-[#FAF7F2] border border-[#E5DFD7] text-[#6E6862] hover:bg-[#F4ECE2] disabled:opacity-30 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-rose-700 w-4 text-center">
                          {emp.lopDays}
                        </span>
                        <button
                          onClick={() => handleLopChange(emp.id, 1)}
                          disabled={payrollStatus !== 'DRAFT'}
                          className="w-5 h-5 rounded bg-[#FAF7F2] border border-[#E5DFD7] text-[#6E6862] hover:bg-[#F4ECE2] disabled:opacity-30 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                      {comp.lopDeduction > 0 && (
                        <div className="text-[10px] text-rose-600 font-mono">
                          -₹{comp.lopDeduction.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                      ₹{comp.totalDeductions.toLocaleString('en-IN')}
                      <div className="text-[10px] text-[#6E6862]">
                        PF: ₹{comp.pf.toLocaleString('en-IN')} • TDS: ₹{comp.tds.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                      ₹{comp.netPayable.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedPayslipEmp(emp)}
                        className="p-1.5 rounded-lg text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] transition-all"
                        title="View Official Payslip"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Payslip Modal */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Payslip Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#682038]" />
                  <h3 className="font-bold text-base text-[#242424]">Devloft College of Engineering & Technology</h3>
                </div>
                <p className="text-xs text-[#6E6862]">
                  Salary Slip for the Month of <strong>October 2026</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedPayslipEmp(null)}
                className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Particulars Grid */}
            {(() => {
              const comp = calculateSalaryComponents(
                selectedPayslipEmp.basicSalary,
                selectedPayslipEmp.specialAllowance,
                selectedPayslipEmp.lopDays
              );

              return (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] text-xs">
                    <div>
                      <span className="text-[#6E6862] block">Employee Name:</span>
                      <span className="font-bold text-[#242424]">{selectedPayslipEmp.name}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Emp Code / Dept:</span>
                      <span className="font-mono font-bold text-[#682038]">{selectedPayslipEmp.empCode}</span>
                      <span className="text-[10px] text-[#6E6862] block">{selectedPayslipEmp.department}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Designation:</span>
                      <span className="font-semibold text-[#242424]">{selectedPayslipEmp.designation}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Bank Account:</span>
                      <span className="font-mono text-[#242424]">
                        {selectedPayslipEmp.bankName} (···{selectedPayslipEmp.bankAccount.slice(-4)})
                      </span>
                      <span className="text-[10px] text-[#6E6862] block font-mono">PAN: {selectedPayslipEmp.panNumber}</span>
                    </div>
                  </div>

                  {/* Dual Column Earnings & Deductions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Earnings */}
                    <div className="border border-[#E5DFD7] rounded-xl overflow-hidden">
                      <div className="bg-[#FAF7F2] p-2.5 font-bold text-xs text-[#242424] border-b border-[#E5DFD7]">
                        Earnings
                      </div>
                      <div className="divide-y divide-[#E5DFD7] text-xs">
                        <div className="p-2.5 flex justify-between">
                          <span>Basic Pay</span>
                          <span className="font-mono font-bold">₹{comp.basic.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>House Rent Allowance (HRA 40%)</span>
                          <span className="font-mono font-bold">₹{comp.hra.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Dearness Allowance (DA 25%)</span>
                          <span className="font-mono font-bold">₹{comp.da.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Special Allowance</span>
                          <span className="font-mono font-bold">₹{comp.special.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between bg-emerald-50 text-emerald-900 font-bold">
                          <span>Total Gross Earnings</span>
                          <span className="font-mono">₹{comp.grossEarnings.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="border border-[#E5DFD7] rounded-xl overflow-hidden">
                      <div className="bg-[#FAF7F2] p-2.5 font-bold text-xs text-[#242424] border-b border-[#E5DFD7]">
                        Deductions
                      </div>
                      <div className="divide-y divide-[#E5DFD7] text-xs">
                        <div className="p-2.5 flex justify-between">
                          <span>Provident Fund (PF 12%)</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.pf.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Professional Tax (PT)</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.pt.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>TDS / Income Tax</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.tds.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between">
                          <span>Loss of Pay (LOP {selectedPayslipEmp.lopDays} days)</span>
                          <span className="font-mono text-rose-600 font-bold">₹{comp.lopDeduction.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 flex justify-between bg-rose-50 text-rose-900 font-bold">
                          <span>Total Deductions</span>
                          <span className="font-mono">₹{comp.totalDeductions.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Payable Banner */}
                  <div className="bg-[#682038] text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-amber-200">Net Payable Amount</span>
                      <div className="text-xl font-bold font-mono">₹{comp.netPayable.toLocaleString('en-IN')}</div>
                    </div>
                    <span className="text-xs text-white/80">Direct Electronic Bank Credit</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#6E6862]">
                      System-generated slip • Verification Hash: <code className="font-mono text-[#682038]">SHA256:d8a2..f0</code>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPayslipEmp(null)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => alert(`Simulating PDF download for ${selectedPayslipEmp.name}`)}
                        className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Signed PDF</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
