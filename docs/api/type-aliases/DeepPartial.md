[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / DeepPartial

# Type Alias: DeepPartial\<T\>

> **DeepPartial**\<`T`\> = `T` *extends* `Function` ? `T` : `T` *extends* infer U[] ? `DeepPartial`\<`U`\>[] : `T` *extends* `object` ? `{ [K in keyof T]?: DeepPartial<T[K]> }` : `T`

Defined in: [types/utilities.ts:4](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L4)

## Type Parameters

### T

`T`
