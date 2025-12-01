import { describe, it, expect } from 'vitest';
import {
  getObjectValue,
  extendProps,
  deepmerge,
} from '../../src/functions/object';

describe('getObjectValue', () => {
  it('should get nested value with dot notation', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(getObjectValue(obj, 'a.b.c')).toBe(42);
  });

  it('should get nested value with array path', () => {
    const obj = { a: [{ b: 42 }] };
    expect(getObjectValue(obj, ['a', 0, 'b'])).toBe(42);
  });

  it('should return default value when path not found', () => {
    const obj = { a: 1 };
    expect(getObjectValue(obj, 'b', 'default')).toBe('default');
  });

  it('should return undefined when path not found and no default', () => {
    const obj = { a: 1 };
    expect(getObjectValue(obj, 'b')).toBeUndefined();
  });
});

describe('extendProps', () => {
  it('should extend object with additional properties', () => {
    const base = { a: 1 };
    const extended = extendProps(base, { b: 2 });
    expect(extended).toEqual({ a: 1, b: 2 });
    expect(extended).toBe(base); // same reference
  });
});

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
