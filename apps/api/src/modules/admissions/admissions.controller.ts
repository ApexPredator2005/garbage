import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';

@ApiTags('Module 01: Admissions & SIS')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Get('merit-list')
  @ApiOperation({ summary: 'Compute deterministic merit ranking for applicant pool' })
  async getMeritList(@Query('programCode') programCode = 'CSE') {
    return this.admissionsService.generateMeritList(programCode);
  }

  @Get('seat-matrix')
  @ApiOperation({ summary: 'Quota Reservation Seat Matrix Visualizer (Open, OBC, SC, ST, EWS, Mgmt)' })
  async getSeatMatrix(@Query('programCode') programCode = 'CSE') {
    return this.admissionsService.getSeatMatrix(programCode);
  }

  @Get('exit-clearance/:studentId')
  @ApiOperation({ summary: 'Check Statutory Student Exit Barrier Guard status' })
  async checkExitClearance(@Param('studentId') studentId: string) {
    return this.admissionsService.verifyExitClearance(studentId);
  }

  @Post('exit-clearance/:studentId/execute')
  @ApiOperation({ summary: 'Execute student permanent exit with mandatory slip verification' })
  async executeExit(
    @Param('studentId') studentId: string,
    @Body() body: { confirmAdmissionNo: string }
  ) {
    return this.admissionsService.executeStudentExit(studentId, body.confirmAdmissionNo);
  }

  @Post('alumni/push-digilocker')
  @ApiOperation({ summary: 'Alumni Transition & Permanent DigiLocker / NAD Integration' })
  async pushToDigiLocker(
    @Body()
    body: {
      studentId: string;
      degreeRegNo: string;
    }
  ) {
    return this.admissionsService.pushDegreeToDigiLocker(body.studentId, body.degreeRegNo);
  }

  @Get('guardian-wards')
  @ApiOperation({ summary: 'Retrieve mapped wards for single-parent sibling hub' })
  async getGuardianWards(@Query('email') email = 'parent@example.com') {
    return this.admissionsService.getGuardianWards(email);
  }
}
