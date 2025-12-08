[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / hydrate

# Function: hydrate()

> **hydrate**\<`T`\>(`data`): `Hydrate`\<`T`\>

Defined in: [functions/hydrate.ts:21](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/hydrate.ts#L21)

Converts all `null` values to `undefined` in the data structure recursively.

## Type Parameters

### T

`T`

## Parameters

### data

`T`

Any input data (object, array, primitive)

## Returns

`Hydrate`\<`T`\>

Same type as input, but with all nulls replaced by undefined

## Example

```ts
hydrate({ a: null, b: 'test' }) // { a: undefined, b: 'test' }
hydrate([null, 1, { c: null }]) // [undefined, 1, { c: undefined }]
```
