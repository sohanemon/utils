[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / goToClientSideHash

# Function: goToClientSideHash()

> **goToClientSideHash**(`id`, `opts?`): `void`

Defined in: [functions/utils.ts:503](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L503)

Navigates to the specified client-side hash without ssr.
use `scroll-margin-top` with css to add margins

## Parameters

### id

`string`

The ID of the element without # to navigate to.

### opts?

`ScrollIntoViewOptions`

## Returns

`void`

## Example

```ts
goToClientSideHash('my-element');
```
