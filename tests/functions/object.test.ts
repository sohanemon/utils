import { describe, expect, it } from 'vitest';
import { extendProps, getObjectValue } from '../../src/functions/object';

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
