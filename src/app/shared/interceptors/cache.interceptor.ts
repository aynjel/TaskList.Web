import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<any>>();
const cacheInvalidationPatterns: Record<string, string[]> = {};

const invalidateCache = (patterns: string[]): void => {
  const keysToDelete: string[] = [];

  cache.forEach((_, key) => {
    if (patterns.some((pattern) => key.includes(pattern))) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => cache.delete(key));
};

const getCacheInvalidationPatterns = (url: string): string[] => {
  if (url.includes('/example-endpoint')) {
    return cacheInvalidationPatterns['example-key'] || [];
  }
  return [];
};

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.urlWithParams);
    if (cachedResponse) {
      console.log('[Cache] Returning cached response for:', req.urlWithParams);
      return of(cachedResponse);
    }
  }

  if (req.method !== 'GET') {
    const patternsToInvalidate = getCacheInvalidationPatterns(req.url);
    if (patternsToInvalidate.length > 0) {
      console.log('[Cache] Invalidating cache patterns:', patternsToInvalidate);
      invalidateCache(patternsToInvalidate);
    }
  }

  return next(req).pipe(
    tap((event) => {
      if (req.method === 'GET' && event instanceof HttpResponse) {
        console.log('[Cache] Caching GET response for:', req.urlWithParams);
        cache.set(req.urlWithParams, event);
      }
    }),
  );
};
