export type RoleType =
  | 'SUPER_ADMIN'
  | 'INSTITUTION_ADMIN'
  | 'PRINCIPAL'
  | 'REGISTRAR'
  | 'HOD'
  | 'FACULTY'
  | 'EXAM_CONTROLLER'
  | 'ACCOUNTANT'
  | 'HR_OFFICER'
  | 'STUDENT'
  | 'PARENT';

export interface TenantInfo {
  id: string;
  name: string;
  code: string;
  subdomain: string;
}

export interface UploadedCertDoc {
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  previewUrl?: string;
  verificationHash: string;
  authority: string;
}

export interface StudentRecord {
  id: string;
  enrollmentNo: string;
  rollNo: string;
  name: string;
  program: string;
  semester: number;
  section: string;
  status: 'ACTIVE' | 'DETAINED' | 'WITHDRAWN';
  exitClearance: {
    transferCert: boolean;
    characterCert: boolean;
    migrationCert: boolean;
    noDuesSlip: boolean;
    uploadedDocs?: {
      transferCert?: UploadedCertDoc;
      characterCert?: UploadedCertDoc;
      migrationCert?: UploadedCertDoc;
    };
  };
}

export interface TimetableSlotItem {
  id: string;
  day: string;
  period: number;
  time: string;
  courseCode: string;
  courseTitle: string;
  facultyName: string;
  facultyId: string;
  room: string;
  hasClash?: boolean;
}

export interface SubstitutionProposal {
  slotId: string;
  originalFaculty: string;
  substituteFaculty: string;
  substituteId: string;
  department: string;
  weeklyLoad: number;
  period: number;
  matchScore: number;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  internalMarks: number;
  externalMarks: number;
  moderatedMarks: number;
  grade: string;
  gradePoint: number;
  status: 'DRAFT' | 'SUBMITTED' | 'MODERATED' | 'LOCKED';
}

export interface FeeDemandItem {
  id: string;
  studentName: string;
  enrollmentNo: string;
  head: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
}

export interface UtrSubmissionItem {
  id: string;
  studentName: string;
  enrollmentNo: string;
  amount: number;
  utrReference: string;
  receiptUrl: string;
  bankName: string;
  submittedAt: string;
  idempotencyKey: string;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
}

// ========================================================
// MODULE 03: ACADEMICS, TIMETABLE & LEARNING SUITE (9 PILLARS)
// ========================================================

export interface AcademicRegulation {
  id: string;
  code: string; // e.g. "R-2026-CBCS", "R-2022"
  title: string;
  effectiveFromYear: number;
  totalCreditsRequired: number;
  minSemesterCredits: number;
  maxSemesterCredits: number;
  gradingScale: '10_POINT_ABSOLUTE' | '10_POINT_RELATIVE';
  status: 'ACTIVE' | 'ARCHIVED';
  departments: string[];
}

export interface CourseOutcome {
  code: string; // e.g. "CO1"
  description: string;
  bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE';
  poMapping: Record<string, number>; // PO1..PO12 (1: Low, 2: Med, 3: High)
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  hours: number;
  content: string;
}

export interface AcademicCourse {
  id: string;
  code: string;
  title: string;
  credits: number;
  ltpHours: string; // e.g. "3-1-0"
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  type: 'THEORY' | 'LAB' | 'PROFESSIONAL_ELECTIVE' | 'OPEN_ELECTIVE';
  department: string;
  semester: number;
  regulationCode: string;
  prerequisites: string[];
  courseOutcomes: CourseOutcome[];
  syllabusUnits: SyllabusUnit[];
  textbooks: string[];
}

export interface CourseRegistrationItem {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  program: string;
  semester: number;
  registeredCourses: {
    courseCode: string;
    courseTitle: string;
    credits: number;
    type: 'CORE' | 'PROFESSIONAL_ELECTIVE' | 'OPEN_ELECTIVE';
    seatCapacity?: number;
    enrolledCount?: number;
  }[];
  totalCredits: number;
  status: 'SUBMITTED' | 'APPROVED_BY_ADVISOR' | 'ENROLLED' | 'CHANGES_REQUESTED';
  submissionDate: string;
  advisorRemarks?: string;
}

export interface FacultyWorkload {
  facultyId: string;
  name: string;
  designation: 'PROFESSOR' | 'ASSOCIATE_PROFESSOR' | 'ASSISTANT_PROFESSOR';
  department: string;
  maxWeeklyHours: number;
  assignedTheoryHours: number;
  assignedLabHours: number;
  totalWeeklyHours: number;
  coursesAllocated: {
    courseCode: string;
    courseTitle: string;
    section: string;
    type: 'THEORY' | 'LAB';
    labBatch?: string;
    hours: number;
  }[];
  status: 'BALANCED' | 'OVERLOADED' | 'UNDERLOADED';
}

export interface CalendarEventItem {
  id: string;
  title: string;
  category: 'INSTRUCTIONAL_DAY' | 'GAZETTED_HOLIDAY' | 'INTERNAL_EXAM' | 'SEMESTER_END_EXAM' | 'VACATION';
  date: string;
  description?: string;
}

export interface LessonPlanEntry {
  id: string;
  courseCode: string;
  unitNumber: number;
  plannedDate: string;
  actualDate?: string;
  topicTitle: string;
  pedagogy: 'CHALK_AND_TALK' | 'PPT_MULTIMEDIA' | 'LAB_DEMO' | 'CASE_STUDY';
  status: 'COMPLETED' | 'PENDING' | 'RESCHEDULED';
  syllabusCoveragePercent: number;
}

export interface CourseDiaryLog {
  id: string;
  courseCode: string;
  facultyName: string;
  date: string;
  period: number;
  section: string;
  topicCovered: string;
  attendanceCount: number;
  totalStudents: number;
  pedagogyNotes: string;
}

export interface MentoringBatch {
  id: string;
  mentorFacultyId: string;
  mentorName: string;
  mentorDepartment: string;
  totalMentees: number;
  mentees: {
    studentId: string;
    studentName: string;
    rollNo: string;
    cgpa: number;
    attendancePercent: number;
    riskStatus: 'NORMAL' | 'ATTENDANCE_RISK' | 'ACADEMIC_BACKLOG_RISK';
  }[];
  meetingLogs: {
    id: string;
    meetingDate: string;
    agenda: string;
    actionItems: string;
    counselingRemarks: string;
  }[];
}

export interface LearningMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: 'SLIDES' | 'NOTES_PDF' | 'LAB_MANUAL' | 'REFERENCE_ARTICLE';
  uploadDate: string;
  fileSize: string;
  downloadUrl: string;
  accessCount: number;
}

export interface AssignmentItem {
  id: string;
  courseCode: string;
  title: string;
  dueDate: string;
  maxMarks: number;
  description: string;
  submissionsCount: number;
  totalStudents: number;
  status: 'ACTIVE' | 'CLOSED';
}

export interface QuizItem {
  id: string;
  courseCode: string;
  title: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  maxMarks: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface VirtualClassSession {
  id: string;
  courseCode: string;
  courseTitle: string;
  platform: 'GOOGLE_MEET' | 'ZOOM' | 'MS_TEAMS';
  meetingUrl: string;
  meetingId: string;
  passcode: string;
  scheduledTime: string;
  facultyName: string;
}
