import * as React from 'react';
import { workerize } from '../functions';

/**
 * useWorker — Web Worker hook that returns a function to execute in worker.
 *
 * Provides a React hook that returns an execute function to run computations
 * in a Web Worker with loading states and error handling. The worker function
 * does not execute automatically - you must call the returned execute function.
 *
 * @param workerFn - Function to run in the worker (gets workerized automatically)
 * @returns Object with execute function, data, error, and isLoading properties
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useWorker } from './hooks/useWorker';
 *
 * function CalculatorComponent({ numbers }: { numbers: number[] }) {
 *   const { execute, data, isLoading, error } = useWorker(
 *     (nums: number[]) => nums.reduce((a, b) => a + b, 0)
 *   );
 *
 *   if (isLoading) return <div>Calculating...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <div>Sum: {data}</div>
 *       <button onClick={() => execute(numbers)}>Calculate</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useWorker<T extends (...args: any[]) => any>(
  workerFn: T,
): {
  execute: (...args: Parameters<T>) => void;
  data: ReturnType<T> | undefined;
  error: Error | null;
  isLoading: boolean;
} {
  const [data, setData] = React.useState<ReturnType<T> | undefined>(undefined);
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Create workerized function
  const workerizedFn = React.useMemo(() => workerize(workerFn), []);

  const execute = React.useCallback(
    (...args: Parameters<T>) => {
      let isCancelled = false;

      const run = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const result = await workerizedFn(...args);
          if (!isCancelled) {
            setData(result);
          }
        } catch (err) {
          if (!isCancelled) {
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      };

      run();
    },
    [workerizedFn],
  );

  return { execute, data, error, isLoading };
}

/**
 * useWorkerEffect — Run a side effect in a Web Worker.
 *
 * This hook acts like useEffect but runs the callback in a Web Worker instead of the main thread.
 * The callback is executed asynchronously in a worker when the execute function is called.
 *
 * @param callback - Function to run in the worker (should be a side effect, not return data)
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useWorkerEffect } from './hooks/useWorkerEffect';
 *
 * function HeavyComputationComponent({ data }: { data: number[] }) {
 *   const { execute } = useWorkerEffect((nums: number[]) => {
 *     // This runs in a Web Worker
 *     const result = nums.reduce((a, b) => a + b, 0);
 *     console.log('Computed sum in worker:', result);
 *     // Side effects like logging, API calls, etc.
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => execute(data)}>Run Effect in Worker</button>
 *       Check console for worker output
 *     </div>
 *   );
 * }
 * ```
 */
export function useWorkerEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList = [],
) {
  const { execute } = useWorker(effect);

  React.useEffect(() => {
    execute();
  }, [execute, ...deps]);
}
