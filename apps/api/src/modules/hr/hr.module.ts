import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { PrismaService } from '../../platform/prisma.service';

@Module({
  controllers: [HrController],
  providers: [HrService, PrismaService],
  exports: [HrService],
})
export class HrModule {}
