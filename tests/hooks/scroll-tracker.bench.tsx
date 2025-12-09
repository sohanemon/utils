import { bench, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollTracker } from '../../src/hooks/scroll-tracker';

bench('useScrollTracker hook initialization', () => {
  renderHook(() => useScrollTracker());
});

bench('useScrollTracker with custom threshold', () => {
  renderHook(() => useScrollTracker({ threshold: 200 }));
});

bench('useScrollTracker scroll state updates', () => {
  // Mock window.scrollY
  Object.defineProperty(window, 'scrollY', {
    value: 400,
    configurable: true,
  });

  const { result } = renderHook(() => useScrollTracker());

  // Simulate scroll event
  act(() => {
    const calls = (window.addEventListener as any).mock.calls;
    const scrollCall = calls.find((call: any[]) => call[0] === 'scroll');
    if (scrollCall) {
      scrollCall[1](); // Call the scroll handler
    }
  });

  // Access state
  result.current.scrolledPast;
  result.current.direction;
});

bench('useScrollTracker with custom container', () => {
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

  result.current.scrolledPast;
  result.current.direction;
});
