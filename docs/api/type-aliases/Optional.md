[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / Optional

# Type Alias: Optional\<T\>

> **Optional**\<`T`\> = `T` *extends* `object` ? `{ [P in keyof T]: Optional<T[P]> }` : `T` \| `undefined`

Defined in: [types/utilities.ts:34](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L34)

## Type Parameters

### T

`T`
