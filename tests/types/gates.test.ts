import { describe, expectTypeOf } from 'vitest';
import { AND, OR, XOR, XNOR, NAND, NOR, NOT } from '../../src/types/gates';

describe('Logic Gates', () => {
  describe('AND gate', () => {
    it('should return intersection of all types', () => {
      type Result = AND<[true, true, true]>;
      expectTypeOf<Result>().toEqualTypeOf<true>();

      type Result2 = AND<[true, false, true]>;
      expectTypeOf<Result2>().toEqualTypeOf<never>();

      type Result3 = AND<[string, number]>;
      expectTypeOf<Result3>().toEqualTypeOf<string & number>();
    });

    it('should handle single element', () => {
      type Result = AND<[string]>;
      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle empty tuple', () => {
      type Result = AND<[]>;
      expectTypeOf<Result>().toEqualTypeOf<unknown>();
    });
  });

  describe('OR gate', () => {
    it('should return union of all types', () => {
      type Result = OR<[string, number, boolean]>;
      expectTypeOf<Result>().toEqualTypeOf<string | number | boolean>();

      type Result2 = OR<[true, false]>;
      expectTypeOf<Result2>().toEqualTypeOf<true | false>();
    });

    it('should handle single element', () => {
      type Result = OR<[string]>;
      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle empty tuple', () => {
      type Result = OR<[]>;
      expectTypeOf<Result>().toEqualTypeOf<never>();
    });
  });

  describe('XOR gate', () => {
    it('should return exclusive or', () => {
      type Result = XOR<[true, false, false]>;
      expectTypeOf<Result>().toEqualTypeOf<true>();

      type Result2 = XOR<[true, true, false]>;
      expectTypeOf<Result2>().toEqualTypeOf<false>();

      type Result3 = XOR<[string, number]>;
      expectTypeOf<Result3>().toEqualTypeOf<string | number>();
    });
  });

  describe('XNOR gate', () => {
    it('should return exclusive nor', () => {
      type Result = XNOR<[true, true, true]>;
      expectTypeOf<Result>().toEqualTypeOf<false>();

      type Result2 = XNOR<[true, false, true]>;
      expectTypeOf<Result2>().toEqualTypeOf<true>();
    });
  });

  describe('NAND gate', () => {
    it('should return not and', () => {
      type Result = NAND<[true, true]>;
      expectTypeOf<Result>().toEqualTypeOf<false>();

      type Result2 = NAND<[true, false]>;
      expectTypeOf<Result2>().toEqualTypeOf<true>();
    });
  });

  describe('NOR gate', () => {
    it('should return not or', () => {
      type Result = NOR<[true, false]>;
      expectTypeOf<Result>().toEqualTypeOf<false>();

      type Result2 = NOR<[false, false]>;
      expectTypeOf<Result2>().toEqualTypeOf<true>();
    });
  });

  describe('NOT gate', () => {
    it('should negate object properties', () => {
      type TestObj = { a: string; b: number };
      type Result = NOT<TestObj>;
      expectTypeOf<Result>().toEqualTypeOf<{ a?: never; b?: never }>();
    });
  });
});
