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
 * Creates a Web Worker with message handling capabilities.
 *
 * Provides a simple interface for creating and managing dedicated workers,
 * with built-in error handling and message passing. Useful for running
 * computationally intensive tasks in background threads without blocking
 * the main UI thread.
 *
 * @param opts - Configuration options for the worker
 * @returns A worker instance with messaging methods
 *
 * @example
 * ```ts
 * // Using a script URL
 * const worker = createWorker({
 *   script: new URL('./worker.js', import.meta.url),
 *   onMessage: (result) => console.log('Worker result:', result),
 *   onError: (error) => console.error('Worker error:', error),
 * });
 *
 * worker.postMessage({ action: 'calculate', data: [1, 2, 3] });
 *
 * // Cleanup
 * worker.terminate();
 * ```
 *
 * @example
 * ```ts
 * // Using inline code
 * const worker = createWorker({
 *   script: `
 *     self.onmessage = function(e) {
 *       const result = e.data * 2;
 *       self.postMessage(result);
 *     };
 *   `,
 *   onMessage: (result) => console.log('Doubled:', result),
 * });
 *
 * worker.postMessage(21); // Logs: "Doubled: 42"
 * ```
 */
export function createWorker(opts: WorkerOpts): WorkerInstance {
  const { script, options, onMessage, onError, onTerminate } = opts;

  let worker: Worker;
  let isTerminated = false;

  try {
    if (script instanceof URL) {
      worker = new Worker(script, options);
    } else {
      // Create blob URL for inline code
      const blob = new Blob([script], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl, options);

      // Clean up blob URL after worker creation
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.log('⚡[worker.ts] Failed to create worker:', err);
    throw err;
  }

  // Set up message handler
  worker.onmessage = (event: MessageEvent) => {
    try {
      onMessage?.(event.data);
    } catch (err) {
      console.log('⚡[worker.ts] Error in message handler:', err);
    }
  };

  // Set up error handler
  worker.onerror = (error: ErrorEvent) => {
    console.log('⚡[worker.ts] Worker error:', error);
    try {
      onError?.(error);
    } catch (err) {
      console.log('⚡[worker.ts] Error in error handler:', err);
    }
  };

  const instance: WorkerInstance = {
    postMessage: (message: WorkerMessage) => {
      if (isTerminated) {
        console.log('⚡[worker.ts] Cannot post message to terminated worker');
        return;
      }
      try {
        worker.postMessage(message);
      } catch (err) {
        console.log('⚡[worker.ts] Failed to post message:', err);
      }
    },

    terminate: () => {
      if (isTerminated) return;
      isTerminated = true;
      try {
        worker.terminate();
        onTerminate?.();
        console.log('⚡[worker.ts] Worker terminated');
      } catch (err) {
        console.log('⚡[worker.ts] Error terminating worker:', err);
      }
    },

    get terminated() {
      return isTerminated;
    },
  };

  return instance;
}
