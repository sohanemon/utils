[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / extendProps

# Function: extendProps()

> **extendProps**\<`T`, `P`\>(`base`, `props`): `T` & `P`

Defined in: [functions/object.ts:172](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/object.ts#L172)

Extend an object or function with additional properties while
preserving the original type information.

Works with both plain objects and callable functions since
functions in JavaScript are objects too.

## Type Parameters

### T

`T` *extends* `object`

The base object or function type

### P

`P` *extends* `object`

The additional properties type

## Parameters

### base

`T`

The object or function to extend

### props

`P`

An object containing properties to attach

## Returns

`T` & `P`

The same object/function, augmented with the given properties

## Example

```ts
// Extend an object
const obj = extendProps({ a: 1 }, { b: "hello" });
// obj has { a: number; b: string }

// Extend a function
const fn = (x: number) => x * 2;
const enhanced = extendProps(fn, { name: "doubler" });
// enhanced is callable and also has { name: string }
```
