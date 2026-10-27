import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';
import { PrismaService } from '../../platform/prisma.service';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService, PrismaService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
