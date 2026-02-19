import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the workerize function to simulate worker behavior for testing
vi.mock('../../src/functions/worker', () => ({
  workerize: vi.fn((fn: Function) => {
    return (...args: any[]) => {
      return new Promise((resolve, reject) => {
        try {
          const result = fn(...args);
          if (result && typeof result.then === 'function') {
            // Handle async functions
            result.then(resolve).catch((error: any) => {
              reject(new Error(error.message || String(error)));
            });
          } else {
            // Handle sync functions
            resolve(result);
          }
        } catch (error: any) {
          reject(new Error(error.message || String(error)));
        }
      });
    };
  }),
}));

// Import after mocking
import { useWorker, useWorkerEffect } from '../../src/hooks/worker';

describe('useWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const add = (a: number, b: number) => a + b;
    const { result } = renderHook(() => useWorker(add));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.execute).toBe('function');
  });

  it('should execute function and update state on success', async () => {
    const multiply = (a: number, b: number) => a * b;
    const { result } = renderHook(() => useWorker(multiply));

    await act(async () => {
      result.current.execute(6, 7);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(42);
    expect(result.current.error).toBeNull();
  });

  it('should handle execution errors', async () => {
    const failingFunction = () => {
      throw new Error('Function failed');
    };
    const { result } = renderHook(() => useWorker(failingFunction));

    await act(async () => {
      result.current.execute();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Function failed');
  });

  it('should handle functions with no parameters', async () => {
    const getTimestamp = () => Date.now();
    const { result } = renderHook(() => useWorker(getTimestamp));

    const mockTimestamp = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

    await act(async () => {
      result.current.execute();
    });

    expect(result.current.data).toBe(mockTimestamp);
  });

  it('should handle complex parameter types', async () => {
    const processUser = (user: { name: string; age: number }) =>
      `${user.name} is ${user.age} years old`;

    const { result } = renderHook(() => useWorker(processUser));
    const user = { name: 'Alice', age: 30 };

    await act(async () => {
      result.current.execute(user);
    });

    expect(result.current.data).toBe('Alice is 30 years old');
  });
});

describe('useWorkerEffect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute effect on mount with empty deps', async () => {
    const effect = vi.fn();
    renderHook(() => useWorkerEffect(effect));

    // Effect should be called during render
    await waitFor(() => {
      expect(effect).toHaveBeenCalled();
    });
  });

  it('should execute effect when deps change', async () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ deps }) => useWorkerEffect(effect, deps),
      { initialProps: { deps: [1] } },
    );

    // First execution
    await waitFor(() => {
      expect(effect).toHaveBeenCalledTimes(1);
    });

    // Change deps
    await act(async () => {
      rerender({ deps: [2] });
    });

    await waitFor(() => {
      expect(effect).toHaveBeenCalledTimes(2);
    });
  });

  it('should not execute effect when deps are the same', async () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ deps }) => useWorkerEffect(effect, deps),
      { initialProps: { deps: [1] } },
    );

    await waitFor(() => {
      expect(effect).toHaveBeenCalledTimes(1);
    });

    // Rerender with same deps
    await act(async () => {
      rerender({ deps: [1] });
    });

    // Should not have called again
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('should handle effect errors gracefully', async () => {
    const failingEffect = () => {
      throw new Error('Effect failed');
    };

    // Should not throw during render
    expect(() => {
      renderHook(() => useWorkerEffect(failingEffect));
    }).not.toThrow();
  });
});
