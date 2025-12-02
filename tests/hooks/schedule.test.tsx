import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSchedule } from '../../src/hooks/schedule';

describe('useSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return schedule function', () => {
    const { result } = renderHook(() => useSchedule());

    expect(typeof result.current).toBe('function');
  });

  it('should schedule task with default options', () => {
    const task = vi.fn();
    const { result } = renderHook(() => useSchedule());

    result.current(task);
    vi.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('should schedule task with custom options', () => {
    const task = vi.fn();
    const { result } = renderHook(() => useSchedule({ retry: 1, delay: 100 }));

    result.current(task);
    vi.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('should handle hook options', () => {
    const { result } = renderHook(() => useSchedule({ timeout: 5000 }));

    expect(typeof result.current).toBe('function');
  });
});
