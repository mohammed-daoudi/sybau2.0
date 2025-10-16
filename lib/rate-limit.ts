import LRUCache from 'lru-cache';
import { NextRequest } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const cache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
    updateAgeOnGet: true,
    updateAgeOnHas: true,
  });

  return {
    check: (req: NextRequest, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = cache.get(token) || [0];
        if (tokenCount[0] === 0) {
          cache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          cache.set(token, tokenCount);
        }

        if (tokenCount[0] > limit) {
          reject(new Error('Rate limit exceeded'));
        } else {
          resolve();
        }
      }),
  };
}