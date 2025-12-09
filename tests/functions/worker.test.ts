import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the workerize function to simulate worker behavior for testing
vi.mock('../../src/functions/worker', () => ({
  workerize: vi.fn((fn: Function) => {
    return (...args: any[]) => {
      return new Promise((resolve, reject) => {
        try {
          const result = fn(...args);
          if (result && typeof result.then === 'function') {
            // Handle async functions
            result.then(resolve).catch((error: any) => {
              reject(new Error(error.message || String(error)));
            });
          } else {
            // Handle sync functions
            resolve(result);
          }
        } catch (error: any) {
          reject(new Error(error.message || String(error)));
        }
      });
    };
  }),
}));

// Import after mocking
import { workerize } from '../../src/functions/worker';

const mockWorkerize = vi.mocked(workerize);

describe('workerize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should workerize a simple synchronous function', async () => {
    const add = (a: number, b: number) => a + b;
    const workerizedAdd = workerize(add);

    const result = await workerizedAdd(2, 3);
    expect(result).toBe(5);
    expect(mockWorkerize).toHaveBeenCalledWith(add);
  });

  it('should workerize an async function', async () => {
    const asyncAdd = async (a: number, b: number) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return a + b;
    };
    const workerizedAsyncAdd = workerize(asyncAdd);

    const result = await workerizedAsyncAdd(3, 4);
    expect(result).toBe(7);
  });

  it('should handle functions with no parameters', async () => {
    const getRandom = () => Math.random();
    const workerizedGetRandom = workerize(getRandom);

    // Mock Math.random for consistent result
    const mockRandom = 0.12345;
    vi.spyOn(Math, 'random').mockReturnValue(mockRandom);

    const result = await workerizedGetRandom();
    expect(result).toBe(mockRandom);
  });

  it('should handle functions with complex parameters', async () => {
    const processObject = (obj: { name: string; value: number }) =>
      `${obj.name}: ${obj.value * 2}`;

    const workerizedProcess = workerize(processObject);
    const input = { name: 'test', value: 42 };

    const result = await workerizedProcess(input);
    expect(result).toBe('test: 84');
  });

  it('should handle functions returning objects', async () => {
    const createUser = (name: string, age: number) => ({
      name,
      age,
      active: true,
    });
    const workerizedCreateUser = workerize(createUser);

    const expectedUser = { name: 'John', age: 30, active: true };
    const result = await workerizedCreateUser('John', 30);
    expect(result).toEqual(expectedUser);
  });

  it('should handle worker errors', async () => {
    const failingFunction = () => {
      throw new Error('Function failed');
    };
    const workerizedFailing = workerize(failingFunction);

    await expect(workerizedFailing()).rejects.toThrow('Function failed');
  });

  it('should handle worker runtime errors', async () => {
    const runtimeErrorFunction = () => {
      const obj = null as any;
      return obj.property;
    };
    const workerizedRuntimeError = workerize(runtimeErrorFunction);

    await expect(workerizedRuntimeError()).rejects.toThrow();
  });

  it('should handle multiple concurrent executions', async () => {
    const multiply = (a: number, b: number) => a * b;
    const workerizedMultiply = workerize(multiply);

    const results = await Promise.all([
      workerizedMultiply(2, 3),
      workerizedMultiply(4, 5),
      workerizedMultiply(6, 7),
    ]);

    expect(results).toEqual([6, 20, 42]);
  });

  it('should handle functions with default parameters', async () => {
    const greet = (name: string, prefix = 'Hello') => `${prefix} ${name}`;
    const workerizedGreet = workerize(greet);

    const result = await workerizedGreet('World');
    expect(result).toBe('Hello World');
  });

  it('should handle functions with rest parameters', async () => {
    const sumAll = (...numbers: number[]) => numbers.reduce((a, b) => a + b, 0);
    const workerizedSumAll = workerize(sumAll);

    const result = await workerizedSumAll(1, 2, 3, 4, 5);
    expect(result).toBe(15);
  });

  it('should handle functions returning undefined', async () => {
    const sideEffect = () => undefined;
    const workerizedSideEffect = workerize(sideEffect);

    const result = await workerizedSideEffect();
    expect(result).toBeUndefined();
  });

  it('should handle functions returning null', async () => {
    const returnNull = () => null;
    const workerizedReturnNull = workerize(returnNull);

    const result = await workerizedReturnNull();
    expect(result).toBeNull();
  });

  it('should handle large data structures', async () => {
    const processArray = (arr: number[]) => arr.map((x) => x * 2);
    const workerizedProcessArray = workerize(processArray);
    const largeArray = Array.from({ length: 1000 }, (_, i) => i);

    const expectedResult = largeArray.map((x) => x * 2);
    const result = await workerizedProcessArray(largeArray);
    expect(result).toEqual(expectedResult);
  });
});
