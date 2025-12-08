/**
 * Extracts the keys of an object type as a union type.
 *
 * @template T - The object type to extract keys from
 * @returns A union of all keys in the object type
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type UserKeys = Keys<User>; // 'name' | 'age'
 * ```
 */
export type Keys<T extends object> = keyof T;

/**
 * Extracts the values of an object type as a union type.
 *
 * @template T - The object type to extract values from
 * @returns A union of all values in the object type
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type UserValues = Values<User>; // string | number
 * ```
 */
export type Values<T extends object> = T[keyof T];

/**
 * Makes all properties of an object type optional recursively.
 *
 * This type traverses through nested objects and arrays, making all properties optional.
 * Functions and primitives are left unchanged.
 *
 * @template T - The type to make deeply partial
 * @returns A type with all properties optional recursively
 *
 * @example
 * ```ts
 * type Config = {
 *   server: { host: string; port: number };
 *   features: string[];
 * };
 *
 * type PartialConfig = DeepPartial<Config>;
 * // {
 * //   server?: { host?: string; port?: number };
 * //   features?: string[];
 * // }
 * ```
 */
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/**
 * Makes only specified properties of an object type optional.
 *
 * @template T - The base object type
 * @template K - The keys to make optional
 * @returns An object type with specified properties optional
 *
 * @example
 * ```ts
 * type User = { name: string; age: number; email: string };
 * type PartialUser = SelectivePartial<User, 'age' | 'email'>;
 * // { name: string; age?: number; email?: string }
 * ```
 */
export type SelectivePartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Makes all properties of an object type required recursively.
 *
 * This type traverses through nested objects and arrays, making all properties required.
 * Functions and primitives are left unchanged.
 *
 * @template T - The type to make deeply required
 * @returns A type with all properties required recursively
 *
 * @example
 * ```ts
 * type PartialConfig = {
 *   server?: { host?: string; port?: number };
 * };
 *
 * type RequiredConfig = DeepRequired<PartialConfig>;
 * // {
 * //   server: { host: string; port: number };
 * // }
 * ```
 */
export type DeepRequired<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<T[K]> }
      : T;

/**
 * Makes only specified properties of an object type required.
 *
 * @template T - The base object type
 * @template K - The keys to make required
 * @returns An object type with specified properties required
 *
 * @example
 * ```ts
 * type PartialUser = { name?: string; age?: number; email?: string };
 * type RequiredUser = SelectiveRequired<PartialUser, 'name'>;
 * // { name: string; age?: number; email?: string }
 * ```
 */
export type SelectiveRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Creates a type where all properties are never (useful for excluding types).
 *
 * This can be used to create mutually exclusive types or to exclude certain properties.
 *
 * @template T - The object type to transform
 * @returns An object type with all properties set to never
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type ExcludedUser = Never<User>; // { name: never; age: never }
 * ```
 */
export type Never<T> = {
  [K in keyof T]: never;
};

/**
 * Makes all properties of an object type nullable recursively.
 *
 * @template T - The type to make nullable
 * @returns A type where all properties can be null
 *
 * @example
 * ```ts
 * type User = { name: string; profile: { age: number } };
 * type NullableUser = Nullable<User>;
 * // { name: string | null; profile: { age: number | null } | null }
 * ```
 */
export type Nullable<T> = T extends object
  ? { [P in keyof T]: Nullable<T[P]> }
  : T | null;

/**
 * Makes all properties of an object type optional (undefined) recursively.
 *
 * @template T - The type to make optional
 * @returns A type where all properties can be undefined
 *
 * @example
 * ```ts
 * type User = { name: string; profile: { age: number } };
 * type OptionalUser = Optional<User>;
 * // { name: string | undefined; profile: { age: number | undefined } | undefined }
 * ```
 */
export type Optional<T> = T extends object
  ? { [P in keyof T]: Optional<T[P]> }
  : T | undefined;

/**
 * Makes all properties of an object type nullish (null or undefined) recursively.
 *
 * @template T - The type to make nullish
 * @returns A type where all properties can be null or undefined
 *
 * @example
 * ```ts
 * type User = { name: string; profile: { age: number } };
 * type NullishUser = Nullish<User>;
 * // { name: string | null | undefined; profile: { age: number | null | undefined } | null | undefined }
 * ```
 */
export type Nullish<T> = T extends object
  ? { [P in keyof T]: Nullish<T[P]> }
  : T | null | undefined;

/**
 * Makes all properties of an object type optional and nullish recursively.
 *
 * This combines optional properties with nullish values.
 *
 * @template T - The type to make maybe
 * @returns A type where all properties are optional and can be null or undefined
 *
 * @example
 * ```ts
 * type User = { name: string; profile: { age: number } };
 * type MaybeUser = Maybe<User>;
 * // { name?: string | null | undefined; profile?: { age?: number | null | undefined } | null | undefined }
 * ```
 */
export type Maybe<T> = T extends object
  ? { [P in keyof T]?: Nullish<T[P]> }
  : T | null | undefined;

/**
 * Makes all properties of an object type readonly recursively.
 *
 * This type traverses through nested objects and arrays, making all properties readonly.
 * Functions and primitives are left unchanged.
 *
 * @template T - The type to make deeply readonly
 * @returns A type with all properties readonly recursively
 *
 * @example
 * ```ts
 * type Config = {
 *   server: { host: string; port: number };
 *   features: string[];
 * };
 *
 * type ReadonlyConfig = DeepReadonly<Config>;
 * // {
 * //   readonly server: { readonly host: string; readonly port: number };
 * //   readonly features: readonly string[];
 * // }
 * ```
 */
export type DeepReadonly<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

/**
 * Removes readonly modifier from all properties of an object type recursively.
 *
 * @template T - The readonly type to make mutable
 * @returns A type with all readonly modifiers removed
 *
 * @example
 * ```ts
 * type ReadonlyUser = { readonly name: string; readonly profile: { readonly age: number } };
 * type MutableUser = Mutable<ReadonlyUser>;
 * // { name: string; profile: { age: number } }
 * ```
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Extracts keys of an object type that have values of a specific type.
 *
 * @template T - The object type to search
 * @template U - The value type to match
 * @returns A union of keys whose values match the specified type
 *
 * @example
 * ```ts
 * type User = { name: string; age: number; active: boolean };
 * type StringKeys = KeysOfType<User, string>; // 'name'
 * type NumberKeys = KeysOfType<User, number>; // 'age'
 * ```
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Omits properties from an object type that have values of a specific type.
 *
 * @template T - The object type to filter
 * @template U - The value type to exclude
 * @returns An object type without properties of the specified value type
 *
 * @example
 * ```ts
 * type Mixed = { name: string; age: number; active: boolean };
 * type WithoutStrings = OmitByType<Mixed, string>; // { age: number; active: boolean }
 * ```
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Makes specified properties required while keeping others as-is.
 *
 * @template T - The base object type
 * @template K - The keys to make required
 * @returns An object type with specified properties required
 *
 * @example
 * ```ts
 * type PartialUser = { name?: string; age?: number; email?: string };
 * type RequiredNameUser = RequiredKeys<PartialUser, 'name'>;
 * // { name: string; age?: number; email?: string }
 * ```
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Computes the symmetric difference between two object types.
 *
 * Properties that exist in either T or U but not in both.
 *
 * @template T - First object type
 * @template U - Second object type
 * @returns Properties unique to T or U
 *
 * @example
 * ```ts
 * type A = { x: number; y: string };
 * type B = { y: string; z: boolean };
 * type DiffAB = Diff<A, B>; // { x: number; z: boolean }
 * ```
 */
export type Diff<T, U> = Omit<T, keyof U> & Omit<U, keyof T>;

/**
 * Computes the intersection of two object types (properties present in both).
 *
 * @template T - First object type
 * @template U - Second object type
 * @returns Properties that exist in both T and U
 *
 * @example
 * ```ts
 * type A = { x: number; y: string };
 * type B = { y: string; z: boolean };
 * type IntersectionAB = Intersection<A, B>; // { y: string }
 * ```
 */
export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

/**
 * Merges two object types, combining their properties.
 *
 * @template T - First object type
 * @template U - Second object type
 * @returns A merged object type with properties from both
 *
 * @example
 * ```ts
 * type A = { x: number; y: string };
 * type B = { y: boolean; z: string };
 * type Merged = Merge<A, B>; // { x: number; y: boolean; z: string }
 * ```
 */
export type Merge<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T> & Diff<U, T>,
> = Pick<I, keyof I>;

/**
 * Subtracts properties of one object type from another.
 *
 * @template T - The object type to subtract from
 * @template U - The object type whose properties to subtract
 * @returns T without properties that exist in U
 *
 * @example
 * ```ts
 * type A = { x: number; y: string; z: boolean };
 * type B = { y: string };
 * type Subtracted = Substract<A, B>; // { x: number; z: boolean }
 * ```
 */
export type Substract<T extends object, U extends object> = Omit<T, keyof U>;

/**
 * Represents either all properties present or none of them.
 *
 * Useful for creating mutually exclusive configurations.
 *
 * @template T - The object type
 * @returns Either the full object or an empty object with optional properties
 *
 * @example
 * ```ts
 * type Config = { host: string; port: number };
 * type AllOrNoneConfig = AllOrNone<Config>;
 * // { host: string; port: number } | {}
 * ```
 */
export type AllOrNone<T> = T | { [P in keyof T]?: never };

/**
 * Represents exactly one property from an object type being present.
 *
 * Useful for creating discriminated unions or mutually exclusive options.
 *
 * @template T - The object type
 * @returns A union where only one property is present at a time
 *
 * @example
 * ```ts
 * type Action = { type: 'create'; payload: string } | { type: 'update'; id: number };
 * type OneAction = OneOf<Action>;
 * // { type: 'create'; payload: string } | { type: 'update'; id: number }
 * ```
 */
export type OneOf<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T];

/**
 * Represents exactly two properties from an object type being present.
 *
 * @template T - The object type
 * @returns A union where exactly two properties are present at a time
 *
 * @example
 * ```ts
 * type Config = { a: number; b: string; c: boolean };
 * type TwoConfig = TwoOf<Config>;
 * // { a: number; b: string } | { a: number; c: boolean } | { b: string; c: boolean }
 * ```
 */
export type TwoOf<T> = {
  [K in keyof T]: { [L in Exclude<keyof T, K>]: Pick<T, K | L> }[Exclude<
    keyof T,
    K
  >];
}[keyof T];

/**
 * Prettifies a complex type by expanding it for better readability in tooltips.
 *
 * This type doesn't change the runtime type but helps with IntelliSense display.
 *
 * @template T - The type to prettify
 * @returns The same type but expanded for better readability
 *
 * @example
 * ```ts
 * type Complex = { a: string } & { b: number };
 * type PrettyComplex = Prettify<Complex>; // Shows as { a: string; b: number }
 * ```
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Extracts all nested keys of an object type as dot-separated strings.
 *
 * @template ObjectType - The object type to extract nested keys from
 * @template IgnoreKeys - Keys to ignore during extraction
 * @returns A union of dot-separated string paths
 *
 * @example
 * ```ts
 * type User = {
 *   name: string;
 *   profile: { age: number; address: { city: string } };
 *   tags: string[];
 * };
 *
 * type UserPaths = NestedKeyOf<User>;
 * // 'name' | 'profile' | 'profile.age' | 'profile.address' | 'profile.address.city' | 'tags'
 * ```
 */
export type NestedKeyOf<
  ObjectType extends object,
  IgnoreKeys extends string = never,
> = {
  [Key in keyof ObjectType & string]: Key extends IgnoreKeys
    ? never
    : ObjectType[Key] extends object
      ? ObjectType[Key] extends Array<any>
        ? Key
        : `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key], IgnoreKeys>}`
      : `${Key}`;
}[keyof ObjectType & string];

/**
 * Creates a type that excludes properties present in another type.
 *
 * This is useful for creating mutually exclusive types.
 *
 * @template T - The base type
 * @template U - The type whose properties to exclude
 * @returns A type with properties from T that are not in U
 *
 * @example
 * ```ts
 * type A = { x: number; y: string };
 * type B = { y: string };
 * type WithoutB = Without<A, B>; // { x?: never }
 * ```
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
