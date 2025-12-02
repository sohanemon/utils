import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from '../../src/hooks/async';

describe.skip('useAsync', () => {
  it('should execute async function in manual mode', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeUndefined();

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe('success');
    expect(asyncFn).toHaveBeenCalledTimes(1);
  });

  it('should execute async function in auto mode', async () => {
    const asyncFn = vi.fn().mockResolvedValue('auto success');
    const { result } = renderHook(() => useAsync(asyncFn, { mode: 'auto' }));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toBe('auto success');
  });

  it('should handle errors', async () => {
    const error = new Error('Test error');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(error);
  });

  it('should call onSuccess callback', async () => {
    const onSuccess = vi.fn();
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() =>
      useAsync(asyncFn, { mode: 'manual', onSuccess }),
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(onSuccess).toHaveBeenCalledWith('data');
  });

  it('should call onError callback', async () => {
    const onError = vi.fn();
    const error = new Error('Error');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() =>
      useAsync(asyncFn, { mode: 'manual', onError }),
    );

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Expected
      }
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should call onSettled callback', async () => {
    const onSettled = vi.fn();
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() =>
      useAsync(asyncFn, { mode: 'manual', onSettled }),
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(onSettled).toHaveBeenCalledWith('data', undefined);
  });

  it('should abort previous execution when execute is called again', async () => {
    const abortController = new AbortController();
    const asyncFn = vi.fn().mockImplementation((signal: AbortSignal) => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve('done'), 100);
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Aborted'));
        });
      });
    });

    const { result, rerender } = renderHook(() =>
      useAsync(asyncFn, { mode: 'manual' }),
    );

    // Start first execution
    const promise1 = act(async () => {
      result.current.execute();
    });

    // Start second execution immediately
    const promise2 = act(async () => {
      result.current.execute();
    });

    await promise2;

    rerender();
    expect(result.current.status).toBe('success');
    expect(asyncFn).toHaveBeenCalledTimes(2);
  });

  it('should handle AbortError gracefully', async () => {
    const asyncFn = vi.fn().mockImplementation(() => {
      const err = new Error('Aborted');
      err.name = 'AbortError';
      throw err;
    });
    const { result, rerender } = renderHook(() =>
      useAsync(asyncFn, { mode: 'manual' }),
    );

    await act(async () => {
      const execResult = await result.current.execute();
      expect(execResult).toBeUndefined(); // Aborted executions return undefined
    });

    rerender();
    expect(result.current.status).toBe('pending');
  });

  it('should respect deps in auto mode', async () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { rerender } = renderHook(
      ({ deps }) => useAsync(asyncFn, { mode: 'auto', deps }),
      { initialProps: { deps: [1] } },
    );

    await waitFor(() => {
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      rerender({ deps: [2] });
    });

    await waitFor(() => {
      expect(asyncFn).toHaveBeenCalledTimes(2);
    });
  });

  it('should provide correct status booleans', async () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    await act(async () => {
      result.current.execute();
    });

    expect(result.current.isIdle).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should reset state on new execution', async () => {
    let callCount = 0;
    const asyncFn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.reject(new Error('First error'));
      return Promise.resolve('success');
    });

    const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

    // First execution fails
    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.status).toBe('error');

    // Second execution succeeds
    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeUndefined();
  });
});
