import { describe, it, expect } from 'vitest';
import { hydrate, isWithFallbackCompatible } from '../../src/functions/hydrate';

describe('hydrate', () => {
  it('should convert null to undefined', () => {
    const result = hydrate({ a: null, b: 1 } as any);
    expect(result).toEqual({ a: undefined, b: 1 });
  });

  it('should merge with fallback', () => {
    const result = hydrate({ a: null } as any, { a: 'default' });
    expect(result).toEqual({ a: { a: 'default' } });
  });

  it('should handle nested objects', () => {
    const result = hydrate({ a: { b: null } } as any, { a: { b: 'default' } });
    expect(result).toEqual({ a: { b: { a: { b: 'default' } } } });
  });

  it('should handle arrays', () => {
    const result = hydrate([null, 1] as any, ['default'] as any);
    expect(result).toEqual([['default'], 1]);
  });

  it('should respect convertNullToUndefined option', () => {
    const result = hydrate({ a: null } as any, undefined, {
      convertNullToUndefined: false,
    });
    expect(result).toEqual({ a: null });
  });
});

describe('isWithFallbackCompatible', () => {
  it('should check compatibility', () => {
    expect(isWithFallbackCompatible({})).toBe(true);
    expect(isWithFallbackCompatible([])).toBe(true);
    expect(isWithFallbackCompatible(null)).toBe(false);
  });
});
