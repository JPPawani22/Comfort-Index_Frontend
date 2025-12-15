import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = environment.cache.ttl;

  set<T>(key: string, data:  T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp:  Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this. cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}