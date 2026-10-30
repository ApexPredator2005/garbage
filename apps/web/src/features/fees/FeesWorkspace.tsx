import React, { useState } from 'react';
import { MOCK_FEE_DEMANDS, MOCK_UTR_SUBMISSIONS } from '../../mockData';
import { FeeDemandItem, UtrSubmissionItem } from '../../types';
import {
  CreditCard,
  CheckCircle,
  Shield,
  FileCheck,
  Lock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BookOpen,
  DollarSign,
  TrendingUp,
  Receipt,
  Building,
  Layers,
  Scale,
  Calendar,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  PieChart,
  Tag,
  ArrowRight,
  Printer,
} from 'lucide-react';

type FeesTab =
  | 'structures_demands'
  | 'collection_desk'
  | 'utr_reconciliation'
  | 'concessions_waivers'
  | 'general_ledger'
  | 'institution_finance';

interface FeeHeadDefinition {
  code: string;
  name: string;
  ledgerAccount: string;
  type: 'RECURRING_SEMESTER' | 'ONE_TIME_ADMISSION' | 'REFUNDABLE_DEPOSIT' | 'OPTIONAL_FACILITY';
  amount: number;
}

interface CashierSession {
  sessionId: string;
  cashierName: string;
  counterNo: string;
  openingFloat: number;
  cashCollected: number;
  cardCollected: number;
  ddCollected: number;
  totalCollected: number;
  physicalCashCounted: number;
  discrepancy: number;
  status: 'OPEN' | 'RECONCILED_CLOSED';
}

interface GeneralLedgerVoucher {
  id: string;
  voucherNo: string;
  date: string;
  type: 'RECEIPT' | 'PAYMENT' | 'JOURNAL' | 'CONTRA';
  narration: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  balanced: boolean;
}

interface DepartmentBudget {
  department: string;
  allocatedAmount: number;
  utilizedAmount: number;
  committedAmount: number;
  balanceRemaining: number;
  utilizationPct: number;
}

const INITIAL_FEE_HEADS: FeeHeadDefinition[] = [
  { code: 'FH_TUI', name: 'Academic Tuition Fee', ledgerAccount: '4001 - Academic Revenue', type: 'RECURRING_SEMESTER', amount: 45000 },
  { code: 'FH_DEV', name: 'Campus Development Fund', ledgerAccount: '4005 - Development Fees', type: 'RECURRING_SEMESTER', amount: 15000 },
  { code: 'FH_EXAM', name: 'Semester Examination & Valuation', ledgerAccount: '4010 - Exam Receipts', type: 'RECURRING_SEMESTER', amount: 3500 },
  { code: 'FH_LAB', name: 'Computing & Engineering Lab Consumables', ledgerAccount: '4020 - Lab Receipts', type: 'RECURRING_SEMESTER', amount: 6500 },
  { code: 'FH_CAU', name: 'Refundable Institute Caution Deposit', ledgerAccount: '2105 - Caution Deposits Payable', type: 'REFUNDABLE_DEPOSIT', amount: 10000 },
  { code: 'FH_LIB', name: 'Digital Library & IEEE Consortium Pass-through', ledgerAccount: '4030 - Library Receipts', type: 'RECURRING_SEMESTER', amount: 2000 },
];

const INITIAL_VOUCHERS: GeneralLedgerVoucher[] = [
  {
    id: 'v-101',
    voucherNo: 'VR-2026-1049',
    date: '2026-10-29',
    type: 'RECEIPT',
    narration: 'Semester 4 Tuition collected from Aarav Sharma (2024CSE001) via Razorpay',
    debitAccount: '1002 - Bank HDFC Collection A/c',
    creditAccount: '1100 - Student Fee Receivables',
    amount: 72000,
    balanced: true,
  },
  {
    id: 'v-102',
    voucherNo: 'VR-2026-1050',
    date: '2026-10-29',
    type: 'RECEIPT',
    narration: 'Counter Fee Collection - Cashier Counter 1 Session Shift A',
    debitAccount: '1001 - Cash in Hand (Main Safe)',
    creditAccount: '1100 - Student Fee Receivables',
    amount: 145000,
    balanced: true,
  },
  {
    id: 'v-103',
    voucherNo: 'VJ-2026-0812',
    date: '2026-10-28',
    type: 'JOURNAL',
    narration: 'Recognition of Monthly Depreciation on Computer Lab Equipment (15% SLM)',
    debitAccount: '5010 - Depreciation Expense',
    creditAccount: '1501 - Accumulated Depreciation Server/PC',
    amount: 68500,
    balanced: true,
  },
  {
    id: 'v-104',
    voucherNo: 'VP-2026-0442',
    date: '2026-10-27',
    type: 'PAYMENT',
    narration: 'Vendor Payment to Airtel Fiber Leased Line (1 Gbps ISP bill less TDS 2%)',
    debitAccount: '5025 - Internet & Network Expenses',
    creditAccount: '1002 - Bank HDFC Operating A/c',
    amount: 88200,
    balanced: true,
  },
];

const INITIAL_BUDGETS: DepartmentBudget[] = [
  { department: 'Computer Science & Engineering', allocatedAmount: 2500000, utilizedAmount: 1850000, committedAmount: 320000, balanceRemaining: 330000, utilizationPct: 86.8 },
  { department: 'Electronics & Communication', allocatedAmount: 2200000, utilizedAmount: 1420000, committedAmount: 210000, balanceRemaining: 570000, utilizationPct: 74.1 },
  { department: 'Mechanical & Robotics', allocatedAmount: 2800000, utilizedAmount: 2310000, committedAmount: 240000, balanceRemaining: 250000, utilizationPct: 91.1 },
  { department: 'Central Library & Resources', allocatedAmount: 1500000, utilizedAmount: 1180000, committedAmount: 120000, balanceRemaining: 200000, utilizationPct: 86.7 },
];

export const FeesWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeesTab>('structures_demands');
  const [demands, setDemands] = useState<FeeDemandItem[]>(MOCK_FEE_DEMANDS);
  const [utrSubmissions, setUtrSubmissions] = useState<UtrSubmissionItem[]>(MOCK_UTR_SUBMISSIONS);
  const [selectedUtr, setSelectedUtr] = useState<UtrSubmissionItem | null>(null);
  const [vouchers, setVouchers] = useState<GeneralLedgerVoucher[]>(INITIAL_VOUCHERS);

  // Idempotency simulation state
  const [idempotencyKey, setIdempotencyKey] = useState<string>('a9e1f57b-70dc-4a69-90d2-92c10319ef11');
  const [isLockActive, setIsLockActive] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(60);
  const [duplicateAttemptsBlocked, setDuplicateAttemptsBlocked] = useState(0);

  // Cashier Session State
  const [cashierSession, setCashierSession] = useState<CashierSession>({
    sessionId: 'SESS-2026-1029-A',
    cashierName: 'Mr. Pradeep Joshi (Head Cashier)',
    counterNo: 'Counter 02 (Bursar Annex)',
    openingFloat: 5000,
    cashCollected: 65000,
    cardCollected: 120000,
    ddCollected: 85000,
    totalCollected: 270000,
    physicalCashCounted: 70000, // 65000 + 5000 float = 70000
    discrepancy: 0,
    status: 'OPEN',
  });

  const handleSimulatePaymentWithIdempotency = () => {
    if (isLockActive) {
      setDuplicateAttemptsBlocked((prev) => prev + 1);
      return;
    }

    setIsLockActive(true);
    setLockTimeRemaining(60);
    setDuplicateAttemptsBlocked(0);

    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLockActive(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleApproveUtr = (utr: UtrSubmissionItem) => {
    setUtrSubmissions((prev) =>
      prev.map((u) => (u.id === utr.id ? { ...u, status: 'APPROVED' } : u))
    );

    setDemands((prev) =>
      prev.map((d) =>
        d.enrollmentNo === utr.enrollmentNo
          ? {
              ...d,
              paidAmount: d.paidAmount + utr.amount,
              dueAmount: Math.max(0, d.dueAmount - utr.amount),
              status: d.dueAmount - utr.amount <= 0 ? 'PAID' : 'PARTIAL',
            }
          : d
      )
    );

    setSelectedUtr(null);
  };

  const handleRejectUtr = (utr: UtrSubmissionItem) => {
    setUtrSubmissions((prev) =>
      prev.map((u) => (u.id === utr.id ? { ...u, status: 'REJECTED' } : u))
    );
    setSelectedUtr(null);
  };

  const handleCloseCashierDay = () => {
    setCashierSession((prev) => ({
      ...prev,
      status: 'RECONCILED_CLOSED',
    }));
    alert('Cashier Shift Closed. Reconciled day-end voucher generated and posted to Cash Book.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B5E3C]">Module 05: Fees & Financial Accounting</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#682038] border border-[#E5DFD7]">
              Strict Double-Entry Posting Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Fees, Payment Gateway & General Ledger</h2>
          <p className="text-xs text-[#6E6862] mt-0.5">
            Automated demand runs, dual-channel cashier collection, Bursar bank reconciliation, balanced vouchers, and departmental budget variance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Debit ≡ Credit Enforced</span>
          </span>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('structures_demands')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'structures_demands'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Fee Structures & Demands</span>
        </button>

        <button
          onClick={() => setActiveTab('collection_desk')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'collection_desk'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>2. Collection & Cashier Day-Close</span>
        </button>

        <button
          onClick={() => setActiveTab('utr_reconciliation')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'utr_reconciliation'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <FileCheck className="w-4 h-4 text-amber-600" />
          <span>3. UTR Audit & Idempotency</span>
        </button>

        <button
          onClick={() => setActiveTab('concessions_waivers')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'concessions_waivers'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>4. Concessions & No-Dues Desk</span>
        </button>

        <button
          onClick={() => setActiveTab('general_ledger')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'general_ledger'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-600" />
          <span>5. General Ledger & Vouchers</span>
        </button>

        <button
          onClick={() => setActiveTab('institution_finance')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'institution_finance'
              ? 'border-[#682038] text-[#682038] bg-white shadow-sm'
              : 'border-transparent text-[#6E6862] hover:text-[#242424]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>6. Institutional Budgets & Assets</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: FEE STRUCTURES & BULK DEMANDS                           */}
      {/* ============================================================== */}
      {activeTab === 'structures_demands' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase block">Total Active Fee Heads</span>
              <div className="text-2xl font-bold font-mono text-[#242424] mt-1">6 Heads Configured</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Linked directly to Chart of Accounts (COA)</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#16A34A] uppercase block">B.Tech Standard Semester Demand</span>
              <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">₹72,000 / Sem</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Composite total of tuition, labs, exams & amenities</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#682038] uppercase block">Late Fine Statutory Engine</span>
              <div className="text-2xl font-bold font-mono text-[#682038] mt-1">₹50 / Day</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Calculated automatically after 15-day grace window</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Configured Institutional Fee Heads & Chart of Accounts Mapping
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Defines revenue accounts credited automatically when student fee demands are realized.
                </p>
              </div>
              <button
                onClick={() => alert('Executing Bulk Demand Generation for Semester 4 (250 Students)...')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D] flex items-center gap-1.5 self-start"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run Bulk Semester Demand</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Head Code & Name</th>
                    <th className="px-4 py-3">Category Type</th>
                    <th className="px-4 py-3">COA Ledger Account</th>
                    <th className="px-4 py-3 text-right">Standard Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_FEE_HEADS.map((head) => (
                    <tr key={head.code} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#242424] text-sm">{head.name}</div>
                        <div className="font-mono text-[10px] text-[#682038]">{head.code}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#6E6862]">
                        {head.type.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#242424]">
                        {head.ledgerAccount}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sm text-[#242424]">
                        ₹{head.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: COLLECTION DESK & CASHIER DAY-CLOSE                    */}
      {/* ============================================================== */}
      {activeTab === 'collection_desk' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Cashier Counter Shift & Day-Close Reconciler
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Verifies physical cash drawer counts against system receipts before locking daily register.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    cashierSession.status === 'OPEN'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {cashierSession.status === 'OPEN' ? 'SHIFT OPEN & TRANSACTING' : 'SHIFT RECONCILED & CLOSED'}
                </span>
                {cashierSession.status === 'OPEN' && (
                  <button
                    onClick={handleCloseCashierDay}
                    className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D]"
                  >
                    Execute Day-Close
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Opening Cash Float</span>
                <span className="font-mono font-bold text-base text-[#242424]">
                  ₹{cashierSession.openingFloat.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Counter Cash Collected</span>
                <span className="font-mono font-bold text-base text-[#16A34A]">
                  ₹{cashierSession.cashCollected.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold block">POS Swipe & DD</span>
                <span className="font-mono font-bold text-base text-[#682038]">
                  ₹{(cashierSession.cardCollected + cashierSession.ddCollected).toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] text-emerald-900 uppercase font-bold block">Discrepancy / Variance</span>
                <span className="font-mono font-bold text-base text-emerald-700">₹0 (Exact Match)</span>
              </div>
            </div>
          </div>

          {/* Student Demands Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                Student Fee Demands & Collection Register ({demands.length} Students)
              </h3>
              <span className="text-xs text-[#6E6862]">Real-time balance synchronization</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Student & Program</th>
                    <th className="px-6 py-3.5 text-right">Total Demand</th>
                    <th className="px-6 py-3.5 text-right">Paid Amount</th>
                    <th className="px-6 py-3.5 text-right">Balance Due</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {demands.map((demand) => (
                    <tr key={demand.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{demand.studentName}</div>
                        <div className="font-mono text-[11px] text-[#682038]">
                          {demand.enrollmentNo} &bull; {demand.head}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-[#242424]">
                        ₹{demand.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-[#16A34A]">
                        ₹{demand.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-[#BA1A1A]">
                        ₹{demand.dueAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[#6E6862]">Net 15 Days (Active)</td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            demand.status === 'PAID'
                              ? 'bg-[#E8F5E9] text-[#16A34A]'
                              : demand.status === 'PARTIAL'
                              ? 'bg-[#FEF3C7] text-amber-800'
                              : 'bg-[#FFEBEE] text-[#BA1A1A]'
                          }`}
                        >
                          {demand.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: UTR RECONCILIATION & IDEMPOTENCY ENGINE                */}
      {/* ============================================================== */}
      {activeTab === 'utr_reconciliation' && (
        <div className="space-y-6">
          {/* Strict Idempotency Engine Simulation Callout */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D5B3BC] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#682038] text-white flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    Strict Idempotency Engine Visualizer (`src/platform/idempotency.service.ts`)
                  </h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Guarantees zero duplicate fee records when parents on flaky mobile connections double-tap Submit.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulatePaymentWithIdempotency}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ${
                  isLockActive
                    ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                    : 'bg-[#682038] hover:bg-[#54192D] text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isLockActive ? 'Simulate Rapid Duplicate Click' : 'Simulate Parent Fee Submission'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Generated Idempotency Key</span>
                <span className="font-mono text-[11px] text-[#682038] truncate block font-bold mt-0.5">{idempotencyKey}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Atomic Redis Lock State</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isLockActive ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  <span className="font-mono font-bold text-[11px] text-[#242424]">
                    {isLockActive ? `LOCKED (SET NX EX ${lockTimeRemaining}s)` : 'IDLE / AVAILABLE'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
                <span className="text-[10px] text-[#6E6862] uppercase font-bold block">Blocked Duplicate Attempts</span>
                <span className="font-mono font-bold text-[11px] text-[#BA1A1A] block mt-0.5">
                  {duplicateAttemptsBlocked > 0 ? `${duplicateAttemptsBlocked} duplicate clicks defused safely` : '0 duplicate taps'}
                </span>
              </div>
            </div>
          </div>

          {/* Two-Step Manual UTR Verification Desk */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Bursar Manual UTR Verification Desk ({utrSubmissions.length} Transactions)
                </h3>
                <span className="text-[11px] text-[#6E6862]">
                  Student balance remains untouched until Bursar audits physical bank statement.
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                Audit Desk Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Student Details</th>
                    <th className="px-6 py-3.5">Bank & Reference</th>
                    <th className="px-6 py-3.5">Amount Declared</th>
                    <th className="px-6 py-3.5">Submission Time</th>
                    <th className="px-6 py-3.5">Audit Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {utrSubmissions.map((utr) => (
                    <tr key={utr.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{utr.studentName}</div>
                        <div className="font-mono text-[11px] text-[#682038]">{utr.enrollmentNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-[#242424]">{utr.utrReference}</div>
                        <div className="text-[11px] text-[#6E6862]">{utr.bankName}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-sm text-[#242424]">
                        ₹{utr.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[#6E6862]">{utr.submittedAt}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            utr.status === 'APPROVED'
                              ? 'bg-[#E8F5E9] text-[#16A34A]'
                              : utr.status === 'REJECTED'
                              ? 'bg-[#FFEBEE] text-[#BA1A1A]'
                              : 'bg-[#FEF3C7] text-amber-800'
                          }`}
                        >
                          {utr.status === 'PENDING_VERIFICATION' ? 'Awaiting Audit' : utr.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {utr.status === 'PENDING_VERIFICATION' ? (
                          <button
                            onClick={() => setSelectedUtr(utr)}
                            className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white font-semibold text-xs transition-colors"
                          >
                            Audit & Reconcile
                          </button>
                        ) : (
                          <span className="text-xs text-[#9B948D] italic">Ledger Updated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Split-Screen Bursar Audit Modal */}
          {selectedUtr && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-[#682038]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#242424]">Split-Screen UTR Bank Reconciliation Desk</h3>
                    <p className="text-xs text-[#6E6862]">Verify UTR bank reference against campus bank statement before ledger cut.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] space-y-2 text-xs">
                    <div>
                      <span className="text-[#6E6862] block">Student Name:</span>
                      <span className="font-bold text-[#242424] text-sm">{selectedUtr.studentName}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Enrollment Number:</span>
                      <span className="font-mono font-bold text-[#682038]">{selectedUtr.enrollmentNo}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Amount to Credit:</span>
                      <span className="font-mono font-bold text-base text-[#16A34A]">₹{selectedUtr.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] space-y-2 text-xs">
                    <div>
                      <span className="text-[#6E6862] block">Declared Bank:</span>
                      <span className="font-bold text-[#242424]">{selectedUtr.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">UTR Transaction Hash:</span>
                      <span className="font-mono font-bold text-[#242424] break-all">{selectedUtr.utrReference}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6862] block">Date of NEFT/IMPS:</span>
                      <span className="font-mono text-[#242424]">{selectedUtr.submittedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleRejectUtr(selectedUtr)}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold"
                  >
                    Reject (Fake / Unmatched UTR)
                  </button>
                  <button
                    onClick={() => handleApproveUtr(selectedUtr)}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Post Ledger Cut</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CONCESSIONS, SCHOLARSHIPS & NO-DUES DESK                */}
      {/* ============================================================== */}
      {activeTab === 'concessions_waivers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Merit Concessions, Government Scholarships & No-Dues Desk
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Manages Dean's fee waivers, Post-Matric SC/ST government credits, and graduation no-dues sign-offs.
                </p>
              </div>
              <button
                onClick={() => alert('New Concession Application Form opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D]"
              >
                + Grant Concession
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#242424]">Dean's Merit Scholarship</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% Tuition</span>
                </div>
                <div className="text-xs text-[#6E6862] mt-1">Recipient: Vikramaditya Verma (2024CSE005)</div>
                <div className="font-mono font-bold text-sm text-[#16A34A] mt-2">₹45,000 Waived</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#242424]">State Post-Matric Welfare</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Govt Reimbursement</span>
                </div>
                <div className="text-xs text-[#6E6862] mt-1">Direct benefit transfer from State Social Welfare Dept</div>
                <div className="font-mono font-bold text-sm text-blue-700 mt-2">₹35,000 Credited</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#242424]">Staff Ward Fee Concession</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">50% Tuition</span>
                </div>
                <div className="text-xs text-[#6E6862] mt-1">Child of permanent institutional faculty/staff</div>
                <div className="font-mono font-bold text-sm text-purple-700 mt-2">₹22,500 Waived</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: GENERAL LEDGER & BALANCED VOUCHERS                      */}
      {/* ============================================================== */}
      {activeTab === 'general_ledger' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Double-Entry General Ledger & Balanced Vouchers
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Every transaction enforces mathematical equilibrium: Total Debits ≡ Total Credits.
                </p>
              </div>
              <button
                onClick={() => alert('New Double-Entry Journal Voucher Creator')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D] flex items-center gap-1.5 self-start"
              >
                <span>+ Create Journal Voucher</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Voucher No & Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Debit Ledger Account</th>
                    <th className="px-4 py-3">Credit Ledger Account</th>
                    <th className="px-4 py-3 text-right">Amount (₹)</th>
                    <th className="px-4 py-3 text-right">Equilibrium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-[#682038]">{v.voucherNo}</div>
                        <div className="text-[10px] text-[#6E6862]">{v.date}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#242424]">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5DFD7] font-mono text-[10px]">
                          {v.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-800">
                        {v.debitAccount}
                      </td>
                      <td className="px-4 py-3 font-mono text-blue-800">
                        {v.creditAccount}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sm text-[#242424]">
                        ₹{v.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <Check className="w-3 h-3" />
                          <span>BALANCED</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: INSTITUTION FINANCE, BUDGETS & FIXED ASSETS             */}
      {/* ============================================================== */}
      {activeTab === 'institution_finance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Departmental Capital & Operational Budget Variance (FY 2026-27)
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Real-time monitoring of fund commitments against Board-approved institutional grants.
                </p>
              </div>
              <button
                onClick={() => alert('Exporting Statutory Trial Balance and Balance Sheet PDF...')}
                className="px-3.5 py-1.5 rounded-lg border border-[#E5DFD7] text-xs font-bold text-[#6E6862] hover:bg-[#FAF7F2] flex items-center gap-1.5 self-start"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export Balance Sheet</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-4 py-3">Department / Facility</th>
                    <th className="px-4 py-3 text-right">Allocated Grant</th>
                    <th className="px-4 py-3 text-right">Utilized Expense</th>
                    <th className="px-4 py-3 text-right">Committed Orders</th>
                    <th className="px-4 py-3 text-right">Balance Available</th>
                    <th className="px-4 py-3 text-right">Utilization %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_BUDGETS.map((b) => (
                    <tr key={b.department} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-4 py-3 font-bold text-[#242424]">
                        {b.department}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium">
                        ₹{b.allocatedAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                        ₹{b.utilizedAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-amber-700">
                        ₹{b.committedAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#682038]">
                        ₹{b.balanceRemaining.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            b.utilizationPct >= 85
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {b.utilizationPct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
