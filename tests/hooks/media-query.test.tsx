import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from '../../src/hooks/media-query';

describe('useMediaQuery', () => {
  // Mock window.matchMedia
  const mockMatchMedia = vi.fn();
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = mockMatchMedia;
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  describe('string query', () => {
    it('should return boolean for media query string', () => {
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(typeof result.current).toBe('boolean');
    });

    it('should return true when breakpoint matches', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery('md'));

      expect(result.current).toBe(true);
    });

    it('should return false when breakpoint does not match', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery('lg'));

      expect(result.current).toBe(false);
    });
  });

  describe('mapper object', () => {
    it('should return DEFAULT when no breakpoints match', () => {
      // Mock window.matchMedia to return false for all breakpoints
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery({ DEFAULT: 'fallback', sm: 'small' }),
      );

      expect(result.current).toBe('fallback');
    });

    it('should return correct breakpoint value when matches (mobile-first)', () => {
      // Mock md breakpoint (768px) matches
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(min-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          sm: 'small',
          md: 'medium',
          lg: 'large',
        }),
      );

      // Mobile-first: md (768px) matches, so return 'medium'
      expect(result.current).toBe('medium');
    });

    it('should return largest matching breakpoint (mobile-first)', () => {
      // Mock multiple breakpoints match (sm and md)
      const mockMatchMedia = vi.fn((query: string) => ({
        matches:
          query === '(min-width: 640px)' || query === '(min-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          sm: 'small',
          md: 'medium',
          lg: 'large',
        }),
      );

      // Should return 'medium' (largest matching)
      expect(result.current).toBe('medium');
    });

    it('should handle mixed value types', () => {
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(min-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery<string | number | boolean>({
          DEFAULT: 'base',
          sm: 123,
          md: true,
        }),
      );

      expect(result.current).toBe(true);
    });

    it('should update value when breakpoint changes', async () => {
      // Store the current match state
      const mdMatches = { current: false };
      const listeners: Array<() => void> = [];

      const mockMatchMedia = vi.fn((query: string) => {
        const isMd = query === '(min-width: 768px)';
        return {
          get matches() {
            return isMd ? mdMatches.current : false;
          },
          addEventListener: vi.fn((event, listener) => {
            if (isMd && event === 'change') {
              listeners.push(listener);
            }
          }),
          removeEventListener: vi.fn(),
        };
      });

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          md: 'medium',
        }),
      );

      expect(result.current).toBe('base');

      // Simulate breakpoint match by changing the ref value
      mdMatches.current = true;
      // Trigger the change event
      listeners.forEach((listener) => listener());

      // Wait for React to process the state update
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(result.current).toBe('medium');
    });

    it('should handle partial breakpoint definitions', () => {
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(min-width: 1536px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          '2xl': 'extra-large', // Only 2xl defined, skipping md/lg/xl
        }),
      );

      expect(result.current).toBe('extra-large');
    });
  });
});
