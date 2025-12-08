/**
 * A task function that can be synchronous or asynchronous.
 */
export type Task = () => Promise<void> | void;

/**
 * Options for configuring the schedule function.
 */
export interface ScheduleOpts {
  /** Number of retry attempts on failure. Defaults to 0. */
  retry?: number;
  /** Delay in milliseconds between retries. Defaults to 0. */
  delay?: number;
  /** Maximum time in milliseconds to wait for the task to complete. */
  timeout?: number;
}

/**
 * Runs a function asynchronously in the background without blocking the main thread.
 *
 * Executes the task immediately using setTimeout, with optional retry logic on failure.
 * Useful for non-critical operations like analytics, logging, or background processing.
 * Logs execution time and retry attempts to the console.
 *
 * @param task - The function to execute asynchronously
 * @param options - Configuration options for retries and timing
 *
 * @example
 * ```ts
 * // Simple background task
 * schedule(() => {
 *   console.log('Background work done');
 * });
 *
 * // Task with retry on failure
 * schedule(
 *   () => sendAnalytics(),
 *   { retry: 3, delay: 1000 }
 * );
 * ```
 */
export function schedule(task: Task, options: ScheduleOpts = {}) {
  const { retry = 0, delay = 0 } = options;

  const start = Date.now();

  const attempt = async (triesLeft: number) => {
    try {
      await task();
      const total = Date.now() - start;
      console.log(`⚡[schedule.ts] Completed in ${total}ms`);
    } catch (err) {
      console.log('⚡[schedule.ts] err:', err);
      if (triesLeft > 0) {
        console.log(`⚡[schedule.ts] Retrying in ${delay}ms...`);
        setTimeout(() => attempt(triesLeft - 1), delay);
      } else {
        const total = Date.now() - start;
        console.log(`⚡[schedule.ts] Failed after ${total}ms`);
      }
    }
  };

  // Schedule immediately
  setTimeout(() => attempt(retry), 0);
}
