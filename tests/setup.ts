import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Web Worker API
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;

  constructor(_scriptURL: string | URL, _options?: WorkerOptions) {
    // Mock constructor - we'll simulate worker behavior
  }

  postMessage(message: any) {
    if (this.terminated) return;

    // Simulate async worker execution
    setTimeout(() => {
      if (this.terminated) return;

      try {
        // Extract the function from the worker code (simplified mock)
        const workerCode = message.workerCode || '';
        const args = message.args || [];

        // For testing, we'll directly execute the function
        // In real implementation, this would be done in the worker
        const fn = eval(`(${workerCode})`);
        const result = fn(...args);

        if (result && typeof result.then === 'function') {
          // Handle promises
          result
            .then((res: any) => {
              if (!this.terminated && this.onmessage) {
                this.onmessage({
                  data: { type: 'result', result: res },
                } as MessageEvent);
              }
            })
            .catch((error: any) => {
              if (!this.terminated && this.onmessage) {
                this.onmessage({
                  data: { type: 'error', error: error.message },
                } as MessageEvent);
              }
            });
        } else {
          // Handle synchronous results
          if (!this.terminated && this.onmessage) {
            this.onmessage({
              data: { type: 'result', result },
            } as MessageEvent);
          }
        }
      } catch (error: any) {
        if (!this.terminated && this.onmessage) {
          this.onmessage({
            data: { type: 'error', error: error.message },
          } as MessageEvent);
        }
      }
    }, 0);
  }

  terminate() {
    this.terminated = true;
  }

  addEventListener(_type: string, _listener: EventListener) {
    // Mock implementation
  }

  removeEventListener(_type: string, _listener: EventListener) {
    // Mock implementation
  }
}

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-worker-url'),
});

// Mock Blob constructor
const MockBlob = vi
  .fn()
  .mockImplementation((parts: any[], options?: BlobPropertyBag) => {
    const content = parts
      .map((part) => (typeof part === 'string' ? part : part.toString()))
      .join('');

    return {
      parts,
      options,
      size: content.length,
      type: options?.type || '',
      text: () => Promise.resolve(content),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(content.length)),
      slice: vi.fn(),
      stream: vi.fn(),
    };
  });

global.Blob = MockBlob as any;

// Mock Worker
global.Worker = MockWorker as any;
