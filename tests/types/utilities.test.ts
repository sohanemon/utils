import { describe, expectTypeOf } from 'vitest';
import {
  Keys,
  Values,
  SelectivePartial,
  SelectiveRequired,
  Never,
  Nullable,
  Optional,
  Nullish,
  Maybe,
  Mutable,
  KeysOfType,
  OmitByType,
  RequiredKeys,
  Diff,
  Intersection,
  Merge,
  Substract,
  AllOrNone,
  OneOf,
  TwoOf,
  NestedKeyOf,
  Without,
} from '../../src/types/utilities';

describe('Basic Utilities', () => {
  it('Keys should extract object keys', () => {
    type TestObj = { a: string; b: number; c: boolean };
    expectTypeOf<Keys<TestObj>>().toEqualTypeOf<'a' | 'b' | 'c'>();
  });

  it('Values should extract object values', () => {
    type TestObj = { a: string; b: number };
    expectTypeOf<Values<TestObj>>().toEqualTypeOf<string | number>();
  });

  it('SelectivePartial should make specified keys optional', () => {
    type TestObj = { a: string; b: number; c: boolean };
    expectTypeOf<SelectivePartial<TestObj, 'b' | 'c'>>().toEqualTypeOf<{
      a: string;
      b?: number;
      c?: boolean;
    }>();
  });

  it('SelectiveRequired should make specified keys required', () => {
    type TestObj = { a?: string; b?: number; c?: boolean };
    expectTypeOf<SelectiveRequired<TestObj, 'a' | 'b'>>().toEqualTypeOf<{
      a: string;
      b: number;
      c?: boolean;
    }>();
  });

  it('Never should make all properties never', () => {
    type TestObj = { a: string; b: number };
    expectTypeOf<Never<TestObj>>().toEqualTypeOf<{ a: never; b: never }>();
  });

  it('Nullable should make all properties nullable', () => {
    type TestObj = { a: string; b: { c: number } };
    expectTypeOf<Nullable<TestObj>>().toEqualTypeOf<{
      a: string | null;
      b: { c: number | null } | null;
    }>();
  });

  it('Optional should make all properties optional with undefined', () => {
    type TestObj = { a: string; b: { c: number } };
    expectTypeOf<Optional<TestObj>>().toEqualTypeOf<{
      a: string | undefined;
      b: { c: number | undefined } | undefined;
    }>();
  });

  it('Nullish should make all properties nullish', () => {
    type TestObj = { a: string; b: { c: number } };
    expectTypeOf<Nullish<TestObj>>().toEqualTypeOf<{
      a: string | null | undefined;
      b: { c: number | null | undefined } | null | undefined;
    }>();
  });

  it('Maybe should make all properties optional and nullish', () => {
    type TestObj = { a: string; b: { c: number } };
    expectTypeOf<Maybe<TestObj>>().toEqualTypeOf<{
      a?: string | null | undefined;
      b?: { c?: number | null | undefined } | null | undefined;
    }>();
  });

  it('Mutable should remove readonly modifiers', () => {
    type ReadonlyObj = { readonly a: string; readonly b: number };
    expectTypeOf<Mutable<ReadonlyObj>>().toEqualTypeOf<{
      a: string;
      b: number;
    }>();
  });

  it('KeysOfType should extract keys with specific value type', () => {
    type TestObj = { a: string; b: number; c: string; d: boolean };
    expectTypeOf<KeysOfType<TestObj, string>>().toEqualTypeOf<'a' | 'c'>();
    expectTypeOf<KeysOfType<TestObj, number>>().toEqualTypeOf<'b'>();
  });

  it('OmitByType should omit properties with specific value type', () => {
    type TestObj = { a: string; b: number; c: string; d: boolean };
    expectTypeOf<OmitByType<TestObj, string>>().toEqualTypeOf<{
      b: number;
      d: boolean;
    }>();
  });

  it('RequiredKeys should make specified keys required', () => {
    type TestObj = { a?: string; b?: number; c?: boolean };
    expectTypeOf<RequiredKeys<TestObj, 'a' | 'b'>>().toEqualTypeOf<{
      a: string;
      b: number;
      c?: boolean;
    }>();
  });

  it('Diff should compute symmetric difference', () => {
    type A = { x: number; y: string };
    type B = { y: string; z: boolean };
    expectTypeOf<Diff<A, B>>().toEqualTypeOf<{ x: number; z: boolean }>();
  });

  it('Intersection should find common properties', () => {
    type A = { x: number; y: string };
    type B = { y: string; z: boolean };
    expectTypeOf<Intersection<A, B>>().toEqualTypeOf<{ y: string }>();
  });

  it('Merge should combine properties', () => {
    type A = { x: number; y: string };
    type B = { y: boolean; z: string };
    expectTypeOf<Merge<A, B>>().toEqualTypeOf<{
      x: number;
      y: boolean;
      z: string;
    }>();
  });

  it('Substract should remove properties from first type', () => {
    type A = { x: number; y: string; z: boolean };
    type B = { y: string };
    expectTypeOf<Substract<A, B>>().toEqualTypeOf<{ x: number; z: boolean }>();
  });

  it('AllOrNone should be all properties or none', () => {
    type Config = { host: string; port: number };
    expectTypeOf<AllOrNone<Config>>().toEqualTypeOf<
      { host: string; port: number } | {}
    >();
  });

  it('OneOf should have exactly one property', () => {
    type Action =
      | { type: 'create'; payload: string }
      | { type: 'update'; id: number };
    expectTypeOf<OneOf<Action>>().toEqualTypeOf<Action>();
  });

  it('TwoOf should have exactly two properties', () => {
    type Config = { a: number; b: string; c: boolean };
    expectTypeOf<TwoOf<Config>>().toEqualTypeOf<
      | { a: number; b: string }
      | { a: number; c: boolean }
      | { b: string; c: boolean }
    >();
  });

  it('NestedKeyOf should extract nested keys', () => {
    type User = {
      name: string;
      profile: { age: number; address: { city: string } };
      tags: string[];
    };
    expectTypeOf<NestedKeyOf<User>>().toEqualTypeOf<
      | 'name'
      | 'profile'
      | 'profile.age'
      | 'profile.address'
      | 'profile.address.city'
      | 'tags'
    >();
  });

  it('Without should exclude properties', () => {
    type A = { x: number; y: string };
    type B = { y: string };
    expectTypeOf<Without<A, B>>().toEqualTypeOf<{ x?: never }>();
  });
});
