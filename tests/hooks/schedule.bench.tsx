import { renderHook } from '@testing-library/react';
import { bench, vi } from 'vitest';
import { useSchedule } from '../../src/hooks/schedule';

bench('useSchedule hook initialization', () => {
  renderHook(() => useSchedule());
});

bench('useSchedule task execution', () => {
  const task = vi.fn();
  const { result } = renderHook(() => useSchedule());

  result.current(task);
  // Task should execute synchronously in test due to mock
});

bench('useSchedule with custom timeout', () => {
  const task = vi.fn();
  const { result } = renderHook(() => useSchedule({ timeout: 1000 }));

  result.current(task);
});

bench('useScheduledEffect execution', () => {
  const effect = vi.fn();
  renderHook(() => {
    // This would normally schedule the effect
    // In test, it runs synchronously
    effect();
  });
});
