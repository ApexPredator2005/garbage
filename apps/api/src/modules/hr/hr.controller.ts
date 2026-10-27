import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HrService } from './hr.service';

@ApiTags('Module 06: HR & Payroll Lifecycle')
@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('payroll-sheet')
  @ApiOperation({ summary: 'Calculate monthly payroll sheet with deterministic formula engine' })
  async getPayrollSheet(@Query('month') month = '2026-10') {
    return this.hrService.getStaffPayrollSheet(month);
  }

  @Post('advance-cycle')
  @ApiOperation({ summary: '3-Stage State Machine: Advance payroll cycle to APPROVED or LOCKED' })
  async advanceCycle(
    @Body()
    body: {
      cycleMonth: string;
      targetState: 'APPROVED' | 'LOCKED';
      signatory: string;
    }
  ) {
    return this.hrService.advancePayrollCycle(body.cycleMonth, body.targetState, body.signatory);
  }
}
