[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `T` *extends* `Function` ? `T` : `T` *extends* infer U[] ? `DeepRequired`\<`U`\>[] : `T` *extends* `object` ? `{ [K in keyof T]-?: DeepRequired<T[K]> }` : `T`

Defined in: [types/utilities.ts:15](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L15)

## Type Parameters

### T

`T`
