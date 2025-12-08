[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / Nullish

# Type Alias: Nullish\<T\>

> **Nullish**\<`T`\> = `T` *extends* `object` ? `{ [P in keyof T]: Nullish<T[P]> }` : `T` \| `null` \| `undefined`

Defined in: [types/utilities.ts:38](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L38)

## Type Parameters

### T

`T`
