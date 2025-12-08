[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / MergeRefs

# Type Alias: MergeRefs()

> **MergeRefs** = \<`T`\>(...`refs`) => `React.RefCallback`\<`T`\>

Defined in: [functions/utils.ts:476](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L476)

Merges multiple refs into a single ref callback.

## Type Parameters

### T

`T`

## Parameters

### refs

...(`React.Ref`\<`T`\> \| `undefined`)[]

An array of refs to merge.

## Returns

`React.RefCallback`\<`T`\>

- A function that updates the merged ref with the provided value.
