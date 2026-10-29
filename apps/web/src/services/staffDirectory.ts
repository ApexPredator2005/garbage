import { RoleType } from '../types';

export interface StaffMember {
  id: string;
  empCode: string;
  name: string;
  designation: string;
  department: string;
  role: RoleType;
  email: string;
  temporaryPassword?: string;
  status: 'ACTIVE' | 'RELIEVED' | 'TRANSFERRED' | 'PROBATION';
  dateOfJoining: string;
  bankAccount: string;
  bankName: string;
  panNumber: string;
  basicSalary: number;
  specialAllowance: number;
  lopDays: number;
  isIncumbent: boolean;
  totpSecret?: string;
}

export type OutgoingDisposition = 'REASSIGN_FACULTY' | 'TRANSFER_DEPT' | 'RELIEVE_ARCHIVE';

export interface HandoverRecord {
  id: string;
  role: RoleType;
  department: string;
  outgoingStaffId: string;
  outgoingStaffName: string;
  outgoingEmpCode: string;
  outgoingDisposition: OutgoingDisposition;
  incomingStaffId: string;
  incomingStaffName: string;
  incomingEmpCode: string;
  incomingEmail: string;
  handoverDate: string;
  effectiveDate: string;
  approvalRef: string;
  transferredPrivileges: string[];
  handoverNotes: string;
  auditHash: string;
}

export interface WelcomeMemo {
  memoNumber: string;
  issuedAt: string;
  empCode: string;
  name: string;
  department: string;
  designation: string;
  role: RoleType;
  email: string;
  temporaryPassword: string;
  totpSecret: string;
  authoritySignoff: string;
  securityNotice: string;
}

// Single-incumbent institutional governance roles
export const SINGLE_INCUMBENT_ROLES: RoleType[] = [
  'PRINCIPAL',
  'REGISTRAR',
  'HOD',
  'ACCOUNTANT',
  'EXAM_CONTROLLER',
  'HR_OFFICER',
  'INSTITUTION_ADMIN',
];

export const ROLE_PRIVILEGE_MAP: Record<RoleType, string[]> = {
  PRINCIPAL: [
    'Institutional Executive Veto & Policy Signoff',
    'Faculty Appointment Ratification',
    'Emergency Campus Closure Overrides',
    'NAAC / NIRF Regulatory Dossier Signing',
  ],
  REGISTRAR: [
    'Student SIS Exit Clearance & Transfer Certificate Issuance',
    'Program Matriculation & Degree Sanctions',
    'Official Transcript Cryptographic Seal Signoff',
  ],
  HOD: [
    'Semester Mark Moderation Approval',
    'Faculty Timetable Clashes & Substitution Dispatch',
    'Student Attendance Shortage Condonation Escalation',
  ],
  ACCOUNTANT: [
    'Corporate Bank NEFT Disbursement Authorization',
    'General Ledger Journal Voucher Posting (JV)',
    'Bank UTR Payment Clearance & DD Reconciliation',
  ],
  EXAM_CONTROLLER: [
    'Final Marksheet Hash Seal & Lock Authority',
    'External Examiner Grading Matrix Moderation',
    'Hall Ticket & Barcode Generation Authorization',
  ],
  HR_OFFICER: [
    'Staff Onboarding & Credential Provisioning',
    'Monthly Statutory Payroll Calculation & LOP Approval',
    'Service Book Maintenance & Leave Sanctions',
  ],
  FACULTY: [
    'Daily Turnstile Attendance Logging',
    'Course Syllabus Unit Tracking',
    'Internal Assessment Entry & Assignment Review',
  ],
  INSTITUTION_ADMIN: [
    'Campus Network Infrastructure & Access Audits',
    'Classroom Resource Allocation',
    'Security System & Device Hub Diagnostics',
  ],
  SUPER_ADMIN: [
    'Multi-Tenant Tenant Provisioning & Sharding',
    'System Cryptographic Root Key Management',
    'Global Security Policy Enforcement',
  ],
  STUDENT: ['Personal Self-Service Learning Portal'],
  PARENT: ['Multi-Ward Academic & Fee Desk'],
};

// Default seed staff aligned with existing login profiles and payroll records
export const DEFAULT_STAFF_DIRECTORY: StaffMember[] = [
  {
    id: 'emp-principal',
    empCode: 'EMP-ADM-001',
    name: 'Dr. K. S. Sharma',
    designation: 'Principal & Campus Director',
    department: 'Executive Directorate',
    role: 'PRINCIPAL',
    email: 'principal@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2016-08-01',
    bankAccount: '992019283401',
    bankName: 'HDFC Bank',
    panNumber: 'ABCDE1234F',
    basicSalary: 125000,
    specialAllowance: 25000,
    lopDays: 0,
    isIncumbent: true,
  },
  {
    id: 'emp-1',
    empCode: 'EMP-CSE-004',
    name: 'Dr. Anand Joshi',
    designation: 'Professor & Head of Department',
    department: 'Computer Science',
    role: 'HOD',
    email: 'hod.cse@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2019-06-15',
    bankAccount: '992019283412',
    bankName: 'HDFC Bank',
    panNumber: 'ABCDE1234F',
    basicSalary: 95000,
    specialAllowance: 18000,
    lopDays: 0,
    isIncumbent: true,
  },
  {
    id: 'emp-2',
    empCode: 'EMP-CSE-012',
    name: 'Prof. Sunita Rao',
    designation: 'Associate Professor',
    department: 'Computer Science',
    role: 'FACULTY',
    email: 'sunita.rao@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2021-01-10',
    bankAccount: '112039482711',
    bankName: 'State Bank of India',
    panNumber: 'BWKPE9912K',
    basicSalary: 72000,
    specialAllowance: 12000,
    lopDays: 1,
    isIncumbent: false,
  },
  {
    id: 'emp-faculty-1',
    empCode: 'EMP-CSE-018',
    name: 'Dr. Ramesh Kulkarni',
    designation: 'Senior Faculty & Instructor',
    department: 'Computer Science',
    role: 'FACULTY',
    email: 'ramesh.kulkarni@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2020-03-15',
    bankAccount: '772910394820',
    bankName: 'Canara Bank',
    panNumber: 'RAMKU8812N',
    basicSalary: 68000,
    specialAllowance: 10000,
    lopDays: 0,
    isIncumbent: false,
  },
  {
    id: 'emp-bursar',
    empCode: 'EMP-FIN-003',
    name: 'Vinod Nair',
    designation: 'Bursar & Accounts Officer',
    department: 'Finance & Accounts',
    role: 'ACCOUNTANT',
    email: 'bursar.accounts@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2017-11-20',
    bankAccount: '334910294812',
    bankName: 'Axis Bank',
    panNumber: 'QWERT9012R',
    basicSalary: 82000,
    specialAllowance: 15000,
    lopDays: 0,
    isIncumbent: true,
  },
  {
    id: 'emp-hr',
    empCode: 'EMP-HR-007',
    name: 'Pooja Bhatt',
    designation: 'HR & Personnel Officer',
    department: 'Human Resources',
    role: 'HR_OFFICER',
    email: 'hr.personnel@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2021-04-05',
    bankAccount: '556102938472',
    bankName: 'ICICI Bank',
    panNumber: 'POOJB4412P',
    basicSalary: 65000,
    specialAllowance: 11000,
    lopDays: 0,
    isIncumbent: true,
  },
  {
    id: 'emp-coe',
    empCode: 'EMP-EXM-005',
    name: 'Dr. S. K. Sundaram',
    designation: 'Controller of Examinations (COE)',
    department: 'Examination Branch',
    role: 'EXAM_CONTROLLER',
    email: 'coe.exams@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2018-02-14',
    bankAccount: '667102938411',
    bankName: 'State Bank of India',
    panNumber: 'SKSU4819M',
    basicSalary: 92000,
    specialAllowance: 16000,
    lopDays: 0,
    isIncumbent: true,
  },
  {
    id: 'emp-reg',
    empCode: 'EMP-ADM-002',
    name: 'K. R. Venkatraman',
    designation: 'Dean & Academic Registrar',
    department: 'Academic Affairs',
    role: 'REGISTRAR',
    email: 'registrar@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2018-03-20',
    bankAccount: '882910394819',
    bankName: 'Canara Bank',
    panNumber: 'ZXCVB5678Q',
    basicSalary: 88000,
    specialAllowance: 14000,
    lopDays: 2,
    isIncumbent: true,
  },
  {
    id: 'emp-admin',
    empCode: 'EMP-OPS-009',
    name: 'Arvind Nambiar',
    designation: 'Institution Administrator',
    department: 'Campus Operations',
    role: 'INSTITUTION_ADMIN',
    email: 'admin.ops@jssate.edu',
    status: 'ACTIVE',
    dateOfJoining: '2020-09-01',
    bankAccount: '445910283918',
    bankName: 'ICICI Bank',
    panNumber: 'PLMKO4819M',
    basicSalary: 76000,
    specialAllowance: 12000,
    lopDays: 0,
    isIncumbent: true,
  },
  {
    id: 'emp-superadmin',
    empCode: 'EMP-SYS-000',
    name: 'Platform Root Administrator',
    designation: 'Enterprise Cloud Architect',
    department: 'IT Directorate',
    role: 'SUPER_ADMIN',
    email: 'platform.root@campus.edu',
    status: 'ACTIVE',
    dateOfJoining: '2015-01-01',
    bankAccount: '111122223333',
    bankName: 'Reserve Bank of India',
    panNumber: 'ROOTP0001Z',
    basicSalary: 150000,
    specialAllowance: 30000,
    lopDays: 0,
    isIncumbent: true,
  },
];

export const INITIAL_HANDOVER_LOGS: HandoverRecord[] = [
  {
    id: 'HND-2025-014',
    role: 'HOD',
    department: 'Computer Science',
    outgoingStaffId: 'emp-legacy-hod',
    outgoingStaffName: 'Dr. Aris Thorne',
    outgoingEmpCode: 'EMP-CSE-002',
    outgoingDisposition: 'REASSIGN_FACULTY',
    incomingStaffId: 'emp-1',
    incomingStaffName: 'Dr. Anand Joshi',
    incomingEmpCode: 'EMP-CSE-004',
    incomingEmail: 'hod.cse@jssate.edu',
    handoverDate: '2025-06-14',
    effectiveDate: '2025-06-15',
    approvalRef: 'BOG-RES-2025-88',
    transferredPrivileges: [
      'Semester Mark Moderation Approval',
      'Faculty Timetable Clashes & Substitution Dispatch',
      'Student Attendance Shortage Condonation Escalation',
    ],
    handoverNotes: 'Regular rotational succession completed after 3-year academic tenure. Dr. Aris Thorne transitioned to Emeritus Senior Professor with pure research portfolio.',
    auditHash: 'SHA256:7b92f4410a8c2d3e110e59a84d4',
  },
];

const DIRECTORY_STORAGE_KEY = 'devloft_staff_directory';
const HANDOVER_STORAGE_KEY = 'devloft_role_succession_logs';

/**
 * Retrieve the current staff directory from localStorage with fallback to defaults.
 */
export function getStaffDirectory(): StaffMember[] {
  try {
    const raw = localStorage.getItem(DIRECTORY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DIRECTORY_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_DIRECTORY));
      return DEFAULT_STAFF_DIRECTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read staff directory from localStorage:', err);
  }
  return DEFAULT_STAFF_DIRECTORY;
}

/**
 * Save staff directory to localStorage.
 */
export function saveStaffDirectory(directory: StaffMember[]): void {
  try {
    localStorage.setItem(DIRECTORY_STORAGE_KEY, JSON.stringify(directory));
  } catch (err) {
    console.error('Failed to save staff directory to localStorage:', err);
  }
}

/**
 * Retrieve handover audit logs.
 */
export function getHandoverAuditLogs(): HandoverRecord[] {
  try {
    const raw = localStorage.getItem(HANDOVER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HANDOVER_STORAGE_KEY, JSON.stringify(INITIAL_HANDOVER_LOGS));
      return INITIAL_HANDOVER_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read handover logs from localStorage:', err);
  }
  return INITIAL_HANDOVER_LOGS;
}

/**
 * Save handover audit logs.
 */
export function saveHandoverAuditLogs(logs: HandoverRecord[]): void {
  try {
    localStorage.setItem(HANDOVER_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save handover logs to localStorage:', err);
  }
}

/**
 * Find current active incumbent for a single-holder role.
 */
export function getIncumbentForRole(role: RoleType, department?: string): StaffMember | undefined {
  const directory = getStaffDirectory();
  return directory.find((staff) => {
    if (staff.status !== 'ACTIVE' || !staff.isIncumbent) return false;
    if (staff.role !== role) return false;
    if (role === 'HOD' && department && staff.department !== department) return false;
    return true;
  });
}

/**
 * Generate a cryptographically randomized temporary password for onboarding.
 */
export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  let pwd = 'Temp#';
  for (let i = 0; i < 7; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

/**
 * Generate a 16-character base32 TOTP provisioning secret.
 */
export function generateTotpSecret(): string {
  const base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += base32.charAt(Math.floor(Math.random() * base32.length));
  }
  return secret;
}

/**
 * Onboard a new staff member and optionally execute a role succession handover.
 */
export function onboardStaff(
  input: {
    name: string;
    designation: string;
    department: string;
    role: RoleType;
    email: string;
    basicSalary: number;
    specialAllowance: number;
    dateOfJoining: string;
    bankAccount: string;
    bankName: string;
    panNumber: string;
  },
  successionConfig?: {
    outgoingStaffId: string;
    disposition: OutgoingDisposition;
    approvalRef: string;
    notes: string;
  }
): { staff: StaffMember; handoverLog?: HandoverRecord; welcomeMemo: WelcomeMemo } {
  const directory = [...getStaffDirectory()];
  const handoverLogs = [...getHandoverAuditLogs()];

  const newId = `emp-${Date.now().toString(36)}`;
  const deptCode = input.department.slice(0, 3).toUpperCase();
  const nextNum = String(directory.length + 1).padStart(3, '0');
  const empCode = `EMP-${deptCode}-${nextNum}`;

  const tempPassword = generateTemporaryPassword();
  const totpSecret = generateTotpSecret();

  let isIncumbent = SINGLE_INCUMBENT_ROLES.includes(input.role);
  let handoverLog: HandoverRecord | undefined;

  // Handle Role Succession if there was an outgoing incumbent
  if (successionConfig && successionConfig.outgoingStaffId) {
    const outgoingIndex = directory.findIndex((s) => s.id === successionConfig.outgoingStaffId);
    if (outgoingIndex !== -1) {
      const outgoing = directory[outgoingIndex];
      let updatedStatus = outgoing.status;
      let updatedRole = outgoing.role;
      let updatedDesignation = outgoing.designation;

      if (successionConfig.disposition === 'REASSIGN_FACULTY') {
        updatedRole = 'FACULTY';
        updatedDesignation = `Senior Faculty (Ex-${outgoing.role})`;
      } else if (successionConfig.disposition === 'TRANSFER_DEPT') {
        updatedRole = 'FACULTY';
        updatedDesignation = `Faculty Liaison (${outgoing.department})`;
      } else if (successionConfig.disposition === 'RELIEVE_ARCHIVE') {
        updatedStatus = 'RELIEVED';
        updatedDesignation = `Relieved (${outgoing.designation})`;
      }

      directory[outgoingIndex] = {
        ...outgoing,
        role: updatedRole,
        designation: updatedDesignation,
        status: updatedStatus,
        isIncumbent: false,
      };

      const now = new Date().toISOString().split('T')[0];
      const randomHex = Math.random().toString(16).substring(2, 10);
      handoverLog = {
        id: `HND-${new Date().getFullYear()}-${String(handoverLogs.length + 1).padStart(3, '0')}`,
        role: input.role,
        department: input.department,
        outgoingStaffId: outgoing.id,
        outgoingStaffName: outgoing.name,
        outgoingEmpCode: outgoing.empCode,
        outgoingDisposition: successionConfig.disposition,
        incomingStaffId: newId,
        incomingStaffName: input.name,
        incomingEmpCode: empCode,
        incomingEmail: input.email,
        handoverDate: now,
        effectiveDate: input.dateOfJoining || now,
        approvalRef: successionConfig.approvalRef || `HR-RES-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        transferredPrivileges: ROLE_PRIVILEGE_MAP[input.role] || ['Institutional Portal Access'],
        handoverNotes: successionConfig.notes || `Formal role succession executed during official onboarding. Outgoing staff disposition: ${successionConfig.disposition}.`,
        auditHash: `SHA256:${randomHex}${Date.now().toString(16)}`,
      };

      handoverLogs.unshift(handoverLog);
      saveHandoverAuditLogs(handoverLogs);
    }
  }

  const newStaff: StaffMember = {
    id: newId,
    empCode,
    name: input.name,
    designation: input.designation,
    department: input.department,
    role: input.role,
    email: input.email,
    temporaryPassword: tempPassword,
    status: 'ACTIVE',
    dateOfJoining: input.dateOfJoining,
    bankAccount: input.bankAccount,
    bankName: input.bankName,
    panNumber: input.panNumber,
    basicSalary: input.basicSalary,
    specialAllowance: input.specialAllowance,
    lopDays: 0,
    isIncumbent,
    totpSecret,
  };

  directory.unshift(newStaff);
  saveStaffDirectory(directory);

  const welcomeMemo: WelcomeMemo = {
    memoNumber: `MEMO-HR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    issuedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    empCode,
    name: input.name,
    department: input.department,
    designation: input.designation,
    role: input.role,
    email: input.email,
    temporaryPassword: tempPassword,
    totpSecret,
    authoritySignoff: 'Registrar & Directorate of Human Resources',
    securityNotice:
      'Per Institutional Security Policy ISO/IEC 27001, this temporary credential is valid for 24 hours. The appointee must change their password and register their 2FA Authenticator on first login.',
  };

  return {
    staff: newStaff,
    handoverLog,
    welcomeMemo,
  };
}

/**
 * Execute standalone role succession between existing staff members.
 */
export function executeRoleSuccession(
  role: RoleType,
  outgoingStaffId: string,
  incomingStaffId: string,
  disposition: OutgoingDisposition,
  approvalRef: string,
  notes: string
): HandoverRecord {
  const directory = [...getStaffDirectory()];
  const handoverLogs = [...getHandoverAuditLogs()];

  const outgoingIdx = directory.findIndex((s) => s.id === outgoingStaffId);
  const incomingIdx = directory.findIndex((s) => s.id === incomingStaffId);

  if (outgoingIdx === -1 || incomingIdx === -1) {
    throw new Error('Staff records not found in directory');
  }

  const outgoing = directory[outgoingIdx];
  const incoming = directory[incomingIdx];

  // Update outgoing staff
  let updatedStatus = outgoing.status;
  let updatedRole = outgoing.role;
  let updatedDesignation = outgoing.designation;

  if (disposition === 'REASSIGN_FACULTY') {
    updatedRole = 'FACULTY';
    updatedDesignation = `Professor / Senior Faculty (Ex-${outgoing.role})`;
  } else if (disposition === 'TRANSFER_DEPT') {
    updatedRole = 'FACULTY';
    updatedDesignation = `Academic Liaison (${outgoing.department})`;
  } else if (disposition === 'RELIEVE_ARCHIVE') {
    updatedStatus = 'RELIEVED';
    updatedDesignation = `Relieved (${outgoing.designation})`;
  }

  directory[outgoingIdx] = {
    ...outgoing,
    role: updatedRole,
    designation: updatedDesignation,
    status: updatedStatus,
    isIncumbent: false,
  };

  // Update incoming staff
  directory[incomingIdx] = {
    ...incoming,
    role,
    isIncumbent: true,
  };

  saveStaffDirectory(directory);

  const now = new Date().toISOString().split('T')[0];
  const randomHex = Math.random().toString(16).substring(2, 10);
  const handoverLog: HandoverRecord = {
    id: `HND-${new Date().getFullYear()}-${String(handoverLogs.length + 1).padStart(3, '0')}`,
    role,
    department: incoming.department || outgoing.department,
    outgoingStaffId: outgoing.id,
    outgoingStaffName: outgoing.name,
    outgoingEmpCode: outgoing.empCode,
    outgoingDisposition: disposition,
    incomingStaffId: incoming.id,
    incomingStaffName: incoming.name,
    incomingEmpCode: incoming.empCode,
    incomingEmail: incoming.email,
    handoverDate: now,
    effectiveDate: now,
    approvalRef: approvalRef || `BOG-RES-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    transferredPrivileges: ROLE_PRIVILEGE_MAP[role] || ['Institutional Portal Executive Access'],
    handoverNotes: notes || `Role transfer executed by HR Office. Outgoing staff disposition: ${disposition}.`,
    auditHash: `SHA256:${randomHex}${Date.now().toString(16)}`,
  };

  handoverLogs.unshift(handoverLog);
  saveHandoverAuditLogs(handoverLogs);

  return handoverLog;
}
