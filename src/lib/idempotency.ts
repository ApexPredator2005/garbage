/**
 * Idempotency Protection Engine (Upstash Redis / In-Memory Fallback)
 * Prevents duplicate financial transactions and race conditions when users
 * double-click or experience flaky mobile network connections.
 */

interface IdempotencyLockResult<T = any> {
  isDuplicate: boolean;
  cachedResponse?: T;
}

// In-memory fallback map for environments where Redis connection is unconfigured
const memoryLockStore = new Map<string, { expiresAt: number; response?: any }>();

export class IdempotencyGuard {
  private static prefix = "idempotency";

  /**
   * Attempts to acquire an atomic lock for the given idempotency key.
   * If the key was already locked or processed within the TTL, marks as duplicate.
   */
  static async acquireLock<T = any>(
    key: string,
    ttlSeconds = 60
  ): Promise<IdempotencyLockResult<T>> {
    const lockKey = `${this.prefix}:${key}`;
    const now = Date.now();

    // 1. Check if Upstash Redis credentials exist in environment
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      try {
        // Atomic SET lock NX (Only set if Not eXists) with TTL
        const setRes = await fetch(`${redisUrl}/set/${lockKey}/PROCESSING?nx&ex=${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        });
        const setData = await setRes.json();

        // If Redis returns null, the key already exists!
        if (setData.result !== "OK") {
          // Fetch existing cached response
          const getRes = await fetch(`${redisUrl}/get/${lockKey}:response`, {
            headers: { Authorization: `Bearer ${redisToken}` },
          });
          const getData = await getRes.json();
          const cachedResponse = getData.result ? JSON.parse(getData.result) : undefined;

          return {
            isDuplicate: true,
            cachedResponse,
          };
        }

        return { isDuplicate: false };
      } catch (err) {
        console.warn("[Idempotency] Redis unreachable, falling back to memory lock store", err);
      }
    }

    // 2. High-performance In-Memory Fallback
    const existing = memoryLockStore.get(lockKey);
    if (existing && existing.expiresAt > now) {
      return {
        isDuplicate: true,
        cachedResponse: existing.response,
      };
    }

    // Set atomic memory lock
    memoryLockStore.set(lockKey, {
      expiresAt: now + ttlSeconds * 1000,
    });

    return { isDuplicate: false };
  }

  /**
   * Caches the finalized successful API response payload.
   * Subsequent double-clicks within the TTL return this exact payload instantly.
   */
  static async saveResponse<T = any>(
    key: string,
    response: T,
    ttlSeconds = 86400 // 24 hours
  ): Promise<void> {
    const lockKey = `${this.prefix}:${key}`;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      try {
        const payload = encodeURIComponent(JSON.stringify(response));
        await fetch(`${redisUrl}/set/${lockKey}:response/${payload}?ex=${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        });
        return;
      } catch (err) {
        console.warn("[Idempotency] Failed to cache response in Redis", err);
      }
    }

    // In-memory update
    const existing = memoryLockStore.get(lockKey);
    if (existing) {
      existing.response = response;
    }
  }

  /**
   * Releases the lock in case of an application exception,
   * allowing the client to safely retry.
   */
  static async releaseLock(key: string): Promise<void> {
    const lockKey = `${this.prefix}:${key}`;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      try {
        await fetch(`${redisUrl}/del/${lockKey}`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        });
      } catch (err) {
        console.warn("[Idempotency] Failed to release Redis lock", err);
      }
    }

    memoryLockStore.delete(lockKey);
  }
}
