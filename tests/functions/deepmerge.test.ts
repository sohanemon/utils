import { describe, expect, it } from 'vitest';
import { deepmerge } from '../../src/functions/deepmerge';

describe('deepmerge', () => {
  it('should merge basic objects', () => {
    const result = deepmerge({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should merge nested objects', () => {
    const result = deepmerge({ a: { x: 1 } }, { a: { y: 2 } });
    expect(result).toEqual({ a: { x: 1, y: 2 } });
  });

  it('should handle arrays with replace strategy', () => {
    const result = deepmerge({ arr: [1] }, { arr: [2] });
    expect(result).toEqual({ arr: [2] });
  });

  it('should handle arrays with concat strategy', () => {
    const result = deepmerge(
      { arr: [1] },
      { arr: [2] },
      { arrayMerge: 'concat' },
    );
    expect(result).toEqual({ arr: [1, 2] });
  });

  it('should handle arrays with merge strategy', () => {
    const result = deepmerge(
      { arr: [{ a: 1 }] },
      { arr: [{ b: 2 }] },
      { arrayMerge: 'merge' },
    );
    expect(result).toEqual({ arr: [{ a: 1, b: 2 }] });
  });

  it('should allow sources with extra properties', () => {
    const result = deepmerge({ a: 1 }, { b: 2, c: 3 });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should handle circular references', () => {
    const obj1: any = { a: 1 };
    obj1.self = obj1;
    const obj2 = { b: 2 };
    const result = deepmerge(obj1, obj2);
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    // Note: with cloning, self points to original, not result
    expect(result.self).toBe(obj1);
  });

  it('should respect maxDepth', () => {
    const result = deepmerge(
      { a: { b: { c: 1 } } },
      { a: { b: { d: 2 } } },
      { maxDepth: 2 },
    );
    expect(result.a.b).toEqual({ c: 1 }); // maxDepth prevents deep merge
  });

  it('should use custom merge function', () => {
    const result = deepmerge(
      { a: 1 },
      { a: 2 },
      {
        customMerge: (key, targetVal, sourceVal) => {
          if (key === 'a') return targetVal + sourceVal;
          return sourceVal;
        },
      },
    );
    expect(result).toEqual({ a: 3 });
  });
});
