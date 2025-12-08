import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as React from 'react';
import {
  useClickOutside,
  useIsomorphicEffect,
  useMediaQuery,
  useSessionStorage,
  useLocalStorage,
  useQuerySelector,
  useIsScrolling,
  useIsAtTop,
  useIntersection,
} from '../../src/hooks';

describe('hooks/index', () => {
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
  });

  describe('useIsomorphicEffect', () => {
    it('should work like useEffect', () => {
      const effect = vi.fn();

      renderHook(() => useIsomorphicEffect(effect, []));

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMediaQuery', () => {
    it('should return boolean for media query', () => {
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(typeof result.current).toBe('boolean');
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
});
