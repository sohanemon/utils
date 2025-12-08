[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / normalizeText

# Function: normalizeText()

> **normalizeText**(`str?`, `options?`): `string`

Defined in: [functions/utils.ts:540](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L540)

Normalizes a string by:
- Applying Unicode normalization (NFC)
- Optionally removing diacritic marks (accents)
- Optionally trimming leading/trailing non-alphanumeric characters
- Optionally converting to lowercase

## Parameters

### str?

The string to normalize

`string` | `null`

### options?

Normalization options

#### lowercase?

`boolean`

Whether to convert the result to lowercase (default: true)

#### removeAccents?

`boolean`

Whether to remove diacritic marks like accents (default: true)

#### removeNonAlphanumeric?

`boolean`

Whether to trim non-alphanumeric characters from the edges (default: true)

## Returns

`string`

The normalized string
