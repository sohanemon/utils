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
    expect(extended.a).toBe(1);
    expect(extended.b).toBe(2);
  });

  it('should extend object with multiple properties', () => {
    const base = { name: 'John' };
    const extended = extendProps(base, { age: 30, city: 'NYC' });
    expect(extended).toEqual({ name: 'John', age: 30, city: 'NYC' });
    expect(extended.name).toBe('John');
    expect(extended.age).toBe(30);
    expect(extended.city).toBe('NYC');
  });

  it('should extend function with properties', () => {
    const baseFn = () => 'hello';
    const extendedFn = extendProps(baseFn, {
      description: 'Greeting function',
      version: '1.0',
    });
    expect(typeof extendedFn).toBe('function');
    expect(extendedFn()).toBe('hello');
    expect(extendedFn.description).toBe('Greeting function');
    expect(extendedFn.version).toBe('1.0');
    expect(extendedFn).toBe(baseFn); // same reference
  });

  it('should extend array with properties', () => {
    const baseArray = [1, 2, 3];
    const extendedArray = extendProps(baseArray, {
      total: 6,
      description: 'Numbers',
    });
    expect(extendedArray[0]).toBe(1);
    expect(extendedArray[1]).toBe(2);
    expect(extendedArray[2]).toBe(3);
    expect(extendedArray.length).toBe(3);
    expect(extendedArray.total).toBe(6);
    expect(extendedArray.description).toBe('Numbers');
    expect(extendedArray).toBe(baseArray); // same reference
  });

  it('should handle union types - object case', () => {
    const base: { id: string } | null = { id: '123' };
    const extended = extendProps(base, { name: 'Test' });
    expect(extended).not.toBe(null);
    expect(extended?.id).toBe('123');
    expect(extended?.name).toBe('Test');
  });

  it('should handle union types - null case', () => {
    const base: { id: string } | null = null;
    const extended = extendProps(base, { name: 'Test' });
    expect(extended).toBe(null);
  });

  it('should handle union types - undefined case', () => {
    const base: { id: string } | undefined = undefined;
    const extended = extendProps(base, { name: 'Test' });
    expect(extended).toBe(undefined);
  });

  it('should handle complex union types', () => {
    type ComplexType = { id: string; data: number[] } | null | undefined;
    const base: ComplexType = { id: 'abc', data: [1, 2, 3] };
    const extended = extendProps(base, { meta: 'info' });
    expect(extended).not.toBe(null);
    expect(extended?.id).toBe('abc');
    expect(extended?.data).toEqual([1, 2, 3]);
    expect(extended?.meta).toBe('info');
  });

  it('should return null when base is null', () => {
    const base: { id: string } | null = null;
    const extended = extendProps(base, { customProp: 'value' });
    expect(extended).toBe(null);
  });

  it('should return undefined when base is undefined', () => {
    const base: { id: string } | undefined = undefined;
    const extended = extendProps(base, { customProp: 'value' });
    expect(extended).toBe(undefined);
  });

  it('should handle empty props object', () => {
    const base = { a: 1 };
    const extended = extendProps(base, {});
    expect(extended).toEqual({ a: 1 });
    expect(extended).toBe(base);
  });

  it('should override existing properties', () => {
    const base = { a: 1, b: 2 };
    const extended = extendProps(base, { b: 3, c: 4 });
    expect(extended).toEqual({ a: 1, b: 3, c: 4 });
    expect(extended.a).toBe(1);
    expect(extended.b).toBe(3);
    expect(extended.c).toBe(4);
  });

  it('should preserve prototype chain for objects', () => {
    class TestClass {
      method() {
        return 'original';
      }
    }
    const instance = new TestClass();
    const extended = extendProps(instance, { extra: 'prop' });
    expect(extended.method()).toBe('original');
    expect(extended.extra).toBe('prop');
    expect(extended instanceof TestClass).toBe(true);
  });

  it('should handle symbol properties', () => {
    const sym = Symbol('test');
    const base = { [sym]: 'symbol value' };
    const extended = extendProps(base, { normal: 'prop' });
    expect(extended[sym]).toBe('symbol value');
    expect(extended.normal).toBe('prop');
  });

  it('should handle getter/setter properties', () => {
    const base = {
      _value: 42,
      get value() {
        return this._value;
      },
      set value(v) {
        this._value = v;
      },
    };
    const extended = extendProps(base, { computed: 'test' });
    expect(extended.value).toBe(42);
    extended.value = 100;
    expect(extended.value).toBe(100);
    expect(extended.computed).toBe('test');
  });
});
