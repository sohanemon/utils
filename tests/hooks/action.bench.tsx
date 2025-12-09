import { bench, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAction } from '../../src/hooks/action';

bench('useAction hook initialization', () => {
  const action = vi.fn().mockResolvedValue('bench result');
  renderHook(() => useAction(action));
});

bench('useAction execute method', async () => {
  const action = vi.fn().mockResolvedValue('bench result');
  const { result } = renderHook(() => useAction(action));

  await act(async () => {
    await result.current.execute('bench input');
  });
});

bench('useAction state access', async () => {
  const action = vi.fn().mockResolvedValue('state test');
  const { result } = renderHook(() => useAction(action));

  await act(async () => {
    await result.current.execute('state input');
  });

  // Measure state access
  result.current.isIdle;
  result.current.isLoading;
  result.current.isSuccess;
  result.current.data;
  result.current.error;
});

bench('useAction reset method', async () => {
  const action = vi.fn().mockResolvedValue('reset test');
  const { result } = renderHook(() => useAction(action));

  await act(async () => {
    await result.current.execute('reset input');
  });

  act(() => {
    result.current.reset();
  });
});
