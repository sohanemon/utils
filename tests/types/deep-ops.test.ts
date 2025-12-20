import { describe, expectTypeOf } from 'vitest';
import {
  DeepPartial,
  DeepRequired,
  DeepReadonly,
} from '../../src/types/utilities';

describe('Deep Operations', () => {
  it('DeepPartial should make all nested properties optional', () => {
    type Config = {
      server: { host: string; port: number };
      features: string[];
    };
    expectTypeOf<DeepPartial<Config>>().toEqualTypeOf<{
      server?: { host?: string; port?: number };
      features?: string[];
    }>();
  });

  it('DeepRequired should make all nested properties required', () => {
    type PartialConfig = {
      server?: { host?: string; port?: number };
      features?: string[];
    };
    expectTypeOf<DeepRequired<PartialConfig>>().toEqualTypeOf<{
      server: { host: string; port: number };
      features: string[];
    }>();
  });

  it('DeepReadonly should make all nested properties readonly', () => {
    type Config = {
      server: { host: string; port: number };
      features: string[];
    };
    expectTypeOf<DeepReadonly<Config>>().toEqualTypeOf<{
      readonly server: { readonly host: string; readonly port: number };
      readonly features: readonly string[];
    }>();
  });

  it('DeepPartial should preserve functions', () => {
    type WithFunction = {
      data: { value: string };
      handler: () => void;
    };
    expectTypeOf<DeepPartial<WithFunction>>().toEqualTypeOf<{
      data?: { value?: string };
      handler: () => void;
    }>();
  });

  it('DeepRequired should preserve functions', () => {
    type WithFunction = {
      data?: { value?: string };
      handler: () => void;
    };
    expectTypeOf<DeepRequired<WithFunction>>().toEqualTypeOf<{
      data: { value: string };
      handler: () => void;
    }>();
  });

  it('DeepReadonly should preserve functions', () => {
    type WithFunction = {
      data: { value: string };
      handler: () => void;
    };
    expectTypeOf<DeepReadonly<WithFunction>>().toEqualTypeOf<{
      readonly data: { readonly value: string };
      readonly handler: () => void;
    }>();
  });
});
