import { describe, it, expect, vi } from 'vitest';
import { shield } from '../../src/functions/shield';

describe('shield', () => {
  describe('sync operations', () => {
    it('should return [null, data] for successful sync operation', () => {
      const result = shield(() => 'success');
      expect(result).toEqual([null, 'success']);
    });

    it('should return [error, null] for failed sync operation', () => {
      const error = new Error('Test error');
      const result = shield(() => {
        throw error;
      });
      expect(result).toEqual([error, null]);
    });

    it('should handle non-Error throws', () => {
      const result = shield(() => {
        throw 'string error';
      });
      expect(result).toEqual(['string error', null]);
    });

    it('should handle complex return values', () => {
      const obj = { key: 'value' };
      const result = shield(() => obj);
      expect(result).toEqual([null, obj]);
    });

    it('should handle null return', () => {
      const result = shield(() => null);
      expect(result).toEqual([null, null]);
    });

    it('should handle undefined return', () => {
      const result = shield(() => undefined);
      expect(result).toEqual([null, undefined]);
    });
  });

  describe('async operations', () => {
    it('should return [null, data] for successful async operation', async () => {
      const promise = Promise.resolve('async success');
      const result = await shield(promise);
      expect(result).toEqual([null, 'async success']);
    });

    it('should return [error, null] for failed async operation', async () => {
      const error = new Error('Async error');
      const promise = Promise.reject(error);
      const result = await shield(promise);
      expect(result).toEqual([error, null]);
    });

    it('should handle async operation that throws non-Error', async () => {
      const promise = Promise.reject('async string error');
      const result = await shield(promise);
      expect(result).toEqual(['async string error', null]);
    });

    it('should handle resolved promise with complex data', async () => {
      const data = { async: true, value: 42 };
      const promise = Promise.resolve(data);
      const result = await shield(promise);
      expect(result).toEqual([null, data]);
    });
  });

  describe('function name logging', () => {
    it('should log error with function name for sync failures', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      function namedFunction() {
        throw new Error('fail');
      }

      shield(namedFunction);

      expect(consoleSpy).toHaveBeenCalledWith(
        '\x1b[31m🛡 [shield]\x1b[0m namedFunction failed →',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle anonymous functions', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      shield(() => {
        throw new Error('anonymous fail');
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '\x1b[31m🛡 [shield]\x1b[0m  failed →',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle function that returns promise-like object', () => {
      const result = shield(() => ({
        then: () => 'not a real promise',
      }));
      expect(result).toEqual([null, { then: expect.any(Function) }]);
    });

    it('should handle throwing undefined', () => {
      const result = shield(() => {
        throw undefined;
      });
      expect(result).toEqual([undefined, null]);
    });

    it('should handle throwing null', () => {
      const result = shield(() => {
        throw null;
      });
      expect(result).toEqual([null, null]);
    });

    it('should handle throwing object', () => {
      const obj = { custom: 'error' };
      const result = shield(() => {
        throw obj;
      });
      expect(result).toEqual([obj, null]);
    });
  });

  describe('type safety', () => {
    it('should maintain type information for sync operations', () => {
      const result = shield(() => 42 as const);
      expect(result).toEqual([null, 42]);
      // TypeScript should infer [null, 42] | [Error, null]
    });

    it('should maintain type information for async operations', async () => {
      const promise = Promise.resolve('typed' as const);
      const result = await shield(promise);
      expect(result).toEqual([null, 'typed']);
    });
  });
});
