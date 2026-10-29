import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building,
  GraduationCap,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  FileText,
  DollarSign,
  ChevronRight,
  Download,
  Check,
  X,
  AlertCircle,
  Plus,
  Sparkles,
  ExternalLink,
  Target,
  BarChart3,
  BadgeAlert,
  Send,
  Video,
  MapPin,
  UserCheck,
  FileCheck,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export interface RecruitmentDrive {
  id: string;
  companyName: string;
  roleTitle: string;
  jobLocation: string;
  ctcPackage: number; // in LPA (Lakhs Per Annum)
  stipendDuringInternship?: number; // per month
  tier: 'SUPER_DREAM' | 'DREAM' | 'REGULAR';
  eligibleBranches: string[];
  minCgpa: number;
  maxActiveBacklogs: number;
  driveDate: string;
  deadlineDate: string;
  status: 'OPEN' | 'ONGOING' | 'COMPLETED';
  totalApplied: number;
  shortlistedCount: number;
  offersReleased: number;
  jdSummary: string;
}

export type PipelineStage =
  | 'APPLIED'
  | 'OA_SHORTLISTED'
  | 'TECH_ROUND_1'
  | 'TECH_ROUND_2'
  | 'HR_ROUND'
  | 'OFFER_RELEASED';

export interface StudentApplication {
  id: string;
  driveId: string;
  companyName: string;
  roleTitle: string;
  studentName: string;
  rollNo: string;
  enrollmentNo: string;
  branch: string;
  cgpa: number;
  activeBacklogs: number;
  appliedDate: string;
  currentStage: PipelineStage;
  offerCtc?: number;
  baseSalary?: number; // in LPA
  variableBonus?: number; // in LPA
  joiningBonus?: number; // in LPA
  stockOptions?: number; // in LPA
  isDreamOffer: boolean;
  status: 'IN_PROCESS' | 'OFFERED' | 'REJECTED' | 'ACCEPTED';
}

export interface InterviewSlot {
  id: string;
  companyName: string;
  roleTitle: string;
  studentName: string;
  rollNo: string;
  panelNumber: string; // e.g. "Panel 1 - Technical Architecture"
  slotTime: string;
  roomLocation: string; // e.g. "T&P Boardroom 2B / MS Teams"
  interviewerName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'CLEARED' | 'NOT_CLEARED';
}

export interface StudentResumeVerification {
  id: string;
  studentName: string;
  rollNo: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  atsScore: number; // 0 - 100
  mockTestRank: number;
  resumeUrl: string;
  status: 'APPROVED' | 'CHANGES_REQUESTED' | 'PENDING_REVIEW';
  reviewerFeedback?: string;
}

export interface InternshipRecord {
  id: string;
  studentName: string;
  rollNo: string;
  companyName: string;
  roleTitle: string;
  durationMonths: number;
  monthlyStipend: number;
  supervisorName: string;
  supervisorScore: number; // out of 10
  ppoStatus: 'PPO_OFFERED' | 'UNDER_REVIEW' | 'NOT_OFFERED';
}

const INITIAL_DRIVES: RecruitmentDrive[] = [
  {
    id: 'drv-1',
    companyName: 'Google Cloud India',
    roleTitle: 'Cloud Software Engineer (Campus APM)',
    jobLocation: 'Bengaluru / Hyderabad',
    ctcPackage: 38.5,
    stipendDuringInternship: 110000,
    tier: 'SUPER_DREAM',
    eligibleBranches: ['Computer Science', 'Electronics & Comm', 'Information Science'],
    minCgpa: 8.0,
    maxActiveBacklogs: 0,
    driveDate: '2026-11-04',
    deadlineDate: '2026-11-02',
    status: 'ONGOING',
    totalApplied: 142,
    shortlistedCount: 28,
    offersReleased: 4,
    jdSummary:
      'Building large-scale distributed Kubernetes orchestrators, zero-trust infrastructure, and low-latency gRPC internal microservices.',
  },
  {
    id: 'drv-2',
    companyName: 'Microsoft Corporation',
    roleTitle: 'Software Development Engineer I (Azure)',
    jobLocation: 'Bengaluru / Noida',
    ctcPackage: 42.0,
    stipendDuringInternship: 125000,
    tier: 'SUPER_DREAM',
    eligibleBranches: ['Computer Science', 'Information Science'],
    minCgpa: 8.2,
    maxActiveBacklogs: 0,
    driveDate: '2026-11-08',
    deadlineDate: '2026-11-05',
    status: 'OPEN',
    totalApplied: 188,
    shortlistedCount: 36,
    offersReleased: 0,
    jdSummary:
      'Core Azure compute fabrics, hyper-scale cloud telemetry platforms, and high-performance C++/Rust kernel optimizations.',
  },
  {
    id: 'drv-3',
    companyName: 'Cisco Systems',
    roleTitle: 'Network Software Engineer',
    jobLocation: 'Bengaluru',
    ctcPackage: 18.2,
    stipendDuringInternship: 75000,
    tier: 'DREAM',
    eligibleBranches: ['Computer Science', 'Electronics & Comm', 'Telecommunication'],
    minCgpa: 7.2,
    maxActiveBacklogs: 0,
    driveDate: '2026-10-24',
    deadlineDate: '2026-10-20',
    status: 'COMPLETED',
    totalApplied: 210,
    shortlistedCount: 45,
    offersReleased: 12,
    jdSummary:
      'Routing protocols, software-defined enterprise networking (SD-WAN), and network virtualization architectures.',
  },
  {
    id: 'drv-4',
    companyName: 'Tata Consultancy Services (Digital)',
    roleTitle: 'Systems Engineer & Digital Architect',
    jobLocation: 'Pan India',
    ctcPackage: 7.5,
    stipendDuringInternship: 30000,
    tier: 'REGULAR',
    eligibleBranches: ['All Engineering Branches'],
    minCgpa: 6.5,
    maxActiveBacklogs: 1,
    driveDate: '2026-10-18',
    deadlineDate: '2026-10-15',
    status: 'COMPLETED',
    totalApplied: 480,
    shortlistedCount: 160,
    offersReleased: 84,
    jdSummary:
      'Enterprise Java / Spring cloud modernization, full-stack microservices, and AI-enabled data engineering pipelines.',
  },
];

const INITIAL_APPLICATIONS: StudentApplication[] = [
  {
    id: 'app-1',
    driveId: 'drv-1',
    companyName: 'Google Cloud India',
    roleTitle: 'Cloud Software Engineer',
    studentName: 'Aarav Sharma',
    rollNo: '26CS01',
    enrollmentNo: 'EN2026-CSE-001',
    branch: 'Computer Science',
    cgpa: 9.15,
    activeBacklogs: 0,
    appliedDate: '2026-10-28',
    currentStage: 'TECH_ROUND_2',
    isDreamOffer: true,
    status: 'IN_PROCESS',
  },
  {
    id: 'app-2',
    driveId: 'drv-1',
    companyName: 'Google Cloud India',
    roleTitle: 'Cloud Software Engineer',
    studentName: 'Diya Patel',
    rollNo: '26CS02',
    enrollmentNo: 'EN2026-CSE-002',
    branch: 'Computer Science',
    cgpa: 8.85,
    activeBacklogs: 0,
    appliedDate: '2026-10-28',
    currentStage: 'OFFER_RELEASED',
    offerCtc: 38.5,
    baseSalary: 22.0,
    variableBonus: 4.5,
    joiningBonus: 5.0,
    stockOptions: 7.0,
    isDreamOffer: true,
    status: 'OFFERED',
  },
  {
    id: 'app-3',
    driveId: 'drv-3',
    companyName: 'Cisco Systems',
    roleTitle: 'Network Software Engineer',
    studentName: 'Rohan Verma',
    rollNo: '26EC15',
    enrollmentNo: 'EN2026-ECE-015',
    branch: 'Electronics & Comm',
    cgpa: 8.4,
    activeBacklogs: 0,
    appliedDate: '2026-10-22',
    currentStage: 'OFFER_RELEASED',
    offerCtc: 18.2,
    baseSalary: 14.0,
    variableBonus: 2.2,
    joiningBonus: 2.0,
    stockOptions: 0,
    isDreamOffer: true,
    status: 'ACCEPTED',
  },
  {
    id: 'app-4',
    driveId: 'drv-4',
    companyName: 'Tata Consultancy Services (Digital)',
    roleTitle: 'Digital Systems Engineer',
    studentName: 'Tarun Saxena',
    rollNo: '26ME08',
    enrollmentNo: 'EN2026-MEC-008',
    branch: 'Mechanical Engg',
    cgpa: 7.3,
    activeBacklogs: 0,
    appliedDate: '2026-10-16',
    currentStage: 'OFFER_RELEASED',
    offerCtc: 7.5,
    baseSalary: 6.5,
    variableBonus: 1.0,
    joiningBonus: 0,
    stockOptions: 0,
    isDreamOffer: false,
    status: 'ACCEPTED',
  },
];

const INITIAL_INTERVIEWS: InterviewSlot[] = [
  {
    id: 'slot-1',
    companyName: 'Google Cloud India',
    roleTitle: 'Cloud Software Engineer',
    studentName: 'Aarav Sharma',
    rollNo: '26CS01',
    panelNumber: 'Panel 1 — Distributed Systems Architecture',
    slotTime: 'Today, 14:30 - 15:15 IST',
    roomLocation: 'T&P Interview Boardroom 2B',
    interviewerName: 'Sundar Narayanan (Principal SRE)',
    status: 'IN_PROGRESS',
  },
  {
    id: 'slot-2',
    companyName: 'Microsoft Corporation',
    roleTitle: 'Software Development Engineer I (Azure)',
    studentName: 'Vikram Seth',
    rollNo: '26CS14',
    panelNumber: 'Panel 2 — Algorithms & Data Fabrics',
    slotTime: 'Tomorrow, 10:00 - 10:45 IST',
    roomLocation: 'T&P Virtual Room Alpha (MS Teams)',
    interviewerName: 'Preeti Deshmukh (Partner SDE)',
    status: 'SCHEDULED',
  },
];

const INITIAL_RESUMES: StudentResumeVerification[] = [
  {
    id: 'res-1',
    studentName: 'Aarav Sharma',
    rollNo: '26CS01',
    branch: 'Computer Science',
    cgpa: 9.15,
    backlogs: 0,
    atsScore: 94,
    mockTestRank: 3,
    resumeUrl: 'https://campus.edu/resumes/26CS01_Aarav_Sharma.pdf',
    status: 'APPROVED',
    reviewerFeedback: 'Excellent ATS compliance. Strong distributed systems projects and open-source contributions.',
  },
  {
    id: 'res-2',
    studentName: 'Sneha Roy',
    rollNo: '26CS22',
    branch: 'Computer Science',
    cgpa: 8.1,
    backlogs: 0,
    atsScore: 78,
    mockTestRank: 19,
    resumeUrl: 'https://campus.edu/resumes/26CS22_Sneha_Roy.pdf',
    status: 'CHANGES_REQUESTED',
    reviewerFeedback: 'Replace two-column layout with single-column ATS format. Add quantitative metrics to internship bullet points.',
  },
  {
    id: 'res-3',
    studentName: 'Naveen Kumar',
    rollNo: '26EC31',
    branch: 'Electronics & Comm',
    cgpa: 7.6,
    backlogs: 0,
    atsScore: 82,
    mockTestRank: 27,
    resumeUrl: 'https://campus.edu/resumes/26EC31_Naveen_Kumar.pdf',
    status: 'PENDING_REVIEW',
  },
];

const INITIAL_INTERNSHIPS: InternshipRecord[] = [
  {
    id: 'int-1',
    studentName: 'Diya Patel',
    rollNo: '26CS02',
    companyName: 'Google India',
    roleTitle: 'Software Engineering Intern',
    durationMonths: 6,
    monthlyStipend: 110000,
    supervisorName: 'Karthik Raman (Staff SRE)',
    supervisorScore: 9.8,
    ppoStatus: 'PPO_OFFERED',
  },
  {
    id: 'int-2',
    studentName: 'Rohan Verma',
    rollNo: '26EC15',
    companyName: 'Cisco Systems',
    roleTitle: 'Embedded Network Engineering Intern',
    durationMonths: 6,
    monthlyStipend: 75000,
    supervisorName: 'Anil Deshpande (Director Eng)',
    supervisorScore: 9.4,
    ppoStatus: 'PPO_OFFERED',
  },
  {
    id: 'int-3',
    studentName: 'Tarun Saxena',
    rollNo: '26ME08',
    companyName: 'Bosch Engineering',
    roleTitle: 'Automotive Robotics Trainee',
    durationMonths: 4,
    monthlyStipend: 45000,
    supervisorName: 'Matthias Weber (Team Lead)',
    supervisorScore: 8.6,
    ppoStatus: 'UNDER_REVIEW',
  },
];

const STAGE_LABELS: Record<PipelineStage, string> = {
  APPLIED: '1. Application Submitted',
  OA_SHORTLISTED: '2. Online Assessment Cleared',
  TECH_ROUND_1: '3. Technical Interview I',
  TECH_ROUND_2: '4. Technical Interview II',
  HR_ROUND: '5. Behavioral / HR Round',
  OFFER_RELEASED: '6. Formal Offer Letter Extended',
};

export const PlacementWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'drives' | 'tracker' | 'interviews' | 'resumes' | 'internships' | 'analytics'>('drives');
  const [drives, setDrives] = useState<RecruitmentDrive[]>(INITIAL_DRIVES);
  const [applications, setApplications] = useState<StudentApplication[]>(INITIAL_APPLICATIONS);
  const [interviews, setInterviews] = useState<InterviewSlot[]>(INITIAL_INTERVIEWS);
  const [resumes, setResumes] = useState<StudentResumeVerification[]>(INITIAL_RESUMES);
  const [internships, setInternships] = useState<InternshipRecord[]>(INITIAL_INTERNSHIPS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  // Modals
  const [isNewDriveModalOpen, setIsNewDriveModalOpen] = useState(false);
  const [selectedAppForOffer, setSelectedAppForOffer] = useState<StudentApplication | null>(null);
  const [activeResumeForReview, setActiveResumeForReview] = useState<StudentResumeVerification | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');

  // New Drive Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newCtc, setNewCtc] = useState<number>(14.5);
  const [newStipend, setNewStipend] = useState<number>(50000);
  const [newLocation, setNewLocation] = useState('Bengaluru');
  const [newTier, setNewTier] = useState<'SUPER_DREAM' | 'DREAM' | 'REGULAR'>('DREAM');
  const [newMinCgpa, setNewMinCgpa] = useState<number>(7.5);
  const [newDriveDate, setNewDriveDate] = useState('2026-11-15');
  const [newJdSummary, setNewJdSummary] = useState('');

  // Advance Candidate Stage in Pipeline
  const handleAdvanceStage = (appId: string) => {
    const stageFlow: PipelineStage[] = [
      'APPLIED',
      'OA_SHORTLISTED',
      'TECH_ROUND_1',
      'TECH_ROUND_2',
      'HR_ROUND',
      'OFFER_RELEASED',
    ];

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentIndex = stageFlow.indexOf(app.currentStage);
        if (currentIndex < stageFlow.length - 1) {
          const nextStage = stageFlow[currentIndex + 1];
          return {
            ...app,
            currentStage: nextStage,
            status: nextStage === 'OFFER_RELEASED' ? 'OFFERED' : app.status,
            offerCtc: nextStage === 'OFFER_RELEASED' ? app.offerCtc || 24.0 : app.offerCtc,
          };
        }
        return app;
      })
    );
    alert('Candidate stage advanced cleanly in placement pipeline!');
  };

  // Reject Candidate
  const handleRejectCandidate = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'REJECTED' } : app))
    );
    alert('Candidate status updated to Rejected for this recruitment drive.');
  };

  // Approve Resume
  const handleApproveResume = (resumeId: string) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === resumeId
          ? {
              ...r,
              status: 'APPROVED',
              reviewerFeedback: 'Approved by T&P Verification Desk for campus recruitment registration.',
            }
          : r
      )
    );
    alert('Student resume approved and unlocked for campus drive applications!');
  };

  // Request Changes on Resume
  const handleRequestResumeChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResumeForReview) return;
    setResumes((prev) =>
      prev.map((r) =>
        r.id === activeResumeForReview.id
          ? {
              ...r,
              status: 'CHANGES_REQUESTED',
              reviewerFeedback: feedbackInput || 'Update resume ATS formatting.',
            }
          : r
      )
    );
    alert('Feedback sent to student via institutional portal!');
    setActiveResumeForReview(null);
    setFeedbackInput('');
  };

  // Create New Drive Action
  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RecruitmentDrive = {
      id: `drv-${Date.now().toString(36)}`,
      companyName: newCompanyName,
      roleTitle: newRoleTitle,
      jobLocation: newLocation,
      ctcPackage: Number(newCtc),
      stipendDuringInternship: Number(newStipend),
      tier: newTier,
      eligibleBranches: ['Computer Science', 'Information Science', 'Electronics & Comm'],
      minCgpa: Number(newMinCgpa),
      maxActiveBacklogs: 0,
      driveDate: newDriveDate,
      deadlineDate: newDriveDate,
      status: 'OPEN',
      totalApplied: 0,
      shortlistedCount: 0,
      offersReleased: 0,
      jdSummary: newJdSummary || 'Engineering roles in campus recruitments.',
    };

    setDrives([created, ...drives]);
    setIsNewDriveModalOpen(false);
    setNewCompanyName('');
    setNewRoleTitle('');
    alert(`Recruitment drive for ${created.companyName} registered and published!`);
  };

  // Filtered drives
  const filteredDrives = useMemo(() => {
    return drives.filter((d) => {
      const matchSearch =
        d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = selectedTier === 'ALL' || d.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [drives, searchQuery, selectedTier]);

  // Aggregate Metrics (NIRF Parameter 3)
  const metrics = useMemo(() => {
    const totalDrives = drives.length;
    const totalPlaced = applications.filter((a) => a.status === 'OFFERED' || a.status === 'ACCEPTED').length;
    const superDreamOffers = applications.filter((a) => a.offerCtc && a.offerCtc >= 20.0).length;
    const highestPackage = Math.max(...drives.map((d) => d.ctcPackage));
    const allCtcs = applications.filter((a) => a.offerCtc).map((a) => a.offerCtc as number);
    const medianPackage = allCtcs.length > 0 ? (allCtcs.reduce((a, b) => a + b, 0) / allCtcs.length).toFixed(1) : '12.4';
    return { totalDrives, totalPlaced, superDreamOffers, highestPackage, medianPackage };
  }, [drives, applications]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Training &amp; Placement Cell (T&amp;P Directorate)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              NIRF Parameter 3 Compliant
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              AICTE Tier-1 Corporate MoUs
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Corporate Recruitment &amp; Placement Career Hub</h1>
          <p className="text-xs text-[#6E6862]">
            Campus recruitment drives, 6-stage candidate selection pipelines, interview panel scheduling, resume ATS verification, and NIRF returns.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsNewDriveModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Campus Drive</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSubTab('drives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'drives'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#FB923C]" />
          <span>Recruitment Drives ({drives.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'tracker'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Target className="w-4 h-4 text-[#FB923C]" />
          <span>Selection Pipeline Stepper ({applications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('interviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'interviews'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Video className="w-4 h-4 text-[#FB923C]" />
          <span>Interview Scheduler ({interviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('resumes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'resumes'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#FB923C]" />
          <span>Resume &amp; ATS Verification ({resumes.filter((r) => r.status === 'PENDING_REVIEW').length} Pending)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('internships')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'internships'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#FB923C]" />
          <span>Internship &amp; PPO Registry</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'analytics'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FB923C]" />
          <span>NIRF Parameter 3 &amp; NAAC Returns</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Registered Drives</div>
          <div className="text-xl font-bold text-[#682038]">{metrics.totalDrives} Companies</div>
          <div className="text-[10px] text-[#8B5E3C]">Active campus partners</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Total Placed Offers</div>
          <div className="text-xl font-bold text-emerald-700">{metrics.totalPlaced} Students</div>
          <div className="text-[10px] text-emerald-600">88.4% Placement Realization</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Highest CTC Package</div>
          <div className="text-xl font-bold text-[#682038]">₹{metrics.highestPackage} LPA</div>
          <div className="text-[10px] text-[#8B5E3C]">Microsoft Azure SDE</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Median Salary (NIRF)</div>
          <div className="text-xl font-bold text-blue-700">₹{metrics.medianPackage} LPA</div>
          <div className="text-[10px] text-blue-600">Verified for NIRF Ranking</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Super Dream (&gt;= 20 LPA)</div>
          <div className="text-xl font-bold text-amber-700">{metrics.superDreamOffers} Offers</div>
          <div className="text-[10px] text-amber-600">Tier-1 FAANG / Cloud</div>
        </div>
      </div>

      {/* TAB 1: RECRUITMENT DRIVES */}
      {subTab === 'drives' && (
        <div className="space-y-4">
          {/* Search & Tier Filters */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Company Name or Role Title..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#242424] focus:outline-none focus:border-[#682038]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs font-semibold text-[#242424] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Compensation Tiers</option>
                <option value="SUPER_DREAM">Super Dream (&gt;= 20 LPA)</option>
                <option value="DREAM">Dream (10 - 20 LPA)</option>
                <option value="REGULAR">Regular / Mass (&lt; 10 LPA)</option>
              </select>
            </div>
          </div>

          {/* Drives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrives.map((drv) => (
              <div
                key={drv.id}
                className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs flex flex-col justify-between hover:border-[#682038]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          drv.tier === 'SUPER_DREAM'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : drv.tier === 'DREAM'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {drv.tier.replace('_', ' ')}
                      </span>
                      <h3 className="font-bold text-base text-[#242424] mt-1.5">{drv.companyName}</h3>
                      <p className="text-xs text-[#6E6862]">{drv.roleTitle}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-[#682038]">₹{drv.ctcPackage} LPA</div>
                      <div className="text-[10px] text-[#6E6862]">
                        {drv.stipendDuringInternship ? `₹${drv.stipendDuringInternship.toLocaleString()}/mo stipend` : 'Full-time CTC'}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#6E6862] line-clamp-2">{drv.jdSummary}</p>

                  <div className="bg-[#FAF7F2] rounded-xl p-3 text-xs space-y-1.5 border border-[#EFE9E1]">
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Location:</span>
                      <span className="font-semibold text-[#242424]">{drv.jobLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Cutoff Eligibility:</span>
                      <span className="font-semibold text-[#682038]">Min {drv.minCgpa} CGPA • 0 Backlogs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Drive Schedule Date:</span>
                      <span className="font-mono text-[#242424]">{drv.driveDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFE9E1] flex items-center justify-between text-xs mt-4">
                  <span className="text-[#6E6862] font-medium">
                    Applied: <strong className="text-[#242424]">{drv.totalApplied}</strong> | Shortlisted: <strong className="text-[#682038]">{drv.shortlistedCount}</strong>
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {drv.offersReleased} Offers Released
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SELECTION PIPELINE TRACKER */}
      {subTab === 'tracker' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Candidate 6-Stage Selection Stepper</h3>
                <p className="text-xs text-[#6E6862]">
                  Progress candidates sequentially from Application to Online Assessment, Technical Rounds, HR, and Offer Issuance.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Candidate Details</th>
                    <th className="p-3.5">Target Drive</th>
                    <th className="p-3.5">CGPA &amp; Backlogs</th>
                    <th className="p-3.5">Current Stage (1 to 6)</th>
                    <th className="p-3.5">Compensation</th>
                    <th className="p-3.5 text-right">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[#242424]">{app.studentName}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{app.rollNo} • {app.branch}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#242424]">{app.companyName}</div>
                        <div className="text-[10px] text-[#6E6862]">{app.roleTitle}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#682038]">{app.cgpa} CGPA</span>
                        <div className="text-[10px] text-emerald-700">{app.activeBacklogs} Backlogs</div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F4ECEE] text-[#682038] border border-[#E5DFD7]">
                          {STAGE_LABELS[app.currentStage]}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {app.offerCtc ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-800 font-mono">₹{app.offerCtc} LPA</span>
                            <button
                              type="button"
                              onClick={() => setSelectedAppForOffer(app)}
                              className="block text-[10px] text-[#8B5E3C] underline cursor-pointer hover:text-[#682038]"
                            >
                              View CTC Breakdown &rarr;
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#6E6862]">Pending Final Round</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {app.status === 'IN_PROCESS' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAdvanceStage(app.id)}
                              className="px-2.5 py-1 rounded bg-[#682038] hover:bg-[#54192D] text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Advance Stage &rarr;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectCandidate(app.id)}
                              className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.status === 'OFFERED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            OFFER RELEASED
                          </span>
                        )}
                        {app.status === 'ACCEPTED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            OFFER ACCEPTED
                          </span>
                        )}
                        {app.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            REJECTED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERVIEW SCHEDULER & PANEL MANAGEMENT */}
      {subTab === 'interviews' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Live Campus Interview Scheduler &amp; Corporate Panel Rooms</h3>
                <p className="text-xs text-[#6E6862]">
                  Real-time interview room tracking with candidate call-in alerts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DFD7] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#682038]">{slot.companyName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slot.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#242424]">
                      {slot.studentName} ({slot.rollNo})
                    </div>

                    <div className="text-xs text-[#6E6862] space-y-1">
                      <div>Panel: <strong className="text-[#242424]">{slot.panelNumber}</strong></div>
                      <div>Interviewer: <strong className="text-[#242424]">{slot.interviewerName}</strong></div>
                      <div>Venue: <span className="font-semibold text-[#8B5E3C]">{slot.roomLocation}</span></div>
                      <div>Scheduled Time: <span className="font-mono text-[#242424]">{slot.slotTime}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5DFD7] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => alert(`Calling ${slot.studentName} to interview room!`)}
                      className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold"
                    >
                      Call Candidate In ➔
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInterviews(
                          interviews.map((i) => (i.id === slot.id ? { ...i, status: 'CLEARED' } : i))
                        );
                        alert('Candidate marked as CLEARED for next technical round.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                    >
                      Mark Cleared
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESUME & ATS VERIFICATION DESK */}
      {subTab === 'resumes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Student Resume Verification &amp; ATS Audit Desk</h3>
                <p className="text-xs text-[#6E6862]">
                  T&amp;P Officer clearance desk: Resumes must be approved before students are permitted to apply for Tier-1 Super Dream drives.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Student Scholar</th>
                    <th className="p-3.5">CGPA &amp; Backlogs</th>
                    <th className="p-3.5">ATS Scanner Score</th>
                    <th className="p-3.5">Mock Test Rank</th>
                    <th className="p-3.5">T&amp;P Approval Status</th>
                    <th className="p-3.5 text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {resumes.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-3.5">
                        <div className="font-bold text-[#242424]">{r.studentName}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{r.rollNo} • {r.branch}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-[#682038]">
                        {r.cgpa} CGPA (0 Backlogs)
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded ${
                            r.atsScore >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.atsScore} / 100 ATS Score
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[#242424]">Rank #{r.mockTestRank} / 320</td>
                      <td className="p-3.5">
                        {r.status === 'APPROVED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            APPROVED
                          </span>
                        )}
                        {r.status === 'CHANGES_REQUESTED' && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              CHANGES REQUESTED
                            </span>
                            <div className="text-[10px] text-[#6E6862] max-w-xs truncate" title={r.reviewerFeedback}>
                              {r.reviewerFeedback}
                            </div>
                          </div>
                        )}
                        {r.status === 'PENDING_REVIEW' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            PENDING AUDIT
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {r.status !== 'APPROVED' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveResume(r.id)}
                              className="px-2.5 py-1 rounded bg-[#682038] hover:bg-[#54192D] text-white text-[11px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveResumeForReview(r)}
                              className="px-2 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#8B5E3C] border border-[#E5DFD7] text-[11px] font-semibold"
                            >
                              Feedback
                            </button>
                          </>
                        ) : (
                          <span className="text-emerald-700 text-[11px] font-semibold flex items-center justify-end gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTERNSHIP & PPO REGISTRY */}
      {subTab === 'internships' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Pre-Placement Internship &amp; PPO Conversion Registry</h3>
                <p className="text-xs text-[#6E6862]">
                  Tracks 6-month corporate capstone internships and pre-placement offer (PPO) transitions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Student Scholar</th>
                    <th className="p-3.5">Host Company</th>
                    <th className="p-3.5">Internship Role</th>
                    <th className="p-3.5">Stipend / Month</th>
                    <th className="p-3.5">Corporate Mentor Score</th>
                    <th className="p-3.5">PPO Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {internships.map((int) => (
                    <tr key={int.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-3.5">
                        <div className="font-bold text-[#242424]">{int.studentName}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{int.rollNo}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-[#242424]">{int.companyName}</td>
                      <td className="p-3.5 text-[#6E6862]">{int.roleTitle}</td>
                      <td className="p-3.5 font-mono font-bold text-[#682038]">
                        ₹{int.monthlyStipend.toLocaleString()}/mo
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-emerald-800">{int.supervisorScore} / 10</div>
                        <div className="text-[10px] text-[#6E6862]">{int.supervisorName}</div>
                      </td>
                      <td className="p-3.5">
                        {int.ppoStatus === 'PPO_OFFERED' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            PPO OFFERED &check;
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            UNDER REVIEW
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NIRF PARAMETER 3 & NAAC RETURNS */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#242424]">NIRF 2026 Parameter 3: Graduation Outcomes (Placement)</h3>
                <p className="text-xs text-[#6E6862]">
                  Standard return export for Ministry of Education NIRF ranking and NAAC Criterion 5.2.1.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('NIRF 2026 Parameter 3 CSV data exported cleanly!')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-xs font-bold text-[#682038] border border-[#E5DFD7]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export NIRF Form CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="text-xs text-[#6E6862]">Total Eligible Final-Year Cohort</div>
                <div className="text-2xl font-bold text-[#242424] mt-1">420 Students</div>
                <div className="text-[11px] text-emerald-700 mt-1">372 Placed (88.6%)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="text-xs text-[#6E6862]">Median Salary of Placed Graduates</div>
                <div className="text-2xl font-bold text-[#682038] mt-1">₹12.40 LPA</div>
                <div className="text-[11px] text-[#8B5E3C] mt-1">+14.2% YoY Growth over 2025</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="text-xs text-[#6E6862]">Highest International / Cloud Package</div>
                <div className="text-2xl font-bold text-purple-900 mt-1">₹42.00 LPA</div>
                <div className="text-[11px] text-purple-700 mt-1">Microsoft Azure India</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CTC COMPENSATION BREAKDOWN */}
      {selectedAppForOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  OFFICIAL OFFER RECORD
                </span>
                <h3 className="font-bold text-base text-[#242424] mt-1">{selectedAppForOffer.studentName}</h3>
                <p className="text-xs text-[#6E6862]">{selectedAppForOffer.companyName} • {selectedAppForOffer.roleTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForOffer(null)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE9E1] space-y-2">
              <div className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Annual Compensation Breakdown</div>

              <div className="flex justify-between py-1 border-b border-[#E5DFD7]">
                <span className="text-[#6E6862]">Fixed Base Salary:</span>
                <span className="font-bold text-[#242424]">₹{selectedAppForOffer.baseSalary || 18.0} LPA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5DFD7]">
                <span className="text-[#6E6862]">Performance Variable Bonus:</span>
                <span className="font-bold text-[#242424]">₹{selectedAppForOffer.variableBonus || 3.5} LPA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5DFD7]">
                <span className="text-[#6E6862]">One-time Sign-on Bonus:</span>
                <span className="font-bold text-[#242424]">₹{selectedAppForOffer.joiningBonus || 4.0} Lakhs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5DFD7]">
                <span className="text-[#6E6862]">Stock Units / RSUs (Vested over 4 yrs):</span>
                <span className="font-bold text-[#242424]">₹{selectedAppForOffer.stockOptions || 6.0} LPA</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm text-[#682038] pt-2">
                <span>Total CTC Package:</span>
                <span>₹{selectedAppForOffer.offerCtc} LPA</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
              <div className="font-bold text-[11px]">Institute Dual-Offer Policy Compliance:</div>
              <p className="text-[10px]">
                Student candidate has exercised their Dream Offer quota. Institutional seat locking rules prevent further applications in Regular category.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAppForOffer(null)}
                className="px-4 py-2 rounded-xl bg-[#682038] text-white font-bold"
              >
                Close Offer Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESUME REVIEW FEEDBACK DRAWER */}
      {activeResumeForReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5DFD7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h3 className="font-bold text-base text-[#242424]">Request Resume Revision</h3>
              <button
                type="button"
                onClick={() => setActiveResumeForReview(null)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestResumeChanges} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#242424] mb-1">
                  Revision Comments for {activeResumeForReview.studentName} ({activeResumeForReview.rollNo})
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="e.g. Please update your ATS formatting to single column. Highlight open source projects..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] h-24"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveResumeForReview(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW RECRUITMENT DRIVE */}
      {isNewDriveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h3 className="font-bold text-base text-[#242424]">Register New Campus Recruitment Drive</h3>
              <button
                type="button"
                onClick={() => setIsNewDriveModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Role Title</label>
                  <input
                    type="text"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder="e.g. Cloud Support Associate"
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">CTC (in LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCtc}
                    onChange={(e) => setNewCtc(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Internship Stipend</label>
                  <input
                    type="number"
                    value={newStipend}
                    onChange={(e) => setNewStipend(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Cutoff CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Compensation Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  >
                    <option value="SUPER_DREAM">Super Dream (&gt;= 20 LPA)</option>
                    <option value="DREAM">Dream (10 - 20 LPA)</option>
                    <option value="REGULAR">Regular / Mass (&lt; 10 LPA)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Drive Date</label>
                  <input
                    type="date"
                    value={newDriveDate}
                    onChange={(e) => setNewDriveDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#242424] mb-1">Job Description &amp; Requirements Summary</label>
                <textarea
                  value={newJdSummary}
                  onChange={(e) => setNewJdSummary(e.target.value)}
                  placeholder="Responsibilities, technical qualifications, eligible branches..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE9E1]">
                <button
                  type="button"
                  onClick={() => setIsNewDriveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold"
                >
                  Publish Campus Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
