[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / Maybe

# Type Alias: Maybe\<T\>

> **Maybe**\<`T`\> = `T` *extends* `object` ? `{ [P in keyof T]?: Nullish<T[P]> }` : `T` \| `null` \| `undefined`

Defined in: [types/utilities.ts:42](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L42)

## Type Parameters

### T

`T`
