import { act, renderHook, waitFor } from '@testing-library/react';
import { bench, expect, vi } from 'vitest';
import { useAsync } from '../../src/hooks/async';

bench('useAsync hook initialization', () => {
  const asyncFn = vi.fn().mockResolvedValue('bench result');
  renderHook(() => useAsync(asyncFn, { mode: 'manual' }));
});

bench('useAsync execute method', async () => {
  const asyncFn = vi.fn().mockResolvedValue('bench result');
  const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

  await act(async () => {
    await result.current.execute();
  });
});

bench('useAsync auto mode execution', async () => {
  const asyncFn = vi.fn().mockResolvedValue('auto result');
  renderHook(() => useAsync(asyncFn, { mode: 'auto' }));

  await waitFor(() => {
    expect(asyncFn).toHaveBeenCalled();
  });
});

bench('useAsync state access', async () => {
  const asyncFn = vi.fn().mockResolvedValue('state test');
  const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

  await act(async () => {
    await result.current.execute();
  });

  // Measure state access
  result.current.isIdle;
  result.current.isPending;
  result.current.isSuccess;
  result.current.isError;
  result.current.data;
  result.current.error;
});

bench('useAsync abort handling', async () => {
  const asyncFn = vi.fn().mockImplementation((signal: AbortSignal) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve('aborted'), 10);
    });
  });

  const { result } = renderHook(() => useAsync(asyncFn, { mode: 'manual' }));

  await act(async () => {
    result.current.execute();
  });

  await act(async () => {
    result.current.execute(); // Second call should abort first
  });
});
