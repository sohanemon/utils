[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / throttle

# Function: throttle()

> **throttle**\<`F`\>(`function_`, `wait`, `options?`): `ThrottledFunction`\<`F`\>

Defined in: [functions/utils.ts:361](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L361)

Creates a throttled function that invokes the provided function at most once
every `wait` milliseconds.

If the `leading` option is set to `true`, the function will be invoked immediately
on the leading edge of the throttle interval. If the `trailing` option is set to `true`,
the function will also be invoked at the end of the throttle interval if additional
calls were made during the interval.

The returned function includes the `isPending` property to check if the throttle
timer is currently active.

## Type Parameters

### F

`F` *extends* (...`args`) => `any`

The type of the function to throttle.

## Parameters

### function\_

`F`

The function to throttle.

### wait

`number` = `100`

The number of milliseconds to wait between invocations (default is 100ms).

### options?

An optional object with the following properties:
  - `leading` (boolean): If `true`, invokes the function on the leading edge of the interval.
  - `trailing` (boolean): If `true`, invokes the function on the trailing edge of the interval.

#### leading?

`boolean`

#### trailing?

`boolean`

## Returns

`ThrottledFunction`\<`F`\>

A throttled version of the provided function, enhanced with the `isPending` property.

## Throws

If the first parameter is not a function.

## Throws

If the `wait` parameter is negative.

## Example

```ts
const log = throttle((message: string) => console.log(message), 200);
log('Hello'); // Logs "Hello" immediately if leading is true.
console.log(log.isPending); // true if the timer is active.
```
