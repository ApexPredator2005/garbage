/**
 * Devloft Campus Management System - Shared Domain Enums
 * Grounded in Devloft Technical Specification (21 Oct 2026)
 */

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  REGISTRAR = 'REGISTRAR',
  HOD = 'HOD',
  FACULTY = 'FACULTY',
  EXAM_CONTROLLER = 'EXAM_CONTROLLER',
  ACCOUNTANT = 'ACCOUNTANT',
  HR_OFFICER = 'HR_OFFICER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  ON_DUTY = 'ON_DUTY',
  LEAVE = 'LEAVE',
}

export enum MarkStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  MODERATED = 'MODERATED',
  LOCKED = 'LOCKED',
}

export enum PayrollState {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  LOCKED = 'LOCKED',
}

export enum VoucherType {
  RECEIPT = 'RECEIPT',
  PAYMENT = 'PAYMENT',
  JOURNAL = 'JOURNAL',
  CONTRA = 'CONTRA',
}

export enum CertificateType {
  BONAFIDE = 'BONAFIDE',
  TRANSFER = 'TRANSFER',
  MIGRATION = 'MIGRATION',
  CONDUCT = 'CONDUCT',
  STUDY = 'STUDY',
}

export enum PaymentMethod {
  ONLINE_GATEWAY = 'ONLINE_GATEWAY',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  DEMAND_DRAFT = 'DEMAND_DRAFT',
  BANK_TRANSFER_UTR = 'BANK_TRANSFER_UTR',
}

export enum PaymentVerificationStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum CourseType {
  THEORY = 'THEORY',
  LAB = 'LAB',
  ELECTIVE = 'ELECTIVE',
  OPEN_ELECTIVE = 'OPEN_ELECTIVE',
}
