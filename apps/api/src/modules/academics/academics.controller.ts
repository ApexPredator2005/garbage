import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';

@ApiTags('Module 03: Academics, Timetable & Substitution')
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Fetch CBCS courses and credits' })
  async getCourses(@Query('dept') dept = 'CSE') {
    return this.academicsService.getCourses(dept);
  }

  @Get('substitution/find-candidates')
  @ApiOperation({ summary: 'Smart Substitution Assistant: Collision solver for free teachers in same wing' })
  async findSubstitutes(
    @Query('period') period = '2',
    @Query('day') day = '3',
    @Query('facultyId') facultyId = 'fac-004'
  ) {
    return this.academicsService.findSubstitutes(parseInt(period, 10), parseInt(day, 10), facultyId);
  }

  @Post('substitution/assign')
  @ApiOperation({ summary: '1-Click substitution duty assignment without master timetable mutation' })
  async assignDuty(
    @Body()
    body: {
      timetableSlotId: string;
      substituteFacultyId: string;
      reason: string;
    }
  ) {
    return this.academicsService.assignDuty(
      body.timetableSlotId,
      body.substituteFacultyId,
      body.reason
    );
  }
}
