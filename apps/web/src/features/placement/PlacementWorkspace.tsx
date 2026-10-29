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
} from 'lucide-react';

interface RecruitmentDrive {
  id: string;
  companyName: string;
  logoUrl?: string;
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

type PipelineStage = 'APPLIED' | 'OA_SHORTLISTED' | 'TECH_ROUND_1' | 'TECH_ROUND_2' | 'HR_ROUND' | 'OFFER_RELEASED';

interface StudentApplication {
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
  isDreamOffer: boolean;
  status: 'IN_PROCESS' | 'OFFERED' | 'REJECTED' | 'ACCEPTED';
}

interface InternshipRecord {
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
    jdSummary: 'Building large-scale distributed Kubernetes orchestrators, zero-trust infrastructure, and low-latency gRPC internal microservices.',
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
    jdSummary: 'Core Azure compute fabrics, hyper-scale cloud telemetry platforms, and high-performance C++/Rust kernel optimizations.',
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
    jdSummary: 'Routing protocols, software-defined enterprise networking (SD-WAN), and network virtualization architectures.',
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
    jdSummary: 'Enterprise Java / Spring cloud modernization, full-stack microservices, and AI-enabled data engineering pipelines.',
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
    cgpa: 8.82,
    activeBacklogs: 0,
    appliedDate: '2026-10-21',
    currentStage: 'OFFER_RELEASED',
    offerCtc: 18.2,
    isDreamOffer: true,
    status: 'ACCEPTED',
  },
  {
    id: 'app-4',
    driveId: 'drv-2',
    companyName: 'Microsoft Corporation',
    roleTitle: 'Software Development Engineer I',
    studentName: 'Sneha Kulkarni',
    rollNo: '26CS19',
    enrollmentNo: 'EN2026-CSE-019',
    branch: 'Computer Science',
    cgpa: 8.94,
    activeBacklogs: 0,
    appliedDate: '2026-10-29',
    currentStage: 'OA_SHORTLISTED',
    isDreamOffer: true,
    status: 'IN_PROCESS',
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
  const [subTab, setSubTab] = useState<'drives' | 'tracker' | 'internships' | 'analytics'>('drives');
  const [drives, setDrives] = useState<RecruitmentDrive[]>(INITIAL_DRIVES);
  const [applications, setApplications] = useState<StudentApplication[]>(INITIAL_APPLICATIONS);
  const [internships, setInternships] = useState<InternshipRecord[]>(INITIAL_INTERNSHIPS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  // Modals
  const [isNewDriveModalOpen, setIsNewDriveModalOpen] = useState(false);
  const [selectedDriveForDetail, setSelectedDriveForDetail] = useState<RecruitmentDrive | null>(null);

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
        const currentIdx = stageFlow.indexOf(app.currentStage);
        if (currentIdx < stageFlow.length - 1) {
          const nextStage = stageFlow[currentIdx + 1];
          const isOffered = nextStage === 'OFFER_RELEASED';
          return {
            ...app,
            currentStage: nextStage,
            status: isOffered ? 'OFFERED' : app.status,
            offerCtc: isOffered ? app.offerCtc || 24.0 : app.offerCtc,
          };
        }
        return app;
      })
    );
  };

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
      eligibleBranches: ['Computer Science', 'Electronics & Comm'],
      minCgpa: Number(newMinCgpa),
      maxActiveBacklogs: 0,
      driveDate: newDriveDate,
      deadlineDate: newDriveDate,
      status: 'OPEN',
      totalApplied: 0,
      shortlistedCount: 0,
      offersReleased: 0,
      jdSummary: newJdSummary || 'Engineering responsibilities covering software development, systems integration, and product scaling.',
    };

    setDrives([created, ...drives]);
    setIsNewDriveModalOpen(false);
    setNewCompanyName('');
    setNewRoleTitle('');
    setNewJdSummary('');
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalOffers = applications.filter((a) => a.status === 'OFFERED' || a.status === 'ACCEPTED').length + 84 + 12 + 4;
    const highestCtc = Math.max(...drives.map((d) => d.ctcPackage));
    const avgCtc = (drives.reduce((acc, d) => acc + d.ctcPackage, 0) / drives.length).toFixed(1);
    const activeCompanies = drives.length;
    return { totalOffers, highestCtc, avgCtc, activeCompanies };
  }, [drives, applications]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Career Services &amp; Corporate Relations
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Season 2026-27 Active
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Training &amp; Placement Directorate (T&amp;P)</h1>
          <p className="text-xs text-[#6E6862]">
            Corporate recruitment drives, 6-stage interview pipeline, Dream Offer policy enforcement, and NIRF placement metrics.
          </p>
        </div>

        {/* Global Action Desk */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsNewDriveModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Schedule Recruitment Drive</span>
          </button>
        </div>
      </div>

      {/* Workspace Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('drives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'drives'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Building className="w-4 h-4 text-[#FB923C]" />
          <span>Campus Recruitment Drives ({drives.length})</span>
        </button>

        <button
          onClick={() => setSubTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'tracker'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Target className="w-4 h-4 text-[#FB923C]" />
          <span>Interview Pipeline Tracker ({applications.length})</span>
        </button>

        <button
          onClick={() => setSubTab('internships')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'internships'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#FB923C]" />
          <span>Internship Directorate &amp; PPO Desk ({internships.length})</span>
        </button>

        <button
          onClick={() => setSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'analytics'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FB923C]" />
          <span>NIRF Table &amp; Salary Analytics</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Total Placement Offers</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">{stats.totalOffers}</span>
            <span className="text-xs text-emerald-600 font-semibold">91.4% Batch Placed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Highest CTC Sanctioned</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#682038]">₹{stats.highestCtc} LPA</span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
              Super Dream
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Average CTC Package</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">₹{stats.avgCtc} LPA</span>
            <span className="text-xs text-[#6E6862]">Median: ₹12.0 LPA</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Participating Corporates</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">{stats.activeCompanies}</span>
            <span className="text-xs text-blue-600 font-semibold">12 MNC Partners</span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: RECRUITMENT DRIVES */}
      {subTab === 'drives' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Active Corporate Drive Catalog
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6E6862]" />
                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#E5DFD7] bg-white focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="py-1.5 px-3 rounded-lg text-xs border border-[#E5DFD7] bg-white text-[#242424] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Package Tiers</option>
                <option value="SUPER_DREAM">Super Dream (&ge; ₹20 LPA)</option>
                <option value="DREAM">Dream (₹10 - 20 LPA)</option>
                <option value="REGULAR">Regular (&lt; ₹10 LPA)</option>
              </select>
            </div>
          </div>

          {/* Drives Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives
              .filter((d) => {
                const matchSearch =
                  d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
                const matchTier = selectedTier === 'ALL' || d.tier === selectedTier;
                return matchSearch && matchTier;
              })
              .map((drv) => (
                <div
                  key={drv.id}
                  className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-sm space-y-4 hover:border-[#682038]/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#242424]">{drv.companyName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            drv.tier === 'SUPER_DREAM'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : drv.tier === 'DREAM'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                        >
                          {drv.tier === 'SUPER_DREAM' ? '★ Super Dream' : drv.tier}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#682038] mt-0.5">{drv.roleTitle}</div>
                      <div className="text-[11px] text-[#6E6862] flex items-center gap-2 mt-1">
                        <span>📍 {drv.jobLocation}</span>
                        <span>•</span>
                        <span>Drive Date: {drv.driveDate}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold font-mono text-[#682038]">₹{drv.ctcPackage} LPA</div>
                      {drv.stipendDuringInternship && (
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          ₹{drv.stipendDuringInternship.toLocaleString('en-IN')}/mo stipend
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#6E6862] line-clamp-2">{drv.jdSummary}</p>

                  {/* Eligibility Tags */}
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD7] flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#6E6862] block">Eligibility Criteria</span>
                      <span className="font-bold text-[#242424]">
                        Min CGPA: <strong className="text-[#682038]">{drv.minCgpa}</strong> • Max Backlogs: {drv.maxActiveBacklogs}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        drv.status === 'OPEN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : drv.status === 'ONGOING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {drv.status}
                    </span>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5DFD7]">
                    <div className="flex items-center gap-3 text-xs text-[#6E6862]">
                      <span><strong>{drv.totalApplied}</strong> Applied</span>
                      <span>•</span>
                      <span><strong>{drv.shortlistedCount}</strong> Shortlisted</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{drv.offersReleased} Offers</span>
                    </div>

                    <button
                      onClick={() => setSelectedDriveForDetail(drv)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#682038] hover:bg-[#FAF7F2] border border-[#E5DFD7] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View JD &amp; Roster</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INTERVIEW PIPELINE TRACKER */}
      {subTab === 'tracker' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Multi-Stage Candidate Selection Pipeline
              </h3>
            </div>
            <span className="text-xs text-[#6E6862]">Dream Offer Limit: Max 1 Super Dream + 1 Regular</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Particulars</th>
                  <th className="py-3 px-4 font-semibold">Applied Corporate</th>
                  <th className="py-3 px-4 font-semibold">Academics (CGPA)</th>
                  <th className="py-3 px-4 font-semibold">Current Pipeline Stage</th>
                  <th className="py-3 px-4 font-semibold">Offer Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Pipeline Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#242424]">{app.studentName}</div>
                      <div className="text-[11px] text-[#6E6862] font-mono">
                        {app.rollNo} • {app.branch}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#682038]">{app.companyName}</div>
                      <div className="text-[11px] text-[#6E6862]">{app.roleTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#242424]">
                      {app.cgpa}{' '}
                      <span className="text-[10px] text-emerald-600 font-normal">
                        ({app.activeBacklogs} backlogs)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FAF7F2] text-[#682038] border border-[#E5DFD7] inline-block">
                        {STAGE_LABELS[app.currentStage]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : app.status === 'OFFERED'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {app.status === 'OFFERED' && app.offerCtc
                          ? `Offer: ₹${app.offerCtc} LPA`
                          : app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {app.currentStage !== 'OFFER_RELEASED' ? (
                        <button
                          onClick={() => handleAdvanceStage(app.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <span>Advance Stage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hired</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INTERNSHIP DIRECTORATE */}
      {subTab === 'internships' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Pre-Graduation Internship Registry &amp; PPO Conversions
              </h3>
            </div>
            <span className="text-xs text-emerald-700 font-bold">100% Industry Supervisor Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Intern Particulars</th>
                  <th className="py-3 px-4 font-semibold">Corporate Host &amp; Role</th>
                  <th className="py-3 px-4 font-semibold text-right">Monthly Stipend</th>
                  <th className="py-3 px-4 font-semibold">Industry Supervisor</th>
                  <th className="py-3 px-4 font-semibold text-center">Performance Rating</th>
                  <th className="py-3 px-4 font-semibold text-center">PPO Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {internships.map((int) => (
                  <tr key={int.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#242424]">{int.studentName}</div>
                      <div className="text-[10px] text-[#6E6862] font-mono">{int.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#682038]">{int.companyName}</div>
                      <div className="text-[11px] text-[#6E6862]">{int.roleTitle} ({int.durationMonths} Months)</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                      ₹{int.monthlyStipend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#242424]">{int.supervisorName}</td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                        ★ {int.supervisorScore} / 10
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          int.ppoStatus === 'PPO_OFFERED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {int.ppoStatus === 'PPO_OFFERED' ? '✓ PPO Converted' : 'Under Review'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: NIRF TABLE & ANALYTICS */}
      {subTab === 'analytics' && (
        <div className="space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-5 flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#242424]">
              <h3 className="font-bold text-sm">Official NIRF Ranking Metric Compliance:</h3>
              <p className="text-[#6E6862]">
                Aggregates graduation outcomes (GO), median salary of graduating batch, higher study progression, and entrepreneurship incubations required under NIRF Parameter 3 and NAAC Criterion 5.2.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
              <div>
                <h4 className="font-bold text-sm text-[#242424]">NIRF Academic Year 2026-27 Table Output</h4>
                <p className="text-xs text-[#6E6862]">Sanctioned intake vs. placement statistics</p>
              </div>
              <button
                onClick={() => alert('Simulating official NIRF Data Template CSV export...')}
                className="px-3.5 py-1.5 rounded-xl bg-[#682038] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#54192D]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export NIRF Table</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[#6E6862] block">Graduating Batch Size:</span>
                <span className="text-xl font-bold font-mono text-[#242424]">420 Pupils</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[#6E6862] block">Total Placed:</span>
                <span className="text-xl font-bold font-mono text-emerald-700">384 (91.4%)</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[#6E6862] block">Median Salary:</span>
                <span className="text-xl font-bold font-mono text-[#682038]">₹12,00,000</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7]">
                <span className="text-[#6E6862] block">Higher Education / GATE:</span>
                <span className="text-xl font-bold font-mono text-blue-700">28 Pupils</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW RECRUITMENT DRIVE */}
      {isNewDriveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#682038]" />
                <h3 className="font-bold text-base text-[#242424]">Schedule Campus Recruitment Drive</h3>
              </div>
              <button onClick={() => setIsNewDriveModalOpen(false)} className="p-1 text-[#6E6862] hover:bg-[#F4ECE2] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Corporate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE-1 Cloud Infrastructure"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Annual CTC (₹ LPA) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newCtc}
                    onChange={(e) => setNewCtc(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Monthly Stipend (₹)</label>
                  <input
                    type="number"
                    value={newStipend}
                    onChange={(e) => setNewStipend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Tier Category *</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-semibold"
                  >
                    <option value="SUPER_DREAM">Super Dream (&ge; 20 LPA)</option>
                    <option value="DREAM">Dream (10 - 20 LPA)</option>
                    <option value="REGULAR">Regular (&lt; 10 LPA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Minimum CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Drive Execution Date</label>
                  <input
                    type="date"
                    required
                    value={newDriveDate}
                    onChange={(e) => setNewDriveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#242424]">Job Description &amp; Responsibilities</label>
                <textarea
                  rows={2}
                  placeholder="Summary of skills, tech stacks (React, Python, Go, Cloud), and evaluation rounds..."
                  value={newJdSummary}
                  onChange={(e) => setNewJdSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsNewDriveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6862] hover:bg-[#FAF7F2] border border-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish &amp; Notify Eligible Students</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DRIVE DETAIL & CANDIDATES */}
      {selectedDriveForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#E5DFD7]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#242424]">{selectedDriveForDetail.companyName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {selectedDriveForDetail.tier}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#682038] mt-0.5">{selectedDriveForDetail.roleTitle}</div>
              </div>
              <button onClick={() => setSelectedDriveForDetail(null)} className="p-1 text-[#6E6862] hover:bg-[#F4ECE2] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD7]">
                <div>
                  <span className="text-[#6E6862] block">Package CTC:</span>
                  <span className="font-bold font-mono text-[#682038] text-sm">₹{selectedDriveForDetail.ctcPackage} LPA</span>
                </div>
                <div>
                  <span className="text-[#6E6862] block">Eligible Cutoff:</span>
                  <span className="font-bold text-[#242424]">{selectedDriveForDetail.minCgpa} CGPA</span>
                </div>
                <div>
                  <span className="text-[#6E6862] block">Drive Date:</span>
                  <span className="font-bold text-[#242424]">{selectedDriveForDetail.driveDate}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#242424] block mb-1">Job Specification:</span>
                <p className="text-[#6E6862] bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#E5DFD7] leading-relaxed">
                  {selectedDriveForDetail.jdSummary}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#242424] block mb-1">Eligible Disciplines:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDriveForDetail.eligibleBranches.map((b, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-white text-[#242424] border border-[#E5DFD7] text-[11px]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5DFD7]">
              <button
                onClick={() => setSelectedDriveForDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#682038] text-white text-xs font-bold hover:bg-[#54192D]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
