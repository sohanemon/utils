[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / OmitByType

# Type Alias: OmitByType\<T, U\>

> **OmitByType**\<`T`, `U`\> = `{ [K in keyof T as T[K] extends U ? never : K]: T[K] }`

Defined in: [types/utilities.ts:62](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L62)

## Type Parameters

### T

`T`

### U

`U`
