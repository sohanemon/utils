[**@sohanemon/utils**](../README.md)

***

[@sohanemon/utils](../globals.md) / NestedKeyOf

# Type Alias: NestedKeyOf\<ObjectType, IgnoreKeys\>

> **NestedKeyOf**\<`ObjectType`, `IgnoreKeys`\> = \{ \[Key in keyof ObjectType & string\]: Key extends IgnoreKeys ? never : ObjectType\[Key\] extends object ? ObjectType\[Key\] extends any\[\] ? Key : \`$\{Key\}\` \| \`$\{Key\}.$\{NestedKeyOf\<ObjectType\[Key\], IgnoreKeys\>\}\` : \`$\{Key\}\` \}\[keyof `ObjectType` & `string`\]

Defined in: [types/utilities.ts:101](https://github.com/sohanemon/utils/blob/aaa82809c2c1f47ece5c8e0e0beaa65a0ffc893a/src/types/utilities.ts#L101)

## Type Parameters

### ObjectType

`ObjectType` *extends* `object`

### IgnoreKeys

`IgnoreKeys` *extends* `string` = `never`
