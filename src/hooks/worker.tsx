import * as React from 'react';
import type { WorkerInstance, WorkerOpts } from '../functions';
import { createWorker } from '../functions/worker';

/**
 * useWorker — create and manage a Web Worker instance.
 *
 * Provides a React hook for creating and managing Web Workers with automatic
 * cleanup on unmount. Useful for running computationally intensive tasks
 * in background threads without blocking the UI.
 *
 * @param options - Configuration options for the worker
 * @returns A worker instance with messaging methods
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useWorker } from './hooks/useWorker';
 *
 * function CalculatorComponent() {
 *   const worker = useWorker({
 *     script: `
 *       self.onmessage = function(e) {
 *         const result = e.data.numbers.reduce((a, b) => a + b, 0);
 *         self.postMessage({ sum: result });
 *       };
 *     `,
 *     onMessage: (result) => {
 *       console.log('Sum calculated:', result.sum);
 *     },
 *   });
 *
 *   const handleCalculate = () => {
 *     worker.postMessage({ numbers: [1, 2, 3, 4, 5] });
 *   };
 *
 *   return (
 *     <button onClick={handleCalculate}>
 *       Calculate Sum in Worker
 *     </button>
 *   );
 * }
 * ```
 */
export function useWorker(options: WorkerOpts): WorkerInstance {
  const workerRef = React.useRef<WorkerInstance | null>(null);

  // Create worker on mount
  React.useEffect(() => {
    try {
      workerRef.current = createWorker(options);
    } catch (err) {
      console.log('⚡[worker.tsx] Failed to create worker in hook:', err);
    }

    // Cleanup on unmount
    return () => {
      if (workerRef.current && !workerRef.current.terminated) {
        workerRef.current.terminate();
      }
    };
  }, []); // Empty deps - only create once

  // Return a stable reference that delegates to the actual worker
  return React.useMemo(
    () => ({
      postMessage: (message: any) => {
        workerRef.current?.postMessage(message);
      },
      terminate: () => {
        workerRef.current?.terminate();
      },
      get terminated() {
        return workerRef.current?.terminated ?? true;
      },
    }),
    [],
  );
}

/**
 * useWorkerEffect — Run a worker task as a React effect.
 *
 * This hook creates a worker and runs the provided task function within it,
 * similar to how `useEffect` runs tasks. The worker is automatically created
 * and terminated based on the dependency array, with proper cleanup.
 *
 * @param task - The function to run in the worker (receives worker instance)
 * @param deps - Dependency array; worker will be recreated when these change
 * @param options - Worker configuration options
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useWorkerEffect } from './hooks/useWorkerEffect';
 *
 * function DataProcessor({ data }: { data: number[] }) {
 *   const [result, setResult] = React.useState<number | null>(null);
 *
 *   useWorkerEffect(
 *     (worker) => {
 *       // Send data to worker
 *       worker.postMessage(data);
 *     },
 *     [data], // Recreate worker when data changes
 *     {
 *       script: `
 *         self.onmessage = function(e) {
 *           const numbers = e.data;
 *           const sum = numbers.reduce((a, b) => a + b, 0);
 *           self.postMessage(sum);
 *         };
 *       `,
 *       onMessage: (sum) => setResult(sum),
 *     }
 *   );
 *
 *   return <div>Sum: {result}</div>;
 * }
 * ```
 */
export function useWorkerEffect(
  task: (worker: WorkerInstance) => void,
  deps: React.DependencyList = [],
  options: WorkerOpts,
): void {
  const worker = useWorker(options);

  React.useEffect(() => {
    let cleanup: (() => void) | void;

    try {
      cleanup = task(worker);
    } catch (err) {
      console.log('⚡[worker.tsx] Error running worker task:', err);
    }

    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [worker, ...deps]);
}
