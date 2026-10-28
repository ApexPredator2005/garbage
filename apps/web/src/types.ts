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
