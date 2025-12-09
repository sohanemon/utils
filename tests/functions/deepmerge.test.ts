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
    expect(result['a']).toBe(1);
    expect(result['b']).toBe(2);
    // Note: with cloning, self points to original, not result
    expect(result['self']).toBe(obj1);
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
        customMerge: (key: string, targetVal: any, sourceVal: any) => {
          if (key === 'a') return targetVal + sourceVal;
          return sourceVal;
        },
      },
    );
    expect(result).toEqual({ a: 3 });
  });

  it('should handle primitive targets', () => {
    const result = deepmerge(42 as any, { a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('should handle string primitives', () => {
    const result = deepmerge('hello' as any, { a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('should handle boolean primitives', () => {
    const result = deepmerge(true as any, { a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('should skip null sources', () => {
    const result = deepmerge({ a: 1 }, null as any, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle undefined sources', () => {
    const result = deepmerge({ a: 1 }, undefined as any, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle null target', () => {
    const result = deepmerge(null as any, { a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('should handle undefined target', () => {
    const result = deepmerge(undefined as any, { a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('should merge symbol keys', () => {
    const sym = Symbol('test');
    const result = deepmerge({ [sym]: 1 }, { [sym]: 2 });
    expect(result[sym]).toBe(2);
  });

  it('should handle symbol values', () => {
    const sym = Symbol('value');
    const result = deepmerge({ a: sym }, { b: 1 });
    expect(result.a).toBe(sym);
    expect(result.b).toBe(1);
  });

  it('should handle Date objects', () => {
    const date1 = new Date('2020-01-01');
    const date2 = new Date('2021-01-01');
    const result = deepmerge({ date: date1 }, { date: date2 });
    expect(result.date).toBe(date2);
  });

  it('should handle RegExp objects', () => {
    const regex1 = /test/;
    const regex2 = /other/;
    const result = deepmerge({ regex: regex1 }, { regex: regex2 });
    expect(result.regex).toBe(regex2);
  });

  it('should handle function values', () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const result = deepmerge({ fn: fn1 }, { fn: fn2 });
    expect(result.fn).toBe(fn2);
  });

  it('should not clone when clone is false', () => {
    const target = { a: 1 };
    const result = deepmerge(target, { b: 2 }, { clone: false });
    expect(result).toBe(target);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should merge multiple sources', () => {
    const result = deepmerge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it('should merge multiple sources with nested objects', () => {
    const result = deepmerge({ a: { x: 1 } }, { a: { y: 2 } }, { b: { z: 3 } });
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: { z: 3 } });
  });

  it('should handle empty objects', () => {
    const result = deepmerge({}, { a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('should handle empty arrays', () => {
    const result = deepmerge([], [1, 2]);
    expect(result).toEqual([1, 2]);
  });

  it('should merge with empty source', () => {
    const result = deepmerge({ a: 1 }, {});
    expect(result).toEqual({ a: 1 });
  });

  it('should handle array vs object mismatch', () => {
    const result = deepmerge({ a: [1, 2] }, { a: { b: 3 } });
    expect(result).toEqual({ a: { b: 3 } });
  });

  it('should handle object vs array mismatch', () => {
    const result = deepmerge({ a: { b: 1 } }, { a: [2, 3] });
    expect(result).toEqual({ a: [2, 3] });
  });

  it('should handle primitive vs object mismatch', () => {
    const result = deepmerge({ a: 1 }, { a: { b: 2 } });
    expect(result).toEqual({ a: { b: 2 } });
  });

  it('should merge arrays of different lengths with merge strategy', () => {
    const result = deepmerge(
      { arr: [1, 2] },
      { arr: [3] },
      { arrayMerge: 'merge' },
    );
    expect(result).toEqual({ arr: [3, 2] });
  });

  it('should merge arrays with objects of different lengths', () => {
    const result = deepmerge(
      { arr: [{ a: 1 }, { b: 2 }] },
      { arr: [{ c: 3 }] },
      { arrayMerge: 'merge' },
    );
    expect(result).toEqual({ arr: [{ a: 1, c: 3 }, { b: 2 }] });
  });

  it('should merge functions with custom merge', () => {
    const fn1 = () => 'first';
    const fn2 = () => 'second';
    const result = deepmerge(
      { fn: fn1 },
      { fn: fn2 },
      {
        customMerge: (key, target, source) => {
          if (typeof target === 'function' && typeof source === 'function') {
            return () => `${target()} and ${source()}`;
          }
          return source;
        },
      },
    );
    expect(result.fn()).toBe('first and second');
  });

  it('should merge functions directly with custom merge', () => {
    const fn1 = () => 'first';
    const fn2 = () => 'second';
    const result = deepmerge(fn1 as any, fn2 as any, {
      customMerge: (key, target, source) => {
        if (typeof target === 'function' && typeof source === 'function') {
          return () => `${target()} and ${source()}`;
        }
        return source;
      },
    }) as any;
    expect(result()).toBe('first and second');
  });

  it('should chain multiple function merges', () => {
    const result = deepmerge(
      { onFinish: () => 'first' },
      { onFinish: () => 'second' },
      { onFinish: (v: string) => `third ${v}` },
      {
        customMerge: (key, target, source) => {
          if (typeof target === 'function' && typeof source === 'function') {
            return (...args: any[]) => {
              target(...args);
              return source(...args);
            };
          }
          return source;
        },
      },
    );
    expect(result.onFinish('test')).toBe('third test');
  });

  it('should replace functions by default', () => {
    const fn1 = () => 'first';
    const fn2 = () => 'second';
    const result = deepmerge({ fn: fn1 }, { fn: fn2 });
    expect(result.fn).toBe(fn2);
  });

  it('should compose functions with functionMerge option', () => {
    const calls: string[] = [];
    const fn1 = () => calls.push('first');
    const fn2 = () => calls.push('second');
    const result = deepmerge(
      { fn: fn1 },
      { fn: fn2 },
      { functionMerge: 'compose' },
    );
    result.fn();
    expect(calls).toEqual(['first', 'second']);
  });

  it('should compose top-level functions', () => {
    const calls: string[] = [];
    const fn1 = () => calls.push('first');
    const fn2 = () => calls.push('second');
    const result = deepmerge(fn1 as any, fn2 as any, {
      functionMerge: 'compose',
    }) as any;
    result();
    expect(calls).toEqual(['first', 'second']);
  });

  it('should replace functions when functionMerge is replace', () => {
    const fn1 = () => 'first';
    const fn2 = () => 'second';
    const result = deepmerge(
      { fn: fn1 },
      { fn: fn2 },
      { functionMerge: 'replace' },
    );
    expect(result.fn).toBe(fn2);
  });
});
