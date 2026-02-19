import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BREAKPOINTS, useMediaQuery } from '../../src/hooks/media-query';

describe('useMediaQuery', () => {
  const mockMatchMedia = vi.fn();
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
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

  describe('exports', () => {
    it('should export BREAKPOINTS with correct values', () => {
      expect(BREAKPOINTS).toEqual({
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      });
    });
  });

  describe('string query (single)', () => {
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

    it('should convert sm breakpoint to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('sm'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 640px)');
    });

    it('should convert md breakpoint to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('md'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });

    it('should convert lg breakpoint to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('lg'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });

    it('should convert xl breakpoint to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('xl'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1280px)');
    });

    it('should convert 2xl breakpoint to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('2xl'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1536px)');
    });
  });

  describe('max-* breakpoints', () => {
    it('should convert max-sm to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('max-sm'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 639px)');
    });

    it('should convert max-md to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('max-md'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    });

    it('should convert max-lg to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('max-lg'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1023px)');
    });

    it('should convert max-xl to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('max-xl'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1279px)');
    });

    it('should convert max-2xl to correct query', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => useMediaQuery('max-2xl'));
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1535px)');
    });
  });

  describe('array queries (AND logic)', () => {
    it('should return true when all queries match', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 768px)' || query === '(max-width: 1023px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery(['md', 'max-lg']));
      expect(result.current).toBe(true);
    });

    it('should return false when any query does not match', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 768px)', // md matches, max-lg doesn't
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery(['md', 'max-lg']));
      expect(result.current).toBe(false);
    });

    it('should handle breakpoint and custom queries separately', () => {
      const mockFn = vi.fn((query: string) => ({
        matches: query === '(min-width: 640px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      mockMatchMedia.mockImplementation(mockFn);

      const { result } = renderHook(() =>
        useMediaQuery(['sm', '(prefers-color-scheme: dark)']),
      );

      // sm matches but prefers-color-scheme doesn't
      expect(result.current).toBe(false);
    });

    it('should handle range queries (tablet: >=md && <lg)', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 768px)' || query === '(max-width: 1023px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery(['md', 'max-lg']));
      expect(result.current).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1023px)');
    });

    it('should work with single-item array', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery(['md']));
      expect(result.current).toBe(true);
    });

    it('should handle multiple max-* breakpoints', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches:
          query === '(max-width: 1023px)' || query === '(max-width: 1279px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery(['max-lg', 'max-xl']));
      expect(result.current).toBe(true);
    });

    it('should handle empty array (vacuous truth)', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery([]));
      expect(result.current).toBe(true);
    });
  });

  describe('custom media queries', () => {
    it('should handle prefers-color-scheme: dark', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(prefers-color-scheme: dark)'),
      );
      expect(result.current).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)',
      );
    });

    it('should handle prefers-color-scheme: light', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(prefers-color-scheme: light)'),
      );
      expect(result.current).toBe(false);
    });

    it('should handle orientation: portrait', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(orientation: portrait)'),
      );
      expect(result.current).toBe(true);
    });

    it('should handle orientation: landscape', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(orientation: landscape)'),
      );
      expect(result.current).toBe(false);
    });

    it('should handle prefers-reduced-motion: reduce', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(prefers-reduced-motion: reduce)'),
      );
      expect(result.current).toBe(true);
    });

    it('should handle prefers-reduced-motion: no-preference', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(prefers-reduced-motion: no-preference)'),
      );
      expect(result.current).toBe(false);
    });

    it('should handle complex custom queries', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery('(min-width: 500px) and (max-width: 800px)'),
      );
      expect(result.current).toBe(true);
    });

    it('should handle pointer queries', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery('(pointer: coarse)'));
      expect(result.current).toBe(true);
    });

    it('should handle hover queries', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery('(hover: none)'));
      expect(result.current).toBe(false);
    });
  });

  describe('mapper object', () => {
    it('should return DEFAULT when no breakpoints match', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery({ DEFAULT: 'fallback', sm: 'small' }),
      );

      expect(result.current).toBe('fallback');
    });

    it('should return correct breakpoint value when matches', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          sm: 'small',
          md: 'medium',
          lg: 'large',
        }),
      );

      expect(result.current).toBe('medium');
    });

    it('should return first matching breakpoint in config order', () => {
      // If both sm and md breakpoints match, md should win because:
      // In config order: 2xl > xl > lg > md > sm > max-*
      // So md is checked before sm
      mockMatchMedia.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 640px)' || query === '(min-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          sm: 'small',
          md: 'medium',
          lg: 'large',
        }),
      );

      // md (768px) comes before sm (640px) in the config, so md matches first
      expect(result.current).toBe('medium');
    });

    it('should handle mixed value types', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery<string | number | boolean>({
          DEFAULT: 'base',
          sm: 123,
          md: true,
        }),
      );

      expect(result.current).toBe(true);
    });

    it('should handle partial breakpoint definitions', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1536px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          '2xl': 'extra-large',
        }),
      );

      expect(result.current).toBe('extra-large');
    });

    it('should work with max-* breakpoints in mapper', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(max-width: 767px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'desktop',
          'max-md': 'mobile',
        }),
      );

      expect(result.current).toBe('mobile');
    });

    it('should handle all undefined breakpoints except DEFAULT', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'fallback',
        }),
      );

      expect(result.current).toBe('fallback');
    });

    it('should handle only max-* breakpoints defined', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(max-width: 639px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'default',
          'max-sm': 'mobile',
        }),
      );

      expect(result.current).toBe('mobile');
    });

    it('should handle React elements as values', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const mobileEl = React.createElement('div', { key: 'mobile' }, 'Mobile');
      const desktopEl = React.createElement(
        'div',
        { key: 'desktop' },
        'Desktop',
      );

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: mobileEl,
          lg: desktopEl,
        }),
      );

      // Should return the desktop element when lg matches
      expect(result.current).toBe(desktopEl);
    });

    it('should handle all breakpoints defined', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1536px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'default',
          sm: 'small',
          md: 'medium',
          lg: 'large',
          xl: 'extra-large',
          '2xl': 'huge',
          'max-sm': 'tiny',
          'max-md': 'mobile',
          'max-lg': 'tablet',
          'max-xl': 'desktop',
          'max-2xl': 'wide',
        }),
      );

      // 2xl should win (highest priority)
      expect(result.current).toBe('huge');
    });
  });

  describe('event listeners', () => {
    it('should update when breakpoint changes', async () => {
      let mdMatches = false;
      const listeners: Array<() => void> = [];

      mockMatchMedia.mockImplementation((query: string) => {
        const isMd = query === '(min-width: 768px)';
        return {
          get matches() {
            return isMd ? mdMatches : false;
          },
          addEventListener: vi.fn((event, listener) => {
            if (isMd && event === 'change') {
              listeners.push(listener);
            }
          }),
          removeEventListener: vi.fn(),
        };
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          md: 'medium',
        }),
      );

      expect(result.current).toBe('base');

      mdMatches = true;
      act(() => {
        listeners.forEach((listener) => listener());
      });

      await waitFor(() => {
        expect(result.current).toBe('medium');
      });
    });

    it('should handle multiple breakpoint changes', async () => {
      let matches: Record<string, boolean> = {
        '(min-width: 640px)': false,
        '(min-width: 768px)': false,
        '(min-width: 1024px)': false,
      };
      const listeners: Array<() => void> = [];

      mockMatchMedia.mockImplementation((query: string) => {
        return {
          get matches() {
            return matches[query] ?? false;
          },
          addEventListener: vi.fn((event, listener) => {
            if (event === 'change') {
              listeners.push(listener);
            }
          }),
          removeEventListener: vi.fn(),
        };
      });

      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'default',
          sm: 'small',
          md: 'medium',
          lg: 'large',
        }),
      );

      expect(result.current).toBe('default');

      // Change to sm
      matches = {
        '(min-width: 640px)': true,
        '(min-width: 768px)': false,
        '(min-width: 1024px)': false,
      };
      act(() => {
        listeners.forEach((listener) => listener());
      });
      await waitFor(() => expect(result.current).toBe('small'));

      // Change to md
      matches = {
        '(min-width: 640px)': true,
        '(min-width: 768px)': true,
        '(min-width: 1024px)': false,
      };
      act(() => {
        listeners.forEach((listener) => listener());
      });
      await waitFor(() => expect(result.current).toBe('medium'));

      // Change to lg
      matches = {
        '(min-width: 640px)': true,
        '(min-width: 768px)': true,
        '(min-width: 1024px)': true,
      };
      act(() => {
        listeners.forEach((listener) => listener());
      });
      await waitFor(() => expect(result.current).toBe('large'));
    });

    it('should register listeners for all defined breakpoints', () => {
      const addEventListener = vi.fn();

      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener: vi.fn(),
      });

      renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
          sm: 'small',
          md: 'medium',
        }),
      );

      // Should register listeners for sm and md
      expect(addEventListener).toHaveBeenCalledTimes(2);
    });

    it('should not register listeners when no breakpoints defined', () => {
      const addEventListener = vi.fn();

      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener: vi.fn(),
      });

      renderHook(() =>
        useMediaQuery({
          DEFAULT: 'base',
        }),
      );

      expect(addEventListener).not.toHaveBeenCalled();
    });
  });

  describe('re-renders', () => {
    it('should maintain stable value across re-renders', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result, rerender } = renderHook(() => useMediaQuery('md'));

      const firstValue = result.current;
      rerender();
      const secondValue = result.current;

      expect(firstValue).toBe(secondValue);
    });

    it('should not re-subscribe on re-render with same query', () => {
      const addEventListener = vi.fn();
      const removeEventListener = vi.fn();

      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener,
      });

      const { rerender } = renderHook(() => useMediaQuery('md'));

      const initialCallCount = addEventListener.mock.calls.length;
      rerender();

      // Should not add new listeners on re-render
      expect(addEventListener).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should handle changing query prop', async () => {
      const mockFn = vi.fn((query: string) => ({
        matches: query === '(min-width: 1024px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      mockMatchMedia.mockImplementation(mockFn);

      const { result, rerender } = renderHook(
        ({ query }: { query: 'md' | 'lg' }) => useMediaQuery(query),
        {
          initialProps: { query: 'md' },
        },
      );

      expect(result.current).toBe(false);

      rerender({ query: 'lg' });

      // Wait for effect to run
      await waitFor(() => expect(result.current).toBe(true));
    });
  });

  describe('performance', () => {
    it('should not re-create query strings on every render', () => {
      const matchMediaSpy = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      window.matchMedia = matchMediaSpy;

      const { rerender } = renderHook(() => useMediaQuery('md'));

      const initialCallCount = matchMediaSpy.mock.calls.length;
      rerender();
      rerender();
      rerender();

      // Should not call matchMedia again for same query
      expect(matchMediaSpy).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should memoize entries for mapper object', () => {
      const matchMediaSpy = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      window.matchMedia = matchMediaSpy;

      const map = { DEFAULT: 'base', sm: 'small', md: 'medium' };

      const { rerender } = renderHook(() => useMediaQuery(map));

      // Initial calls include state initialization
      const callsAfterInitial = matchMediaSpy.mock.calls.length;

      rerender();

      // Should not re-process entries on re-render with same map
      expect(matchMediaSpy.mock.calls.length).toBe(callsAfterInitial);
    });
  });

  describe('type safety', () => {
    it('should accept valid breakpoint strings', () => {
      // These should not cause TypeScript errors
      const { result: r1 } = renderHook(() => useMediaQuery('sm'));
      const { result: r2 } = renderHook(() => useMediaQuery('max-lg'));
      const { result: r3 } = renderHook(() => useMediaQuery('(custom: query)'));

      expect(typeof r1.current).toBe('boolean');
      expect(typeof r2.current).toBe('boolean');
      expect(typeof r3.current).toBe('boolean');
    });

    it('should accept valid breakpoint arrays', () => {
      const { result } = renderHook(() =>
        useMediaQuery(['sm', 'max-lg', '(custom: query)']),
      );

      expect(typeof result.current).toBe('boolean');
    });

    it('should accept valid mapper objects', () => {
      const { result } = renderHook(() =>
        useMediaQuery({
          DEFAULT: 'default',
          sm: 'small',
          'max-md': 'mobile',
        }),
      );

      expect(typeof result.current).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle concurrent mode safely', () => {
      // React 18 concurrent mode might invoke effects multiple times
      const addEventListener = vi.fn();
      const removeEventListener = vi.fn();

      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener,
      });

      // Render and unmount multiple times to simulate strict mode
      for (let i = 0; i < 3; i++) {
        const { unmount } = renderHook(() => useMediaQuery('md'));
        unmount();
      }

      // Should have equal add and remove calls
      expect(addEventListener.mock.calls.length).toBe(
        removeEventListener.mock.calls.length,
      );
    });

    it('should handle values of different types correctly', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 640px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result: r1 } = renderHook(() =>
        useMediaQuery({ DEFAULT: 0, sm: 1 }),
      );
      expect(r1.current).toBe(1);

      const { result: r2 } = renderHook(() =>
        useMediaQuery({ DEFAULT: null as any, sm: { data: true } }),
      );
      expect(r2.current).toEqual({ data: true });

      const { result: r3 } = renderHook(() =>
        useMediaQuery({ DEFAULT: [] as string[], sm: ['item'] }),
      );
      expect(r3.current).toEqual(['item']);
    });

    it('should handle adding listeners that throw', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: () => {
          throw new Error('addEventListener failed');
        },
        removeEventListener: vi.fn(),
      });

      // Should not throw
      expect(() => {
        renderHook(() => useMediaQuery('md'));
      }).not.toThrow();
    });
  });
});
