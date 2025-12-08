import { sleep } from './utils';

/**
 * Repeatedly polls an async `cond` function UNTIL it returns a TRUTHY value,
 * or until the operation times out or is aborted.
 *
 * Designed for waiting on async jobs, external state, or delayed availability.
 *
 * @template T The type of the successful result.
 *
 * @param cond
 * A function returning a Promise that resolves to:
 *   - a truthy value `T` → stop polling and return it
 *   - falsy/null/undefined → continue polling
 *
 * @param options
 * Configuration options:
 * - `interval` (number) — Time between polls in ms (default: 5000 ms)
 * - `timeout` (number) — Max total duration before failing (default: 5 min)
 * - `jitter` (boolean) — Add small random offset (±10%) to intervals to avoid sync bursts (default: true)
 * - `signal` (AbortSignal) — Optional abort signal to cancel polling
 *
 * @returns
 * Resolves with the truthy value `T` when successful.
 * Throws `AbortError` if aborted
 *
 * @example
 * ```ts
 * // Poll for job completion
 * const job = await poll(async () => {
 *   const status = await getJobStatus();
 *   return status === 'done' ? status : null;
 * }, { interval: 3000, timeout: 60000 });
 * ```
 *
 * @example
 * ```ts
 * // Wait for API endpoint to be ready
 * const apiReady = await poll(async () => {
 *   try {
 *     await fetch('/api/health');
 *     return true;
 *   } catch {
 *     return null;
 *   }
 * }, { interval: 1000, timeout: 30000 });
 * ```
 *
 * @example
 * ```ts
 * // Poll with abort signal for cancellation
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 10000); // Cancel after 10s
 *
 * try {
 *   const result = await poll(
 *     () => checkExternalService(),
 *     { interval: 2000, signal: controller.signal }
 *   );
 * } catch (err) {
 *   if (err.name === 'AbortError') {
 *     console.log('Polling was cancelled');
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Poll for user action completion
 * const userConfirmed = await poll(async () => {
 *   const confirmations = await getPendingConfirmations();
 *   return confirmations.length > 0 ? confirmations[0] : null;
 * }, { interval: 5000, timeout: 300000 }); // 5 min timeout
 * ```
 */
export async function poll<T>(
  cond: () => Promise<T | null | false | undefined>,
  {
    interval = 5000,
    timeout = 5 * 60 * 1000,
    jitter = true,
    signal,
  }: Partial<{
    interval: number;
    timeout: number;
    signal: AbortSignal;
    jitter: boolean;
  }> = {},
): Promise<T> {
  const start = Date.now();
  let aborted = signal?.aborted ?? false;

  // fast listener (avoids repeated property lookups)
  const abortListener = () => {
    aborted = true;
  };
  signal?.addEventListener('abort', abortListener, { once: true });

  try {
    for (let attempt = 0; ; attempt++) {
      // fast exit check
      if (aborted) throw new Error('Polling aborted');

      const result = await cond();
      if (result) return result;

      const elapsed = Date.now() - start;
      if (elapsed >= timeout)
        throw new Error('Polling timed out', {
          cause: `Polling timed out after ${timeout}ms`,
        });

      // add jitter (±10%) for anti-sync
      const delay = jitter
        ? interval + (Math.random() - 0.5) * interval * 0.2
        : interval;

      await sleep(delay, signal);
    }
  } catch (err) {
    throw err; // stop polling on any error
  } finally {
    // cleanup to avoid leaks
    signal?.removeEventListener('abort', abortListener);
  }
}
