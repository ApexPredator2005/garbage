import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { PrismaService } from '../../platform/prisma.service';
import { RedisService } from '../../platform/redis.service';

@Module({
  controllers: [FeesController],
  providers: [FeesService, PrismaService, RedisService],
  exports: [FeesService],
})
export class FeesModule {}
