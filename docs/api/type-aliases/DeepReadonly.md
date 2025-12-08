[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / DeepReadonly

# Type Alias: DeepReadonly\<T\>

> **DeepReadonly**\<`T`\> = `T` *extends* `Function` ? `T` : `T` *extends* infer U[] ? `ReadonlyArray`\<`DeepReadonly`\<`U`\>\> : `T` *extends* `object` ? `{ readonly [K in keyof T]: DeepReadonly<T[K]> }` : `T`

Defined in: [types/utilities.ts:46](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L46)

## Type Parameters

### T

`T`
