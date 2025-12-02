import { describe, expect, it } from 'vitest';
import { hydrate } from '../../src/functions/hydrate';

describe('hydrate', () => {
  it('should convert null to undefined in objects', () => {
    const result = hydrate({ a: null, b: 1 });
    expect(result).toEqual({ a: undefined, b: 1 });
  });

  it('should handle nested objects', () => {
    const result = hydrate({ a: { b: null, c: { d: null } } });
    expect(result).toEqual({ a: { b: undefined, c: { d: undefined } } });
  });

  it('should handle arrays', () => {
    const result = hydrate([null, 1, { c: null }]);
    expect(result).toEqual([undefined, 1, { c: undefined }]);
  });

  it('should handle deeply nested arrays and objects', () => {
    const result = hydrate({
      arr: [null, { obj: [null, null] }],
      obj: { nested: [null, { deep: null }] },
    });
    expect(result).toEqual({
      arr: [undefined, { obj: [undefined, undefined] }],
      obj: { nested: [undefined, { deep: undefined }] },
    });
  });

  it('should handle primitives', () => {
    expect(hydrate(null)).toBe(undefined);
    expect(hydrate(undefined)).toBe(undefined);
    expect(hydrate(42)).toBe(42);
    expect(hydrate(0)).toBe(0);
    expect(hydrate(-1)).toBe(-1);
    expect(hydrate(3.14)).toBe(3.14);
    expect(hydrate('test')).toBe('test');
    expect(hydrate('')).toBe('');
    expect(hydrate(true)).toBe(true);
    expect(hydrate(false)).toBe(false);
    const sym = Symbol('test');
    expect(hydrate(sym)).toBe(sym);
    expect(hydrate(123n)).toBe(123n);
  });

  it('should handle empty objects and arrays', () => {
    expect(hydrate({})).toEqual({});
    expect(hydrate([])).toEqual([]);
  });

  it('should handle mixed types', () => {
    const result = hydrate({
      obj: { nested: null },
      arr: [null, 'item'],
      primitive: null,
      num: 42,
      bool: true,
    });
    expect(result).toEqual({
      obj: { nested: undefined },
      arr: [undefined, 'item'],
      primitive: undefined,
      num: 42,
      bool: true,
    });
  });

  it('should not mutate the original object', () => {
    const original = { a: null, b: { c: null } };
    const result = hydrate(original);
    expect(original).toEqual({ a: null, b: { c: null } });
    expect(result).toEqual({ a: undefined, b: { c: undefined } });
  });

  it('should handle special objects without recursion', () => {
    const date = new Date();
    const result = hydrate({
      date,
      reg: /test/,
      map: new Map([['key', null]]),
    });
    expect(result.date).toBe(date);
    expect(result.reg).toEqual(/test/);
    expect(result.map).toBeInstanceOf(Map);
    expect((result.map as Map<string, any>).get('key')).toBe(null); // null not converted since not recursed
  });

  it('should handle functions', () => {
    const func = () => 'test';
    expect(hydrate(func)).toBe(func);
  });

  it('should handle objects with null prototype', () => {
    const obj = Object.create(null);
    obj.a = null;
    obj.b = 1;
    const result = hydrate(obj);
    expect(result).toEqual({ a: undefined, b: 1 });
  });

  it('should handle large nested structures', () => {
    const deep: any = { level: 0 };
    let current: any = deep;
    for (let i = 1; i < 100; i++) {
      current.nested = { level: i, value: i % 2 === 0 ? null : i };
      current = current.nested;
    }
    const result: any = hydrate(deep);
    expect(result.level).toBe(0);
    current = result;
    for (let i = 1; i < 100; i++) {
      expect(current.nested.level).toBe(i);
      expect(current.nested.value).toBe(i % 2 === 0 ? undefined : i);
      current = current.nested;
    }
  });
});
