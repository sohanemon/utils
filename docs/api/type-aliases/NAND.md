[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / NAND

# Type Alias: NAND\<T\>

> **NAND**\<`T`\> = [`NOT`](NOT.md)\<[`AND`](AND.md)\<`T`\>\>

Defined in: [types/gates.ts:141](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/gates.ts#L141)

Computes a type-level NAND for a tuple of types.

Truth table for 3 arguments:

A  B  C  = NAND
1  1  1  = 0
1  1  0  = 1
1  0  1  = 1
1  0  0  = 1
0  1  1  = 1
0  1  0  = 1
0  0  1  = 1
0  0  0  = 1

## Type Parameters

### T

`T` *extends* `any`[]

Tuple of boolean-like types (1/0)
