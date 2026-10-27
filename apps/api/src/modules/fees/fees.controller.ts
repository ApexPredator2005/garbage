import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FeesService } from './fees.service';

@ApiTags('Module 05: Fees & Double-Entry Accounting')
@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('pending-utrs')
  @ApiOperation({ summary: 'Two-Step Verification Desk: Query pending manual UTR payment queue' })
  async getPendingQueue() {
    return this.feesService.getPendingUtrQueue();
  }

  @Post('submit-utr')
  @ApiOperation({ summary: 'Submit manual bank transfer UTR with Redis strict idempotency lock (60s)' })
  async submitUtr(
    @Body()
    body: {
      studentId: string;
      feeDemandId: string;
      utrNumber: string;
      amount: number;
      bankName: string;
      receiptUrl: string;
      idempotencyKey: string;
    }
  ) {
    return this.feesService.submitManualUtrPayment(
      body.studentId,
      body.feeDemandId,
      body.utrNumber,
      body.amount,
      body.bankName,
      body.receiptUrl,
      body.idempotencyKey
    );
  }

  @Post('verify-utr/:id')
  @ApiOperation({ summary: 'Bursar 1-click bank reconciliation & double-entry voucher posting' })
  async verifyUtr(
    @Param('id') submissionId: string,
    @Body() body: { bursarEmpId: string }
  ) {
    return this.feesService.verifyAndClearUtr(submissionId, body.bursarEmpId);
  }
}
