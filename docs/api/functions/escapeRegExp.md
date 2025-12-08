[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / escapeRegExp

# Function: escapeRegExp()

> **escapeRegExp**(`str`): `string`

Defined in: [functions/utils.ts:522](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L522)

Escapes a string for use in a regular expression.

## Parameters

### str

`string`

The string to escape

## Returns

`string`

- The escaped string

## Example

```ts
const escapedString = escapeRegExp('Hello, world!');
// escapedString === 'Hello\\, world!'
```
