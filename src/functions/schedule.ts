export type Task = () => Promise<void> | void;

export interface ScheduleOpts {
  retry?: number;
  delay?: number;
  timeout?: number;
}

/**
 * Runs a function asynchronously in the background.
 * Returns immediately, retries on failure if configured.
 * Logs total time taken.
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
