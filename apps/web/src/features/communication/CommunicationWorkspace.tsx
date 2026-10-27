import React, { useState, useMemo } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Filter,
  Send,
  User,
  ChevronRight,
  Check,
  Plus,
  Paperclip,
  FileText,
  Smartphone,
  X,
  Search,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  Inbox,
} from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'EXAM' | 'EVENT' | 'URGENT' | 'CIRCULAR';
  audience: 'ALL' | 'FACULTY' | 'STUDENT' | 'DEPT_CSE';
  content: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL';
  totalRecipients: number;
  acknowledgedCount: number;
  hasAttachment?: boolean;
}

interface HelpdeskTicket {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentRoll: string;
  department: string;
  category: 'ACADEMIC_EVAL' | 'FEE_DISPUTE' | 'IT_WIFI' | 'HOSTEL_GRIEVANCE';
  subject: string;
  description: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  createdAt: string;
  slaDeadlineHours: number;
  hoursRemaining: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTo: string;
  internalNotes: string[];
}

interface ApprovalStep {
  stepName: string;
  role: string;
  status: 'APPROVED' | 'PENDING' | 'WAITING';
  approvedBy?: string;
  timestamp?: string;
}

interface ApprovalWorkflowItem {
  id: string;
  requestTitle: string;
  applicantName: string;
  applicantRoll: string;
  type: 'ON_DUTY_HACKATHON' | 'MEDICAL_LEAVE' | 'LAB_EQUIPMENT_GRANT';
  steps: ApprovalStep[];
}

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not-01',
    title: 'Autonomous End-Semester Examination Schedule (Winter 2026)',
    category: 'EXAM',
    audience: 'ALL',
    content:
      'The comprehensive autonomous timetable for all UG programs has been ratified by the Controller of Examinations. Hall tickets will be issued strictly to candidates possessing ≥75% attendance.',
    publishedAt: '2026-10-25 09:30 AM',
    author: 'Dr. Katherine Vance',
    authorRole: 'Controller of Examinations',
    priority: 'CRITICAL',
    totalRecipients: 2480,
    acknowledgedCount: 1942,
    hasAttachment: true,
  },
  {
    id: 'not-02',
    title: 'AICTE Smart India Hackathon Internal Selection Camp',
    category: 'ACADEMIC',
    audience: 'DEPT_CSE',
    content:
      'Shortlisted student teams for SIH 2026 must present software architecture diagrams before the Departmental Review Board on Thursday, 10:00 AM in Seminar Hall 2.',
    publishedAt: '2026-10-24 02:15 PM',
    author: 'Dr. Aris Thorne',
    authorRole: 'HOD Computer Science',
    priority: 'URGENT',
    totalRecipients: 420,
    acknowledgedCount: 388,
    hasAttachment: false,
  },
  {
    id: 'not-03',
    title: 'Statutory Campus Wi-Fi 6 Certificate Renewal Instructions',
    category: 'CIRCULAR',
    audience: 'FACULTY',
    content:
      'Faculty members must import the renewed root SSL certificate into their workstations to maintain uninterrupted access to internal IEEE research repositories.',
    publishedAt: '2026-10-23 11:00 AM',
    author: 'Rameshwar Naik',
    authorRole: 'Lead Systems Admin',
    priority: 'NORMAL',
    totalRecipients: 174,
    acknowledgedCount: 142,
    hasAttachment: true,
  },
];

const INITIAL_TICKETS: HelpdeskTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'TKT-2026-891',
    studentName: 'Sneha Patel',
    studentRoll: '2023CSE042',
    department: 'Computer Science',
    category: 'ACADEMIC_EVAL',
    subject: 'Mid-Sem Distributed Systems Retotaling Request',
    description:
      'Question 4 (Raft consensus algorithm) was awarded 2 marks instead of 8 marks according to the published model key.',
    priority: 'URGENT',
    createdAt: '2026-10-26 08:30 AM',
    slaDeadlineHours: 4,
    hoursRemaining: 1.2,
    status: 'OPEN',
    assignedTo: 'Prof. Sunita Rao',
    internalNotes: ['Model key cross-referenced with course coordinator; rechecking pending.'],
  },
  {
    id: 'tkt-102',
    ticketNumber: 'TKT-2026-887',
    studentName: 'Zaid Al-Mansoor',
    studentRoll: '2023CSE047',
    department: 'Computer Science',
    category: 'FEE_DISPUTE',
    subject: 'Hostel Mess Fee Double-Deduction Recheck',
    description:
      'Payment made via Netbanking on 22 Oct with UTR-AXIS-991823 was debited from account but ledger still showed unpaid dues until manually flagged.',
    priority: 'HIGH',
    createdAt: '2026-10-25 14:00 PM',
    slaDeadlineHours: 24,
    hoursRemaining: 6.5,
    status: 'IN_PROGRESS',
    assignedTo: 'Bursar Desk',
    internalNotes: ['Bank reconciliation report matched UTR; pending balance release voucher.'],
  },
  {
    id: 'tkt-103',
    ticketNumber: 'TKT-2026-874',
    studentName: 'Rahul Sharma',
    studentRoll: '2023CSE041',
    department: 'Computer Science',
    category: 'IT_WIFI',
    subject: 'MAC Address Binding for Linux Laptop in Lab 4',
    description:
      'Device MAC address (a4:c3:f0:19:92:44) rejected by radius server during practical lab session.',
    priority: 'NORMAL',
    createdAt: '2026-10-24 10:15 AM',
    slaDeadlineHours: 72,
    hoursRemaining: 34.0,
    status: 'RESOLVED',
    assignedTo: 'Rameshwar Naik',
    internalNotes: ['RADIUS client record provisioned with 802.1x credentials.'],
  },
];

const INITIAL_WORKFLOWS: ApprovalWorkflowItem[] = [
  {
    id: 'wf-01',
    requestTitle: 'On-Duty Leave for SIH National Hackathon',
    applicantName: 'Vikramaditya Verma',
    applicantRoll: '2023CSE043',
    type: 'ON_DUTY_HACKATHON',
    steps: [
      { stepName: 'Faculty Mentor', role: 'Dr. Sunita Rao', status: 'APPROVED', approvedBy: 'S. Rao', timestamp: '24 Oct 10:00' },
      { stepName: 'Head of Department', role: 'Dr. Aris Thorne', status: 'APPROVED', approvedBy: 'A. Thorne', timestamp: '24 Oct 14:30' },
      { stepName: 'Dean Student Affairs', role: 'Prof. C. Mathur', status: 'PENDING' },
      { stepName: 'Academic Office', role: 'Registrar', status: 'WAITING' },
    ],
  },
];

export const CommunicationWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'notices' | 'helpdesk' | 'approvals'>('helpdesk');
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(INITIAL_TICKETS);
  const [workflows, setWorkflows] = useState<ApprovalWorkflowItem[]>(INITIAL_WORKFLOWS);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [ticketFilter, setTicketFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [newNote, setNewNote] = useState('');
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'ALL' | 'FACULTY' | 'STUDENT' | 'DEPT_CSE'>('ALL');

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    if (ticketFilter === 'ALL') return tickets;
    return tickets.filter((t) => t.status === ticketFilter);
  }, [tickets, ticketFilter]);

  // Handle note addition & resolution
  const handleAddNote = () => {
    if (!selectedTicket || !newNote.trim()) return;
    const updated = {
      ...selectedTicket,
      internalNotes: [...selectedTicket.internalNotes, newNote.trim()],
    };
    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setNewNote('');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: 'RESOLVED' } : null));
    }
  };

  // Publish new notice
  const handlePublishNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    const newNotice: NoticeItem = {
      id: `not-${Date.now()}`,
      title: noticeTitle.trim(),
      category: 'CIRCULAR',
      audience: noticeAudience,
      content: noticeContent.trim(),
      publishedAt: 'Just now',
      author: 'Academic Administration',
      authorRole: 'Registrar Office',
      priority: 'NORMAL',
      totalRecipients: noticeAudience === 'ALL' ? 2480 : 420,
      acknowledgedCount: 1,
    };
    setNotices([newNotice, ...notices]);
    setIsCreateNoticeOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#682038]/10 text-[#682038]">
              Module 07
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Zero-SMS Architecture & SLA Helpdesk
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              WebSocket Push + Email Active
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Communication, Circulars & SLA Helpdesk</h1>
          <p className="text-xs text-[#6E6862]">
            Cost-optimized institutional broadcasting, automated SLA escalation queues, and multi-step governance approval workflows.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DFD7]">
          <button
            onClick={() => setSubTab('helpdesk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'helpdesk'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>SLA Helpdesk</span>
            {tickets.filter((t) => t.status !== 'RESOLVED').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {tickets.filter((t) => t.status !== 'RESOLVED').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('notices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'notices'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notice Board</span>
          </button>

          <button
            onClick={() => setSubTab('approvals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'approvals'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Approval Stepper</span>
          </button>
        </div>
      </div>

      {/* Cost-Saving Zero-SMS / Zero-WhatsApp Banner */}
      <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-4 flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs text-[#242424]">
          <span className="font-bold text-sm">Cost-Optimized Communication Architecture (Strict Zero-SMS Policy):</span>
          <p className="text-[#6E6862]">
            Third-party SMS gateways and WhatsApp Business API tolls are completely eliminated. All campus broadcasts and transactional alerts are transmitted via real-time WebSocket Push notifications and institutional SMTP email servers at <strong>₹0 marginal cost</strong>.
          </p>
        </div>
      </div>

      {/* SUB-TAB 1: SLA HELPDESK TICKETING QUEUE */}
      {subTab === 'helpdesk' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5DFD7]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#242424]">Ticket Status Filter:</span>
              {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setTicketFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    ticketFilter === status
                      ? 'bg-[#682038] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#6E6862]">
              Strict SLAs: <strong>Urgent: 4h</strong> • <strong>High: 24h</strong> • <strong>Normal: 72h</strong>
            </div>
          </div>

          {/* Ticket Grid & Detail Drawer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Ticket Cards List */}
            <div className="lg:col-span-2 space-y-3">
              {filteredTickets.map((tkt) => {
                const isUrgent = tkt.priority === 'URGENT';
                const isSelected = selectedTicket?.id === tkt.id;

                return (
                  <div
                    key={tkt.id}
                    onClick={() => setSelectedTicket(tkt)}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#682038] shadow-md ring-1 ring-[#682038]'
                        : 'border-[#E5DFD7] hover:border-[#8B5E3C] shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#682038]">{tkt.ticketNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                            {tkt.category.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#242424]">{tkt.subject}</h3>
                      </div>

                      {/* SLA Timer Badge */}
                      {tkt.status !== 'RESOLVED' ? (
                        <div
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                            tkt.hoursRemaining < 2
                              ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{tkt.hoursRemaining.toFixed(1)}h remaining</span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6E6862] line-clamp-2 mb-3">{tkt.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-[#6E6862] pt-3 border-t border-[#E5DFD7]">
                      <div>
                        <span className="font-semibold text-[#242424]">{tkt.studentName}</span> ({tkt.studentRoll} • {tkt.department})
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Assigned to: <strong>{tkt.assignedTo}</strong></span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Ticket Detail & Action Panel */}
            <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-sm space-y-4">
              {selectedTicket ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#682038]">{selectedTicket.ticketNumber}</span>
                      <h4 className="font-bold text-sm text-[#242424]">{selectedTicket.subject}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedTicket.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedTicket.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#6E6862] space-y-1">
                    <div>
                      <span className="font-medium text-[#242424]">Student: </span>
                      {selectedTicket.studentName} ({selectedTicket.studentRoll})
                    </div>
                    <div>
                      <span className="font-medium text-[#242424]">Created At: </span>
                      {selectedTicket.createdAt}
                    </div>
                    <div>
                      <span className="font-medium text-[#242424]">Assigned Handler: </span>
                      <span className="font-bold text-[#682038]">{selectedTicket.assignedTo}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD7] text-xs text-[#242424]">
                    <span className="font-semibold block text-[#6E6862] text-[10px] uppercase mb-1">
                      Issue Description:
                    </span>
                    {selectedTicket.description}
                  </div>

                  {/* Internal Resolution Notes */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#242424]">Internal Resolution Log:</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {selectedTicket.internalNotes.map((note, idx) => (
                        <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Note Input */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Add staff investigation note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      className="w-full text-xs p-2 rounded-lg border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-xs font-semibold border border-[#E5DFD7] disabled:opacity-50"
                      >
                        Add Internal Note
                      </button>

                      {selectedTicket.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleResolveTicket(selectedTicket.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve Ticket</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[#6E6862] space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-[#8B5E3C]/40" />
                  <p className="text-xs">Select a grievance ticket from the queue to review SLA deadlines and post resolution vouchers.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TARGETED NOTICE BOARD */}
      {subTab === 'notices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#242424]">Campus Circulars & Administrative Gazettes</h3>
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Circular</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => {
              const readPct = Math.round((notice.acknowledgedCount / notice.totalRecipients) * 100);

              return (
                <div key={notice.id} className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                        {notice.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          notice.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : notice.priority === 'URGENT'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {notice.priority}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#242424] leading-snug">{notice.title}</h4>
                    <p className="text-xs text-[#6E6862] leading-relaxed">{notice.content}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#E5DFD7] text-xs">
                    <div className="flex items-center justify-between text-[11px] text-[#6E6862]">
                      <span>{notice.author}</span>
                      <span>{notice.publishedAt}</span>
                    </div>

                    {/* Read Receipt Tracker */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-medium text-[#6E6862]">
                        <span>Read Receipts (In-App)</span>
                        <span className="font-mono font-bold text-[#242424]">{readPct}% ({notice.acknowledgedCount}/{notice.totalRecipients})</span>
                      </div>
                      <div className="w-full bg-[#E5DFD7] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#682038] h-full rounded-full" style={{ width: `${readPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MULTI-STEP APPROVAL WORKFLOW STEPPER */}
      {subTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Multi-Party Institutional Approval Workflows</h3>
                <p className="text-xs text-[#6E6862]">
                  Sequential cryptographic signoffs for statutory leaves, travel grants, and hardware procurement.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                1 Pending Approval
              </span>
            </div>

            {workflows.map((wf) => (
              <div key={wf.id} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E5DFD7] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#242424]">{wf.requestTitle}</h4>
                    <span className="text-xs text-[#6E6862]">
                      Applicant: <strong>{wf.applicantName}</strong> ({wf.applicantRoll})
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#682038]/10 text-[#682038]">
                    {wf.type}
                  </span>
                </div>

                {/* Horizontal Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
                  {wf.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 relative ${
                        st.status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : st.status === 'PENDING'
                          ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400'
                          : 'bg-white border-[#E5DFD7] text-[#6E6862]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px]">Step {idx + 1}</span>
                        {st.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {st.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
                      </div>
                      <div className="font-semibold text-xs text-[#242424]">{st.stepName}</div>
                      <div className="text-[10px] text-[#6E6862]">{st.role}</div>
                      {st.approvedBy && (
                        <div className="text-[9px] font-mono text-emerald-700">Signed: {st.approvedBy} ({st.timestamp})</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {isCreateNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <h3 className="font-bold text-sm text-[#242424]">Publish Official Campus Circular</h3>
              <button onClick={() => setIsCreateNoticeOpen(false)} className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#242424]">Circular Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule of Autonomous Re-examinations..."
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#242424]">Target Audience:</label>
                <select
                  value={noticeAudience}
                  onChange={(e) => setNoticeAudience(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none"
                >
                  <option value="ALL">Entire Campus (Students + Faculty)</option>
                  <option value="FACULTY">Faculty & Administrative Staff Only</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="DEPT_CSE">Computer Science Department Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#242424]">Circular Text:</label>
                <textarea
                  rows={4}
                  placeholder="Draft the official circular notice..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreateNoticeOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishNotice}
                disabled={!noticeTitle.trim() || !noticeContent.trim()}
                className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm disabled:opacity-50"
              >
                Broadcast to In-App & Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
