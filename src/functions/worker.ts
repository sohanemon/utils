/**
 * Message data that can be sent to/from a worker.
 */
export type WorkerMessage = any;

/**
 * Options for configuring the worker.
 */
export interface WorkerOpts {
  /** The worker script URL or inline code string. */
  script: string | URL;
  /** Options for the worker. */
  options?: WorkerOptions;
  /** Callback for when the worker sends a message. */
  onMessage?: (message: WorkerMessage) => void;
  /** Callback for when the worker encounters an error. */
  onError?: (error: ErrorEvent) => void;
  /** Callback for when the worker terminates. */
  onTerminate?: () => void;
}

/**
 * A worker instance with messaging capabilities.
 */
export interface WorkerInstance {
  /** Send a message to the worker. */
  postMessage: (message: WorkerMessage) => void;
  /** Terminate the worker. */
  terminate: () => void;
  /** Check if the worker is terminated. */
  readonly terminated: boolean;
}

/**
 * Converts a regular function into a workerized version that runs in a Web Worker.
 *
 * This provides the ultimate DX for Web Workers - just write a normal function
 * and "workerize" it to run in the background without blocking the UI.
 *
 * @param fn - The function to workerize
 * @returns A function that calls the original function in a worker and returns a Promise
 *
 * @example
 * ```ts
 * // Define a normal function
 * function fibonacci(n: number): number {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * }
 *
 * // Workerize it
 * const workerizedFib = workerize(fibonacci);
 *
 * // Use like a normal async function!
 * const result = await workerizedFib(35);
 * console.log(result); // Works just like the original function
 * ```
 *
 * @example
 * ```ts
 * // Works with any function signature
 * const sumArray = workerize((arr: number[]) =>
 *   arr.reduce((a, b) => a + b, 0)
 * );
 *
 * const result = await sumArray([1, 2, 3, 4, 5]); // 15
 * ```
 */
export function workerize<T extends (...args: any[]) => any>(
  fn: T,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const workerCode = `
    self.onmessage = async (e) => {
      try {
        const fn = ${fn.toString()};
        const result = await fn(...e.data);
        self.postMessage({ type: 'result', result });
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        if (e.data.type === 'result') {
          resolve(e.data.result);
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.error));
        }
      };

      worker.onerror = (error) => {
        reject(new Error(`Worker error: ${error.message}`));
      };

      worker.postMessage(args);
    });
  };
}
