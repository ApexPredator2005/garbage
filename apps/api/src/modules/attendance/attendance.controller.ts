import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AttendanceService, BulkAttendanceItem } from './attendance.service';

@ApiTags('Module 02: Attendance & Condonation')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('bulk-flush')
  @ApiOperation({ summary: 'Submit fast 40-student single array attendance (<15ms payload)' })
  async recordBulk(
    @Body()
    body: {
      courseOfferingId: string;
      periodNumber: number;
      records: BulkAttendanceItem[];
    },
    @Headers('x-tenant-id') tenantId?: string
  ) {
    return this.attendanceService.recordBulkAttendance(
      body.courseOfferingId,
      body.periodNumber,
      body.records,
      tenantId
    );
  }

  @Get('exam-eligibility/:studentId')
  @ApiOperation({ summary: 'Query 75% statutory hall ticket eligibility status' })
  async checkEligibility(@Param('studentId') studentId: string) {
    return this.attendanceService.checkExamEligibility(studentId);
  }

  @Post('condonation')
  @ApiOperation({ summary: 'Submit medical condonation request with ₹500 fee UTR receipt' })
  async applyCondonation(
    @Body()
    body: {
      studentId: string;
      certRef: string;
      feeUtr: string;
      claimedSessions: number;
    }
  ) {
    return this.attendanceService.processCondonation(
      body.studentId,
      body.certRef,
      body.feeUtr,
      body.claimedSessions
    );
  }

  @Post('biometric-punch')
  @ApiOperation({ summary: 'Append-only raw hardware turnstile punch event stream' })
  async ingestPunch(
    @Body()
    body: {
      deviceId: string;
      rawTimestamp: string;
      identifier: string;
      ipAddress: string;
    }
  ) {
    return this.attendanceService.ingestBiometricPunch(
      body.deviceId,
      body.rawTimestamp,
      body.identifier,
      body.ipAddress
    );
  }
}
