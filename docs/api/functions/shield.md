[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / shield

# Function: shield()

## Call Signature

> **shield**\<`T`, `E`\>(`operation`): `Promise`\<\[`E` \| `null`, `T` \| `null`\]\>

Defined in: [functions/shield.ts:17](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/shield.ts#L17)

A helper to run sync or async operations safely without try/catch.

Returns a tuple `[error, data]`:
- `error`: the thrown error (if any), otherwise `null`
- `data`: the resolved value (if successful), otherwise `null`

### Type Parameters

#### T

`T`

#### E

`E` = `Error`

### Parameters

#### operation

`Promise`\<`T`\>

### Returns

`Promise`\<\[`E` \| `null`, `T` \| `null`\]\>

### Example

```ts
const [err, value] = shield(() => riskySync());
if (err) console.error(err);

const [asyncErr, result] = await shield(fetchData());
if (asyncErr) throw asyncErr;
```

## Call Signature

> **shield**\<`T`, `E`\>(`operation`): \[`E` \| `null`, `T` \| `null`\]

Defined in: [functions/shield.ts:21](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/shield.ts#L21)

A helper to run sync or async operations safely without try/catch.

Returns a tuple `[error, data]`:
- `error`: the thrown error (if any), otherwise `null`
- `data`: the resolved value (if successful), otherwise `null`

### Type Parameters

#### T

`T`

#### E

`E` = `Error`

### Parameters

#### operation

() => `T`

### Returns

\[`E` \| `null`, `T` \| `null`\]

### Example

```ts
const [err, value] = shield(() => riskySync());
if (err) console.error(err);

const [asyncErr, result] = await shield(fetchData());
if (asyncErr) throw asyncErr;
```
