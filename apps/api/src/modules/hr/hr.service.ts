import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma.service';

@Injectable()
export class HrService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Deterministic Sandboxed Salary Formula Engine (Without eval)
   */
  calculateComponents(basic: number, special: number, lopDays = 0) {
    const hra = Math.round(basic * 0.4); // 40% of Basic
    const da = Math.round(basic * 0.25); // 25% of Basic
    const grossEarnings = basic + hra + da + special;

    const pf = Math.round(basic * 0.12); // 12% of Basic
    const pt = 200; // Fixed PT
    const tds = grossEarnings > 100000 ? Math.round(grossEarnings * 0.1) : Math.round(grossEarnings * 0.05);

    const dailyRate = Math.round(grossEarnings / 30);
    const lopDeduction = dailyRate * lopDays;

    const totalDeductions = pf + pt + tds + lopDeduction;
    const netPayable = grossEarnings - totalDeductions;

    return {
      basic,
      hra,
      da,
      special,
      grossEarnings,
      pf,
      pt,
      tds,
      dailyRate,
      lopDeduction,
      totalDeductions,
      netPayable,
    };
  }

  async getStaffPayrollSheet(cycleMonth = '2026-10') {
    const staff = [
      { id: 'emp-1', code: 'EMP-CSE-004', name: 'Dr. Aris Thorne', designation: 'Professor & HOD', dept: 'CSE', basic: 95000, special: 18000, lopDays: 0 },
      { id: 'emp-2', code: 'EMP-CSE-012', name: 'Prof. Sunita Rao', designation: 'Associate Professor', dept: 'CSE', basic: 72000, special: 12000, lopDays: 1 },
      { id: 'emp-3', code: 'EMP-ECE-008', name: 'Dr. Rajesh Deshmukh', designation: 'Associate Professor', dept: 'ECE', basic: 74000, special: 14000, lopDays: 0 },
    ];

    const sheet = staff.map((s) => ({
      ...s,
      ...this.calculateComponents(s.basic, s.special, s.lopDays),
    }));

    return {
      cycleMonth,
      status: 'DRAFT',
      totalEmployees: sheet.length,
      totalGross: sheet.reduce((acc, row) => acc + row.grossEarnings, 0),
      totalNetDisbursement: sheet.reduce((acc, row) => acc + row.netPayable, 0),
      sheet,
    };
  }

  /**
   * Monthly Payroll 3-Stage State Machine (DRAFT -> APPROVED -> LOCKED)
   */
  async advancePayrollCycle(cycleMonth: string, targetState: 'APPROVED' | 'LOCKED', signatory: string) {
    if (targetState === 'LOCKED') {
      const voucherNo = `JV-2026-PAY-${Date.now().toString().slice(-4)}`;
      return {
        cycleMonth,
        status: 'LOCKED',
        signatory,
        lockedAt: new Date().toISOString(),
        isImmutable: true,
        glVoucher: {
          voucherNumber: voucherNo,
          debitAccount: '5010 - Faculty Salaries & Allowances',
          creditAccount: '1010 - Corporate Disbursement A/c',
          amount: 614700,
          isBalanced: true,
        },
      };
    }

    return {
      cycleMonth,
      status: 'APPROVED',
      signatory,
      approvedAt: new Date().toISOString(),
    };
  }
}
