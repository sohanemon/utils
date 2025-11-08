import * as React from 'react';
import { ScheduleOpts } from '../functions';
import { schedule as _schedule, Task } from '../functions/schedule';

/**
 * useSchedule — run non-urgent work later, without blocking UI.
 */
export function useSchedule(options: ScheduleOpts = {}) {
  const { timeout = 10000 } = options;

  const schedule = React.useCallback(
    (task: Task) => {
      const exec = () => {
        try {
          React.startTransition(() => {
            task();
          });
        } catch (err) {
          console.log('⚡[schedule.tsx] Failed: ', err);
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(exec, { timeout });
      } else {
        _schedule(exec);
      }
    },
    [timeout],
  );

  return schedule;
}

/**
 * useScheduledEffect — Runs a non-urgent task in a React component without blocking UI rendering.
 *
 * This hook is like `useEffect`, but the provided task is executed
 * with low priority using `requestIdleCallback` (if available)
 * or a fallback scheduler. Useful for heavy computations, logging,
 * analytics, or background work that doesn't need to block render.
 *
 * @param {Function} effect - The function to run later. Can be synchronous or return a Promise.
 * @param {React.DependencyList[]} deps - Dependency array; task will re-run whenever these change.
 * @param {ScheduleOpts} [options] - Optional scheduling options.
 * @param {number} [options.timeout] - Max time (ms) to wait before executing the task. Defaults to 10000.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useScheduledEffect } from './hooks/useScheduledEffect';
 *
 * function MyComponent({ userId }: { userId: string }) {
 *   useScheduledEffect(() => {
 *     // non-blocking analytics or heavy work
 *     console.log('Sending analytics for user:', userId);
 *   }, [userId], { timeout: 5000 });
 *
 *   return <div>Component loaded. Task will run later 😎</div>;
 * }
 * ```
 */
export function useScheduledEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList = [],
  options: ScheduleOpts = {},
) {
  const schedule = useSchedule(options);

  React.useEffect(() => {
    let cleanup: void | (() => void);

    schedule(() => {
      cleanup = effect();
    });

    return () => {
      if (typeof cleanup === 'function') cleanup?.();
    };
  }, [schedule, ...deps]);
}
