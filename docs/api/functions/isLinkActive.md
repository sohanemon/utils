[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / isLinkActive

# Function: isLinkActive()

> **isLinkActive**(`params`): `boolean`

Defined in: [functions/utils.ts:39](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L39)

Checks if a link is active, considering optional localization prefixes.

## Parameters

### params

Parameters object.

#### currentPath

`string`

The current browser path.

#### exact?

`boolean` = `true`

#### locales?

`string`[] = `...`

Supported locale prefixes.

#### path

`string`

The target path of the link.

## Returns

`boolean`

- True if the link is active, false otherwise.
