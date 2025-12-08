[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / deepmerge

# Function: deepmerge()

## Call Signature

> **deepmerge**\<`T`, `S`\>(`target`, ...`sources`): `TMerged`\<`T` \| `S`\[`number`\]\>

Defined in: [functions/deepmerge.ts:75](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/deepmerge.ts#L75)

Deeply merges multiple objects, with later sources taking precedence.
Handles nested objects, arrays, and special object types with circular reference detection.

Features:
- Deep merging of nested objects
- Configurable array merging strategies
- Circular reference detection and handling
- Support for symbols and special objects (Date, RegExp, etc.)
- Type-safe with improved generics
- Optional cloning to avoid mutation
- Custom merge functions for specific keys

### Type Parameters

#### T

`T` *extends* `Record`\<`string`, `any`\>

The target object type

#### S

`S` *extends* `Record`\<`string`, `any`\>[]

### Parameters

#### target

`T`

The target object to merge into

#### sources

...`S`

Source objects to merge from (can have additional properties)

### Returns

`TMerged`\<`T` \| `S`\[`number`\]\>

The merged object with proper typing

### Examples

```ts
// Basic merge
deepmerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
```

```ts
// Nested merge
deepmerge({ a: { x: 1 } }, { a: { y: 2 } }) // { a: { x: 1, y: 2 } }
```

```ts
// Array concat
deepmerge({ arr: [1] }, { arr: [2] }, { arrayMerge: 'concat' }) // { arr: [1, 2] }
```

```ts
// Sources with extra properties
deepmerge({ a: 1 }, { b: 2, c: 3 }) // { a: 1, b: 2, c: 3 }
```

## Call Signature

> **deepmerge**\<`T`, `S`\>(`target`, `sources`, `options?`): `TMerged`\<`T` \| `S`\[`number`\]\>

Defined in: [functions/deepmerge.ts:79](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/deepmerge.ts#L79)

Deeply merges multiple objects, with later sources taking precedence.
Handles nested objects, arrays, and special object types with circular reference detection.

Features:
- Deep merging of nested objects
- Configurable array merging strategies
- Circular reference detection and handling
- Support for symbols and special objects (Date, RegExp, etc.)
- Type-safe with improved generics
- Optional cloning to avoid mutation
- Custom merge functions for specific keys

### Type Parameters

#### T

`T` *extends* `Record`\<`string`, `any`\>

The target object type

#### S

`S` *extends* `Record`\<`string`, `any`\>[]

### Parameters

#### target

`T`

The target object to merge into

#### sources

`S`

Source objects to merge from (can have additional properties)

#### options?

Configuration options

##### arrayMerge?

`"concat"` \| `"replace"` \| `"merge"` \| (`target`, `source`) => `any`[]

How to merge arrays: 'replace' (default), 'concat', or 'merge'

##### clone?

`boolean`

Whether to clone the target (default: true)

##### customMerge?

(`key`, `targetValue`, `sourceValue`) => `any`

Custom merge function for specific keys

##### maxDepth?

`number`

Maximum recursion depth (default: 100)

### Returns

`TMerged`\<`T` \| `S`\[`number`\]\>

The merged object with proper typing

### Examples

```ts
// Basic merge
deepmerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
```

```ts
// Nested merge
deepmerge({ a: { x: 1 } }, { a: { y: 2 } }) // { a: { x: 1, y: 2 } }
```

```ts
// Array concat
deepmerge({ arr: [1] }, { arr: [2] }, { arrayMerge: 'concat' }) // { arr: [1, 2] }
```

```ts
// Sources with extra properties
deepmerge({ a: 1 }, { b: 2, c: 3 }) // { a: 1, b: 2, c: 3 }
```
