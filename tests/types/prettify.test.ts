import { describe, expectTypeOf, it } from 'vitest';
import { OR } from '../../src/types/gates';
import { Prettify } from '../../src/types/utilities';

describe('Prettify', () => {
  it('should flatten intersections', () => {
    type Complex = { a: string } & { b: number };
    expectTypeOf<Prettify<Complex>>().toEqualTypeOf<{ a: string; b: number }>();
  });

  it('should preserve unions distributively', () => {
    type TestUnion = OR<[string, { a: number; b: string }, () => void]>;
    type Prettified = Prettify<TestUnion>;
    expectTypeOf<Prettified>().toEqualTypeOf<
      string | { a: number; b: string } | (() => void)
    >();
  });

  it('should preserve primitives', () => {
    expectTypeOf<Prettify<string>>().toEqualTypeOf<string>();
    expectTypeOf<Prettify<number>>().toEqualTypeOf<number>();
  });

  it('should flatten object intersections in unions', () => {
    type UnionWithIntersection = OR<[{ x: string } & { y: number }, boolean]>;
    expectTypeOf<Prettify<UnionWithIntersection>>().toEqualTypeOf<
      { x: string; y: number } | boolean
    >();
  });
});
