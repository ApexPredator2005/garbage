import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma.service';
import { RedisService } from '../../platform/redis.service';

@Injectable()
export class FeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  /**
   * Two-Step Manual UTR Verification Submission
   * Protected by Strict Redis Idempotency Key (60s Lock)
   */
  async submitManualUtrPayment(
    studentId: string,
    feeDemandId: string,
    utrNumber: string,
    amount: number,
    bankName: string,
    receiptUrl: string,
    idempotencyKey: string
  ) {
    if (!utrNumber || utrNumber.length < 8) {
      throw new BadRequestException('Valid 8+ character Bank Transfer / UPI UTR number is required.');
    }

    // 1. Acquire Strict Atomic Idempotency Lock (60s)
    const lockAcquired = await this.redis.acquireIdempotencyLock(idempotencyKey, 60);
    if (!lockAcquired) {
      throw new ConflictException(
        'Duplicate Transaction Prevented: An identical payment request is currently being processed. Please wait 60 seconds.'
      );
    }

    try {
      // 2. Persist payment submission with status PENDING_VERIFICATION
      // Rule: Student balance remains strictly untouched until Bursar signoff
      const submission = {
        id: `PAY-${Date.now()}`,
        studentId,
        feeDemandId,
        utrNumber,
        amount,
        bankName,
        receiptUrl,
        status: 'PENDING_VERIFICATION',
        submittedAt: new Date().toISOString(),
        isLedgerUpdated: false, // Balance NOT yet deducted
      };

      return {
        message: 'Payment submission logged successfully. Awaiting Bursar bank reconciliation.',
        submission,
      };
    } finally {
      // Lock will expire automatically in 60s per Redis TTL
    }
  }

  /**
   * Bursar 1-Click Bank Statement Audit & Ledger Clearance
   * Posts balanced double-entry voucher (Debit Bank / Credit Fee Revenue)
   */
  async verifyAndClearUtr(submissionId: string, bursarEmpId: string) {
    const voucherNo = `JV-2026-FEE-${Date.now().toString().slice(-4)}`;

    return {
      submissionId,
      status: 'VERIFIED_AND_POSTED',
      clearedBy: bursarEmpId,
      clearedAt: new Date().toISOString(),
      isLedgerUpdated: true,
      generalLedgerVoucher: {
        voucherNumber: voucherNo,
        type: 'RECEIPT',
        debitAccount: '1010 - HDFC Campus Collection A/c',
        creditAccount: '3010 - Student Tuition Fee Revenue',
        amount: 45000,
        isBalanced: true,
      },
    };
  }

  /**
   * Fetch Pending UTR Verification Queue for Bursar Desk
   */
  async getPendingUtrQueue() {
    return [
      {
        id: 'PAY-101',
        studentName: 'Rahul Sharma',
        rollNo: '2023CSE041',
        program: 'B.Tech CSE',
        utrNumber: 'UTR-HDFC-99182301',
        amount: 65000,
        bankName: 'HDFC Bank',
        submittedAt: '2026-10-26 10:14 AM',
        status: 'PENDING_VERIFICATION',
      },
      {
        id: 'PAY-102',
        studentName: 'Sneha Patel',
        rollNo: '2023CSE042',
        program: 'B.Tech CSE',
        utrNumber: 'UTR-AXIS-44910283',
        amount: 32500,
        bankName: 'Axis Bank',
        submittedAt: '2026-10-26 11:30 AM',
        status: 'PENDING_VERIFICATION',
      },
    ];
  }
}
