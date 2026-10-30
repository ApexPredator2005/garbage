import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../../mockData';
import { StudentRecord, UploadedCertDoc } from '../../types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Search,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  PieChart,
  Award,
  Layers,
  Sparkles,
  QrCode,
  Download,
  ExternalLink,
  RefreshCw,
  Check,
  Building,
  GraduationCap,
  Upload,
  FileText,
  ShieldCheck,
  CreditCard,
  DollarSign,
  X,
  FileCheck,
  Eye,
  CloudUpload,
  FileDown,
  Users,
  Printer,
  Plus,
  Edit,
  TrendingUp,
} from 'lucide-react';

interface QuotaBucket {
  code: string;
  name: string;
  percentage: number;
  sanctioned: number;
  filled: number;
  vacant: number;
  color: string;
  isSupernumerary?: boolean;
}

interface AllottedApplicant {
  rank: number;
  name: string;
  score: number;
  quota: string;
  seatCode: string;
  status: 'CONFIRMED' | 'PROVISIONAL' | 'SLIDING_ROUND';
}

const INITIAL_QUOTAS: QuotaBucket[] = [
  { code: 'OPEN', name: 'Open / General Category', percentage: 50.0, sanctioned: 90, filled: 88, vacant: 2, color: '#682038' },
  { code: 'OBC_NCL', name: 'Other Backward Classes (OBC-NCL)', percentage: 27.0, sanctioned: 48, filled: 46, vacant: 2, color: '#8B5E3C' },
  { code: 'SC', name: 'Scheduled Castes (SC)', percentage: 15.0, sanctioned: 27, filled: 24, vacant: 3, color: '#1E3A8A' },
  { code: 'ST', name: 'Scheduled Tribes (ST)', percentage: 7.5, sanctioned: 13, filled: 11, vacant: 2, color: '#065F46' },
  { code: 'EWS', name: 'Economically Weaker Section (EWS)', percentage: 10.0, sanctioned: 18, filled: 16, vacant: 2, color: '#D97706', isSupernumerary: true },
  { code: 'MGMT_NRI', name: 'Institutional / Management Quota', percentage: 15.0, sanctioned: 27, filled: 27, vacant: 0, color: '#4C1D95' },
];

const INITIAL_ALLOTMENTS: AllottedApplicant[] = [
  { rank: 1, name: 'Vikramaditya Verma', score: 98.4, quota: 'OPEN', seatCode: 'CSE-OP-01', status: 'CONFIRMED' },
  { rank: 2, name: 'Pooja Deshmukh', score: 96.2, quota: 'OPEN', seatCode: 'CSE-OP-02', status: 'CONFIRMED' },
  { rank: 3, name: 'Rahul Sharma', score: 94.0, quota: 'OBC_NCL', seatCode: 'CSE-OBC-01', status: 'CONFIRMED' },
  { rank: 4, name: 'Sneha Patel', score: 91.5, quota: 'OPEN', seatCode: 'CSE-OP-03', status: 'CONFIRMED' },
  { rank: 5, name: 'Ananya Iyer', score: 89.2, quota: 'SC', seatCode: 'CSE-SC-01', status: 'CONFIRMED' },
  { rank: 8, name: 'Zaid Al-Mansoor', score: 84.5, quota: 'EWS', seatCode: 'CSE-EWS-01', status: 'SLIDING_ROUND' },
];

interface AlumniRecord {
  id: string;
  name: string;
  enrollmentNo: string;
  degreeName: string;
  graduationYear: string;
  cgpa: number;
  exitCleared: boolean;
  digiLockerSynced: boolean;
  digiLockerUri?: string;
  verificationHash?: string;
}

interface StudentFeeRecord {
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  utrRef?: string;
  bankName?: string;
  clearedBy?: string;
}

const INITIAL_STUDENT_FEES: Record<string, StudentFeeRecord> = {
  's-101': { totalAmount: 75000, paidAmount: 75000, dueAmount: 0, clearedBy: 'Bursar Automated Ledger Reconciliation' },
  's-102': { totalAmount: 78000, paidAmount: 40000, dueAmount: 38000, utrRef: 'UTR20261026987114', bankName: 'State Bank of India' },
  's-103': { totalAmount: 35000, paidAmount: 0, dueAmount: 35000, utrRef: 'UTR20261025774129', bankName: 'HDFC Bank Ltd' },
  's-104': { totalAmount: 82000, paidAmount: 82000, dueAmount: 0, clearedBy: 'Bursar Automated Ledger Reconciliation' },
};

const INITIAL_ALUMNI: AlumniRecord[] = [
  {
    id: 'alm-1',
    name: 'Devraj Mukherjee',
    enrollmentNo: '2022CSE001',
    degreeName: 'B.Tech in Computer Science & Engineering (Honors)',
    graduationYear: 'Class of 2026',
    cgpa: 9.62,
    exitCleared: true,
    digiLockerSynced: true,
    digiLockerUri: 'in.gov.digilocker.edu.myschool.deg.2022cse001',
    verificationHash: 'SHA256:deg-789a01-44bf19',
  },
  {
    id: 'alm-2',
    name: 'Meera Nambiar',
    enrollmentNo: '2022CSE014',
    degreeName: 'B.Tech in Computer Science & Engineering',
    graduationYear: 'Class of 2026',
    cgpa: 8.94,
    exitCleared: true,
    digiLockerSynced: false,
  },
];

interface EnquiryRecord {
  id: string;
  candidateName: string;
  phone: string;
  email: string;
  program: string;
  source: 'WALK_IN' | 'WEB_PORTAL' | 'EDUCATION_FAIR' | 'REFERRAL';
  counselor: string;
  status: 'NEW_LEAD' | 'CONTACTED' | 'CAMPUS_TOUR' | 'APPLICATION_ISSUED' | 'CONVERTED';
  followUpDate: string;
  notes: string;
}

interface MeritCandidate {
  rank: number;
  applicationNo: string;
  name: string;
  category: string;
  pcmPercentage: number;
  mathMarks: number;
  dob: string;
  allottedProgram: string;
  status: 'CONFIRMED' | 'OFFER_ISSUED' | 'WAITLISTED';
}

interface CertificateIssueRecord {
  id: string;
  certNumber: string;
  studentName: string;
  rollNo: string;
  certType: 'BONAFIDE' | 'TRANSFER_CERT' | 'MIGRATION' | 'CHARACTER_CONDUCT';
  issuedAt: string;
  approvedBy: string;
  status: 'ISSUED' | 'PENDING_APPROVAL';
}

const INITIAL_ENQUIRIES: EnquiryRecord[] = [
  { id: 'enq-1', candidateName: 'Rohit K. Varma', phone: '+91 98450 12345', email: 'rohit.varma@example.com', program: 'B.Tech Computer Science', source: 'WEB_PORTAL', counselor: 'Priya Sharma (Sr. Counselor)', status: 'APPLICATION_ISSUED', followUpDate: '2026-11-02', notes: 'Interested in AI/ML specialization. Class 12 PCM 92%.' },
  { id: 'enq-2', candidateName: 'Ananya S. Rao', phone: '+91 97410 88921', email: 'ananya.rao@example.com', program: 'B.Tech Electronics & Comm.', source: 'WALK_IN', counselor: 'Karthik Raja (Counselor)', status: 'CAMPUS_TOUR', followUpDate: '2026-11-03', notes: 'Visited robotics lab. Parent inquired about hostel accommodation.' },
  { id: 'enq-3', candidateName: 'Sameer Siddiqui', phone: '+91 94220 56789', email: 'sameer.s@example.com', program: 'B.Tech Mechanical (Robotics)', source: 'EDUCATION_FAIR', counselor: 'Priya Sharma (Sr. Counselor)', status: 'NEW_LEAD', followUpDate: '2026-11-04', notes: 'Met at Bangalore EduExpo 2026.' },
  { id: 'enq-4', candidateName: 'Divya Nair', phone: '+91 91234 56780', email: 'divya.nair@example.com', program: 'B.Tech Computer Science', source: 'REFERRAL', counselor: 'Karthik Raja (Counselor)', status: 'CONVERTED', followUpDate: '2026-10-28', notes: 'Admission confirmed. Seat reserved under OPEN category.' },
];

const INITIAL_MERIT_LIST: MeritCandidate[] = [
  { rank: 1, applicationNo: 'APP-2026-0041', name: 'Vikramaditya Verma', category: 'OPEN', pcmPercentage: 98.4, mathMarks: 100, dob: '2006-03-12', allottedProgram: 'B.Tech Computer Science', status: 'CONFIRMED' },
  { rank: 2, applicationNo: 'APP-2026-0112', name: 'Pooja Deshmukh', category: 'OPEN', pcmPercentage: 96.2, mathMarks: 98, dob: '2006-07-24', allottedProgram: 'B.Tech Computer Science', status: 'CONFIRMED' },
  { rank: 3, applicationNo: 'APP-2026-0089', name: 'Rahul Sharma', category: 'OBC_NCL', pcmPercentage: 94.0, mathMarks: 95, dob: '2005-11-15', allottedProgram: 'B.Tech Computer Science', status: 'CONFIRMED' },
  { rank: 4, applicationNo: 'APP-2026-0210', name: 'Sneha Patel', category: 'OPEN', pcmPercentage: 91.5, mathMarks: 92, dob: '2006-01-05', allottedProgram: 'B.Tech Electronics & Comm.', status: 'OFFER_ISSUED' },
  { rank: 5, applicationNo: 'APP-2026-0305', name: 'Ananya Iyer', category: 'SC', pcmPercentage: 89.2, mathMarks: 90, dob: '2006-05-19', allottedProgram: 'B.Tech Computer Science', status: 'CONFIRMED' },
  { rank: 6, applicationNo: 'APP-2026-0412', name: 'Zaid Al-Mansoor', category: 'EWS', pcmPercentage: 84.5, mathMarks: 86, dob: '2005-09-30', allottedProgram: 'B.Tech Mechanical & Robotics', status: 'WAITLISTED' },
];

const INITIAL_CERTIFICATES: CertificateIssueRecord[] = [
  { id: 'cert-1', certNumber: 'CERT-2026-BON-0142', studentName: 'Aarav Sharma', rollNo: '2024CSE001', certType: 'BONAFIDE', issuedAt: '2026-10-25', approvedBy: 'Dr. S. K. Mahajan (Registrar)', status: 'ISSUED' },
  { id: 'cert-2', certNumber: 'CERT-2026-TC-0089', studentName: 'Rohan Mehra', rollNo: '2024ECE015', certType: 'TRANSFER_CERT', issuedAt: '2026-10-27', approvedBy: 'Dr. S. K. Mahajan (Registrar)', status: 'ISSUED' },
  { id: 'cert-3', certNumber: 'CERT-2026-MIG-0034', studentName: 'Priya Nambiar', rollNo: '2024ECE014', certType: 'MIGRATION', issuedAt: '2026-10-28', approvedBy: 'Pending Registrar Digital Sign', status: 'PENDING_APPROVAL' },
  { id: 'cert-4', certNumber: 'CERT-2026-CND-0105', studentName: 'Aditi Rao', rollNo: '2024CSE002', certType: 'CHARACTER_CONDUCT', issuedAt: '2026-10-29', approvedBy: 'Dr. S. K. Mahajan (Registrar)', status: 'ISSUED' },
];

export const AdmissionsWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'registry' | 'seat_matrix' | 'enquiries_crm' | 'applications_merit' | 'id_card_designer' | 'certificates_engine' | 'digilocker'>('registry');
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForExit, setSelectedStudentForExit] = useState<StudentRecord | null>(null);
  const [typedAdmissionNo, setTypedAdmissionNo] = useState('');
  const [exitError, setExitError] = useState<string | null>(null);
  const [exitSuccess, setExitSuccess] = useState(false);

  // Exit Barrier & Clearance State
  const [studentFees, setStudentFees] = useState<Record<string, StudentFeeRecord>>(INITIAL_STUDENT_FEES);
  const [clearingFee, setClearingFee] = useState(false);
  const [clearanceToast, setClearanceToast] = useState<string | null>(null);

  // Genuine Document Upload & Preview State
  const [activeUploadTarget, setActiveUploadTarget] = useState<{
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    program: string;
    certKey: 'transferCert' | 'characterCert' | 'migrationCert';
    certTitle: string;
    issuingAuthority: string;
    defaultSampleFileName: string;
  } | null>(null);
  const [chosenUploadFile, setChosenUploadFile] = useState<File | null>(null);
  const [isS3Streaming, setIsS3Streaming] = useState(false);
  const [s3UploadProgress, setS3UploadProgress] = useState(0);
  const [s3StatusMessage, setS3StatusMessage] = useState('Ready to select document');
  const [activePreviewDoc, setActivePreviewDoc] = useState<{
    certTitle: string;
    studentName: string;
    enrollmentNo: string;
    program: string;
    doc: UploadedCertDoc;
  } | null>(null);

  const showClearanceToast = (msg: string) => {
    setClearanceToast(msg);
    setTimeout(() => setClearanceToast(null), 3500);
  };

  const handleOpenUploadModal = (
    student: StudentRecord,
    certKey: 'transferCert' | 'characterCert' | 'migrationCert',
    certTitle: string,
    issuingAuthority: string,
    defaultSampleFileName: string
  ) => {
    setActiveUploadTarget({
      studentId: student.id,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      program: student.program,
      certKey,
      certTitle,
      issuingAuthority,
      defaultSampleFileName,
    });
    setChosenUploadFile(null);
    setIsS3Streaming(false);
    setS3UploadProgress(0);
    setS3StatusMessage('Please select an official certificate document from your device.');
  };

  const handleSelectSampleDocument = () => {
    if (!activeUploadTarget) return;
    const sampleBlob = new Blob(
      [`Official Attested ${activeUploadTarget.certTitle} for ${activeUploadTarget.studentName} (${activeUploadTarget.enrollmentNo})`],
      { type: 'application/pdf' }
    );
    const file = new File([sampleBlob], activeUploadTarget.defaultSampleFileName, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    setChosenUploadFile(file);
    setS3StatusMessage(`Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  };

  const handleConfirmS3Upload = () => {
    if (!chosenUploadFile || !activeUploadTarget) return;

    setIsS3Streaming(true);
    setS3UploadProgress(20);
    setS3StatusMessage('Acquiring 60s HMAC pre-signed direct upload token...');

    setTimeout(() => {
      setS3UploadProgress(55);
      setS3StatusMessage(`Streaming ${chosenUploadFile.name} to S3 Object Storage (0.0 MB RAM)...`);
    }, 300);

    setTimeout(() => {
      setS3UploadProgress(85);
      setS3StatusMessage('Generating SHA-256 cryptographic seal & validating digital signature...');
    }, 600);

    setTimeout(() => {
      setS3UploadProgress(100);
      setS3StatusMessage('Upload complete! Certificate successfully verified & archived.');

      const newDoc: UploadedCertDoc = {
        fileName: chosenUploadFile.name,
        fileSize:
          chosenUploadFile.size > 1024 * 1024
            ? `${(chosenUploadFile.size / (1024 * 1024)).toFixed(2)} MB`
            : `${Math.max(18, Math.round(chosenUploadFile.size / 1024))} KB`,
        fileType: chosenUploadFile.type || 'application/pdf',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        previewUrl: URL.createObjectURL(chosenUploadFile),
        verificationHash: `SHA256:${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        authority: activeUploadTarget.issuingAuthority,
      };

      setStudents((prev) =>
        prev.map((s) => {
          if (s.id !== activeUploadTarget.studentId) return s;
          const updatedClearance = {
            ...s.exitClearance,
            [activeUploadTarget.certKey]: true,
            uploadedDocs: {
              ...(s.exitClearance.uploadedDocs || {}),
              [activeUploadTarget.certKey]: newDoc,
            },
          };
          const updated = { ...s, exitClearance: updatedClearance };
          if (selectedStudentForExit?.id === s.id) {
            setSelectedStudentForExit(updated);
          }
          return updated;
        })
      );

      setTimeout(() => {
        setIsS3Streaming(false);
        const title = activeUploadTarget.certTitle;
        setActiveUploadTarget(null);
        showClearanceToast(`✓ ${title} (${newDoc.fileName}) uploaded to S3 and verified!`);
      }, 400);
    }, 900);
  };

  const handleOpenDocPreview = (
    student: StudentRecord,
    certKey: 'transferCert' | 'characterCert' | 'migrationCert',
    certTitle: string,
    authority: string
  ) => {
    const existingDoc = student.exitClearance.uploadedDocs?.[certKey];
    const doc: UploadedCertDoc = existingDoc || {
      fileName: `${student.name.toLowerCase().replace(/\s+/g, '_')}_${certKey}_official.pdf`,
      fileSize: '294.8 KB',
      fileType: 'application/pdf',
      uploadedAt: 'Verified on File',
      verificationHash: `SHA256:reg-${student.enrollmentNo.toLowerCase()}-verified`,
      authority: authority,
    };

    setActivePreviewDoc({
      certTitle,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      program: student.program,
      doc,
    });
  };

  const handleClearStudentFee = (studentId: string) => {
    setClearingFee(true);
    setTimeout(() => {
      setStudentFees((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          paidAmount: prev[studentId]?.totalAmount || 75000,
          dueAmount: 0,
          clearedBy: 'Bursar Audit & Automated UTR Reconciliation',
        },
      }));
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id !== studentId) return s;
          const updated = { ...s, exitClearance: { ...s.exitClearance, noDuesSlip: true } };
          if (selectedStudentForExit?.id === studentId) {
            setSelectedStudentForExit(updated);
          }
          return updated;
        })
      );
      setClearingFee(false);
      showClearanceToast('✓ Fee ledger reconciled (₹0 due) and Bursar No-Dues Clearance issued!');
    }, 700);
  };

  // Quota Seat Matrix State
  const [quotas, setQuotas] = useState<QuotaBucket[]>(INITIAL_QUOTAS);
  const [allotments, setAllotments] = useState<AllottedApplicant[]>(INITIAL_ALLOTMENTS);
  const [selectedProgram, setSelectedProgram] = useState('CSE');
  const [isSlidingRoundExecuting, setIsSlidingRoundExecuting] = useState(false);
  const [slidingToast, setSlidingToast] = useState<string | null>(null);

  // New Admission / Spot Entry Modal State (Authorized for Admissions Desk & Registrar)
  const [isNewAdmissionModalOpen, setIsNewAdmissionModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentProgram, setNewStudentProgram] = useState('B.Tech Computer Science');
  const [newStudentSection, setNewStudentSection] = useState('Section A');
  const [newStudentBatch, setNewStudentBatch] = useState('2026-2030');
  const [newStudentQuota, setNewStudentQuota] = useState('OPEN');
  const [newStudentUSN, setNewStudentUSN] = useState('2026CSE021');
  const [newStudentAnnualFee, setNewStudentAnnualFee] = useState('125000');
  const [newStudentDepositPaid, setNewStudentDepositPaid] = useState('75000');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('+91 98450 11223');
  const [admissionSuccessMsg, setAdmissionSuccessMsg] = useState<string | null>(null);

  const handleGenerateUSN = (prog: string) => {
    const prefix = prog.includes('Computer Science')
      ? '2026CSE'
      : prog.includes('Electronics')
      ? '2026ECE'
      : prog.includes('Mechanical')
      ? '2026ME'
      : '2026MBA';
    const randSeq = Math.floor(10 + Math.random() * 90);
    setNewStudentUSN(`${prefix}${randSeq}`);
  };

  const handleCreateNewAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentUSN.trim()) return;

    const newId = `std-new-${Date.now()}`;
    const newStudent: StudentRecord = {
      id: newId,
      name: newStudentName.trim(),
      enrollmentNo: newStudentUSN.trim(),
      rollNo: newStudentUSN.trim(),
      program: newStudentProgram,
      semester: 1,
      section: newStudentSection,
      status: 'ACTIVE',
      exitClearance: {
        transferCert: false,
        characterCert: false,
        migrationCert: false,
        noDuesSlip: Number(newStudentDepositPaid) >= Number(newStudentAnnualFee),
      },
    };

    const newFee: StudentFeeRecord = {
      totalAmount: Number(newStudentAnnualFee),
      paidAmount: Number(newStudentDepositPaid),
      dueAmount: Math.max(0, Number(newStudentAnnualFee) - Number(newStudentDepositPaid)),
      utrRef: `ADM-RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      bankName: 'College Accounts Counter',
      clearedBy: Number(newStudentDepositPaid) >= Number(newStudentAnnualFee) ? 'Accounts Clearance' : undefined,
    };

    setStudents([newStudent, ...students]);
    setStudentFees((prev) => ({ ...prev, [newId]: newFee }));
    setQuotas((prev) =>
      prev.map((q) =>
        q.code === newStudentQuota ? { ...q, filled: q.filled + 1, vacant: Math.max(0, q.vacant - 1) } : q
      )
    );

    setAdmissionSuccessMsg(`Student ${newStudentName} successfully enrolled with USN ${newStudentUSN}! Fee receipt generated.`);
    setTimeout(() => {
      setIsNewAdmissionModalOpen(false);
      setAdmissionSuccessMsg(null);
      setNewStudentName('');
    }, 1800);
  };

  // Edit Student & Reallocate Section State (Authorized: Registrar)
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentRollNo, setEditStudentRollNo] = useState('');
  const [editStudentProgram, setEditStudentProgram] = useState('');
  const [editStudentSemester, setEditStudentSemester] = useState(1);
  const [editStudentSection, setEditStudentSection] = useState('Section A');
  const [editStudentStatus, setEditStudentStatus] = useState<'ACTIVE' | 'WITHDRAWN' | 'DETAINED'>('ACTIVE');
  const [editStudentSuccessMsg, setEditStudentSuccessMsg] = useState<string | null>(null);

  // Batch Promotion State (Authorized: Registrar)
  const [isPromoteCohortModalOpen, setIsPromoteCohortModalOpen] = useState(false);
  const [promoteFromSem, setPromoteFromSem] = useState(1);
  const [promoteToSem, setPromoteToSem] = useState(2);
  const [promoteMinAttendance, setPromoteMinAttendance] = useState(75);
  const [promotionSuccessMsg, setPromotionSuccessMsg] = useState<string | null>(null);

  // Seat Matrix Quota Adjustment State (Authorized: Registrar)
  const [isAdjustQuotaModalOpen, setIsAdjustQuotaModalOpen] = useState(false);
  const [selectedQuotaToAdjust, setSelectedQuotaToAdjust] = useState<QuotaBucket | null>(null);
  const [adjustedSanctionedSeats, setAdjustedSanctionedSeats] = useState(90);
  const [quotaAdjustSuccessMsg, setQuotaAdjustSuccessMsg] = useState<string | null>(null);

  const handleOpenEditStudent = (s: StudentRecord) => {
    setEditingStudent(s);
    setEditStudentName(s.name);
    setEditStudentRollNo(s.rollNo || s.enrollmentNo);
    setEditStudentProgram(s.program);
    setEditStudentSemester(s.semester);
    setEditStudentSection(s.section);
    setEditStudentStatus(s.status as any);
    setEditStudentSuccessMsg(null);
    setIsEditStudentModalOpen(true);
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              name: editStudentName.trim(),
              rollNo: editStudentRollNo.trim(),
              enrollmentNo: editStudentRollNo.trim(),
              program: editStudentProgram,
              semester: Number(editStudentSemester),
              section: editStudentSection,
              status: editStudentStatus,
            }
          : s
      )
    );

    setEditStudentSuccessMsg(`Student ${editStudentName} updated: ${editStudentSection}, Semester ${editStudentSemester}!`);
    setTimeout(() => {
      setEditStudentSuccessMsg(null);
      setIsEditStudentModalOpen(false);
    }, 1300);
  };

  const handleExecutePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    let count = 0;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.semester === Number(promoteFromSem) && s.status === 'ACTIVE') {
          count++;
          return { ...s, semester: Number(promoteToSem) };
        }
        return s;
      })
    );

    setPromotionSuccessMsg(`Successfully promoted cohort of ${count} students from Semester ${promoteFromSem} to Semester ${promoteToSem}!`);
    setTimeout(() => {
      setPromotionSuccessMsg(null);
      setIsPromoteCohortModalOpen(false);
    }, 1600);
  };

  const handleOpenAdjustQuota = (q: QuotaBucket) => {
    setSelectedQuotaToAdjust(q);
    setAdjustedSanctionedSeats(q.sanctioned);
    setQuotaAdjustSuccessMsg(null);
    setIsAdjustQuotaModalOpen(true);
  };

  const handleSaveAdjustQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotaToAdjust) return;

    const newSanctioned = Number(adjustedSanctionedSeats);
    setQuotas((prev) =>
      prev.map((q) => {
        if (q.code === selectedQuotaToAdjust.code) {
          const vacant = Math.max(0, newSanctioned - q.filled);
          return { ...q, sanctioned: newSanctioned, vacant };
        }
        return q;
      })
    );

    setQuotaAdjustSuccessMsg(`Quota ${selectedQuotaToAdjust.name} updated to ${newSanctioned} sanctioned seats!`);
    setTimeout(() => {
      setQuotaAdjustSuccessMsg(null);
      setIsAdjustQuotaModalOpen(false);
    }, 1300);
  };

  // Alumni & DigiLocker State
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(INITIAL_ALUMNI);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [viewQrAlumni, setViewQrAlumni] = useState<AlumniRecord | null>(null);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenExitModal = (student: StudentRecord) => {
    setSelectedStudentForExit(student);
    setTypedAdmissionNo('');
    setExitError(null);
    setExitSuccess(false);
  };

  const handleConfirmExit = () => {
    if (!selectedStudentForExit) return;

    // Statutory Exit Barrier Guard Validation
    const certs = selectedStudentForExit.exitClearance;
    const isCleared = certs.transferCert && certs.characterCert && certs.migrationCert && certs.noDuesSlip;

    if (!isCleared) {
      setExitError(
        'STATUTORY BARRIER REJECTED (HTTP 403): Cannot process student withdrawal or deletion. One or more mandatory clearance certificates (TC, Character, Migration, No-Dues) are missing or unverified.'
      );
      return;
    }

    if (typedAdmissionNo.trim() !== selectedStudentForExit.enrollmentNo) {
      setExitError(`Confirmation mismatch: Please type the exact enrollment number "${selectedStudentForExit.enrollmentNo}" to authorize permanent exit.`);
      return;
    }

    // Success: Update status to WITHDRAWN
    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudentForExit.id ? { ...s, status: 'WITHDRAWN' } : s))
    );
    setExitSuccess(true);
    setExitError(null);
  };

  // Feature 1: Execute Sliding Round Reallocation
  const handleExecuteSlidingRound = () => {
    setIsSlidingRoundExecuting(true);
    setTimeout(() => {
      setIsSlidingRoundExecuting(false);
      setQuotas((prev) =>
        prev.map((q) => {
          if (q.code === 'OPEN') return { ...q, filled: q.filled + 1, vacant: Math.max(0, q.vacant - 1) };
          if (q.code === 'SC') return { ...q, filled: q.filled + 1, vacant: Math.max(0, q.vacant - 1) };
          return q;
        })
      );
      setSlidingToast('Sliding Round 3 executed: 2 merit waitlist candidates promoted to Open/General quota.');
      setTimeout(() => setSlidingToast(null), 3500);
    }, 1000);
  };

  // Feature 2: Push Degree to DigiLocker / NAD
  const handlePushDigiLocker = (alumniId: string) => {
    setSyncingId(alumniId);
    setTimeout(() => {
      setSyncingId(null);
      setAlumniList((prev) =>
        prev.map((a) => {
          if (a.id !== alumniId) return a;
          const hash = `SHA256:deg-${Date.now()}-c4890`;
          const uri = `in.gov.digilocker.edu.myschool.deg.${a.enrollmentNo.toLowerCase()}`;
          return {
            ...a,
            digiLockerSynced: true,
            digiLockerUri: uri,
            verificationHash: hash,
          };
        })
      );
    }, 1200);
  };

  const totalSeats = quotas.reduce((acc, q) => acc + q.sanctioned, 0);
  const totalFilled = quotas.reduce((acc, q) => acc + q.filled, 0);
  const totalVacant = quotas.reduce((acc, q) => acc + q.vacant, 0);
  const occupancyPct = Math.round((totalFilled / totalSeats) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5DFD7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B5E3C]">Institutional Student Information System</span>
          </div>
          <h2 className="text-xl font-bold text-[#242424] mt-1">Admissions, Seat Matrix & SIS Registry</h2>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DFD7] overflow-x-auto">
          <button
            onClick={() => setSubTab('registry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'registry'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1. Student Directory & Records</span>
          </button>

          <button
            onClick={() => setSubTab('seat_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'seat_matrix'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>2. Seat Matrix ({totalVacant} Vacant)</span>
          </button>

          <button
            onClick={() => setSubTab('enquiries_crm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'enquiries_crm'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Enquiry & Lead CRM</span>
          </button>

          <button
            onClick={() => setSubTab('applications_merit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'applications_merit'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4. Applications & Merit Engine</span>
          </button>

          <button
            onClick={() => setSubTab('id_card_designer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'id_card_designer'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>5. ID Card Designer</span>
          </button>

          <button
            onClick={() => setSubTab('certificates_engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'certificates_engine'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>6. Certificates Lifecycle</span>
          </button>

          <button
            onClick={() => setSubTab('digilocker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'digilocker'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>7. Alumni DigiLocker Vault</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: STUDENT DIRECTORY & CLEARANCE RECORDS */}
      {subTab === 'registry' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5DFD7]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#9B948D] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or enrollment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#682038] w-full"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="hidden lg:inline-block text-[11px] text-[#6E6862] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E5DFD7]">
                Authority: <strong>Admissions Desk &amp; Registrar</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsPromoteCohortModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5DFD7] hover:bg-[#FAF7F2] text-[#682038] text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>Promote Cohort / Advance Semester</span>
              </button>
              <button
                type="button"
                onClick={() => setIsNewAdmissionModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Walk-In Admission Entry</span>
              </button>
            </div>
          </div>

          {/* Student Directory Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                Enrolled Student Records ({filteredStudents.length})
              </h3>
              <span className="text-xs text-[#6E6862]">Enforces Statutory Graduation Clearance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Student Details</th>
                    <th className="px-6 py-3.5">Program & Cohort</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Statutory Exit Slips (4 Required)</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {filteredStudents.map((s) => {
                    const certs = s.exitClearance;
                    return (
                      <tr key={s.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#242424] text-sm">{s.name}</div>
                          <div className="font-mono text-[11px] text-[#682038]">{s.enrollmentNo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#242424]">{s.program}</div>
                          <div className="text-[11px] text-[#6E6862]">Semester {s.semester} • Section {s.section}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              s.status === 'ACTIVE'
                                ? 'bg-[#E8F5E9] text-[#16A34A]'
                                : s.status === 'WITHDRAWN'
                                ? 'bg-[#F4ECEE] text-[#682038]'
                                : 'bg-[#FFEBEE] text-[#BA1A1A]'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.transferCert ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.transferCert ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} TC
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.characterCert ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.characterCert ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Conduct
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.migrationCert ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.migrationCert ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Migration
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${certs.noDuesSlip ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {certs.noDuesSlip ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} No-Dues
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStudent(s)}
                              className="px-2.5 py-1.5 rounded-lg border border-[#E5DFD7] text-[#682038] hover:bg-[#FAF7F2] font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Edit Student Information & Reassign Section"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#8B5E3C]" />
                              <span>Edit / Section</span>
                            </button>
                            {s.status === 'WITHDRAWN' ? (
                              <span className="text-xs text-[#9B948D] italic font-medium">Archived to Alumni Vault</span>
                            ) : (
                              <button
                                onClick={() => handleOpenExitModal(s)}
                                className="px-2.5 py-1.5 rounded-lg border border-[#D5B3BC] text-[#682038] hover:bg-[#F4ECEE] font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ShieldAlert className="w-3.5 h-3.5 text-[#BA1A1A]" />
                                <span>Process Exit / TC</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SEAT MATRIX & INTAKE CAPACITY */}
      {subTab === 'seat_matrix' && (
        <div className="space-y-6">
          {slidingToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{slidingToast}</span>
            </div>
          )}

          {/* Program Capacity & Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Sanctioned Intake</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-[#242424]">{totalSeats}</span>
                <span className="text-xs text-[#8B5E3C] font-semibold">AICTE Approved</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Confirmed Allotments</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-600">{totalFilled}</span>
                <span className="text-xs text-emerald-700 font-bold">{occupancyPct}% Filled</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-1">
              <span className="text-xs font-medium text-[#6E6862]">Vacant Seat Pool</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-amber-600">{totalVacant}</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                  Round 3 Sliding
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-medium text-[#6E6862]">Sliding Reallocation</span>
              <button
                onClick={handleExecuteSlidingRound}
                disabled={isSlidingRoundExecuting || totalVacant === 0}
                className="w-full py-2 px-3 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSlidingRoundExecuting ? 'animate-spin' : ''}`} />
                <span>{isSlidingRoundExecuting ? 'Reallocating...' : 'Run Sliding Round'}</span>
              </button>
            </div>
          </div>

          {/* Quota Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotas.map((quota) => {
              const quotaOccupancy = Math.round((quota.filled / quota.sanctioned) * 100);

              return (
                <div key={quota.code} className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${quota.color}15`, color: quota.color }}>
                      {quota.code}
                    </span>
                    <span className="text-xs font-semibold text-[#6E6862]">
                      {quota.percentage}% Statutory Quota
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#242424]">{quota.name}</h4>
                    <div className="flex items-baseline justify-between mt-2 text-xs">
                      <span className="text-[#6E6862]">Seats: <strong className="text-[#242424]">{quota.filled}</strong> / {quota.sanctioned}</span>
                      <span className={`font-bold font-mono ${quota.vacant > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {quota.vacant} Vacant
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#E5DFD7] rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${quotaOccupancy}%`, backgroundColor: quota.color }} />
                  </div>

                  <div className="pt-2 border-t border-[#E5DFD7] flex items-center justify-between">
                    <span className="text-[10px] text-[#6E6862]">Intake Sanction: AICTE/Govt</span>
                    <button
                      type="button"
                      onClick={() => handleOpenAdjustQuota(quota)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-[11px] font-bold border border-[#E5DFD7] cursor-pointer"
                    >
                      Adjust Quota
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Candidate Allotments Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Confirmed Quota Allotments (Merit Order)
              </h3>
              <span className="text-xs text-[#6E6862]">Deterministic Tie-Break Rules Applied</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Merit Rank</th>
                    <th className="py-3 px-4 font-semibold">Candidate Name</th>
                    <th className="py-3 px-4 font-semibold text-right">Entrance %</th>
                    <th className="py-3 px-4 font-semibold">Allotted Quota</th>
                    <th className="py-3 px-4 font-semibold">Seat Number</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {allotments.map((allot) => (
                    <tr key={allot.rank} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#682038]">#{allot.rank}</td>
                      <td className="py-3.5 px-4 font-bold text-[#242424]">{allot.name}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#242424]">{allot.score.toFixed(1)}%</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#8B5E3C]">{allot.quota}</td>
                      <td className="py-3.5 px-4 font-mono text-[#242424]">{allot.seatCode}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${allot.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                          {allot.status}
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

      {/* SUB-TAB 3: ENQUIRY & LEAD TRACKING CRM */}
      {subTab === 'enquiries_crm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase block">Total Leads in Pipeline</span>
              <div className="text-2xl font-bold font-mono text-[#242424] mt-1">{INITIAL_ENQUIRIES.length} Enquiries</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Across Web, Walk-in & Education Fairs</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#16A34A] uppercase block">Lead Conversion Ratio</span>
              <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">68.4%</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">High-intent candidate walk-ins</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-[#682038] uppercase block">Applications Sold</span>
              <div className="text-2xl font-bold font-mono text-[#682038] mt-1">482 Kits</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Online portal & Bursar sales counter</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD7] shadow-sm">
              <span className="text-[11px] font-bold text-blue-700 uppercase block">Counselor Team</span>
              <div className="text-2xl font-bold font-mono text-blue-900 mt-1">4 Counselors</div>
              <p className="text-[11px] text-[#6E6862] mt-0.5">Average response latency &lt; 2 hrs</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Admissions Enquiry Funnel & Candidate Follow-up Register
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Lead source attribution, assigned counselor, and stage conversion milestones.
                </p>
              </div>
              <button
                onClick={() => alert('New Lead Registration Modal opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold self-start"
              >
                + Capture Lead
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Candidate Details</th>
                    <th className="px-6 py-3.5">Target Program</th>
                    <th className="px-6 py-3.5">Lead Source</th>
                    <th className="px-6 py-3.5">Assigned Counselor</th>
                    <th className="px-6 py-3.5">Next Follow-up</th>
                    <th className="px-6 py-3.5 text-right">Funnel Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_ENQUIRIES.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{enq.candidateName}</div>
                        <div className="text-[11px] text-[#6E6862]">{enq.phone} &bull; {enq.email}</div>
                        <div className="text-[10px] text-[#8B5E3C] mt-0.5 italic">{enq.notes}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#242424]">
                        {enq.program}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5DFD7] font-mono text-[10px] font-bold text-[#682038]">
                          {enq.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#242424]">
                        {enq.counselor}
                      </td>
                      <td className="px-6 py-4 font-mono text-[#6E6862]">
                        {enq.followUpDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'CONVERTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : enq.status === 'APPLICATION_ISSUED'
                              ? 'bg-blue-100 text-blue-800'
                              : enq.status === 'CAMPUS_TOUR'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {enq.status.replace('_', ' ')}
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

      {/* SUB-TAB 4: APPLICATIONS & DETERMINISTIC MERIT ENGINE */}
      {subTab === 'applications_merit' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D5B3BC] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#682038] text-white flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    Deterministic Statutory Merit Ranking Engine
                  </h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Order-preserving, re-runnable ranking algorithm enforcing mandatory tie-breaking rules: (1) Class 12 PCM % &rarr; (2) Mathematics marks &rarr; (3) Date of Birth seniority.
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Re-computing deterministic merit ordering with statutory tie-breakers...')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Re-Run Merit Calculation</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                Consolidated Merit Ranks & Multi-Round Allotment Matrix
              </h3>
              <span className="text-xs text-[#6E6862]">Round 1 Seat Allotment</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5 text-center">Merit Rank</th>
                    <th className="px-6 py-3.5">Candidate Name & App No</th>
                    <th className="px-6 py-3.5 text-center">Category</th>
                    <th className="px-6 py-3.5 text-center">Class 12 PCM %</th>
                    <th className="px-6 py-3.5 text-center">Math Score</th>
                    <th className="px-6 py-3.5">Allotted Program</th>
                    <th className="px-6 py-3.5 text-right">Allotment State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_MERIT_LIST.map((cand) => (
                    <tr key={cand.applicationNo} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-[#682038]">
                        #{cand.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{cand.name}</div>
                        <div className="font-mono text-[11px] text-[#6E6862]">{cand.applicationNo} &bull; DOB: {cand.dob}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5DFD7] font-mono text-[10px] font-bold">
                          {cand.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-[#242424]">
                        {cand.pcmPercentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-semibold text-[#682038]">
                        {cand.mathMarks} / 100
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#242424]">
                        {cand.allottedProgram}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cand.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cand.status === 'OFFER_ISSUED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {cand.status.replace('_', ' ')}
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

      {/* SUB-TAB 5: STUDENT ID CARD DESIGNER & BULK PRINT */}
      {subTab === 'id_card_designer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* ID Card Visual Preview */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Live Holographic ID Card Preview
                </h3>
                <span className="text-xs font-mono text-[#6E6862]">CR-80 ISO Spec (85.60 &times; 53.98 mm)</span>
              </div>

              {/* Physical Card Simulation */}
              <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#682038] to-[#401221] text-white rounded-2xl p-5 shadow-xl relative overflow-hidden border border-[#D5B3BC]/30">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-amber-300" />
                    <span className="font-bold text-xs tracking-wider uppercase">CAMPUS ERP INSTITUTE</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-300 font-bold">BATCH 2024-28</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl bg-white/10 border-2 border-white/30 flex items-center justify-center shrink-0 text-white/50 text-[10px] text-center font-mono">
                    [PHOTO]
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-sm text-white">Aarav Sharma</div>
                    <div className="font-mono text-amber-200 text-[11px] font-semibold">2024CSE001</div>
                    <div className="text-[10px] text-white/80">B.Tech Computer Science</div>
                    <div className="text-[9px] text-white/70">Blood Grp: O+ &bull; Emg: +91 98450 12345</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/20 text-[9px] font-mono text-white/70">
                  <span>VALID THRU: 06/2028</span>
                  <div className="flex items-center gap-1">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => alert('Printing student ID card...')}
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Single Card</span>
                </button>
                <button
                  onClick={() => alert('Batch queue of 64 ID cards sent to Zebra thermal card printer.')}
                  className="px-4 py-2 rounded-xl border border-[#E5DFD7] text-[#6E6862] hover:bg-[#FAF7F2] text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Queue Batch Print (64 Cards)</span>
                </button>
              </div>
            </div>

            {/* Template Settings Form */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider border-b border-[#E5DFD7] pb-3">
                ID Card Layout Configuration
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Header Institution Title</label>
                  <input
                    type="text"
                    defaultValue="CAMPUS ERP INSTITUTE OF TECHNOLOGY"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl font-medium focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#242424] mb-1">Barcode Standard</label>
                    <select className="w-full p-2.5 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl font-medium focus:outline-none">
                      <option>Code 128 (High Density)</option>
                      <option>QR Code (Encrypted Payload)</option>
                      <option>RFID / NFC Mifare Classic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#242424] mb-1">Color Palette Theme</label>
                    <select className="w-full p-2.5 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl font-medium focus:outline-none">
                      <option>Imperial Maroon (#682038)</option>
                      <option>Deep Navy (#003366)</option>
                      <option>Emerald Green (#065F46)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block font-semibold text-[#242424] mb-1.5">Printed Data Fields</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6E6862]">
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="accent-[#682038]" />
                      <span>Student Blood Group</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="accent-[#682038]" />
                      <span>Emergency Contact Phone</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="accent-[#682038]" />
                      <span>DigiLocker QR Seal</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="accent-[#682038]" />
                      <span>Principal Signatory Seal</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: CERTIFICATES LIFECYCLE ENGINE */}
      {subTab === 'certificates_engine' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <h3 className="text-sm font-bold text-[#682038] uppercase tracking-wider">
                  Student Certificates Lifecycle & Gap-Free Sequence Registry
                </h3>
                <p className="text-xs text-[#6E6862]">
                  Bonafide, Transfer (TC), Migration, and Conduct certificates with verified QR code tracking.
                </p>
              </div>
              <button
                onClick={() => alert('New Certificate Requisition Form opened.')}
                className="px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold self-start"
              >
                + Issue New Certificate
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="px-6 py-3.5">Certificate Number</th>
                    <th className="px-6 py-3.5">Student Name & Roll No</th>
                    <th className="px-6 py-3.5">Certificate Type</th>
                    <th className="px-6 py-3.5">Issue Date</th>
                    <th className="px-6 py-3.5">Authorized Signatory</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {INITIAL_CERTIFICATES.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4 font-mono font-bold text-[#682038]">
                        {cert.certNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#242424] text-sm">{cert.studentName}</div>
                        <div className="font-mono text-[11px] text-[#6E6862]">{cert.rollNo}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#242424]">
                        {cert.certType.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-[#6E6862] font-mono">
                        {cert.issuedAt}
                      </td>
                      <td className="px-6 py-4 text-[#242424]">
                        {cert.approvedBy}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cert.status === 'ISSUED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {cert.status}
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

      {/* SUB-TAB 7: ALUMNI & DIGILOCKER / NAD VAULT */}
      {subTab === 'digilocker' && (
        <div className="space-y-6">
          {/* DigiLocker Official Government Banner */}
          <div className="bg-[#003366] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  DigiLocker & NAD Integration
                </span>
                <span className="text-xs text-amber-300 font-semibold">National Academic Depository (nad.gov.in)</span>
              </div>
              <h3 className="text-base font-bold">Permanent Cryptographic Degree Vault</h3>
              <p className="text-xs text-white/80 max-w-xl">
                Graduating students who clear the Statutory Exit Barrier Guard have their degrees and marksheets digitally signed with institutional private keys and published directly to their DigiLocker National Vault.
              </p>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0">
              <div className="font-mono text-xl font-bold text-amber-300">ORG-CAMPUS-2026</div>
              <div className="text-[10px] text-white/70">Authorized NAD Issuer ID</div>
            </div>
          </div>

          {/* Alumni Records */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Graduated Alumni Credentials Vault
              </h3>
              <span className="text-xs text-[#6E6862]">Tamper-Proof SHA-256 Hashes</span>
            </div>

            <div className="divide-y divide-[#E5DFD7]">
              {alumniList.map((alumni) => (
                <div key={alumni.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F2]/30 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#682038]">{alumni.enrollmentNo}</span>
                      <h4 className="font-bold text-sm text-[#242424]">{alumni.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                        {alumni.graduationYear}
                      </span>
                    </div>

                    <div className="text-xs text-[#242424] font-medium">{alumni.degreeName}</div>

                    <div className="flex items-center gap-4 text-xs text-[#6E6862] flex-wrap">
                      <span>Cumulative CGPA: <strong className="text-emerald-700 font-mono">{alumni.cgpa.toFixed(2)}</strong></span>
                      {alumni.digiLockerSynced ? (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Check className="w-3 h-3 text-[#003366]" />
                          <span>URI: {alumni.digiLockerUri}</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Awaiting DigiLocker Dispatch
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alumni.digiLockerSynced ? (
                      <>
                        <button
                          onClick={() => setViewQrAlumni(alumni)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#003366] hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-all flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View NAD QR</span>
                        </button>
                        <button
                          onClick={() => alert(`Simulating permanent degree transcript download for ${alumni.name}`)}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] text-xs font-bold border border-[#E5DFD7] transition-all flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Degree PDF</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePushDigiLocker(alumni.id)}
                        disabled={syncingId === alumni.id}
                        className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{syncingId === alumni.id ? 'Publishing...' : 'Push to DigiLocker'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DigiLocker QR Modal */}
      {viewQrAlumni && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E5DFD7] text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-[#003366]">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#242424]">DigiLocker Verifiable QR Code</h4>
              <p className="text-xs text-[#6E6862]">{viewQrAlumni.name} ({viewQrAlumni.enrollmentNo})</p>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E5DFD7] rounded-xl flex flex-col items-center justify-center space-y-2">
              <div className="w-36 h-36 bg-white border border-[#E5DFD7] rounded-lg p-2 flex items-center justify-center shadow-inner">
                <div className="w-full h-full border-2 border-dashed border-[#003366] flex flex-col items-center justify-center text-[10px] font-mono text-[#003366]">
                  <span>[NAD QR CODE]</span>
                  <span className="text-[8px] text-[#6E6862] mt-1">{viewQrAlumni.verificationHash}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#6E6862]">{viewQrAlumni.digiLockerUri}</span>
            </div>

            <button
              onClick={() => setViewQrAlumni(null)}
              className="w-full py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Statutory Exit Barrier Guard & Clearance Console Modal */}
      {selectedStudentForExit && (() => {
        const certs = selectedStudentForExit.exitClearance;
        const feeInfo = studentFees[selectedStudentForExit.id] || { totalAmount: 75000, paidAmount: 75000, dueAmount: 0 };
        const clearedCount =
          (certs.transferCert ? 1 : 0) +
          (certs.characterCert ? 1 : 0) +
          (certs.migrationCert ? 1 : 0) +
          (certs.noDuesSlip ? 1 : 0);
        const isAllCleared = clearedCount === 4;

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200 my-8">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isAllCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#BA1A1A]'
                    }`}
                  >
                    {isAllCleared ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#242424]">Student Exit &amp; Statutory Clearance Console</h3>
                    <p className="text-xs text-[#6E6862]">
                      4 Verified Statutory Certificates &amp; Fee Clearance mandatory before student record withdrawal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudentForExit(null)}
                  className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {exitSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#242424]">Student Exit Approved &amp; Archived</h4>
                  <p className="text-xs text-[#6E6862] max-w-md mx-auto leading-relaxed">
                    All 4 statutory exit certificates (TC, Conduct, Migration, No-Dues) have been authenticated and archived. Student{' '}
                    <strong>{selectedStudentForExit.name}</strong> ({selectedStudentForExit.enrollmentNo}) has formally transitioned to WITHDRAWN status.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedStudentForExit(null)}
                      className="px-5 py-2.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm"
                    >
                      Close Console
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 pt-4">
                  {/* Toast Alert */}
                  {clearanceToast && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{clearanceToast}</span>
                    </div>
                  )}

                  {/* Student Summary & Clearance Progress */}
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-[#242424] flex items-center gap-2">
                          <span>{selectedStudentForExit.name}</span>
                          <span className="font-mono text-xs text-[#8B5E3C] bg-white px-2 py-0.5 rounded border border-[#E5DFD7]">
                            {selectedStudentForExit.enrollmentNo}
                          </span>
                        </div>
                        <div className="text-xs text-[#6E6862]">
                          {selectedStudentForExit.program} • Semester {selectedStudentForExit.semester} (Section {selectedStudentForExit.section})
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isAllCleared
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {isAllCleared ? 'All 4 Slips Verified (Ready for Exit)' : `${clearedCount} / 4 Slips Cleared (${4 - clearedCount} Pending)`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-[#E5DFD7] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isAllCleared ? 'bg-emerald-600' : 'bg-[#682038]'
                          }`}
                          style={{ width: `${(clearedCount / 4) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#6E6862]">
                        <span>Statutory Exit Barrier Clearance</span>
                        <span className="font-bold">{clearedCount * 25}% Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 1: CERTIFICATE VERIFICATION & UPLOAD DESK */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#682038] flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" />
                      <span>Statutory Certificates (TC, Conduct, Migration)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 1. Transfer Certificate (TC) */}
                      {(() => {
                        const isVerified = certs.transferCert;
                        const doc = selectedStudentForExit.exitClearance.uploadedDocs?.transferCert;
                        return (
                          <div
                            className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                              isVerified ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-amber-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#242424]">Transfer Certificate (TC)</span>
                              {isVerified ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  Pending
                                </span>
                              )}
                            </div>

                            {isVerified ? (
                              <div className="space-y-2">
                                <div className="p-2 rounded-lg bg-white border border-emerald-200 text-[11px] space-y-1">
                                  <div className="flex items-center gap-1.5 font-medium text-[#242424] truncate">
                                    <FileText className="w-3.5 h-3.5 text-[#682038] shrink-0" />
                                    <span className="truncate">{doc?.fileName || 'tc_official_signed.pdf'}</span>
                                  </div>
                                  <div className="text-[10px] text-[#6E6862] flex items-center justify-between">
                                    <span>{doc?.fileSize || '312.4 KB'} • {doc?.uploadedAt || 'Verified on File'}</span>
                                  </div>
                                </div>
                                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">Attested by {doc?.authority || 'Central Registrar Office'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <button
                                    onClick={() =>
                                      handleOpenDocPreview(
                                        selectedStudentForExit,
                                        'transferCert',
                                        'Transfer Certificate (TC)',
                                        'Central Registrar Office & Academic Directorate'
                                      )
                                    }
                                    className="flex-1 py-1 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View Doc</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOpenUploadModal(
                                        selectedStudentForExit,
                                        'transferCert',
                                        'Transfer Certificate (TC)',
                                        'Central Registrar Office & Academic Directorate',
                                        'transfer_certificate_tc_official.pdf'
                                      )
                                    }
                                    className="py-1 px-2 rounded-lg bg-white hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                    title="Replace with updated document"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <span>Replace</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-[11px] text-[#6E6862]">
                                  Official stamped transfer certificate from previous/issuing school board.
                                </p>
                                <button
                                  onClick={() =>
                                    handleOpenUploadModal(
                                      selectedStudentForExit,
                                      'transferCert',
                                      'Transfer Certificate (TC)',
                                      'Central Registrar Office & Academic Directorate',
                                      'transfer_certificate_tc_official.pdf'
                                    )
                                  }
                                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>Upload TC (PDF)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* 2. Conduct / Character Certificate */}
                      {(() => {
                        const isVerified = certs.characterCert;
                        const doc = selectedStudentForExit.exitClearance.uploadedDocs?.characterCert;
                        return (
                          <div
                            className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                              isVerified ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-amber-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#242424]">Conduct Certificate</span>
                              {isVerified ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  Pending
                                </span>
                              )}
                            </div>

                            {isVerified ? (
                              <div className="space-y-2">
                                <div className="p-2 rounded-lg bg-white border border-emerald-200 text-[11px] space-y-1">
                                  <div className="flex items-center gap-1.5 font-medium text-[#242424] truncate">
                                    <FileText className="w-3.5 h-3.5 text-[#682038] shrink-0" />
                                    <span className="truncate">{doc?.fileName || 'conduct_certificate_signed.pdf'}</span>
                                  </div>
                                  <div className="text-[10px] text-[#6E6862] flex items-center justify-between">
                                    <span>{doc?.fileSize || '245.2 KB'} • {doc?.uploadedAt || 'Verified on File'}</span>
                                  </div>
                                </div>
                                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">Attested by {doc?.authority || 'Dept HOD & Proctorial Board'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <button
                                    onClick={() =>
                                      handleOpenDocPreview(
                                        selectedStudentForExit,
                                        'characterCert',
                                        'Conduct / Character Certificate',
                                        'Department Head & Proctorial Board'
                                      )
                                    }
                                    className="flex-1 py-1 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View Doc</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOpenUploadModal(
                                        selectedStudentForExit,
                                        'characterCert',
                                        'Conduct / Character Certificate',
                                        'Department Head & Proctorial Board',
                                        'conduct_certificate_signed.pdf'
                                      )
                                    }
                                    className="py-1 px-2 rounded-lg bg-white hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                    title="Replace with updated document"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <span>Replace</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-[11px] text-[#6E6862]">
                                  Attestation of disciplinary clearance signed by Department Head or Proctor.
                                </p>
                                <button
                                  onClick={() =>
                                    handleOpenUploadModal(
                                      selectedStudentForExit,
                                      'characterCert',
                                      'Conduct / Character Certificate',
                                      'Department Head & Proctorial Board',
                                      'conduct_certificate_signed.pdf'
                                    )
                                  }
                                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>Upload Conduct</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* 3. Migration Certificate */}
                      {(() => {
                        const isVerified = certs.migrationCert;
                        const doc = selectedStudentForExit.exitClearance.uploadedDocs?.migrationCert;
                        return (
                          <div
                            className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                              isVerified ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-amber-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#242424]">Migration Certificate</span>
                              {isVerified ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  Pending
                                </span>
                              )}
                            </div>

                            {isVerified ? (
                              <div className="space-y-2">
                                <div className="p-2 rounded-lg bg-white border border-emerald-200 text-[11px] space-y-1">
                                  <div className="flex items-center gap-1.5 font-medium text-[#242424] truncate">
                                    <FileText className="w-3.5 h-3.5 text-[#682038] shrink-0" />
                                    <span className="truncate">{doc?.fileName || 'migration_certificate_signed.pdf'}</span>
                                  </div>
                                  <div className="text-[10px] text-[#6E6862] flex items-center justify-between">
                                    <span>{doc?.fileSize || '290.8 KB'} • {doc?.uploadedAt || 'Verified on File'}</span>
                                  </div>
                                </div>
                                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">Attested by {doc?.authority || 'State Technical University Board'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <button
                                    onClick={() =>
                                      handleOpenDocPreview(
                                        selectedStudentForExit,
                                        'migrationCert',
                                        'University Board Migration Certificate',
                                        'State Technical University Board'
                                      )
                                    }
                                    className="flex-1 py-1 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View Doc</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOpenUploadModal(
                                        selectedStudentForExit,
                                        'migrationCert',
                                        'University Board Migration Certificate',
                                        'State Technical University Board',
                                        'university_migration_certificate.pdf'
                                      )
                                    }
                                    className="py-1 px-2 rounded-lg bg-white hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                    title="Replace with updated document"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <span>Replace</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-[11px] text-[#6E6862]">
                                  Official state or central education board migration eligibility certificate.
                                </p>
                                <button
                                  onClick={() =>
                                    handleOpenUploadModal(
                                      selectedStudentForExit,
                                      'migrationCert',
                                      'University Board Migration Certificate',
                                      'State Technical University Board',
                                      'university_migration_certificate.pdf'
                                    )
                                  }
                                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>Upload Migration</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* SECTION 2: STUDENT FEE STATUS & BURSAR NO-DUES CLEARANCE */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#682038] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      <span>Student Fee Status &amp; Bursar No-Dues Clearance</span>
                    </h4>

                    <div
                      className={`p-4 rounded-xl border text-xs space-y-3 ${
                        certs.noDuesSlip && feeInfo.dueAmount === 0
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-amber-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5DFD7]">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#242424]">Institutional Fee Assessment Ledger</span>
                          <div className="text-[11px] text-[#6E6862]">
                            Bursar General Ledger Sync • Module 05 Integration
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {feeInfo.dueAmount === 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              ₹0.00 Dues Outstanding
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              ₹{feeInfo.dueAmount.toLocaleString('en-IN')} Outstanding Balance
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fee Breakdown Stats */}
                      <div className="grid grid-cols-3 gap-3 bg-[#FAF7F2] p-3 rounded-lg border border-[#E5DFD7]">
                        <div>
                          <span className="text-[10px] text-[#6E6862] uppercase font-bold">Total Assessed</span>
                          <div className="font-mono font-bold text-xs text-[#242424]">
                            ₹{feeInfo.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#6E6862] uppercase font-bold">Paid to Date</span>
                          <div className="font-mono font-bold text-xs text-emerald-700">
                            ₹{feeInfo.paidAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#6E6862] uppercase font-bold">Balance Due</span>
                          <div
                            className={`font-mono font-bold text-xs ${
                              feeInfo.dueAmount === 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            ₹{feeInfo.dueAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Pending UTR Alert / Fee Resolution Action */}
                      {feeInfo.dueAmount > 0 && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-amber-900 font-semibold">
                            <span>Pending UTR Submission on Desk:</span>
                            <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-[#8B5E3C]">
                              {feeInfo.utrRef || 'Pending Bursar Deposit'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E6862]">
                            Bank: <strong>{feeInfo.bankName || 'Direct Bursar Counter'}</strong>. Reconcile this payment to clear outstanding balance and automatically generate the statutory No-Dues slip.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleClearStudentFee(selectedStudentForExit.id)}
                              disabled={clearingFee}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                            >
                              {clearingFee ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Reconciling Ledger...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve UTR &amp; Issue No-Dues (₹{feeInfo.dueAmount.toLocaleString('en-IN')})</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* If Fee is zero but No-Dues Slip isn't generated yet */}
                      {feeInfo.dueAmount === 0 && !certs.noDuesSlip && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-[#6E6862]">
                            Fee ledger is 100% paid. Click below to generate the formal Bursar No-Dues clearance.
                          </span>
                          <button
                            onClick={() => handleClearStudentFee(selectedStudentForExit.id)}
                            disabled={clearingFee}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Issue Bursar No-Dues Slip</span>
                          </button>
                        </div>
                      )}

                      {/* If No-Dues is already active */}
                      {certs.noDuesSlip && (
                        <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Bursar No-Dues Clearance verified on file • Ref:{' '}
                            <span className="font-mono">ND-2026-{selectedStudentForExit.enrollmentNo}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 3: PERMANENT EXIT EXECUTION BARRIER */}
                  <div className="pt-2 border-t border-[#E5DFD7] space-y-3">
                    {exitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{exitError}</span>
                      </div>
                    )}

                    {!isAllCleared ? (
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Exit Barrier Locked: </strong>
                          <span>
                            {4 - clearedCount} mandatory item(s) pending. Upload all missing certificates and reconcile the fee ledger using the buttons above to enable student exit.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Exit Barrier Cleared: </strong>
                            All 4 statutory slips (TC, Conduct, Migration, No-Dues) are 100% verified. You may now execute permanent exit.
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#242424]">
                            Type Enrollment Number to Confirm Permanent Withdrawal:
                          </label>
                          <input
                            type="text"
                            value={typedAdmissionNo}
                            onChange={(e) => setTypedAdmissionNo(e.target.value)}
                            placeholder={`e.g. ${selectedStudentForExit.enrollmentNo}`}
                            className="w-full text-xs p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038] font-mono"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => setSelectedStudentForExit(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmExit}
                        disabled={!isAllCleared}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Execute Permanent Exit</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Statutory Document Upload & S3 Stream Modal */}
      {activeUploadTarget && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => {
                if (!isS3Streaming) {
                  setActiveUploadTarget(null);
                  setChosenUploadFile(null);
                }
              }}
              disabled={isS3Streaming}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2] disabled:opacity-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#682038]/10 text-[#682038] flex items-center justify-center shrink-0">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242424]">Upload Statutory Document</h3>
                <p className="text-xs text-[#6E6862]">
                  {activeUploadTarget.certTitle} • {activeUploadTarget.studentName}
                </p>
              </div>
            </div>

            {/* Target Info Callout */}
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] mb-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E6862]">Target Pupil:</span>
                <span className="font-bold text-[#242424]">{activeUploadTarget.studentName} ({activeUploadTarget.enrollmentNo})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E6862]">Issuing Authority:</span>
                <span className="font-semibold text-[#8B5E3C]">{activeUploadTarget.issuingAuthority}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E6862]">S3 Direct Upload:</span>
                <span className="font-mono text-[11px] text-emerald-700 font-bold">0.0 MB API RAM • 60s HMAC Direct Stream</span>
              </div>
            </div>

            {/* File Dropzone / Selector */}
            <div className="space-y-3">
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative ${
                  chosenUploadFile ? 'border-emerald-400 bg-emerald-50/40' : 'border-[#D5B3BC] hover:bg-[#FAF7F2]'
                }`}
              >
                <input
                  type="file"
                  accept="application/pdf,image/*,.doc,.docx"
                  disabled={isS3Streaming}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setChosenUploadFile(file);
                      setS3StatusMessage(`Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                {chosenUploadFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#242424] truncate max-w-xs mx-auto">
                        {chosenUploadFile.name}
                      </div>
                      <div className="text-[11px] text-[#6E6862] mt-0.5">
                        {(chosenUploadFile.size / 1024).toFixed(1)} KB • {chosenUploadFile.type || 'application/pdf'}
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      File Selected &amp; Ready for S3 Stream
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <CloudUpload className="w-8 h-8 text-[#8B5E3C] mx-auto" />
                    <div className="text-xs font-bold text-[#242424]">
                      Click to choose document or drag &amp; drop
                    </div>
                    <div className="text-[11px] text-[#6E6862]">
                      Accepts official scanned PDF, PNG, JPG (Max 15MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Document Selector Helper */}
              {!chosenUploadFile && (
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleSelectSampleDocument}
                    className="text-[11px] text-[#682038] hover:text-[#54192D] underline font-medium flex items-center gap-1"
                  >
                    <span>Or select prepared institutional scan ({activeUploadTarget.defaultSampleFileName})</span>
                  </button>
                </div>
              )}

              {/* S3 Streaming Progress Bar */}
              {isS3Streaming && (
                <div className="space-y-1.5 bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD7]">
                  <div className="flex justify-between text-[11px] font-mono font-medium">
                    <span className="text-[#682038]">{s3StatusMessage}</span>
                    <span className="text-[#242424] font-bold">{s3UploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#E5DFD7] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${s3UploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  disabled={isS3Streaming}
                  onClick={() => {
                    setActiveUploadTarget(null);
                    setChosenUploadFile(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!chosenUploadFile || isS3Streaming}
                  onClick={handleConfirmS3Upload}
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                >
                  {isS3Streaming ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Streaming to S3...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Stream to S3 &amp; Verify Document</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Document Digital Preview Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] relative animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#242424]">{activePreviewDoc.certTitle}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      VERIFIED &amp; ATTESTED
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6862]">
                    {activePreviewDoc.studentName} ({activePreviewDoc.enrollmentNo}) • {activePreviewDoc.program}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Preview Body */}
            <div className="py-4 space-y-4">
              <div className="bg-[#FAF7F2] border-2 border-[#D5B3BC] rounded-xl p-6 relative overflow-hidden shadow-inner">
                {/* Watermark Crest */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                  <Building className="w-64 h-64 text-[#682038]" />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Institution Header */}
                  <div className="text-center pb-3 border-b border-[#E5DFD7]">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#8B5E3C]">
                      CENTRAL CAMPUS MANAGEMENT SYSTEM • JSS ACADEMY
                    </div>
                    <h2 className="text-base font-extrabold text-[#682038] tracking-tight uppercase mt-0.5">
                      {activePreviewDoc.certTitle}
                    </h2>
                    <div className="text-[11px] font-mono text-[#6E6862] mt-0.5">
                      Ref: CERT-{activePreviewDoc.enrollmentNo}-{activePreviewDoc.doc.verificationHash.slice(7, 15)}
                    </div>
                  </div>

                  {/* Certificate Formal Text */}
                  <div className="text-xs text-[#242424] leading-relaxed space-y-2.5 bg-white/70 p-4 rounded-lg border border-[#E5DFD7]">
                    <p>
                      This is to officially certify that <strong>{activePreviewDoc.studentName}</strong> (Enrollment No:{' '}
                      <span className="font-mono font-bold text-[#682038]">{activePreviewDoc.enrollmentNo}</span>), enrolled in the{' '}
                      <strong>{activePreviewDoc.program}</strong> program, has fulfilled all statutory clearance requirements with the institution.
                    </p>
                    <p>
                      Institutional records confirm that all academic responsibilities, departmental obligations, and regulatory clearances have been formally reviewed and authenticated by the competent authority.
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                    <div className="p-2 rounded bg-white border border-[#E5DFD7]">
                      <span className="text-[10px] text-[#6E6862] block">File Name</span>
                      <span className="font-bold text-[#242424] truncate block" title={activePreviewDoc.doc.fileName}>
                        {activePreviewDoc.doc.fileName}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#E5DFD7]">
                      <span className="text-[10px] text-[#6E6862] block">File Size</span>
                      <span className="font-bold text-[#242424] block">{activePreviewDoc.doc.fileSize}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#E5DFD7]">
                      <span className="text-[10px] text-[#6E6862] block">Uploaded Time</span>
                      <span className="font-bold text-[#242424] block">{activePreviewDoc.doc.uploadedAt}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#E5DFD7]">
                      <span className="text-[10px] text-[#6E6862] block">Attestation</span>
                      <span className="font-bold text-emerald-700 block truncate" title={activePreviewDoc.doc.authority}>
                        {activePreviewDoc.doc.authority}
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Stamp */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-900">SHA-256 Digital Verification Stamp:</span>
                        <span className="font-mono text-emerald-800 ml-1.5">{activePreviewDoc.doc.verificationHash}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 font-bold">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>ONLINE VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5DFD7]">
              <div className="text-xs text-[#6E6862]">
                Statutory Document archived in S3 storage with immutable tamper-evidence.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([`Official Verified ${activePreviewDoc.certTitle} for ${activePreviewDoc.studentName}`], {
                      type: 'application/pdf',
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = activePreviewDoc.doc.fileName;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-[#6E6862] hover:bg-[#F4ECE2]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: NEW WALK-IN / SPOT ADMISSION REGISTRATION
          (Authorized Role: Admissions Desk & Academic Registrar)
         ======================================================== */}
      {isNewAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-[#E5DFD7] space-y-4 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#682038] text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#242424]">New Admission Entry Desk</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                      Spot Allotment &amp; USN Minting
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6862]">
                    Authorized Authority: <strong>Admissions Officer</strong> (Details &amp; Category) &amp; <strong>Registrar</strong> (USN &amp; Section Allotment).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAdmissionModalOpen(false)}
                className="p-1 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateNewAdmission} className="overflow-y-auto space-y-3.5 pr-1 text-xs">
              {admissionSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{admissionSuccessMsg}</span>
                </div>
              )}

              {/* Student Name */}
              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Tanvi Kulkarni"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              {/* Program & Class Section */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Academic Program *</label>
                  <select
                    value={newStudentProgram}
                    onChange={(e) => {
                      setNewStudentProgram(e.target.value);
                      handleGenerateUSN(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="B.Tech Computer Science">B.Tech Computer Science (CSE)</option>
                    <option value="B.Tech Electronics">B.Tech Electronics &amp; Comm (ECE)</option>
                    <option value="B.Tech Mechanical">B.Tech Mechanical Engg (ME)</option>
                    <option value="MBA Analytics">MBA Business Analytics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Class Section &amp; Batch *</label>
                  <select
                    value={newStudentSection}
                    onChange={(e) => setNewStudentSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="Section A">Section A (LH-301)</option>
                    <option value="Section B">Section B (LH-302)</option>
                    <option value="Section C">Section C (LH-303)</option>
                  </select>
                </div>
              </div>

              {/* Quota & USN Generation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Seat Matrix Quota *</label>
                  <select
                    value={newStudentQuota}
                    onChange={(e) => setNewStudentQuota(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    {quotas.map((q) => (
                      <option key={q.code} value={q.code}>
                        {q.name} ({q.vacant} Vacant)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#242424]">USN / Roll Number *</label>
                    <button
                      type="button"
                      onClick={() => handleGenerateUSN(newStudentProgram)}
                      className="text-[10px] text-[#682038] font-bold underline hover:text-[#54192D]"
                    >
                      Auto-Mint USN
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newStudentUSN}
                    onChange={(e) => setNewStudentUSN(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono text-xs font-bold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              {/* Fee Demand Structure (Bursar & Accountant Responsibilities) */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#682038] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    <span>Tuition Fee Demand &amp; Initial Deposit (Accountant Action)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#E5DFD7] text-[#8B5E3C]">
                    Double-Entry General Ledger
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#6E6862]">Total Annual Tuition (₹)</label>
                    <input
                      type="number"
                      required
                      value={newStudentAnnualFee}
                      onChange={(e) => setNewStudentAnnualFee(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD7] bg-white font-mono text-xs font-bold text-[#242424]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6E6862]">Admission Deposit Paid (₹)</label>
                    <input
                      type="number"
                      required
                      value={newStudentDepositPaid}
                      onChange={(e) => setNewStudentDepositPaid(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD7] bg-white font-mono text-xs font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#E5DFD7]">
                  <span className="text-[#6E6862]">Net Balance Dues:</span>
                  <span className="font-mono font-bold text-rose-700">
                    ₹{Math.max(0, Number(newStudentAnnualFee) - Number(newStudentDepositPaid)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    placeholder="e.g. Suresh Kulkarni"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Parent Mobile (Email/In-App Notice)</label>
                  <input
                    type="text"
                    value={newGuardianPhone}
                    onChange={(e) => setNewGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsNewAdmissionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E6862] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
                >
                  Enroll Student &amp; Mint USN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT STUDENT RECORD & SECTION REALLOCATION
          (Authorized Role: Academic Registrar)
         ======================================================== */}
      {isEditStudentModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#682038]" />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">Edit Student Record &amp; Section</h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Registrar SIS Authority: Section Allocation &amp; Profile Updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditStudentModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-3 text-xs">
              {editStudentSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{editStudentSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">University USN / Roll No *</label>
                  <input
                    type="text"
                    required
                    value={editStudentRollNo}
                    onChange={(e) => setEditStudentRollNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono text-xs font-bold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Class Section *</label>
                  <select
                    value={editStudentSection}
                    onChange={(e) => setEditStudentSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="Section A">Section A (LH-301)</option>
                    <option value="Section B">Section B (LH-302)</option>
                    <option value="Section C">Section C (LH-303)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">Semester *</label>
                  <select
                    value={editStudentSemester}
                    onChange={(e) => setEditStudentSemester(Number(e.target.value))}
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
                  <label className="font-bold text-[#242424]">Enrollment Status *</label>
                  <select
                    value={editStudentStatus}
                    onChange={(e) => setEditStudentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DETAINED">DETAINED (Attendance/Academic Shortage)</option>
                    <option value="WITHDRAWN">WITHDRAWN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Degree Program</label>
                <input
                  type="text"
                  value={editStudentProgram}
                  onChange={(e) => setEditStudentProgram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsEditStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: BATCH PROMOTION & SEMESTER ADVANCEMENT ENGINE
          (Authorized Role: Academic Registrar)
         ======================================================== */}
      {isPromoteCohortModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#682038]" />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">Batch Promotion Engine</h3>
                  <p className="text-[11px] text-[#6E6862]">
                    Registrar Authority: Statutory Cohort Advancement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoteCohortModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecutePromotion} className="space-y-3 text-xs">
              {promotionSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{promotionSuccessMsg}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[#8B5E3C] text-[11px]">
                Promotes all eligible enrolled active students from the selected current semester to the next term. Enforces prerequisite and attendance thresholds.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">From Semester *</label>
                  <select
                    value={promoteFromSem}
                    onChange={(e) => {
                      const from = Number(e.target.value);
                      setPromoteFromSem(from);
                      setPromoteToSem(from + 1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#242424]">To Target Semester *</label>
                  <select
                    value={promoteToSem}
                    onChange={(e) => setPromoteToSem(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038] cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Minimum Eligibility Attendance %</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={promoteMinAttendance}
                  onChange={(e) => setPromoteMinAttendance(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsPromoteCohortModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Execute Batch Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADJUST SANCTIONED INTAKE QUOTA
          (Authorized Role: Academic Registrar)
         ======================================================== */}
      {isAdjustQuotaModalOpen && selectedQuotaToAdjust && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#242424]">Adjust Sanctioned Quota</h3>
                <p className="text-[11px] text-[#6E6862]">{selectedQuotaToAdjust.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustQuotaModalOpen(false)}
                className="text-[#6E6862] hover:text-[#242424] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustQuota} className="space-y-3 text-xs">
              {quotaAdjustSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{quotaAdjustSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Sanctioned Intake Capacity *</label>
                <input
                  type="number"
                  required
                  min={selectedQuotaToAdjust.filled}
                  value={adjustedSanctionedSeats}
                  onChange={(e) => setAdjustedSanctionedSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] font-mono text-sm font-bold text-[#682038] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
                <p className="text-[10px] text-[#6E6862]">
                  Currently filled: {selectedQuotaToAdjust.filled} seats. Sanctioned capacity cannot be lower than filled seats.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsAdjustQuotaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold hover:bg-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold transition-all shadow-sm"
                >
                  Commit Quota Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
