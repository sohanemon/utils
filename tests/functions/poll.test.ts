import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { poll } from '../../src/functions/poll';

describe('poll', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should resolve immediately when condition is truthy', async () => {
    const cond = vi.fn().mockResolvedValue('success');
    const result = await poll(cond);
    expect(result).toBe('success');
    expect(cond).toHaveBeenCalledTimes(1);
  });

  it('should poll until condition becomes truthy', async () => {
    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 3 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond, { interval: 100 });
    await vi.advanceTimersByTimeAsync(200);
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(3);
  });

  it('should timeout after specified time', async () => {
    const cond = vi.fn().mockResolvedValue(null);
    const promise = poll(cond, { interval: 100, timeout: 250 });

    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow('Polling timed out');
    expect(cond).toHaveBeenCalledTimes(4); // 0, 100, 200, 300ms
  });

  it('should respect custom interval', async () => {
    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond, { interval: 200 });
    await vi.advanceTimersByTimeAsync(400);
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
  });

  it('should abort when signal is aborted', async () => {
    const abortController = new AbortController();
    const cond = vi.fn().mockResolvedValue(null);

    const promise = poll(cond, {
      interval: 100,
      signal: abortController.signal,
    });

    // Abort after first poll
    setTimeout(() => abortController.abort(), 50);
    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).rejects.toThrow('Polling aborted');
    expect(cond).toHaveBeenCalledTimes(1);
  });

  it('should handle jitter', async () => {
    // Mock Math.random to return 0.5 for consistent jitter
    const originalRandom = Math.random;
    Math.random = vi.fn().mockReturnValue(0.5);

    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond, { interval: 100, jitter: true });
    // With jitter at 0.5, delay should be 100 + (0.5 - 0.5) * 100 * 0.2 = 100
    await vi.advanceTimersByTimeAsync(200);
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);

    Math.random = originalRandom;
  });

  it('should disable jitter when set to false', async () => {
    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond, { interval: 100, jitter: false });
    await vi.advanceTimersByTimeAsync(150);
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
  });

  it('should handle condition function throwing errors', async () => {
    const cond = vi.fn().mockRejectedValue(new Error('Condition failed'));
    const promise = poll(cond, { interval: 100, timeout: 200 });

    await vi.advanceTimersByTimeAsync(150);

    await expect(promise).rejects.toThrow('Condition failed');
  });

  it('should use default options', async () => {
    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond);
    // Default interval 5000, but timeout 5min, so should work
    await vi.advanceTimersByTimeAsync(10000);
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
  });

  it('should handle falsy but truthy values', async () => {
    const cond = vi
      .fn()
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce(false)
      .mockResolvedValue('truthy');

    const result = await poll(cond, { interval: 10, jitter: false });
    expect(result).toBe('truthy');
    expect(cond).toHaveBeenCalledTimes(4);
  });

  it('should not poll if condition is immediately truthy', async () => {
    const cond = vi.fn().mockResolvedValue('immediate');
    const result = await poll(cond);
    expect(result).toBe('immediate');
    expect(cond).toHaveBeenCalledTimes(1);
  });

  it('should handle abort signal already aborted', async () => {
    const abortController = new AbortController();
    abortController.abort();

    const cond = vi.fn().mockResolvedValue(null);
    const promise = poll(cond, { signal: abortController.signal });

    await expect(promise).rejects.toThrow('Polling aborted');
    expect(cond).not.toHaveBeenCalled();
  });
});
