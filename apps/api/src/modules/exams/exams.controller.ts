import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExamsService } from './exams.service';

@ApiTags('Module 04: Exams & Grade Moderation')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get('moderation-curve')
  @ApiOperation({ summary: 'Dual-Signoff Moderation: View statistical grade curve & class averages' })
  async getDistribution(@Query('courseCode') courseCode = 'CS601') {
    return this.examsService.getGradeDistribution(courseCode);
  }

  @Post('moderate')
  @ApiOperation({ summary: 'HOD Moderation signoff with audit notes' })
  async moderate(
    @Body()
    body: {
      courseCode: string;
      reason: string;
      graceDelta: number;
    }
  ) {
    return this.examsService.moderateMarks(body.courseCode, body.reason, body.graceDelta);
  }

  @Post('lock-publish')
  @ApiOperation({ summary: 'Exam Controller final cryptographic lock & SGPA snapshot publication' })
  async lockPublish(
    @Body()
    body: {
      courseCode: string;
      signature: string;
    }
  ) {
    return this.examsService.lockAndPublish(body.courseCode, body.signature);
  }
}
