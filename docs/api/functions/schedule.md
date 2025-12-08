[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / schedule

# Function: schedule()

> **schedule**(`task`, `options`): `void`

Defined in: [functions/schedule.ts:14](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/schedule.ts#L14)

Runs a function asynchronously in the background.
Returns immediately, retries on failure if configured.
Logs total time taken.

## Parameters

### task

[`Task`](../type-aliases/Task.md)

### options

[`ScheduleOpts`](../interfaces/ScheduleOpts.md) = `{}`

## Returns

`void`
