type Task = () => Promise<void> | void;

interface ScheduleOpts {
  retry?: number;
  delay?: number;
}

/**
 * Runs a function asynchronously in the background.
 * Returns immediately, retries on failure if configured.
 */
export function schedule(task: Task, options: ScheduleOpts = {}) {
  const { retry = 0, delay = 0 } = options;

  const attempt = async (triesLeft: number) => {
    try {
      await task();
    } catch (err) {
      console.log('⚡[schedule.ts] err:', err);
      if (triesLeft > 0) {
        console.log(`⚡[schedule.ts] Retrying in ${delay}ms...`);
        setTimeout(() => attempt(triesLeft - 1), delay);
      }
    }
  };

  // Schedule immediately
  setTimeout(() => attempt(retry), 0);
}
