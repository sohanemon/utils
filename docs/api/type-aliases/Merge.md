[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / Merge

# Type Alias: Merge\<T, U, I\>

> **Merge**\<`T`, `U`, `I`\> = `Pick`\<`I`, keyof `I`\>

Defined in: [types/utilities.ts:76](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L76)

## Type Parameters

### T

`T` *extends* `object`

### U

`U` *extends* `object`

### I

`I` = [`Diff`](Diff.md)\<`T`, `U`\> & [`Intersection`](Intersection.md)\<`U`, `T`\> & [`Diff`](Diff.md)\<`U`, `T`\>
