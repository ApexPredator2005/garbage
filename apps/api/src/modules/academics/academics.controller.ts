import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';

@ApiTags('Module 03: Academics, Timetable & Learning Space')
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('regulations')
  @ApiOperation({ summary: '1. Structure: Fetch Academic Regulations and degree credit frameworks' })
  async getRegulations() {
    return this.academicsService.getRegulations();
  }

  @Get('courses')
  @ApiOperation({ summary: '2. Courses: Fetch CBCS course catalog with L-T-P and CO-PO mapping' })
  async getCourses(@Query('dept') dept = 'CSE') {
    return this.academicsService.getCourses(dept);
  }

  @Get('registrations')
  @ApiOperation({ summary: '3. Registration: Fetch student CBCS course registrations' })
  async getRegistrations(@Query('semester') semester = '4') {
    return this.academicsService.getRegistrations(parseInt(semester, 10));
  }

  @Post('registrations/:id/approve')
  @ApiOperation({ summary: '3. Registration: Advisor / HOD approval of registered courses' })
  async approveRegistration(@Param('id') id: string, @Body() body: { advisorRemarks?: string }) {
    return this.academicsService.approveRegistration(id, body?.advisorRemarks);
  }

  @Get('workloads')
  @ApiOperation({ summary: '4. Allocation: Fetch faculty workload balancing matrix' })
  async getWorkloads() {
    return this.academicsService.getWorkloads();
  }

  @Post('timetables/generate')
  @ApiOperation({ summary: '5. Timetable: 1-Click constraint-satisfaction schedule solver' })
  async generateTimetable(@Body() body: { semester: number; section: string }) {
    return this.academicsService.generateTimetable(body.semester, body.section);
  }

  @Post('timetables/publish')
  @ApiOperation({ summary: '5. Timetable: Publish schedule and notify students & faculty' })
  async publishTimetable(@Body() body: { semester: number; section: string }) {
    return this.academicsService.publishTimetable(body.semester, body.section);
  }

  @Get('substitution/find-candidates')
  @ApiOperation({ summary: '5. Timetable: Smart Substitution collision engine for free teachers' })
  async findSubstitutes(
    @Query('period') period = '2',
    @Query('day') day = '3',
    @Query('facultyId') facultyId = 'fac-004'
  ) {
    return this.academicsService.findSubstitutes(parseInt(period, 10), parseInt(day, 10), facultyId);
  }

  @Post('substitution/assign')
  @ApiOperation({ summary: '5. Timetable: 1-Click substitution duty assignment' })
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

  @Get('calendar')
  @ApiOperation({ summary: '6. Calendar: Academic calendar and statutory 90-day tracker' })
  async getCalendar() {
    return this.academicsService.getCalendar();
  }

  @Post('teaching-records/diary')
  @ApiOperation({ summary: '7. Teaching Records: Log daily lecture session in Course Diary' })
  async logCourseDiary(
    @Body()
    body: {
      courseCode: string;
      period: number;
      topicCovered: string;
      attendanceCount: number;
    }
  ) {
    return this.academicsService.logCourseDiary(body);
  }

  @Get('mentoring/mentees')
  @ApiOperation({ summary: '8. Mentoring: Fetch assigned mentee cohort for faculty proctor' })
  async getMentoringMentees(@Query('facultyId') facultyId = 'fac-101') {
    return this.academicsService.getMentoringMentees(facultyId);
  }

  @Get('lms/materials')
  @ApiOperation({ summary: '9. LMS: Fetch study materials and lecture slide decks' })
  async getLmsMaterials(@Query('courseCode') courseCode = 'CS401') {
    return this.academicsService.getLmsMaterials(courseCode);
  }

  @Get('lms/assignments')
  @ApiOperation({ summary: '9. LMS: Fetch course assignments and submission deadlines' })
  async getLmsAssignments(@Query('courseCode') courseCode = 'CS401') {
    return this.academicsService.getLmsAssignments(courseCode);
  }
}
