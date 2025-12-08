[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / Nullable

# Type Alias: Nullable\<T\>

> **Nullable**\<`T`\> = `T` *extends* `object` ? `{ [P in keyof T]: Nullable<T[P]> }` : `T` \| `null`

Defined in: [types/utilities.ts:30](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L30)

## Type Parameters

### T

`T`
