[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / getObjectValue

# Function: getObjectValue()

Implementation of deep object value retrieval with type safety

## Param

Source object

## Param

Path specification (string or array)

## Param

Optional fallback value

## Call Signature

> **getObjectValue**\<`T`, `K`, `D`\>(`obj`, `path`, `defaultValue`): `D` \| `Exclude`\<`GetValue`\<`T`, `K`\>, `undefined`\>

Defined in: [functions/object.ts:40](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/object.ts#L40)

Get a nested value from an object using array path segments

### Type Parameters

#### T

`T`

Object type

#### K

`K` *extends* (`string` \| `number`)[]

Path segments array type

#### D

`D`

Default value type

### Parameters

#### obj

`T`

Source object

#### path

`K`

Array of path segments

#### defaultValue

`D`

Fallback value if path not found

### Returns

`D` \| `Exclude`\<`GetValue`\<`T`, `K`\>, `undefined`\>

Value at path or default value

### Example

```ts
getObjectValue({a: [{b: 1}]}, ['a', 0, 'b']) // 1
```

## Call Signature

> **getObjectValue**\<`T`, `K`\>(`obj`, `path`): `GetValue`\<`T`, `K`\> \| `undefined`

Defined in: [functions/object.ts:57](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/object.ts#L57)

Get a nested value from an object using array path segments

### Type Parameters

#### T

`T`

Object type

#### K

`K` *extends* (`string` \| `number`)[]

Path segments array type

### Parameters

#### obj

`T`

Source object

#### path

`K`

Array of path segments

### Returns

`GetValue`\<`T`, `K`\> \| `undefined`

Value at path or undefined

### Example

```ts
getObjectValue({a: [{b: 1}]}, ['a', 0, 'b']) // 1
```

## Call Signature

> **getObjectValue**\<`T`, `S`, `D`\>(`obj`, `path`, `defaultValue`): `D` \| `Exclude`\<`GetValue`\<`T`, `SplitPath`\<`S`\>\>, `undefined`\>

Defined in: [functions/object.ts:75](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/object.ts#L75)

Get a nested value from an object using dot notation path

### Type Parameters

#### T

`T`

Object type

#### S

`S` *extends* `string`

Path string literal type

#### D

`D`

Default value type

### Parameters

#### obj

`T`

Source object

#### path

`S`

Dot-separated path string

#### defaultValue

`D`

Fallback value if path not found

### Returns

`D` \| `Exclude`\<`GetValue`\<`T`, `SplitPath`\<`S`\>\>, `undefined`\>

Value at path or default value

### Example

```ts
getObjectValue({a: [{b: 1}]}, 'a.0.b', 2) // 1
```

## Call Signature

> **getObjectValue**\<`T`, `S`\>(`obj`, `path`): `GetValue`\<`T`, `SplitPath`\<`S`\>\> \| `undefined`

Defined in: [functions/object.ts:92](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/functions/object.ts#L92)

Get a nested value from an object using dot notation path

### Type Parameters

#### T

`T`

Object type

#### S

`S` *extends* `string`

Path string literal type

### Parameters

#### obj

`T`

Source object

#### path

`S`

Dot-separated path string

### Returns

`GetValue`\<`T`, `SplitPath`\<`S`\>\> \| `undefined`

Value at path or undefined

### Example

```ts
getObjectValue({a: [{b: 1}]}, 'a.0.b') // 1
```
