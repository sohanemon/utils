[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / debounce

# Function: debounce()

> **debounce**\<`F`\>(`function_`, `wait`, `options?`): `DebouncedFunction`\<`F`\>

Defined in: [functions/utils.ts:269](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L269)

Creates a debounced function that delays invoking the provided function until
after the specified `wait` time has elapsed since the last invocation.

If the `immediate` option is set to `true`, the function will be invoked immediately
on the leading edge of the wait interval. Subsequent calls during the wait interval
will reset the timer but not invoke the function until the interval elapses again.

The returned function includes the `isPending` property to check if the debounce
timer is currently active.

## Type Parameters

### F

`F` *extends* (...`args`) => `any`

The type of the function to debounce.

## Parameters

### function\_

`F`

The function to debounce.

### wait

`number` = `100`

The number of milliseconds to delay (default is 100ms).

### options?

An optional object with the following properties:
  - `immediate` (boolean): If `true`, invokes the function on the leading edge
    of the wait interval instead of the trailing edge.

#### immediate

`boolean`

## Returns

`DebouncedFunction`\<`F`\>

A debounced version of the provided function, enhanced with the `isPending` property.

## Throws

If the first parameter is not a function.

## Throws

If the `wait` parameter is negative.

## Example

```ts
const log = debounce((message: string) => console.log(message), 200);
log('Hello'); // Logs "Hello" after 200ms if no other call is made.
console.log(log.isPending); // true if the timer is active.
```
