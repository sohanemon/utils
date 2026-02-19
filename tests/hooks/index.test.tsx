import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useClickOutside,
  useDebounce,
  useEffectOnce,
  useIntersection,
  useIsAtTop,
  useIsClient,
  useIsomorphicEffect,
  useIsScrolling,
  useLocalStorage,
  useLockScroll,
  useQuerySelector,
  useSessionStorage,
  useTimeout,
  useUpdateEffect,
} from '../../src/hooks';

describe('hooks/index', () => {
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

    // Mock requestIdleCallback
    (global as any).requestIdleCallback = vi.fn((cb) => {
      setTimeout(cb, 0);
      return 1;
    });
    (global as any).cancelIdleCallback = vi.fn();

    // Mock sessionStorage and localStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  describe('useClickOutside', () => {
    it('should call callback when clicking outside', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useClickOutside(callback));

      // Create element and attach ref
      const element = document.createElement('div');
      result.current.current = element;
      document.body.appendChild(element);

      // Simulate click outside
      act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(element);
    });

    it('should handle touch events', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useClickOutside(callback));

      // Create element and attach ref
      const element = document.createElement('div');
      result.current.current = element;
      document.body.appendChild(element);

      act(() => {
        document.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(element);
    });

    it('should not call callback when clicking inside', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useClickOutside(callback));

      // Create element and attach ref
      const element = document.createElement('div');
      result.current.current = element;
      document.body.appendChild(element);

      // Simulate click inside
      act(() => {
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(element);
    });

    it('should handle null ref', () => {
      const callback = vi.fn();

      renderHook(() => useClickOutside(callback));

      // With no ref attached, clicking should not trigger callback
      act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('useIsomorphicEffect', () => {
    it('should work like useEffect', () => {
      const effect = vi.fn();

      renderHook(() => useIsomorphicEffect(effect, []));

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useSessionStorage', () => {
    it('should return initial value', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const { result } = renderHook(() =>
        useSessionStorage('key', { value: 'default' }),
      );

      expect(result.current[0]).toEqual({ value: 'default' });

      vi.restoreAllMocks();
    });
  });

  describe('useLocalStorage', () => {
    it('should return initial value', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('key', { value: 'default' }),
      );

      expect(result.current[0]).toEqual({ value: 'default' });

      vi.restoreAllMocks();
    });
  });

  describe('useQuerySelector', () => {
    it('should return null when element not found', () => {
      const { result } = renderHook(() => useQuerySelector('.nonexistent'));

      expect(result.current).toBeNull();
    });

    it('should work with ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      const { result } = renderHook(() => useQuerySelector(ref));

      expect(result.current).toBeNull();
    });
  });

  describe('useIsScrolling', () => {
    it('should return object with isScrolling', () => {
      const { result } = renderHook(() => useIsScrolling());

      expect(result.current).toHaveProperty('isScrolling');
      expect(typeof result.current.isScrolling).toBe('boolean');
    });
  });

  describe('useIsAtTop', () => {
    it('should return object with isAtTop', () => {
      const { result } = renderHook(() => useIsAtTop());

      expect(result.current).toHaveProperty('isAtTop');
      expect(typeof result.current.isAtTop).toBe('boolean');
    });
  });

  describe('useIntersection', () => {
    it('should return intersection state', () => {
      const { result } = renderHook(() => useIntersection({}));

      expect(typeof result.current.isIntersecting).toBe('boolean');
    });
  });

  describe('useDebounce', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('test', 100));

      expect(result.current).toBe('test');
    });

    it('should debounce value changes', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } },
      );

      // Initial value
      expect(result.current).toBe('initial');

      // Change value
      rerender({ value: 'changed', delay: 100 });

      // Should still be old value immediately
      expect(result.current).toBe('initial');

      // Wait for debounce to complete
      await waitFor(
        () => {
          expect(result.current).toBe('changed');
        },
        { timeout: 200 },
      );
    });

    it('should handle rapid changes', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 'first' } },
      );

      rerender({ value: 'second' });
      rerender({ value: 'third' });

      // Should eventually settle on the last value
      await waitFor(
        () => {
          expect(result.current).toBe('third');
        },
        { timeout: 300 },
      );
    });
  });

  describe('useTimeout', () => {
    it('should call callback after delay', () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      renderHook(() => useTimeout(callback, 1000));

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);

      expect(callback).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it('should handle null delay', () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      renderHook(() => useTimeout(callback, null));

      vi.advanceTimersByTime(1000);

      expect(callback).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('should update callback ref', () => {
      vi.useFakeTimers();
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const { rerender } = renderHook(
        ({ callback }) => useTimeout(callback, 1000),
        { initialProps: { callback: callback1 } },
      );

      rerender({ callback: callback2 });

      vi.advanceTimersByTime(1000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('useEffectOnce', () => {
    it('should call effect only once', () => {
      const effect = vi.fn();

      const { rerender } = renderHook(() => useEffectOnce(effect));

      expect(effect).toHaveBeenCalledTimes(1);

      rerender();

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useUpdateEffect', () => {
    it('should not call effect on initial render', () => {
      const effect = vi.fn();

      renderHook(() => useUpdateEffect(effect, []));

      expect(effect).not.toHaveBeenCalled();
    });

    it('should call effect on dependency changes', () => {
      const effect = vi.fn();

      const { rerender } = renderHook(
        ({ dep }) => useUpdateEffect(effect, [dep]),
        { initialProps: { dep: 1 } },
      );

      expect(effect).not.toHaveBeenCalled();

      rerender({ dep: 2 });

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useIsClient', () => {
    it('should return true after hydration', async () => {
      const { result } = renderHook(() => useIsClient());

      await waitFor(
        () => {
          expect(result.current).toBe(true);
        },
        { timeout: 100 },
      );
    });
  });

  describe('useLockScroll', () => {
    it('should set body overflow to hidden', () => {
      const originalOverflow = document.body.style.overflow;

      renderHook(() => useLockScroll());

      expect(document.body.style.overflow).toBe('hidden');

      // Cleanup
      document.body.style.overflow = originalOverflow;
    });

    it('should restore original overflow on unmount', () => {
      const originalOverflow = 'auto';
      document.body.style.overflow = originalOverflow;

      const { unmount } = renderHook(() => useLockScroll());

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe(originalOverflow);
    });
  });
});
