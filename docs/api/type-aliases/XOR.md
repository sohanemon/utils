[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / XOR

# Type Alias: XOR\<T\>

> **XOR**\<`T`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `R` *extends* \[infer S, `...(infer Rest)`\] ? `XOR`\<\[[`XOR_Binary`](XOR_Binary.md)\<`F`, `S`\>, `...Rest`\]\> : `F` : `never`

Defined in: [types/gates.ts:76](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/gates.ts#L76)

Computes a type-level XOR (only one/odd) for a tuple of types.

Truth table for 3 arguments:

A  B  C  = XOR
1  1  1  = 1
1  1  0  = 0
1  0  1  = 0
1  0  0  = 1
0  1  1  = 0
0  1  0  = 1
0  0  1  = 1
0  0  0  = 0

## Type Parameters

### T

`T` *extends* `any`[]

Tuple of boolean-like types (1/0)
