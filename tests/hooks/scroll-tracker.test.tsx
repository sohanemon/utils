import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollTracker } from '../../src/components/scroll-tracker';
import { useScrollTracker } from '../../src/hooks/scroll-tracker';

describe('useScrollTracker', () => {
  beforeEach(() => {
    // Mock window methods
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
    // Mock requestIdleCallback to run synchronously
    Object.defineProperty(window, 'requestIdleCallback', {
      value: (callback: () => void) => callback(),
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useScrollTracker());

    expect(result.current.scrolledPast).toBe(false);
    // Initial direction is 'backward' because current scroll (0) <= prev scroll (0)
    expect(result.current.direction).toBe('backward');
  });

  it('should track scroll position with default threshold', () => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 400,
      configurable: true,
    });

    const { result } = renderHook(() => useScrollTracker());

    // Manually trigger the scroll handler that was set up
    act(() => {
      // The hook sets up a scroll listener, we need to call it
      const calls = (window.addEventListener as any).mock.calls;
      const scrollCall = calls.find((call: any[]) => call[0] === 'scroll');
      if (scrollCall) {
        scrollCall[1](); // Call the scroll handler
      }
    });

    expect(result.current.scrolledPast).toBe(true);
  });

  it('should respect custom threshold', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 200,
      configurable: true,
    });

    const { result } = renderHook(() => useScrollTracker({ threshold: 150 }));

    act(() => {
      const calls = (window.addEventListener as any).mock.calls;
      const scrollCall = calls.find((call: any[]) => call[0] === 'scroll');
      if (scrollCall) {
        scrollCall[1]();
      }
    });

    expect(result.current.scrolledPast).toBe(true);
  });

  it('should work with custom container', () => {
    const mockElement = {
      scrollTop: 400,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;

    const containerRef = { current: mockElement };
    const { result } = renderHook(() =>
      useScrollTracker({ container: containerRef as any }),
    );

    act(() => {
      const calls = mockElement.addEventListener.mock.calls;
      const scrollCall = calls.find((call: any[]) => call[0] === 'scroll');
      if (scrollCall) {
        scrollCall[1]();
      }
    });

    expect(result.current.scrolledPast).toBe(true);
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useScrollTracker());

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });
});
