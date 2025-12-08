[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / OR

# Type Alias: OR\<T\>

> **OR**\<`T`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `R` *extends* `any`[] ? `F` \| `OR`\<`R`\> : `F` : `never`

Defined in: [types/gates.ts:53](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/gates.ts#L53)

Computes a type-level OR (At least one) for a tuple of types.

Truth table for 3 arguments:

A  B  C  = OR
1  1  1  = 1
1  1  0  = 1
1  0  1  = 1
1  0  0  = 1
0  1  1  = 1
0  1  0  = 1
0  0  1  = 1
0  0  0  = 0

## Type Parameters

### T

`T` *extends* `any`[]

Tuple of boolean-like types (1/0)
