declare module 'lru-cache' {
  export interface LRUCacheOptions<K = any, V = any> {
    max?: number;
    ttl?: number;
    updateAgeOnGet?: boolean;
    updateAgeOnHas?: boolean;
  }

  export class LRUCache<K = any, V = any> {
    constructor(options?: LRUCacheOptions<K, V>);
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
  }
}