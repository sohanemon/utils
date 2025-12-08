[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / XNOR

# Type Alias: XNOR\<T\>

> **XNOR**\<`T`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `R` *extends* \[infer S, `...(infer Rest)`\] ? `XNOR`\<\[[`XNOR_Binary`](XNOR_Binary.md)\<`F`, `S`\>, `...Rest`\]\> : `F` : `never`

Defined in: [types/gates.ts:99](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/gates.ts#L99)

Computes a type-level XNOR (All or None true) for a tuple of types.

Truth table for 3 arguments:

A  B  C  = XNOR
1  1  1  = 0
1  1  0  = 1
1  0  1  = 1
1  0  0  = 0
0  1  1  = 1
0  1  0  = 0
0  0  1  = 0
0  0  0  = 1

## Type Parameters

### T

`T` *extends* `any`[]

Tuple of boolean-like types (1/0)
