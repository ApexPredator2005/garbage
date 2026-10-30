import React, { useState, useMemo } from 'react';
import {
  Calendar,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Users,
  Award,
  Filter,
  Search,
  Plus,
  X,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  FileText,
  FileCheck,
  HelpCircle,
  Video,
  Send,
  MessageSquare,
  ClipboardList,
  UserCheck,
  AlertTriangle,
  RotateCw,
  Sliders,
  Bell,
  BookMarked,
  LayoutGrid,
} from 'lucide-react';
import {
  TimetableSlotItem,
  SubstitutionProposal,
  AcademicRegulation,
  AcademicCourse,
  CourseRegistrationItem,
  FacultyWorkload,
  CalendarEventItem,
  LessonPlanEntry,
  CourseDiaryLog,
  MentoringBatch,
  LearningMaterial,
  AssignmentItem,
  QuizItem,
  VirtualClassSession,
  RoleType,
} from '../../types';

// ==========================================
// 01. MOCK DATASETS ACROSS ALL 9 PILLARS
// ==========================================

const INITIAL_REGULATIONS: AcademicRegulation[] = [
  {
    id: 'reg-2026',
    code: 'R-2026-CBCS',
    title: 'Autonomous Outcome-Based CBCS Curriculum Framework',
    effectiveFromYear: 2026,
    totalCreditsRequired: 160,
    minSemesterCredits: 18,
    maxSemesterCredits: 26,
    gradingScale: '10_POINT_ABSOLUTE',
    status: 'ACTIVE',
    departments: ['Computer Science & Engg', 'Electronics & Comm', 'Mechanical Engg'],
  },
  {
    id: 'reg-2022',
    code: 'R-2022-AFFIL',
    title: 'University Affiliated Non-Autonomous Framework',
    effectiveFromYear: 2022,
    totalCreditsRequired: 165,
    minSemesterCredits: 20,
    maxSemesterCredits: 28,
    gradingScale: '10_POINT_RELATIVE',
    status: 'ACTIVE',
    departments: ['Civil Engg', 'Information Science'],
  },
];

const INITIAL_COURSES: AcademicCourse[] = [
  {
    id: 'crs-1',
    code: 'CS401',
    title: 'Design & Analysis of Algorithms',
    credits: 4,
    ltpHours: '3-1-0',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    type: 'THEORY',
    department: 'Computer Science & Engg',
    semester: 4,
    regulationCode: 'R-2026-CBCS',
    prerequisites: ['CS201 Data Structures'],
    textbooks: [
      'Introduction to Algorithms (CLRS), 4th Edition - MIT Press',
      'Computer Algorithms - Ellis Horowitz & Sartaj Sahni',
    ],
    syllabusUnits: [
      { unitNumber: 1, title: 'Foundations & Asymptotic Complexity', hours: 9, content: 'Growth of functions, Recurrence relations, Master theorem, Substitution method.' },
      { unitNumber: 2, title: 'Divide & Conquer, Sorting Lower Bounds', hours: 9, content: 'MergeSort, QuickSort, Strassen Matrix Multiplication, Counting & Radix Sort.' },
      { unitNumber: 3, title: 'Greedy Method & Dynamic Programming', hours: 10, content: 'Fractional Knapsack, Huffman Coding, Bellman-Ford, Floyd-Warshall, Matrix Chain.' },
      { unitNumber: 4, title: 'Graph Algorithms & Flow Networks', hours: 8, content: 'BFS, DFS, Dijkstra, Prim & Kruskal, Ford-Fulkerson maximum flow.' },
      { unitNumber: 5, title: 'NP-Completeness & Approximation', hours: 9, content: 'P, NP, NP-Hard, NP-Complete, Cook-Levin Theorem, Vertex Cover approximation.' },
    ],
    courseOutcomes: [
      { code: 'CO1', description: 'Analyze asymptotic worst-case runtimes of recursive and iterative algorithms.', bloomLevel: 'ANALYZE', poMapping: { PO1: 3, PO2: 3, PO3: 2, PO4: 1 } },
      { code: 'CO2', description: 'Apply Divide and Conquer paradigms to optimize computational search bottlenecks.', bloomLevel: 'APPLY', poMapping: { PO1: 3, PO2: 2, PO3: 3 } },
      { code: 'CO3', description: 'Synthesize optimal Dynamic Programming solutions for multi-stage decision problems.', bloomLevel: 'APPLY', poMapping: { PO2: 3, PO3: 3, PO5: 2 } },
      { code: 'CO4', description: 'Formulate network flow and graph cut algorithms for distributed routing.', bloomLevel: 'EVALUATE', poMapping: { PO1: 3, PO3: 3, PO4: 2 } },
      { code: 'CO5', description: 'Categorize computational hardness and design polynomial-time approximation bounds.', bloomLevel: 'EVALUATE', poMapping: { PO1: 2, PO2: 3, PO4: 3 } },
    ],
  },
  {
    id: 'crs-2',
    code: 'CS402L',
    title: 'Algorithms Laboratory',
    credits: 2,
    ltpHours: '0-0-3',
    lectureHours: 0,
    tutorialHours: 0,
    practicalHours: 3,
    type: 'LAB',
    department: 'Computer Science & Engg',
    semester: 4,
    regulationCode: 'R-2026-CBCS',
    prerequisites: ['CS201 Data Structures Lab'],
    textbooks: ['Algorithm Lab Manual - JSSATE Academic Press'],
    syllabusUnits: [
      { unitNumber: 1, title: 'Divide & Conquer Implementation', hours: 8, content: 'Empirical comparison of QuickSort vs MergeSort over 1M integers.' },
      { unitNumber: 2, title: 'Shortest Path Graphs', hours: 10, content: 'Dijkstra and A* algorithm implementations in modern C++.' },
      { unitNumber: 3, title: 'Dynamic Knapsack Benchmarks', hours: 12, content: '0/1 Knapsack bottom-up table vs space-optimized memoization.' },
    ],
    courseOutcomes: [
      { code: 'CO1', description: 'Implement benchmark suites to verify theoretical big-O time bounds.', bloomLevel: 'APPLY', poMapping: { PO1: 3, PO2: 3, PO5: 3 } },
      { code: 'CO2', description: 'Debug memory leaks and graph recursion stacks using valgrind.', bloomLevel: 'ANALYZE', poMapping: { PO3: 2, PO5: 3 } },
    ],
  },
  {
    id: 'crs-3',
    code: 'CS403PE',
    title: 'Cloud Computing & DevOps Architecture',
    credits: 3,
    ltpHours: '3-0-0',
    lectureHours: 3,
    tutorialHours: 0,
    practicalHours: 0,
    type: 'PROFESSIONAL_ELECTIVE',
    department: 'Computer Science & Engg',
    semester: 4,
    regulationCode: 'R-2026-CBCS',
    prerequisites: ['CS304 Computer Networks'],
    textbooks: ['Cloud Native DevOps with Kubernetes - John Arundel'],
    syllabusUnits: [
      { unitNumber: 1, title: 'Virtualization & Container Fabrics', hours: 9, content: 'Namespaces, cgroups, Docker, OCI spec, microVMs.' },
      { unitNumber: 2, title: 'Kubernetes Orchestration', hours: 10, content: 'Pods, Deployments, Services, Ingress, CRDs, Helm.' },
      { unitNumber: 3, title: 'CI/CD & GitOps Automation', hours: 9, content: 'ArgoCD, GitHub Actions, Terraform Infrastructure-as-Code.' },
      { unitNumber: 4, title: 'Cloud Observability', hours: 8, content: 'Prometheus metrics, Grafana dashboards, OpenTelemetry distributed tracing.' },
      { unitNumber: 5, title: 'Zero Trust Cloud Security', hours: 9, content: 'mTLS, Istio service mesh, IAM least-privilege, KMS secrets.' },
    ],
    courseOutcomes: [
      { code: 'CO1', description: 'Architect containerized multi-tier microservices on cloud engines.', bloomLevel: 'APPLY', poMapping: { PO3: 3, PO5: 3 } },
      { code: 'CO2', description: 'Implement GitOps deployment pipelines with automated rollbacks.', bloomLevel: 'EVALUATE', poMapping: { PO5: 3, PO10: 2 } },
    ],
  },
  {
    id: 'crs-4',
    code: 'OE401',
    title: 'Artificial Intelligence for Healthcare (Open Elective)',
    credits: 3,
    ltpHours: '3-0-0',
    lectureHours: 3,
    tutorialHours: 0,
    practicalHours: 0,
    type: 'OPEN_ELECTIVE',
    department: 'Computer Science & Engg',
    semester: 4,
    regulationCode: 'R-2026-CBCS',
    prerequisites: ['Mathematics for Engineers'],
    textbooks: ['AI in Health - Elsevier Academic'],
    syllabusUnits: [
      { unitNumber: 1, title: 'Medical Imaging Fundamentals', hours: 9, content: 'DICOM, X-Ray, CT, MRI computer vision segmentation.' },
      { unitNumber: 2, title: 'Clinical NLP & EHR Records', hours: 9, content: 'Clinical notes extraction, BioBERT, ICD-10 diagnostic coding.' },
      { unitNumber: 3, title: 'HIPAA & Medical Ethics', hours: 8, content: 'Patient privacy, algorithmic bias, regulatory FDA approvals.' },
    ],
    courseOutcomes: [
      { code: 'CO1', description: 'Understand clinical AI models and radiological computer vision.', bloomLevel: 'UNDERSTAND', poMapping: { PO1: 2, PO6: 3, PO7: 2 } },
    ],
  },
];

const INITIAL_REGISTRATIONS: CourseRegistrationItem[] = [
  {
    id: 'reg-s1',
    studentId: 'std-01',
    studentName: 'Aarav Sharma',
    rollNo: '26CS01',
    program: 'B.Tech CSE',
    semester: 4,
    registeredCourses: [
      { courseCode: 'CS401', courseTitle: 'Design & Analysis of Algorithms', credits: 4, type: 'CORE' },
      { courseCode: 'CS402L', courseTitle: 'Algorithms Laboratory', credits: 2, type: 'CORE' },
      { courseCode: 'CS403PE', courseTitle: 'Cloud Computing & DevOps', credits: 3, type: 'PROFESSIONAL_ELECTIVE', seatCapacity: 60, enrolledCount: 54 },
      { courseCode: 'OE401', courseTitle: 'AI for Healthcare', credits: 3, type: 'OPEN_ELECTIVE', seatCapacity: 60, enrolledCount: 59 },
    ],
    totalCredits: 22,
    status: 'SUBMITTED',
    submissionDate: '2026-10-24',
  },
  {
    id: 'reg-s2',
    studentId: 'std-02',
    studentName: 'Diya Patel',
    rollNo: '26CS02',
    program: 'B.Tech CSE',
    semester: 4,
    registeredCourses: [
      { courseCode: 'CS401', courseTitle: 'Design & Analysis of Algorithms', credits: 4, type: 'CORE' },
      { courseCode: 'CS402L', courseTitle: 'Algorithms Laboratory', credits: 2, type: 'CORE' },
      { courseCode: 'CS403PE', courseTitle: 'Cloud Computing & DevOps', credits: 3, type: 'PROFESSIONAL_ELECTIVE', seatCapacity: 60, enrolledCount: 54 },
    ],
    totalCredits: 19,
    status: 'APPROVED_BY_ADVISOR',
    submissionDate: '2026-10-22',
    advisorRemarks: 'Credits balanced. Prerequisites verified.',
  },
];

const INITIAL_WORKLOADS: FacultyWorkload[] = [
  {
    facultyId: 'fac-101',
    name: 'Dr. Ramesh Kulkarni',
    designation: 'PROFESSOR',
    department: 'Computer Science & Engg',
    maxWeeklyHours: 14,
    assignedTheoryHours: 6,
    assignedLabHours: 6,
    totalWeeklyHours: 12,
    status: 'BALANCED',
    coursesAllocated: [
      { courseCode: 'CS401', courseTitle: 'Design & Analysis of Algorithms', section: 'A', type: 'THEORY', hours: 4 },
      { courseCode: 'CS402L', courseTitle: 'Algorithms Lab', section: 'A', labBatch: 'A1', type: 'LAB', hours: 3 },
      { courseCode: 'CS402L', courseTitle: 'Algorithms Lab', section: 'A', labBatch: 'A2', type: 'LAB', hours: 3 },
    ],
  },
  {
    facultyId: 'fac-102',
    name: 'Prof. Sunita Rao',
    designation: 'ASSOCIATE_PROFESSOR',
    department: 'Computer Science & Engg',
    maxWeeklyHours: 16,
    assignedTheoryHours: 9,
    assignedLabHours: 6,
    totalWeeklyHours: 15,
    status: 'BALANCED',
    coursesAllocated: [
      { courseCode: 'CS403PE', courseTitle: 'Cloud Computing & DevOps', section: 'A', type: 'THEORY', hours: 3 },
      { courseCode: 'CS401', courseTitle: 'Design & Analysis of Algorithms', section: 'B', type: 'THEORY', hours: 4 },
      { courseCode: 'CS402L', courseTitle: 'Algorithms Lab', section: 'B', labBatch: 'B1', type: 'LAB', hours: 3 },
    ],
  },
  {
    facultyId: 'fac-103',
    name: 'Dr. Anand Joshi',
    designation: 'ASSISTANT_PROFESSOR',
    department: 'Computer Science & Engg',
    maxWeeklyHours: 18,
    assignedTheoryHours: 12,
    assignedLabHours: 9,
    totalWeeklyHours: 21,
    status: 'OVERLOADED',
    coursesAllocated: [
      { courseCode: 'OE401', courseTitle: 'AI for Healthcare', section: 'All', type: 'THEORY', hours: 3 },
      { courseCode: 'CS301', courseTitle: 'Data Structures', section: 'A', type: 'THEORY', hours: 4 },
    ],
  },
];

const INITIAL_CALENDAR: CalendarEventItem[] = [
  { id: 'cal-1', title: 'Semester 4 Commencement', date: '2026-08-01', category: 'INSTRUCTIONAL_DAY', description: 'First teaching day of autumn semester' },
  { id: 'cal-2', title: 'Independence Day', date: '2026-08-15', category: 'GAZETTED_HOLIDAY', description: 'National Holiday' },
  { id: 'cal-3', title: 'Continuous Internal Evaluation (CIE-1)', date: '2026-09-18', category: 'INTERNAL_EXAM', description: 'Central test period across Units 1 & 2' },
  { id: 'cal-4', title: 'Mahatma Gandhi Jayanti', date: '2026-10-02', category: 'GAZETTED_HOLIDAY', description: 'National Holiday' },
  { id: 'cal-5', title: 'Continuous Internal Evaluation (CIE-2)', date: '2026-11-04', category: 'INTERNAL_EXAM', description: 'Central test period across Units 3 & 4' },
  { id: 'cal-6', title: 'Semester End Examination (SEE) Commencement', date: '2026-12-01', category: 'SEMESTER_END_EXAM', description: 'University final theory papers' },
];

const INITIAL_LESSONS: LessonPlanEntry[] = [
  { id: 'lp-1', courseCode: 'CS401', unitNumber: 1, plannedDate: '2026-08-04', actualDate: '2026-08-04', topicTitle: 'Course Overview, Math Review, Big-O / Omega / Theta', pedagogy: 'CHALK_AND_TALK', status: 'COMPLETED', syllabusCoveragePercent: 20 },
  { id: 'lp-2', courseCode: 'CS401', unitNumber: 1, plannedDate: '2026-08-07', actualDate: '2026-08-07', topicTitle: 'Recurrence Relations & Substitution Proofs', pedagogy: 'PPT_MULTIMEDIA', status: 'COMPLETED', syllabusCoveragePercent: 40 },
  { id: 'lp-3', courseCode: 'CS401', unitNumber: 1, plannedDate: '2026-08-11', actualDate: '2026-08-12', topicTitle: 'Master Method for Divide-and-Conquer Recurrences', pedagogy: 'CHALK_AND_TALK', status: 'COMPLETED', syllabusCoveragePercent: 70 },
  { id: 'lp-4', courseCode: 'CS401', unitNumber: 1, plannedDate: '2026-08-14', topicTitle: 'Unit 1 Tutorial & Problem Solving Session', pedagogy: 'CASE_STUDY', status: 'PENDING', syllabusCoveragePercent: 100 },
];

const INITIAL_DIARY: CourseDiaryLog[] = [
  { id: 'cd-1', courseCode: 'CS401', facultyName: 'Dr. Ramesh Kulkarni', date: '2026-10-28', period: 2, section: 'A', topicCovered: 'Dynamic Programming: Matrix Chain Multiplication optimal parenthesization.', attendanceCount: 56, totalStudents: 60, pedagogyNotes: 'Detailed blackboard derivation of cost matrix m[i,j].' },
  { id: 'cd-2', courseCode: 'CS401', facultyName: 'Dr. Ramesh Kulkarni', date: '2026-10-27', period: 1, section: 'A', topicCovered: 'Longest Common Subsequence (LCS) bottom-up table construction.', attendanceCount: 58, totalStudents: 60, pedagogyNotes: 'Projector demonstration of string alignment.' },
];

const INITIAL_MENTORING: MentoringBatch[] = [
  {
    id: 'men-1',
    mentorFacultyId: 'fac-101',
    mentorName: 'Dr. Ramesh Kulkarni',
    mentorDepartment: 'Computer Science & Engg',
    totalMentees: 20,
    mentees: [
      { studentId: 'std-01', studentName: 'Aarav Sharma', rollNo: '26CS01', cgpa: 9.15, attendancePercent: 88.5, riskStatus: 'NORMAL' },
      { studentId: 'std-04', studentName: 'Rohan Verma', rollNo: '26CS04', cgpa: 6.4, attendancePercent: 74.2, riskStatus: 'ATTENDANCE_RISK' },
      { studentId: 'std-09', studentName: 'Naveen Kumar', rollNo: '26CS09', cgpa: 5.8, attendancePercent: 81.0, riskStatus: 'ACADEMIC_BACKLOG_RISK' },
    ],
    meetingLogs: [
      { id: 'ml-1', meetingDate: '2026-10-15', agenda: 'Mid-term academic appraisal & attendance check', actionItems: 'Rohan Verma advised to attend remedial problem-solving classes to recover 75% attendance threshold.', counselingRemarks: 'Student acknowledged illness in September. Medical slip forwarded to Dean.' },
    ],
  },
];

const INITIAL_MATERIALS: LearningMaterial[] = [
  { id: 'mat-1', courseCode: 'CS401', title: 'Unit 1 & 2 Lecture Notes: Asymptotic Analysis & Master Theorem', type: 'NOTES_PDF', uploadDate: '2026-08-10', fileSize: '4.2 MB', downloadUrl: '#', accessCount: 148 },
  { id: 'mat-2', courseCode: 'CS401', title: 'Dynamic Programming Presentation Slides (Matrix Chain, Knapsack)', type: 'SLIDES', uploadDate: '2026-10-12', fileSize: '12.8 MB', downloadUrl: '#', accessCount: 112 },
  { id: 'mat-3', courseCode: 'CS402L', title: 'Algorithms Lab Manual & Benchmark Test Data', type: 'LAB_MANUAL', uploadDate: '2026-08-05', fileSize: '2.1 MB', downloadUrl: '#', accessCount: 184 },
];

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  { id: 'asg-1', courseCode: 'CS401', title: 'Assignment 2: Dynamic Programming & Greedy Graph Algorithms', dueDate: '2026-11-05 23:59', maxMarks: 20, description: 'Implement 0/1 Knapsack, Bellman-Ford, and analyze runtime bounds over large sparse graphs.', submissionsCount: 48, totalStudents: 60, status: 'ACTIVE' },
  { id: 'asg-2', courseCode: 'CS401', title: 'Assignment 1: Asymptotic Recurrences & Divide-and-Conquer', dueDate: '2026-09-10 23:59', maxMarks: 15, description: 'Theoretical proofs of Master Theorem cases and Strassen matrix recursion.', submissionsCount: 60, totalStudents: 60, status: 'CLOSED' },
];

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'qz-1',
    courseCode: 'CS401',
    title: 'Quiz 2: Dynamic Programming & Graph Theory',
    timeLimitMinutes: 20,
    totalQuestions: 2,
    maxMarks: 10,
    questions: [
      { id: 'q-1', question: 'What is the optimal time complexity of finding all-pairs shortest paths using Floyd-Warshall?', options: ['O(V^2)', 'O(V^3)', 'O(V log V + E)', 'O(E log V)'], correctIndex: 1 },
      { id: 'q-2', question: 'Which property distinguishes Dynamic Programming from standard Divide and Conquer?', options: ['Optimal Substructure', 'Overlapping Subproblems', 'Greedy Choice Property', 'Memoization Discard'], correctIndex: 1 },
    ],
  },
];

const INITIAL_VIRTUAL_CLASSES: VirtualClassSession[] = [
  { id: 'vc-1', courseCode: 'CS401', courseTitle: 'Algorithms Tutorial & Doubts Clearing Session', platform: 'GOOGLE_MEET', meetingUrl: 'https://meet.google.com/abc-defg-hij', meetingId: 'abc-defg-hij', passcode: 'ACET2026', scheduledTime: 'Today, 16:30 - 17:30 IST', facultyName: 'Dr. Ramesh Kulkarni' },
];

// Initial Timetable Slots (preserved and enhanced)
const INITIAL_SLOTS: TimetableSlotItem[] = [
  { id: 'slot-1', day: 'Monday', period: 1, time: '09:00 - 10:00 AM', courseCode: 'CS401', courseTitle: 'Design & Analysis of Algorithms', facultyName: 'Dr. Ramesh Kulkarni', facultyId: 'fac-101', room: 'LH-201', hasClash: false },
  { id: 'slot-2', day: 'Monday', period: 2, time: '10:00 - 11:00 AM', courseCode: 'CS403PE', courseTitle: 'Cloud Computing & DevOps', facultyName: 'Prof. Sunita Rao', facultyId: 'fac-102', room: 'LH-201', hasClash: true },
  { id: 'slot-3', day: 'Monday', period: 3, time: '11:15 - 12:15 PM', courseCode: 'OE401', courseTitle: 'AI for Healthcare', facultyName: 'Dr. Anand Joshi', facultyId: 'fac-103', room: 'LH-202', hasClash: false },
  { id: 'slot-4', day: 'Monday', period: 4, time: '01:00 - 04:00 PM', courseCode: 'CS402L', courseTitle: 'Algorithms Laboratory (Batches A1/A2)', facultyName: 'Dr. Ramesh Kulkarni', facultyId: 'fac-101', room: 'Lab-CSE-3', hasClash: false },
];

// ==========================================
// 02. MAIN WORKSPACE COMPONENT
// ==========================================

export interface AcademicsWorkspaceProps {
  currentRole?: RoleType;
}

export const AcademicsWorkspace: React.FC<AcademicsWorkspaceProps> = ({ currentRole = 'FACULTY' }) => {
  const isFacultyScoped = currentRole === 'FACULTY';
  // 9 Sub-Tabs according to Devloft CMS Module 03 Specification
  const [activeTab, setActiveTab] = useState<
    | 'courses'
    | 'structure'
    | 'registration'
    | 'allocation'
    | 'timetable'
    | 'calendar'
    | 'teaching'
    | 'mentoring'
    | 'lms'
  >('courses');

  // Pillar States
  const [courses, setCourses] = useState<AcademicCourse[]>(INITIAL_COURSES);
  const [regulations, setRegulations] = useState<AcademicRegulation[]>(INITIAL_REGULATIONS);
  const [registrations, setRegistrations] = useState<CourseRegistrationItem[]>(INITIAL_REGISTRATIONS);
  const [workloads, setWorkloads] = useState<FacultyWorkload[]>(INITIAL_WORKLOADS);
  const [slots, setSlots] = useState<TimetableSlotItem[]>(INITIAL_SLOTS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(INITIAL_CALENDAR);
  const [lessonPlans, setLessonPlans] = useState<LessonPlanEntry[]>(INITIAL_LESSONS);
  const [courseDiary, setCourseDiary] = useState<CourseDiaryLog[]>(INITIAL_DIARY);
  const [mentoringBatches, setMentoringBatches] = useState<MentoringBatch[]>(INITIAL_MENTORING);
  const [materials, setMaterials] = useState<LearningMaterial[]>(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [virtualClasses, setVirtualClasses] = useState<VirtualClassSession[]>(INITIAL_VIRTUAL_CLASSES);

  // Modals & Drawers
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<AcademicCourse | null>(null);
  const [selectedSlotForSub, setSelectedSlotForSub] = useState<TimetableSlotItem | null>(null);
  const [substitutionProposals, setSubstitutionProposals] = useState<SubstitutionProposal[]>([]);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);
  const [isAutoGeneratingTimetable, setIsAutoGeneratingTimetable] = useState(false);
  const [autoGenSuccessMessage, setAutoGenSuccessMessage] = useState<string | null>(null);
  const [activeQuizForTest, setActiveQuizForTest] = useState<QuizItem | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScoreResult, setQuizScoreResult] = useState<number | null>(null);
  const [isAddDiaryModalOpen, setIsAddDiaryModalOpen] = useState(false);
  const [newDiaryTopic, setNewDiaryTopic] = useState('');
  const [newDiaryPeriod, setNewDiaryPeriod] = useState(1);
  const [newDiaryAttendance, setNewDiaryAttendance] = useState(58);

  // Course Creation State (Authorized: Registrar / BOS / Academic Dean)
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDept, setNewCourseDept] = useState('Computer Science & Engg');
  const [newCourseSemester, setNewCourseSemester] = useState(4);
  const [newCourseType, setNewCourseType] = useState<'THEORY' | 'LAB' | 'PROFESSIONAL_ELECTIVE' | 'OPEN_ELECTIVE'>('THEORY');
  const [newCourseCredits, setNewCourseCredits] = useState<number>(4);
  const [newCourseLtpHours, setNewCourseLtpHours] = useState('3-1-0');
  const [newCourseRegulation, setNewCourseRegulation] = useState('R26-NEP');
  const [newCoursePrereq, setNewCoursePrereq] = useState('CS201 Data Structures');
  const [newCourseUnitTitle, setNewCourseUnitTitle] = useState('Unit 1: Fundamentals & System Design');
  const [newCourseUnitHours, setNewCourseUnitHours] = useState(10);
  const [newCourseUnitTopics, setNewCourseUnitTopics] = useState('Foundational architecture, relational schemas, ER modeling, and transaction semantics.');
  const [courseSaveSuccess, setCourseSaveSuccess] = useState<string | null>(null);

  // Syllabus & Subject Credit Revision State (Authorized: HOD, BOS, Registrar)
  const [isEditSyllabusModalOpen, setIsEditSyllabusModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AcademicCourse | null>(null);
  const [syllabusCredits, setSyllabusCredits] = useState<number>(4);
  const [syllabusLtpHours, setSyllabusLtpHours] = useState('3-1-0');
  const [syllabusUnitTitle, setSyllabusUnitTitle] = useState('');
  const [syllabusUnitTopics, setSyllabusUnitTopics] = useState('');
  const [syllabusPlannedHours, setSyllabusPlannedHours] = useState(8);
  const [syllabusVersionCode, setSyllabusVersionCode] = useState('R-2026-CBCS');
  const [syllabusSaveSuccess, setSyllabusSaveSuccess] = useState<string | null>(null);

  // Calendar Event Addition State (Authorized: Registrar)
  const [isAddCalendarEventModalOpen, setIsAddCalendarEventModalOpen] = useState(false);
  const [calDate, setCalDate] = useState('2026-11-15');
  const [calTitle, setCalTitle] = useState('');
  const [calDesc, setCalDesc] = useState('');
  const [calCategory, setCalCategory] = useState<'INSTRUCTIONAL_DAY' | 'GAZETTED_HOLIDAY' | 'INTERNAL_EXAM' | 'SEMESTER_END_EXAM' | 'VACATION'>('INSTRUCTIONAL_DAY');
  const [calendarSaveSuccess, setCalendarSaveSuccess] = useState<string | null>(null);

  // Timetable Slot Builder State (Authorized: Timetable Coordinator & HOD)
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotDay, setSlotDay] = useState('Monday');
  const [slotPeriod, setSlotPeriod] = useState(1);
  const [slotTime, setSlotTime] = useState('09:00 - 10:00 AM');
  const [slotCourseCode, setSlotCourseCode] = useState('CS401');
  const [slotCourseTitle, setSlotCourseTitle] = useState('Design & Analysis of Algorithms');
  const [slotFacultyName, setSlotFacultyName] = useState('Dr. Ramesh Kulkarni');
  const [slotRoom, setSlotRoom] = useState('LH-201');
  const [slotSaveSuccess, setSlotSaveSuccess] = useState<string | null>(null);

  const handleOpenEditSyllabus = (course: AcademicCourse) => {
    setEditingCourse(course);
    setSyllabusCredits(course.credits);
    setSyllabusLtpHours(course.ltpHours);
    setSyllabusUnitTitle(`Unit ${course.syllabusUnits.length + 1}: Emerging Architectures & Applied Paradigms`);
    setSyllabusUnitTopics('Core theoretical framework, practical application benchmarks, and algorithmic analysis.');
    setSyllabusPlannedHours(8);
    setSyllabusVersionCode(course.regulationCode);
    setSyllabusSaveSuccess(null);
    setIsEditSyllabusModalOpen(true);
  };

  const handleSaveSyllabusUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const newUnit = {
      unitNumber: editingCourse.syllabusUnits.length + 1,
      title: syllabusUnitTitle,
      hours: Number(syllabusPlannedHours),
      content: syllabusUnitTopics,
    };

    const updatedCourses = courses.map((c) => {
      if (c.id === editingCourse.id) {
        return {
          ...c,
          credits: Number(syllabusCredits),
          ltpHours: syllabusLtpHours,
          regulationCode: syllabusVersionCode,
          syllabusUnits: [...c.syllabusUnits, newUnit],
        };
      }
      return c;
    });

    setCourses(updatedCourses);
    setEditingCourse((prev) => (prev ? { ...prev, credits: Number(syllabusCredits), ltpHours: syllabusLtpHours, regulationCode: syllabusVersionCode, syllabusUnits: [...prev.syllabusUnits, newUnit] } : null));
    if (selectedCourseForDetail?.id === editingCourse.id) {
      setSelectedCourseForDetail((prev) => (prev ? { ...prev, credits: Number(syllabusCredits), ltpHours: syllabusLtpHours, regulationCode: syllabusVersionCode, syllabusUnits: [...prev.syllabusUnits, newUnit] } : null));
    }

    setSyllabusSaveSuccess(`Syllabus Unit ${newUnit.unitNumber} & Credit Allocation (${syllabusCredits} Credits, L-T-P: ${syllabusLtpHours}) successfully saved for ${editingCourse.code}!`);
    setTimeout(() => {
      setSyllabusSaveSuccess(null);
      setIsEditSyllabusModalOpen(false);
    }, 1500);
  };

  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseTitle) return;

    const newCourseItem: AcademicCourse = {
      id: `course-${Date.now()}`,
      code: newCourseCode.trim().toUpperCase(),
      title: newCourseTitle.trim(),
      department: newCourseDept,
      semester: Number(newCourseSemester),
      type: newCourseType,
      credits: Number(newCourseCredits),
      ltpHours: newCourseLtpHours,
      lectureHours: Number(newCourseLtpHours.split('-')[0]) || 3,
      tutorialHours: Number(newCourseLtpHours.split('-')[1]) || 0,
      practicalHours: Number(newCourseLtpHours.split('-')[2]) || 0,
      regulationCode: newCourseRegulation,
      prerequisites: newCoursePrereq ? [newCoursePrereq] : [],
      courseOutcomes: [
        { code: 'CO1', description: `Understand foundational principles and architecture of ${newCourseTitle}.`, bloomLevel: 'UNDERSTAND', poMapping: { PO1: 3, PO2: 2 } },
        { code: 'CO2', description: `Apply theoretical techniques to solve complex engineering problems in ${newCourseTitle}.`, bloomLevel: 'APPLY', poMapping: { PO2: 3, PO3: 2 } },
      ],
      syllabusUnits: [
        {
          unitNumber: 1,
          title: newCourseUnitTitle || 'Unit 1: Foundations',
          hours: Number(newCourseUnitHours) || 8,
          content: newCourseUnitTopics || 'Fundamental principles and design paradigms.',
        },
      ],
      textbooks: ['Standard Prescribed University Textbook, 2026 Edition'],
    };

    setCourses((prev) => [newCourseItem, ...prev]);
    setCourseSaveSuccess(`New Course ${newCourseItem.code} ("${newCourseItem.title}") created with ${newCourseItem.credits} credits!`);
    setTimeout(() => {
      setCourseSaveSuccess(null);
      setIsAddCourseModalOpen(false);
      setNewCourseCode('');
      setNewCourseTitle('');
    }, 1400);
  };

  const handleSaveCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calTitle || !calDate) return;

    const newEvt: CalendarEventItem = {
      id: `cal-${Date.now()}`,
      date: calDate,
      title: calTitle,
      description: calDesc || 'Institutional academic milestone registered by Registrar Office.',
      category: calCategory,
    };

    setCalendarEvents((prev) => [newEvt, ...prev]);
    setCalendarSaveSuccess(`Calendar event "${calTitle}" added for ${calDate}.`);
    setTimeout(() => {
      setCalendarSaveSuccess(null);
      setIsAddCalendarEventModalOpen(false);
      setCalTitle('');
      setCalDesc('');
    }, 1200);
  };

  const handleOpenAddSlot = (slot?: TimetableSlotItem) => {
    if (slot) {
      setEditingSlotId(slot.id);
      setSlotDay(slot.day);
      setSlotPeriod(slot.period);
      setSlotTime(slot.time);
      setSlotCourseCode(slot.courseCode);
      setSlotCourseTitle(slot.courseTitle);
      setSlotFacultyName(slot.facultyName);
      setSlotRoom(slot.room);
    } else {
      setEditingSlotId(null);
      setSlotDay('Monday');
      setSlotPeriod(slots.length + 1);
      setSlotTime('02:00 - 03:00 PM');
      setSlotCourseCode('CS401');
      setSlotCourseTitle('Design & Analysis of Algorithms');
      setSlotFacultyName('Dr. Ramesh Kulkarni');
      setSlotRoom('LH-201');
    }
    setSlotSaveSuccess(null);
    setIsAddSlotModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();

    // Check clash: same room or faculty in same period
    const hasClash = slots.some(
      (s) =>
        s.id !== editingSlotId &&
        s.day === slotDay &&
        s.period === slotPeriod &&
        (s.room === slotRoom || s.facultyName === slotFacultyName)
    );

    if (editingSlotId) {
      setSlots((prev) =>
        prev.map((s) =>
          s.id === editingSlotId
            ? {
                ...s,
                day: slotDay,
                period: slotPeriod,
                time: slotTime,
                courseCode: slotCourseCode,
                courseTitle: slotCourseTitle,
                facultyName: slotFacultyName,
                room: slotRoom,
                hasClash,
              }
            : s
        )
      );
      setSlotSaveSuccess(`Timetable Period ${slotPeriod} updated successfully.`);
    } else {
      const newSlot: TimetableSlotItem = {
        id: `slot-${Date.now()}`,
        day: slotDay,
        period: slotPeriod,
        time: slotTime,
        courseCode: slotCourseCode,
        courseTitle: slotCourseTitle,
        facultyName: slotFacultyName,
        facultyId: 'fac-custom',
        room: slotRoom,
        hasClash,
      };
      setSlots((prev) => [...prev, newSlot]);
      setSlotSaveSuccess(`New Timetable slot for Period ${slotPeriod} (${slotCourseCode}) added.`);
    }

    setTimeout(() => {
      setSlotSaveSuccess(null);
      setIsAddSlotModalOpen(false);
    }, 1200);
  };

  // Smart Substitution Assistant Handler
  const handleOpenSubstitutionAssistant = (slot: TimetableSlotItem) => {
    setSelectedSlotForSub(slot);
    setAssignedSuccess(null);
    const proposals: SubstitutionProposal[] = [
      {
        slotId: slot.id,
        originalFaculty: slot.facultyName,
        substituteFaculty: 'Prof. Rajesh Nair',
        substituteId: 'fac-sub-1',
        department: 'Computer Science & Engg',
        weeklyLoad: 12,
        period: slot.period,
        matchScore: 98,
      },
      {
        slotId: slot.id,
        originalFaculty: slot.facultyName,
        substituteFaculty: 'Dr. Meenakshi Sundaram',
        substituteId: 'fac-sub-2',
        department: 'Computer Science & Engg',
        weeklyLoad: 14,
        period: slot.period,
        matchScore: 91,
      },
    ];
    setSubstitutionProposals(proposals);
  };

  const handleConfirmSubstitution = (sub: SubstitutionProposal) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === sub.slotId ? { ...s, facultyName: `${sub.substituteFaculty} (Sub)`, hasClash: false } : s
      )
    );
    setAssignedSuccess(`Substitution Duty assigned to ${sub.substituteFaculty}. Master schedule intact.`);
    setTimeout(() => {
      setSelectedSlotForSub(null);
      setAssignedSuccess(null);
    }, 1800);
  };

  // 1-Click Constraint Timetable Solver
  const handleAutoGenerateTimetable = () => {
    setIsAutoGeneratingTimetable(true);
    setAutoGenSuccessMessage(null);
    setTimeout(() => {
      setIsAutoGeneratingTimetable(false);
      setSlots((prev) => prev.map((s) => ({ ...s, hasClash: false })));
      setAutoGenSuccessMessage('Constraint solver completed: 0 clashes detected across 3 sections & 14 faculty rooms.');
    }, 1500);
  };

  // Add Diary Entry
  const handleAddDiaryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CourseDiaryLog = {
      id: `cd-${Date.now().toString(36)}`,
      courseCode: 'CS401',
      facultyName: 'Dr. Ramesh Kulkarni',
      date: new Date().toISOString().split('T')[0],
      period: Number(newDiaryPeriod),
      section: 'A',
      topicCovered: newDiaryTopic,
      attendanceCount: Number(newDiaryAttendance),
      totalStudents: 60,
      pedagogyNotes: 'Classroom lecture & student Q&A.',
    };
    setCourseDiary([newEntry, ...courseDiary]);
    setIsAddDiaryModalOpen(false);
    setNewDiaryTopic('');
    alert('Teaching record committed to institutional Course Diary!');
  };

  // Submit Quiz Test
  const handleSubmitQuiz = () => {
    if (!activeQuizForTest) return;
    let score = 0;
    activeQuizForTest.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += q.options.length > 0 ? 5 : 0;
      }
    });
    setQuizScoreResult(score);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Module 03 • Academics, Curriculum &amp; Learning Management
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Choice-Based Credit System (CBCS)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
              NBA Tier-1 OBE Attainment
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Academics, Timetable, Teaching &amp; Learning Space</h1>
          <p className="text-xs text-[#6E6862]">
            Comprehensive academic governance: Course catalog, L-T-P &amp; CO-PO mapping, CBCS registration, faculty workload balancing, timetable constraint clash solver, lesson diaries, proctorial mentoring, and LMS.
          </p>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAutoGenerateTimetable}
            disabled={isAutoGeneratingTimetable}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>{isAutoGeneratingTimetable ? 'Running CSP Solver...' : 'Run Timetable Solver'}</span>
          </button>
        </div>
      </div>

      {/* Faculty Scoped Session Banner */}
      {isFacultyScoped && (
        <div className="bg-[#FAF7F2] border border-[#D5B3BC] rounded-xl px-4 py-2.5 text-xs text-[#6E6862] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#682038] shrink-0" />
            <span>
              <strong>Faculty Subject-Scoped Session (§4.1):</strong> You are authenticated as instructor for <strong>CS401 (Design &amp; Analysis of Algorithms)</strong> &amp; <strong>CS402L (Algorithms Lab)</strong>. Lesson plans, teaching diaries, study materials, and student submissions are automatically isolated to your teaching allocations.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E5DFD7] text-[#682038] font-bold shrink-0">
            Assigned: CS401 / CS402L
          </span>
        </div>
      )}

      {/* 9-TAB NAVIGATION STRIP */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'courses' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>1. Courses &amp; CO-PO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('structure')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'structure' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>2. Structure &amp; Regulations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('registration')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'registration' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>3. CBCS Registration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('allocation')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'allocation' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>4. Workload Balancing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timetable')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'timetable' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>5. Timetable &amp; Substitutions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'calendar' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>6. Academic Calendar (90 Days)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('teaching')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'teaching' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>7. Course Diary &amp; Lesson Plans</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mentoring')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'mentoring' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>8. Proctorial Mentoring</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lms')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'lms' ? 'bg-[#682038] text-white shadow-sm' : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>9. Learning Space (LMS)</span>
        </button>
      </div>

      {autoGenSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{autoGenSuccessMessage}</span>
          <button onClick={() => setAutoGenSuccessMessage(null)} className="text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* ========================================================
          TAB 1: COURSES, L-T-P & CO-PO OBE MAPPING
         ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#242424]">Autonomous Course Catalog &amp; OBE Syllabus Matrix</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                  Curriculum Authority: HOD &amp; Board of Studies (BOS)
                </span>
              </div>
              <p className="text-xs text-[#6E6862]">
                Official curriculum, syllabus units, credits, lecture-tutorial-practical (L-T-P) distribution, and CO-PO attainment matrices.
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddCourseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Course to Catalog</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenEditSyllabus(courses[0])}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5DFD7] hover:bg-[#FAF7F2] text-[#682038] text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>Update Course Syllabus &amp; Credits</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs flex flex-col justify-between hover:border-[#682038]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                        {c.code}
                      </span>
                      <h3 className="font-bold text-base text-[#242424] mt-1">{c.title}</h3>
                      <p className="text-xs text-[#6E6862]">{c.department} • Semester {c.semester}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-[#682038]">{c.credits} Credits</div>
                      <div className="text-[10px] font-mono text-[#8B5E3C]">L-T-P: {c.ltpHours}</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] rounded-xl p-3 text-xs space-y-1 border border-[#EFE9E1]">
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Course Type:</span>
                      <span className="font-bold text-[#682038]">{c.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Prerequisites:</span>
                      <span className="font-medium text-[#242424]">{c.prerequisites.join(', ') || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Course Outcomes Defined:</span>
                      <span className="font-bold text-emerald-800">{c.courseOutcomes.length} COs (NBA Tier-1)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Syllabus Units Configured:</span>
                      <span className="font-bold text-[#242424]">{c.syllabusUnits.length} Units</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFE9E1] flex items-center justify-between mt-4">
                  <span className="text-[11px] text-[#6E6862]">Regulation: <strong>{c.regulationCode}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSyllabus(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#E5DFD7] hover:bg-[#FAF7F2] text-[#682038] text-xs font-bold transition-colors cursor-pointer"
                      title="Update Syllabus (Authorized: HOD / Board of Studies)"
                    >
                      <BookOpen className="w-3 h-3 text-[#8B5E3C]" />
                      <span>Update Syllabus</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForDetail(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>View CO-PO</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: STRUCTURE & REGULATIONS
         ======================================================== */}
      {activeTab === 'structure' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#242424]">Academic Hierarchy &amp; Autonomous Regulations</h3>
              <p className="text-xs text-[#6E6862]">
                Structure: Institution &rarr; Department &rarr; Program &rarr; Batch &rarr; Semester &rarr; Section with versioned degree regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regulations.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#682038]">{r.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {r.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#242424]">{r.title}</h4>
                  <div className="text-xs text-[#6E6862] space-y-1 pt-1">
                    <div>Degree Credits: <strong className="text-[#242424]">{r.totalCreditsRequired} Credits</strong></div>
                    <div>Semester Bounds: <strong className="text-[#242424]">{r.minSemesterCredits} to {r.maxSemesterCredits} Credits/Sem</strong></div>
                    <div>Grading Scale: <span className="font-mono text-[#8B5E3C]">{r.gradingScale}</span></div>
                    <div>Departments: <span className="text-[#242424]">{r.departments.join(', ')}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: CBCS SEMESTER COURSE REGISTRATION
         ======================================================== */}
      {activeTab === 'registration' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">CBCS Semester Course Registration Desk</h3>
                <p className="text-xs text-[#6E6862]">
                  Enforces prerequisite validation, 18–26 credit boundaries, seat limits, and faculty advisor sign-off.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Registration Window: ACTIVE (4 Days Remaining)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Student Scholar</th>
                    <th className="p-3.5">Registered Courses</th>
                    <th className="p-3.5">Credits Total</th>
                    <th className="p-3.5">Seat Availability</th>
                    <th className="p-3.5">Approval State</th>
                    <th className="p-3.5 text-right">Advisor Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-3.5">
                        <div className="font-bold text-[#242424]">{reg.studentName}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{reg.rollNo} • {reg.program}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          {reg.registeredCourses.map((c) => (
                            <div key={c.courseCode} className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E5DFD7] text-[#682038] font-bold">
                                {c.courseCode}
                              </span>
                              <span className="text-[#242424] font-medium">{c.courseTitle}</span>
                              <span className="text-[10px] text-[#8B5E3C]">({c.credits}c • {c.type})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#682038]">
                        {reg.totalCredits} / 26 Credits
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Elective Seats OK (54/60 Filled)
                        </span>
                      </td>
                      <td className="p-3.5">
                        {reg.status === 'APPROVED_BY_ADVISOR' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            APPROVED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            PENDING ADVISOR
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {reg.status === 'SUBMITTED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setRegistrations(registrations.map((r) => r.id === reg.id ? { ...r, status: 'APPROVED_BY_ADVISOR' } : r));
                              alert(`Registration approved for ${reg.studentName}!`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#682038] text-white text-[11px] font-bold hover:bg-[#54192D]"
                          >
                            Approve Courses
                          </button>
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

      {/* ========================================================
          TAB 4: FACULTY ALLOCATION & WORKLOAD BALANCING
         ======================================================== */}
      {activeTab === 'allocation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#242424]">Faculty Workload Balancing &amp; Lab Batch Subdivision</h3>
              <p className="text-xs text-[#6E6862]">
                AICTE/UGC workload limits: Professors: 14 hrs/week, Associate: 16 hrs/week, Assistant: 18 hrs/week.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workloads.map((w) => (
                <div key={w.facultyId} className="p-4 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#242424]">{w.name}</h4>
                      <p className="text-[10px] text-[#6E6862]">{w.designation}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.status === 'OVERLOADED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Weekly Assigned Load:</span>
                      <span className="font-bold font-mono text-[#682038]">{w.totalWeeklyHours} / {w.maxWeeklyHours} hrs</span>
                    </div>
                    <div className="w-full bg-[#E5DFD7] rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${w.status === 'OVERLOADED' ? 'bg-rose-600' : 'bg-[#682038]'}`}
                        style={{ width: `${Math.min(100, (w.totalWeeklyHours / w.maxWeeklyHours) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5DFD7] text-[11px] space-y-1">
                    <div className="font-semibold text-[#8B5E3C]">Allocated Course &amp; Lab Batches:</div>
                    {w.coursesAllocated.map((c, i) => (
                      <div key={i} className="text-[#242424]">
                        • {c.courseCode} ({c.section}) {c.labBatch ? `[Batch ${c.labBatch}]` : ''} - {c.hours}h
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: TIMETABLE, CLASH SOLVER & SUBSTITUTIONS
         ======================================================== */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#682038]" />
                  <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                    B.Tech CSE — Semester 4 (Section A) Schedule
                  </h3>
                </div>
                <p className="text-xs text-[#6E6862] mt-0.5">
                  Authority: <strong>Timetable Coordinator &amp; HOD</strong> (Schedule generation, room constraints &amp; faculty clash checks).
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleOpenAddSlot()}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD7] text-[#682038] hover:bg-[#FAF7F2] text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Slot Builder</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutoGenerateTimetable}
                  className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Regenerate Schedule</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-xl border transition-all ${
                      slot.hasClash
                        ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-400'
                        : 'bg-[#FAF7F2] border-[#E5DFD7] hover:border-[#682038]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-[#682038]">Period {slot.period}</span>
                      <span className="text-[11px] text-[#6E6862] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {slot.time}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#242424] line-clamp-1">{slot.courseTitle}</div>
                    <div className="text-[11px] font-mono font-semibold text-[#8B5E3C] mt-0.5">{slot.courseCode}</div>

                    <div className="mt-3 pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#242424] text-[11px]">{slot.facultyName}</div>
                        <div className="text-[10px] text-[#6E6862] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#9B948D]" /> {slot.room}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAddSlot(slot)}
                          className="p-1 rounded text-[#9B948D] hover:text-[#682038] hover:bg-[#E5DFD7]/50 cursor-pointer"
                          title="Edit Schedule Slot (Timetable Coordinator)"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                        </button>
                        {slot.hasClash ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSubstitutionAssistant(slot)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Substitute</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenSubstitutionAssistant(slot)}
                            className="p-1 rounded text-[#9B948D] hover:text-[#682038] hover:bg-[#E5DFD7]/50 cursor-pointer"
                            title="Request Substitution"
                          >
                            <UserPlus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: ACADEMIC CALENDAR & 90-DAY TRACKER
         ======================================================== */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Institutional Academic Calendar &amp; Statutory 90-Day Tracker</h3>
                <p className="text-xs text-[#6E6862]">
                  UGC / AICTE mandates minimum 90 instructional working days per semester before exam eligibility.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Current Progress: 82 / 90 Working Days (91.1%)
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddCalendarEventModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone / Date</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {calendarEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold text-[#8B5E3C]">{evt.date}</span>
                    <h4 className="font-bold text-xs text-[#242424]">{evt.title}</h4>
                    <p className="text-[11px] text-[#6E6862]">{evt.description}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      evt.category === 'GAZETTED_HOLIDAY'
                        ? 'bg-rose-100 text-rose-800'
                        : evt.category === 'INTERNAL_EXAM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {evt.category.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: COURSE DIARY & LESSON PLANS
         ======================================================== */}
      {activeTab === 'teaching' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Faculty Course Diary &amp; Lesson Plan Tracker</h3>
                <p className="text-xs text-[#6E6862]">
                  Tracks daily topics taught, student attendance counts, and unit-wise syllabus coverage percentages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDiaryModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold"
              >
                + Log Daily Session Diary
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#682038] uppercase">Lesson Plan Execution (CS401)</div>
                {lessonPlans.map((lp) => (
                  <div key={lp.id} className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{lp.topicTitle}</span>
                      <span className="text-[#682038]">{lp.pedagogy.replace('_', ' ')}</span>
                    </div>
                    <div className="text-[10px] text-[#6E6862]">
                      Planned: {lp.plannedDate} {lp.actualDate ? `• Executed: ${lp.actualDate}` : ''}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="font-bold text-xs text-[#682038] uppercase">Course Diary Logbook</div>
                {courseDiary.map((cd) => (
                  <div key={cd.id} className="p-3 rounded-xl border border-[#E5DFD7] bg-white text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#242424]">
                      <span>{cd.date} • Period {cd.period} (Sec {cd.section})</span>
                      <span className="text-emerald-700">{cd.attendanceCount}/{cd.totalStudents} Present</span>
                    </div>
                    <p className="text-[#6E6862] text-[11px]">{cd.topicCovered}</p>
                    <div className="text-[10px] text-[#8B5E3C]">{cd.pedagogyNotes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 8: PROCTORIAL MENTORING SYSTEM
         ======================================================== */}
      {activeTab === 'mentoring' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#242424]">Proctorial Mentoring Console (1:20 Ratio)</h3>
              <p className="text-xs text-[#6E6862]">
                Faculty proctors track mentee academic trajectory, early-warning attendance alerts, and counseling records.
              </p>
            </div>

            {mentoringBatches.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#242424]">{m.mentorName} ({m.mentorDepartment})</h4>
                    <p className="text-xs text-[#6E6862]">Cohort: 20 Assigned Student Mentees</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    Proctorial Ratio: 1:20 Compliant
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {m.mentees.map((mentee) => (
                    <div key={mentee.studentId} className="p-3 rounded-lg border border-[#E5DFD7] bg-white text-xs space-y-1">
                      <div className="font-bold text-[#242424]">{mentee.studentName} ({mentee.rollNo})</div>
                      <div className="flex justify-between text-[11px]">
                        <span>CGPA: <strong>{mentee.cgpa}</strong></span>
                        <span className={mentee.attendancePercent < 75 ? 'text-rose-700 font-bold' : 'text-emerald-700'}>
                          Att: {mentee.attendancePercent}%
                        </span>
                      </div>
                      {mentee.riskStatus !== 'NORMAL' && (
                        <div className="text-[10px] font-bold text-rose-700 pt-0.5">
                          ⚠️ {mentee.riskStatus.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E5DFD7] text-xs">
                  <div className="font-bold text-[#8B5E3C] mb-1">Recent Meeting Record:</div>
                  {m.meetingLogs.map((log) => (
                    <div key={log.id} className="text-[#6E6862] text-[11px] bg-white p-2.5 rounded-lg border border-[#E5DFD7]">
                      <strong>{log.meetingDate}:</strong> {log.agenda} &mdash; <em>"{log.counselingRemarks}"</em>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 9: LEARNING SPACE (LMS)
         ======================================================== */}
      {activeTab === 'lms' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#242424]">Course Learning Space (LMS Hub)</h3>
              <p className="text-xs text-[#6E6862]">
                Course materials, assignments with rubric grading, auto-graded MCQ quizzes, and Google Meet / Zoom sessions.
              </p>
            </div>

            {/* Virtual Classroom Links */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-700" />
                  <span className="font-bold text-xs text-blue-950">Active Virtual Classroom Sessions</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">Google Meet</span>
              </div>
              {virtualClasses.map((vc) => (
                <div key={vc.id} className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="font-bold text-[#242424]">{vc.courseTitle} ({vc.courseCode})</span>
                    <div className="text-[11px] text-[#6E6862]">{vc.scheduledTime} • Host: {vc.facultyName}</div>
                  </div>
                  <a
                    href={vc.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs inline-flex items-center gap-1"
                  >
                    <span>Join Session</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            {/* Materials & Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Materials */}
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#682038] uppercase">Course Study Materials</div>
                {materials.map((mat) => (
                  <div key={mat.id} className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#242424]">{mat.title}</div>
                      <div className="text-[10px] text-[#6E6862]">{mat.fileSize} • {mat.accessCount} Downloads</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading ${mat.title}...`)}
                      className="p-1.5 rounded bg-white hover:bg-[#E5DFD7] text-[#682038] border border-[#E5DFD7]"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Assignments */}
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#682038] uppercase">Assignments &amp; Submissions</div>
                {assignments.map((asg) => (
                  <div key={asg.id} className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#242424]">
                      <span>{asg.title}</span>
                      <span className="text-[#682038]">{asg.maxMarks} Marks</span>
                    </div>
                    <div className="text-[11px] text-[#6E6862]">{asg.description}</div>
                    <div className="flex justify-between text-[10px] pt-1">
                      <span>Due: {asg.dueDate}</span>
                      <span className="font-bold text-emerald-800">{asg.submissionsCount}/{asg.totalStudents} Submitted</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MCQ Quizzes with Auto-Grading */}
            <div className="pt-2 border-t border-[#E5DFD7] space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[#682038] uppercase">Auto-Graded MCQ Assessment Quizzes</div>
              </div>
              {quizzes.map((qz) => (
                <div key={qz.id} className="p-3.5 rounded-xl border border-[#E5DFD7] bg-white text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#242424]">{qz.title}</h4>
                    <p className="text-[11px] text-[#6E6862]">{qz.totalQuestions} Questions • {qz.timeLimitMinutes} Minutes • Auto-evaluated on submission</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuizForTest(qz);
                      setQuizAnswers({});
                      setQuizScoreResult(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#682038] text-white font-bold"
                  >
                    Open Live Quiz Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: COURSE OUTCOMES & CO-PO OBE MAPPING DRAWER
         ======================================================== */}
      {selectedCourseForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl border border-[#E5DFD7] space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                  {selectedCourseForDetail.code} • L-T-P: {selectedCourseForDetail.ltpHours}
                </span>
                <h3 className="font-bold text-lg text-[#242424] mt-1">{selectedCourseForDetail.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourseForDetail(null)}
                className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* 5-Unit Syllabus Breakdown */}
              <div>
                <h4 className="font-bold text-xs text-[#682038] uppercase mb-2">5-Unit Detailed Syllabus Breakdown</h4>
                <div className="space-y-2">
                  {selectedCourseForDetail.syllabusUnits.map((u) => (
                    <div key={u.unitNumber} className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2]">
                      <div className="flex justify-between font-bold text-[#242424]">
                        <span>Unit {u.unitNumber}: {u.title}</span>
                        <span className="text-[#8B5E3C]">{u.hours} Lecture Hours</span>
                      </div>
                      <p className="text-[11px] text-[#6E6862] mt-1">{u.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Outcomes */}
              <div>
                <h4 className="font-bold text-xs text-[#682038] uppercase mb-2">Course Outcomes (COs) &amp; Bloom's Taxonomy</h4>
                <div className="space-y-1.5">
                  {selectedCourseForDetail.courseOutcomes.map((co) => (
                    <div key={co.code} className="p-2.5 rounded-xl border border-[#E5DFD7] bg-white flex items-start gap-2">
                      <span className="font-mono font-bold text-[#682038] shrink-0">{co.code}</span>
                      <div className="flex-1">
                        <span className="text-[#242424]">{co.description}</span>
                        <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                          {co.bloomLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NBA OBE CO-PO Correlation Matrix Table */}
              <div>
                <h4 className="font-bold text-xs text-[#682038] uppercase mb-2">NBA Tier-1 CO-PO Correlation Matrix (1=Low, 2=Medium, 3=High)</h4>
                <div className="overflow-x-auto border border-[#E5DFD7] rounded-xl">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-[#FAF7F2] font-mono text-[11px] border-b border-[#E5DFD7]">
                      <tr>
                        <th className="p-2 text-left">CO / PO</th>
                        <th>PO1</th><th>PO2</th><th>PO3</th><th>PO4</th><th>PO5</th><th>PO6</th><th>PO7</th><th>PO8</th><th>PO9</th><th>PO10</th><th>PO11</th><th>PO12</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE9E1] font-mono">
                      {selectedCourseForDetail.courseOutcomes.map((co) => (
                        <tr key={co.code}>
                          <td className="p-2 text-left font-bold text-[#682038]">{co.code}</td>
                          <td>{co.poMapping.PO1 || '-'}</td>
                          <td>{co.poMapping.PO2 || '-'}</td>
                          <td>{co.poMapping.PO3 || '-'}</td>
                          <td>{co.poMapping.PO4 || '-'}</td>
                          <td>{co.poMapping.PO5 || '-'}</td>
                          <td>{co.poMapping.PO6 || '-'}</td>
                          <td>{co.poMapping.PO7 || '-'}</td>
                          <td>{co.poMapping.PO8 || '-'}</td>
                          <td>{co.poMapping.PO9 || '-'}</td>
                          <td>{co.poMapping.PO10 || '-'}</td>
                          <td>{co.poMapping.PO11 || '-'}</td>
                          <td>{co.poMapping.PO12 || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E5DFD7] shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCourseForDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#682038] text-white text-xs font-bold"
              >
                Close Course Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: SMART SUBSTITUTION ASSISTANT
         ======================================================== */}
      {selectedSlotForSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#8B5E3C]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Smart Substitution Assistant</h3>
                <p className="text-xs text-[#6E6862]">
                  Collision engine detects unassigned faculty in same wing/department.
                </p>
              </div>
            </div>

            {assignedSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto mb-3 animate-bounce" />
                <h4 className="text-base font-bold text-[#242424]">{assignedSuccess}</h4>
                <p className="text-xs text-[#6E6862] mt-1">Push notification dispatched to substitute faculty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs">
                  <div className="font-bold text-[#682038]">{selectedSlotForSub.courseTitle} ({selectedSlotForSub.courseCode})</div>
                  <div className="text-[#6E6862] mt-0.5">
                    Period {selectedSlotForSub.period} ({selectedSlotForSub.time}) • Room {selectedSlotForSub.room}
                  </div>
                  <div className="text-[#BA1A1A] font-semibold mt-1">
                    Absent Faculty: {selectedSlotForSub.facultyName}
                  </div>
                </div>

                <div className="text-xs font-bold text-[#682038] uppercase tracking-wider">
                  Ranked Free Faculty Proposals ({substitutionProposals.length} Found)
                </div>

                <div className="space-y-2.5">
                  {substitutionProposals.map((proposal) => (
                    <div
                      key={proposal.substituteId}
                      className="p-3.5 rounded-xl border border-[#E5DFD7] hover:border-[#682038] bg-white transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#242424] text-xs">{proposal.substituteFaculty}</div>
                        <div className="text-[11px] text-[#6E6862]">
                          {proposal.department} • Weekly load: {proposal.weeklyLoad} hrs
                        </div>
                        <div className="text-[10px] text-[#16A34A] font-semibold mt-0.5">
                          ✓ Free during Period {proposal.period} • No timetable clash
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConfirmSubstitution(proposal)}
                        className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        1-Click Assign
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlotForSub(null)}
                    className="px-4 py-2 rounded-lg border border-[#E5DFD7] text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD COURSE DIARY ENTRY
         ======================================================== */}
      {isAddDiaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5DFD7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h3 className="font-bold text-base text-[#242424]">Log Daily Session in Course Diary</h3>
              <button onClick={() => setIsAddDiaryModalOpen(false)} className="text-[#6E6862]">✕</button>
            </div>

            <form onSubmit={handleAddDiaryEntry} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Topic Covered</label>
                <input
                  type="text"
                  value={newDiaryTopic}
                  onChange={(e) => setNewDiaryTopic(e.target.value)}
                  placeholder="e.g. Greedy Huffman Coding frequency tree construction."
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Period Number</label>
                  <select
                    value={newDiaryPeriod}
                    onChange={(e) => setNewDiaryPeriod(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  >
                    <option value={1}>Period 1 (09:00 - 10:00)</option>
                    <option value={2}>Period 2 (10:00 - 11:00)</option>
                    <option value={3}>Period 3 (11:15 - 12:15)</option>
                    <option value={4}>Period 4 (13:00 - 14:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Attendance Headcount</label>
                  <input
                    type="number"
                    value={newDiaryAttendance}
                    onChange={(e) => setNewDiaryAttendance(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDiaryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] font-semibold text-[#6E6862]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] text-white font-bold"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: LIVE MCQ QUIZ AUTO-GRADING TEST
         ======================================================== */}
      {activeQuizForTest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#8B5E3C] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5DFD7]">
                  {activeQuizForTest.courseCode} • {activeQuizForTest.timeLimitMinutes} Mins
                </span>
                <h3 className="font-bold text-base text-[#242424] mt-1">{activeQuizForTest.title}</h3>
              </div>
              <button onClick={() => setActiveQuizForTest(null)} className="text-[#6E6862]">✕</button>
            </div>

            {quizScoreResult !== null ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-[#242424]">Quiz Evaluated Automatically!</h4>
                <div className="text-2xl font-mono font-extrabold text-[#682038]">
                  Score: {quizScoreResult} / {activeQuizForTest.maxMarks} Marks
                </div>
                <p className="text-xs text-[#6E6862]">
                  Result automatically compiled and submitted into Module 04 Examination &amp; Internals mark sheet.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveQuizForTest(null)}
                  className="px-5 py-2 rounded-xl bg-[#682038] text-white font-bold"
                >
                  Finish Review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeQuizForTest.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-2">
                    <div className="font-bold text-[#242424]">
                      Q{idx + 1}. {q.question}
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                            quizAnswers[q.id] === optIdx
                              ? 'bg-[#682038] text-white border-[#682038]'
                              : 'bg-white text-[#242424] border-[#E5DFD7]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={quizAnswers[q.id] === optIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                            className="hidden"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                  <button
                    type="button"
                    onClick={() => setActiveQuizForTest(null)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7F2] font-semibold text-[#6E6862]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-[#682038] text-white font-bold"
                  >
                    Submit &amp; Auto-Grade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT & UPDATE SYLLABUS UNITS
          (Authorized Role: HOD & Board of Studies / Academic Dean)
         ======================================================== */}
      {isEditSyllabusModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#682038]" />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">
                    Update Syllabus: {editingCourse.code}
                  </h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Curriculum Authority: <strong>Head of Department (HOD) &amp; Board of Studies</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditSyllabusModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSyllabusUnit} className="space-y-3 text-xs">
              {syllabusSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syllabusSaveSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Target Course</label>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] font-semibold text-[#682038]">
                  {editingCourse.code} — {editingCourse.title} ({editingCourse.department})
                </div>
              </div>

              {/* Subject Credit Weighting & L-T-P Hours */}
              <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424] flex items-center justify-between">
                    <span>Subject Credits *</span>
                    <span className="text-[10px] text-[#8B5E3C]">CBCS Weight</span>
                  </label>
                  <select
                    value={syllabusCredits}
                    onChange={(e) => setSyllabusCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value={5}>5.0 Credits (Advanced Core)</option>
                    <option value={4}>4.0 Credits (Standard Theory Core)</option>
                    <option value={3}>3.0 Credits (Applied Theory / Elective)</option>
                    <option value={2}>2.0 Credits (Professional Elective)</option>
                    <option value={1.5}>1.5 Credits (Laboratory / Practicum)</option>
                    <option value={1}>1.0 Credit (UHV / Social Skill)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#242424] flex items-center justify-between">
                    <span>L-T-P Distribution *</span>
                    <span className="text-[10px] text-[#8B5E3C]">Lec-Tut-Prac</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={syllabusLtpHours}
                    onChange={(e) => setSyllabusLtpHours(e.target.value)}
                    placeholder="e.g. 3-1-0 or 0-0-3"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Regulation Version *</label>
                  <input
                    type="text"
                    required
                    value={syllabusVersionCode}
                    onChange={(e) => setSyllabusVersionCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Planned Lecture Hours *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={syllabusPlannedHours}
                    onChange={(e) => setSyllabusPlannedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Syllabus Unit Title *</label>
                <input
                  type="text"
                  required
                  value={syllabusUnitTitle}
                  onChange={(e) => setSyllabusUnitTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Key Topics (Comma-Separated) *</label>
                <textarea
                  rows={3}
                  required
                  value={syllabusUnitTopics}
                  onChange={(e) => setSyllabusUnitTopics(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsEditSyllabusModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Commit Syllabus Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: MANUAL TIMETABLE SLOT BUILDER
          (Authorized Role: Timetable Coordinator & HOD)
         ======================================================== */}
      {isAddSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#682038]" />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">
                    {editingSlotId ? 'Edit Timetable Schedule Slot' : 'Manual Timetable Slot Builder'}
                  </h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Scheduling Authority: <strong>Timetable Coordinator &amp; Academic Dean</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSlotModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              {slotSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{slotSaveSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Day of Week *</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Period Number *</label>
                  <select
                    value={slotPeriod}
                    onChange={(e) => setSlotPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((p) => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Time Slot Window *</label>
                  <input
                    type="text"
                    required
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Lecture Hall / Lab *</label>
                  <input
                    type="text"
                    required
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={slotCourseCode}
                    onChange={(e) => setSlotCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono text-xs font-bold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Assigned Faculty *</label>
                  <input
                    type="text"
                    required
                    value={slotFacultyName}
                    onChange={(e) => setSlotFacultyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Course Title *</label>
                <input
                  type="text"
                  required
                  value={slotCourseTitle}
                  onChange={(e) => setSlotCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD NEW COURSE / SUBJECT TO CURRICULUM CATALOG
          (Authorized Role: Registrar & Board of Studies / Dean)
         ======================================================== */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#682038]" />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">Add New Course / Subject to Catalog</h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Curriculum Authority: <strong>Registrar Office &amp; Board of Studies (BOS)</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewCourse} className="space-y-3 text-xs">
              {courseSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{courseSaveSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Course / Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS302 or EC204"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono text-xs font-bold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Academic Department *</label>
                  <select
                    value={newCourseDept}
                    onChange={(e) => setNewCourseDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="Computer Science & Engg">Computer Science &amp; Engg</option>
                    <option value="Electronics & Comm. Engg">Electronics &amp; Comm. Engg</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Information Science & Engg">Information Science &amp; Engg</option>
                    <option value="Basic Sciences & Humanities">Basic Sciences &amp; Humanities</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Semester *</label>
                  <select
                    value={newCourseSemester}
                    onChange={(e) => setNewCourseSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Course Type *</label>
                  <select
                    value={newCourseType}
                    onChange={(e) => setNewCourseType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="THEORY">Theory Core</option>
                    <option value="LAB">Practical / Laboratory</option>
                    <option value="PROFESSIONAL_ELECTIVE">Professional Elective</option>
                    <option value="OPEN_ELECTIVE">Open Elective (CBCS)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Regulation Scheme *</label>
                  <input
                    type="text"
                    required
                    value={newCourseRegulation}
                    onChange={(e) => setNewCourseRegulation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424] flex items-center justify-between">
                    <span>Credits Weight *</span>
                    <span className="text-[10px] text-[#8B5E3C]">AICTE/UGC CBCS</span>
                  </label>
                  <select
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value={5}>5.0 Credits (Advanced Major)</option>
                    <option value={4}>4.0 Credits (Standard Theory Core)</option>
                    <option value={3}>3.0 Credits (Elective / Applied Theory)</option>
                    <option value={2}>2.0 Credits (Skill / Mini Project)</option>
                    <option value={1.5}>1.5 Credits (Laboratory / Practicum)</option>
                    <option value={1}>1.0 Credit (UHV / Foundation)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424] flex items-center justify-between">
                    <span>L-T-P Hours *</span>
                    <span className="text-[10px] text-[#8B5E3C]">Lec-Tut-Prac</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseLtpHours}
                    onChange={(e) => setNewCourseLtpHours(e.target.value)}
                    placeholder="e.g. 3-1-0 or 0-0-3"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Prerequisite Subjects</label>
                <input
                  type="text"
                  placeholder="e.g. CS201 Data Structures, CS204 Discrete Math"
                  value={newCoursePrereq}
                  onChange={(e) => setNewCoursePrereq(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              {/* Initial Syllabus Unit */}
              <div className="p-3 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] space-y-2">
                <div className="font-bold text-xs text-[#682038] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Initial Syllabus Unit (Unit 1 Outlines)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-0.5">
                    <label className="text-[10px] font-semibold text-[#6E6862]">Unit Title</label>
                    <input
                      type="text"
                      value={newCourseUnitTitle}
                      onChange={(e) => setNewCourseUnitTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DFD7] bg-white text-xs"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-semibold text-[#6E6862]">Lecture Hours</label>
                    <input
                      type="number"
                      value={newCourseUnitHours}
                      onChange={(e) => setNewCourseUnitHours(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DFD7] bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-semibold text-[#6E6862]">Topics Covered</label>
                  <textarea
                    rows={2}
                    value={newCourseUnitTopics}
                    onChange={(e) => setNewCourseUnitTopics(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E5DFD7] bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Add Course to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD ACADEMIC CALENDAR MILESTONE / DATE
          (Authorized Role: Registrar)
         ======================================================== */}
      {isAddCalendarEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#682038]" />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">Add Calendar Milestone</h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Registrar Authority: Statutory Academic Calendar &amp; 90-Day Schedule
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCalendarEventModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCalendarEvent} className="space-y-3 text-xs">
              {calendarSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{calendarSaveSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Event / Milestone Date *</label>
                <input
                  type="date"
                  required
                  value={calDate}
                  onChange={(e) => setCalDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Assessment 2 or College Annual Day"
                  value={calTitle}
                  onChange={(e) => setCalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Category *</label>
                <select
                  value={calCategory}
                  onChange={(e) => setCalCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                >
                  <option value="INSTRUCTIONAL_DAY">Instructional Working Day / Milestone</option>
                  <option value="INTERNAL_EXAM">Continuous Internal Assessment (CIA / Mid-term)</option>
                  <option value="GAZETTED_HOLIDAY">Gazetted Holiday</option>
                  <option value="SEMESTER_END_EXAM">Semester End University Examinations</option>
                  <option value="VACATION">Academic Recess / Vacation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Description / Circular Reference</label>
                <textarea
                  rows={2}
                  placeholder="Details, regulatory mandate, or institutional notice number..."
                  value={calDesc}
                  onChange={(e) => setCalDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsAddCalendarEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Add to Academic Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
