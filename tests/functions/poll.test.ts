import { describe, expect, it, vi } from 'vitest';
import { poll } from '../../src/functions/poll';

describe('poll', () => {
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
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond, { interval: 50, jitter: false });
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
  });

  it('should timeout after specified time', async () => {
    const cond = vi.fn().mockResolvedValue(null);
    const promise = poll(cond, { interval: 100, timeout: 10 });

    await new Promise((resolve) => setTimeout(resolve, 20));

    await expect(promise).rejects.toThrow('Polling timed out');
    expect(cond).toHaveBeenCalledTimes(2); // first call, then timeout after sleep
  });

  it('should respect custom interval', async () => {
    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond, { interval: 50 });
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
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

    const promise = poll(cond, { interval: 50, jitter: true });
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

    const promise = poll(cond, { interval: 50, jitter: false });
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
  });

  it('should handle condition function throwing errors', async () => {
    const cond = vi.fn().mockRejectedValue(new Error('Condition failed'));
    const promise = poll(cond, { interval: 100, timeout: 200 });

    await expect(promise).rejects.toThrow('Condition failed');
  });

  it('should use default options', async () => {
    let attempts = 0;
    const cond = vi.fn().mockImplementation(() => {
      attempts++;
      return attempts >= 2 ? Promise.resolve('done') : Promise.resolve(null);
    });

    const promise = poll(cond);
    const result = await promise;

    expect(result).toBe('done');
    expect(cond).toHaveBeenCalledTimes(2);
  }, 10000);

  it('should handle falsy but truthy values', async () => {
    const cond = vi
      .fn()
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce(false)
      .mockResolvedValue('truthy');

    const promise = poll(cond, { interval: 50, jitter: false });
    const result = await promise;
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
