/**
 * CASL Action & Subject Definitions
 * Per Section 08 (Authentication & Role-Based Access, Page 9)
 */

export type AppAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'restore'
  | 'export'
  | 'approve'
  | 'moderate'
  | 'lock'
  | 'manage';

export type AppSubject =
  | 'Student'
  | 'Marks'
  | 'Attendance'
  | 'Timetable'
  | 'Leave'
  | 'Fee'
  | 'Voucher'
  | 'Payroll'
  | 'Certificate'
  | 'Report'
  | 'Setting'
  | 'All';

export interface PermissionRule {
  action: AppAction;
  subject: AppSubject;
  conditions?: Record<string, unknown>;
  fields?: string[];
}
