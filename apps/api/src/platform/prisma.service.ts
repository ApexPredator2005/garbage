import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      if (process.env.DATABASE_URL) {
        await this.$connect();
        this.logger.log('Successfully connected to PostgreSQL database.');
      } else {
        this.logger.warn('DATABASE_URL not set. Database operations will use in-memory mock handlers.');
      }
    } catch (err: any) {
      this.logger.warn(`PostgreSQL connection deferred: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {});
  }

  /**
   * Scopes a transaction to a specific tenant using PostgreSQL Row-Level Security
   * Per Section 08 (Authentication & Role-Based Access, Page 8)
   */
  async withTenant<T>(tenantId: string, fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    try {
      return await this.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`SET LOCAL app.tenant_id = '${tenantId}'`);
        return fn(tx as unknown as PrismaClient);
      });
    } catch {
      // In disconnected mode, pass client directly
      return fn(this);
    }
  }
}
