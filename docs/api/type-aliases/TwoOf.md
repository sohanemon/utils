[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / TwoOf

# Type Alias: TwoOf\<T\>

> **TwoOf**\<`T`\> = \{ \[K in keyof T\]: \{ \[L in Exclude\<keyof T, K\>\]: Pick\<T, K \| L\> \}\[Exclude\<keyof T, K\>\] \}\[keyof `T`\]

Defined in: [types/utilities.ts:90](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L90)

## Type Parameters

### T

`T`
