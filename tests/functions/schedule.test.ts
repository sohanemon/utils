import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { schedule } from '../../src/functions/schedule';

describe('schedule', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should execute task immediately with default options', () => {
    const task = vi.fn().mockResolvedValue(undefined);
    schedule(task);

    // Advance timers to execute setTimeout(0)
    vi.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('should log completion time on success', async () => {
    const task = vi.fn().mockResolvedValue(undefined);
    schedule(task);

    vi.runOnlyPendingTimers();
    await vi.runOnlyPendingTimersAsync();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/⚡\[schedule\.ts\] Completed in \d+ms/),
    );
  });

  it('should retry on failure', () => {
    const task = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('First failure');
      })
      .mockReturnValue(undefined);

    schedule(task, { retry: 1, delay: 100 });

    // Initial attempt
    vi.runOnlyPendingTimers();
    expect(task).toHaveBeenCalledTimes(1);

    // Retry after delay
    vi.advanceTimersByTime(100);
    expect(task).toHaveBeenCalledTimes(2);
  });

  it('should log retry messages', () => {
    const task = vi.fn(() => {
      throw new Error('Failure');
    });
    schedule(task, { retry: 1, delay: 50 });

    vi.runOnlyPendingTimers();
    expect(console.log).toHaveBeenCalledWith(
      '⚡[schedule.ts] err:',
      expect.any(Error),
    );
    expect(console.log).toHaveBeenCalledWith(
      '⚡[schedule.ts] Retrying in 50ms...',
    );

    vi.advanceTimersByTime(50);
  });

  it('should log failure after all retries exhausted', () => {
    const task = vi.fn(() => {
      throw new Error('Persistent failure');
    });
    schedule(task, { retry: 1, delay: 50 });

    vi.runOnlyPendingTimers();
    vi.advanceTimersByTime(50);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/⚡\[schedule\.ts\] Failed after \d+ms/),
    );
  });

  it('should handle sync task', () => {
    const task = vi.fn();
    schedule(task);

    vi.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('should handle task that throws synchronously', () => {
    const task = vi.fn(() => {
      throw new Error('Sync error');
    });
    schedule(task, { retry: 1, delay: 50 });

    vi.runOnlyPendingTimers();

    expect(console.log).toHaveBeenCalledWith(
      '⚡[schedule.ts] err:',
      expect.any(Error),
    );
    expect(console.log).toHaveBeenCalledWith(
      '⚡[schedule.ts] Retrying in 50ms...',
    );
  });

  it('should use default retry of 0', () => {
    const task = vi.fn(() => {
      throw new Error('Failure');
    });
    schedule(task);

    vi.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      '⚡[schedule.ts] err:',
      expect.any(Error),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/⚡\[schedule\.ts\] Failed after \d+ms/),
    );
  });

  it('should use default delay of 0', () => {
    const task = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('First');
      })
      .mockReturnValue(undefined);

    schedule(task, { retry: 1 });

    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers(); // Immediate retry since delay=0

    expect(task).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple schedules independently', () => {
    const task1 = vi.fn().mockResolvedValue(undefined);
    const task2 = vi.fn().mockResolvedValue(undefined);

    schedule(task1);
    schedule(task2);

    vi.runOnlyPendingTimers();

    expect(task1).toHaveBeenCalledTimes(1);
    expect(task2).toHaveBeenCalledTimes(1);
  });

  it('should handle task returning void', () => {
    const task = vi.fn(() => {});
    schedule(task);

    vi.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });
});
