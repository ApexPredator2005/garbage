import { z } from 'zod';
import { AttendanceStatus, MarkStatus, CertificateType, PaymentMethod } from './enums.js';

/**
 * 01. Bulk Attendance Register Schema
 * 40-student single payload committed in ~10ms
 */
export const BulkAttendanceRecordSchema = z.object({
  studentId: z.string().uuid(),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().optional(),
});

export const SubmitAttendanceSessionSchema = z.object({
  sessionId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  periodNumber: z.number().int().min(1).max(12),
  courseOfferingId: z.string().uuid(),
  facultyId: z.string().uuid(),
  records: z.array(BulkAttendanceRecordSchema).min(1),
});

export type SubmitAttendanceSessionDto = z.infer<typeof SubmitAttendanceSessionSchema>;

/**
 * 02. Smart Substitution Assistant Schema (User Feature Preserved)
 * Real-time timetable collision detection without mutating master slots
 */
export const FindSubstitutesQuerySchema = z.object({
  absentFacultyId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodNumber: z.number().int().min(1).max(12),
  departmentId: z.string().uuid(),
});

export const AssignSubstitutionDutySchema = z.object({
  timetableSlotId: z.string().uuid(),
  originalFacultyId: z.string().uuid(),
  substituteFacultyId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(3).max(255),
});

export type AssignSubstitutionDutyDto = z.infer<typeof AssignSubstitutionDutySchema>;

/**
 * 03. Dual-Signoff Exam Grade Moderation Schema (User Feature Preserved)
 * Draft -> Moderated (HOD) -> Locked (Controller)
 */
export const EnterMarksPayloadSchema = z.object({
  componentId: z.string().uuid(),
  entries: z.array(
    z.object({
      studentId: z.string().uuid(),
      marksObtained: z.number().min(0).max(100),
      isAbsent: z.boolean().default(false),
    })
  ),
});

export const ModerateMarksPayloadSchema = z.object({
  componentId: z.string().uuid(),
  moderationNotes: z.string().min(5),
  graceMarksAdjustment: z.number().min(0).max(10).default(0),
  status: z.enum([MarkStatus.MODERATED, MarkStatus.LOCKED]),
});

export type EnterMarksDto = z.infer<typeof EnterMarksPayloadSchema>;
export type ModerateMarksDto = z.infer<typeof ModerateMarksPayloadSchema>;

/**
 * 04. Presigned S3 Direct Upload Schema (User Feature Preserved)
 * 60s HMAC token; 0MB server RAM overhead
 */
export const PresignUploadRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ]),
  fileSize: z.number().int().positive().max(15 * 1024 * 1024), // Max 15MB
  category: z.enum([
    'STUDENT_DOCUMENT',
    'PAYMENT_RECEIPT',
    'EXIT_CERTIFICATE',
    'FACULTY_DOCUMENT',
  ]),
});

export type PresignUploadRequestDto = z.infer<typeof PresignUploadRequestSchema>;

/**
 * 05. Strict Idempotency & Fee Payment Schema (User Feature Preserved)
 * Atomic Redis lock (SET NX EX 60) + Unique DB constraint
 */
export const FeePaymentSubmissionSchema = z.object({
  studentId: z.string().uuid(),
  feeDemandId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  idempotencyKey: z.string().uuid('Valid UUIDv4 idempotency key required'),
  utrReference: z.string().min(6).max(64).optional(),
  receiptDocumentUrl: z.string().url().optional(),
});

export type FeePaymentSubmissionDto = z.infer<typeof FeePaymentSubmissionSchema>;

/**
 * 06. Statutory Student Exit Barrier Guard Schema (User Feature Preserved)
 * 4 statutory slips required before student purge
 */
export const StudentExitBarrierCheckSchema = z.object({
  studentId: z.string().uuid(),
  confirmAdmissionNo: z.string().min(1),
  exitReason: z.string().min(10),
});

export type StudentExitBarrierCheckDto = z.infer<typeof StudentExitBarrierCheckSchema>;
