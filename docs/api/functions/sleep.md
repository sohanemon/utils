[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / sleep

# Function: sleep()

> **sleep**(`time`, `signal?`): `Promise`\<`void`\>

Defined in: [functions/utils.ts:210](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/utils.ts#L210)

Pauses execution for the specified time.

`signal` allows cancelling the sleep via AbortSignal.

## Parameters

### time

`number` = `1000`

Time in milliseconds to sleep (default is 1000ms)

### signal?

`AbortSignal`

Optional AbortSignal to cancel the sleep early

## Returns

`Promise`\<`void`\>

- A Promise that resolves after the specified time or when aborted
