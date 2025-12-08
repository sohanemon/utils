[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / poll

# Function: poll()

> **poll**\<`T`\>(`cond`, `options`): `Promise`\<`T`\>

Defined in: [functions/poll.ts:35](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/poll.ts#L35)

Repeatedly polls an async `cond` function UNTIL it returns a TRUTHY value,
or until the operation times out or is aborted.

Designed for waiting on async jobs, external state, or delayed availability.

## Type Parameters

### T

`T`

The type of the successful result.

## Parameters

### cond

() => `Promise`\<`false` \| `T` \| `null` \| `undefined`\>

A function returning a Promise that resolves to:
  - a truthy value `T` → stop polling and return it
  - falsy/null/undefined → continue polling

### options

`Partial`\<\{ `interval`: `number`; `jitter`: `boolean`; `signal`: `AbortSignal`; `timeout`: `number`; \}\> = `{}`

Configuration options:
- `interval` (number) — Time between polls in ms (default: 5000 ms)
- `timeout` (number) — Max total duration before failing (default: 5 min)
- `jitter` (boolean) — Add small random offset (±10%) to intervals to avoid sync bursts (default: true)
- `signal` (AbortSignal) — Optional abort signal to cancel polling

## Returns

`Promise`\<`T`\>

Resolves with the truthy value `T` when successful.
Throws `AbortError` if aborted

## Example

```ts
const job = await poll(async () => {
  const status = await getJobStatus();
  return status === 'done' ? status : null;
}, { interval: 3000, timeout: 60000 });
```
