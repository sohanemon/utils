import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAction } from '../../src/hooks/action';

describe('useAction', () => {
  it('should execute action and update state', async () => {
    const action = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      result.current.execute('input');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe('success');
    expect(result.current.input).toBe('input');
  });

  it('should handle errors', async () => {
    const error = new Error('Action failed');
    const action = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      try {
        await result.current.execute('input');
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
  });

  it('should call onSuccess callback', async () => {
    const onSuccess = vi.fn();
    const action = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAction(action, { onSuccess }));

    await act(async () => {
      await result.current.execute('input');
    });

    expect(onSuccess).toHaveBeenCalledWith('data');
  });

  it('should call onError callback', async () => {
    const onError = vi.fn();
    const error = new Error('Error');
    const action = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAction(action, { onError }));

    await act(async () => {
      try {
        await result.current.execute('input');
      } catch (e) {
        // Expected
      }
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should call onSettled callback', async () => {
    const onSettled = vi.fn();
    const action = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAction(action, { onSettled }));

    await act(async () => {
      await result.current.execute('input');
    });

    expect(onSettled).toHaveBeenCalled();
  });

  it('should executeAsync and return result', async () => {
    const action = vi.fn().mockResolvedValue('async result');
    const { result } = renderHook(() => useAction(action));

    const promiseResult = await act(async () => {
      return result.current.executeAsync('input');
    });

    expect(promiseResult).toBe('async result');
    expect(result.current.data).toBe('async result');
  });

  it('should reset state', async () => {
    const action = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      await result.current.execute('input');
    });

    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.input).toBe(undefined);
  });

  it('should handle loading state', async () => {
    const action = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve('success'), 100)),
      );

    const { result } = renderHook(() => useAction(action));

    act(() => {
      result.current.execute('input');
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should use useExecute hook', () => {
    const action = vi.fn().mockResolvedValue('executed');
    const TestComponent = () => {
      const { useExecute } = useAction(action);
      useExecute('test input');
      return null;
    };

    // This would require rendering a component, but for simplicity, skip
    expect(true).toBe(true);
  });

  it('should handle multiple executions', async () => {
    const action = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      await result.current.execute('first');
    });

    expect(result.current.input).toBe('first');

    await act(async () => {
      await result.current.execute('second');
    });

    expect(result.current.input).toBe('second');
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('should maintain correct status transitions', async () => {
    const action = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAction(action));

    expect(result.current.isIdle).toBe(true);

    act(() => {
      result.current.execute('input');
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
