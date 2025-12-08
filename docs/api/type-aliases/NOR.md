[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / NOR

# Type Alias: NOR\<T\>

> **NOR**\<`T`\> = [`NOT`](NOT.md)\<[`OR`](OR.md)\<`T`\>\>

Defined in: [types/gates.ts:160](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/gates.ts#L160)

Computes a type-level NOR for a tuple of types.

Truth table for 3 arguments:

A  B  C  = NOR
1  1  1  = 0
1  1  0  = 0
1  0  1  = 0
1  0  0  = 0
0  1  1  = 0
0  1  0  = 0
0  0  1  = 0
0  0  0  = 1

## Type Parameters

### T

`T` *extends* `any`[]

Tuple of boolean-like types (1/0)
