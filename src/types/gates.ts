import { Without } from './utilities';

export type BUFFER<T> = T;

export type IMPLIES<T, U> = T extends U ? true : false;

export type XOR_Binary<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type XNOR_Binary<T, U> = (T & U) | (Without<T, U> & Without<U, T>);

/**
 * Computes a type-level AND for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = AND
 * 1  1  1  = 1
 * 1  1  0  = 0
 * 1  0  1  = 0
 * 1  0  0  = 0
 * 0  1  1  = 0
 * 0  1  0  = 0
 * 0  0  1  = 0
 * 0  0  0  = 0
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type AND<T extends any[]> = T extends [infer F, ...infer R]
  ? R extends any[]
    ? F & AND<R>
    : F
  : unknown;

/**
 * Computes a type-level OR for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = OR
 * 1  1  1  = 1
 * 1  1  0  = 1
 * 1  0  1  = 1
 * 1  0  0  = 1
 * 0  1  1  = 1
 * 0  1  0  = 1
 * 0  0  1  = 1
 * 0  0  0  = 0
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type OR<T extends any[]> = T extends [infer F, ...infer R]
  ? R extends any[]
    ? F | OR<R>
    : F
  : never;

/**
 * Computes a type-level XOR for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = XOR
 * 1  1  1  = 1
 * 1  1  0  = 0
 * 1  0  1  = 0
 * 1  0  0  = 1
 * 0  1  1  = 0
 * 0  1  0  = 1
 * 0  0  1  = 1
 * 0  0  0  = 0
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type XOR<T extends any[]> = T extends [infer F, ...infer R]
  ? R extends [infer S, ...infer Rest]
    ? XOR<[XOR_Binary<F, S>, ...Rest]>
    : F
  : never;

/**
 * Computes a type-level XNOR for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = XNOR
 * 1  1  1  = 0
 * 1  1  0  = 1
 * 1  0  1  = 1
 * 1  0  0  = 0
 * 0  1  1  = 1
 * 0  1  0  = 0
 * 0  0  1  = 0
 * 0  0  0  = 1
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type XNOR<T extends any[]> = T extends [infer F, ...infer R]
  ? R extends [infer S, ...infer Rest]
    ? XNOR<[XNOR_Binary<F, S>, ...Rest]>
    : F
  : never;

/**
 * Computes a type-level NOT for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = NOT
 * 1  1  1  = 0
 * 1  1  0  = 0
 * 1  0  1  = 0
 * 1  0  0  = 0
 * 0  1  1  = 0
 * 0  1  0  = 0
 * 0  0  1  = 0
 * 0  0  0  = 1
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type NOT<T> = { [P in keyof T]?: never };

/**
 * Computes a type-level NAND for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = NAND
 * 1  1  1  = 0
 * 1  1  0  = 1
 * 1  0  1  = 1
 * 1  0  0  = 1
 * 0  1  1  = 1
 * 0  1  0  = 1
 * 0  0  1  = 1
 * 0  0  0  = 1
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type NAND<T extends any[]> = NOT<AND<T>>;

/**
 * Computes a type-level NOR for a tuple of types.
 *
 * Truth table for 3 arguments:
 *
 * A  B  C  = NOR
 * 1  1  1  = 0
 * 1  1  0  = 0
 * 1  0  1  = 0
 * 1  0  0  = 0
 * 0  1  1  = 0
 * 0  1  0  = 0
 * 0  0  1  = 0
 * 0  0  0  = 1
 *
 * @template T - Tuple of boolean-like types (1/0)
 */
export type NOR<T extends any[]> = NOT<OR<T>>;
