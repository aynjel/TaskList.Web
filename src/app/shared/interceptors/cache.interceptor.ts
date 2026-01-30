import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const API_URL_TO_INCLUDE_IN_CACHE = {
  tasks: '/Tasks',
};

const cache = new Map<string, HttpEvent<any>>();
const cacheInvalidationPatterns: Record<string, string[]> = {
  tasks: [API_URL_TO_INCLUDE_IN_CACHE.tasks],
};

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
  if (url.includes(API_URL_TO_INCLUDE_IN_CACHE.tasks)) {
    return cacheInvalidationPatterns['tasks'];
  }
  return [];
};

// Export function to manually clear cache (for logout, session expiry, etc.)
export const clearCache = (): void => {
  cache.clear();
  console.log('[Cache] Manually cleared all cache');
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
    tap({
      next: (event) => {
        // Only cache successful GET responses
        if (req.method === 'GET' && event instanceof HttpResponse && event.ok) {
          console.log('[Cache] Caching GET response for:', req.urlWithParams);
          cache.set(req.urlWithParams, event);
        }
      },
      error: () => {
        // Don't cache errors - ensure this request won't be cached
        cache.delete(req.urlWithParams);
      },
    }),
  );
};
