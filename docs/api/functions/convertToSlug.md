[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / convertToSlug

# Function: convertToSlug()

> **convertToSlug**(`str?`): `string`

Defined in: [functions/utils.ts:154](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L154)

Converts a string to a URL-friendly slug by trimming, converting to lowercase,
replacing diacritics, removing invalid characters, and replacing spaces with hyphens.

## Parameters

### str?

`string`

The input string to convert.

## Returns

`string`

The generated slug.

## Example

```ts
convertToSlug("Hello World!"); // "hello-world"
convertToSlug("Déjà Vu"); // "deja-vu"
```
