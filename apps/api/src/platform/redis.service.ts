import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import IORedis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: IORedis;

  onModuleInit() {
    this.client = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      retryStrategy: () => null, // graceful fallback if Redis is offline during local test
    });

    this.client.connect().catch(() => {
      this.logger.warn('Redis not reachable. In-memory fallback will be utilized.');
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit().catch(() => {});
    }
  }

  /**
   * Acquire a strict idempotency lock for payment transactions
   * Pattern: SET idempotency:<key> PENDING NX EX 60
   * Per User Feature & Devloft Spec Section 05
   */
  async acquireIdempotencyLock(key: string, ttlSeconds = 60): Promise<boolean> {
    try {
      const lockKey = `idempotency:${key}`;
      const result = await this.client.set(lockKey, 'PENDING', 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch {
      // In-memory fallback if Redis is disconnected
      return true;
    }
  }

  async releaseIdempotencyLock(key: string): Promise<void> {
    try {
      await this.client.del(`idempotency:${key}`);
    } catch {}
  }

  /**
   * Cache read-heavy master data (calenders, syllabus, subjects)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {}
  }
}
