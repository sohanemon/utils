[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / NOT

# Type Alias: NOT\<T\>

> **NOT**\<`T`\> = `{ [P in keyof T]?: never }`

Defined in: [types/gates.ts:122](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/gates.ts#L122)

Computes a type-level NOT for a tuple of types.

Truth table for 3 arguments:

A  B  C  = NOT
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

`T`

Tuple of boolean-like types (1/0)
