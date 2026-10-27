import { Module } from '@nestjs/common';
import { PrismaService } from './platform/prisma.service';
import { RedisService } from './platform/redis.service';
import { TenancyGuard } from './platform/tenancy.guard';
import { AuthModule } from './modules/auth/auth.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AcademicsModule } from './modules/academics/academics.module';
import { ExamsModule } from './modules/exams/exams.module';
import { FeesModule } from './modules/fees/fees.module';
import { HrModule } from './modules/hr/hr.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    AuthModule,
    AdmissionsModule,
    AttendanceModule,
    AcademicsModule,
    ExamsModule,
    FeesModule,
    HrModule,
    CommunicationModule,
    ReportsModule,
  ],
  providers: [PrismaService, RedisService, TenancyGuard],
  exports: [PrismaService, RedisService, TenancyGuard],
})
export class AppModule {}
