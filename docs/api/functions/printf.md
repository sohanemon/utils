[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / printf

# Function: printf()

> **printf**(`format`, ...`args`): `string`

Defined in: [functions/utils.ts:457](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L457)

Formats a string by replacing each '%s' placeholder with the corresponding argument.
This function mimics the basic behavior of C's printf for %s substitution.

It supports both calls like `printf(format, ...args)` and `printf(format, argsArray)`.

## Parameters

### format

`string`

The format string containing '%s' placeholders.

### args

...`unknown`[]

The values to substitute into the placeholders, either as separate arguments or as a single array.

## Returns

`string`

The formatted string with all '%s' replaced by the provided arguments.

## Example

```ts
const message = printf("%s love %s", "I", "Bangladesh");
// message === "I love Bangladesh"

const arr = ["I", "Bangladesh"];
const message2 = printf("%s love %s", arr);
// message2 === "I love Bangladesh"

// If there are too few arguments:
const incomplete = printf("Bangladesh is %s %s", "beautiful");
// incomplete === "Bangladesh is beautiful"
```
