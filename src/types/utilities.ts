/**
 * Extracts the keys of an object type as a union type.
 */
export type Keys<T extends object> = keyof T;
/**
 * Extracts the values of an object type as a union type.
 */
export type Values<T extends object> = T[keyof T];

/**
 * Makes all properties of an object type optional recursively.
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
 */
export type SelectivePartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Makes all properties of an object type required recursively.
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
 */
export type SelectiveRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Creates a type where all properties are never (useful for excluding types).
 */
export type Never<T> = {
  [K in keyof T]: never;
};

/**
 * Makes all properties of an object type nullable recursively.
 */
export type Nullable<T> = T extends object
  ? { [P in keyof T]: Nullable<T[P]> }
  : T | null;

/**
 * Makes all properties of an object type optional (undefined) recursively.
 */
export type Optional<T> = T extends object
  ? { [P in keyof T]: Optional<T[P]> }
  : T | undefined;

/**
 * Makes all properties of an object type nullish (null or undefined) recursively.
 */
export type Nullish<T> = T extends object
  ? { [P in keyof T]: Nullish<T[P]> }
  : T | null | undefined;

/**
 * Makes all properties of an object type optional and nullish recursively.
 */
export type Maybe<T> = T extends object
  ? { [P in keyof T]?: Nullish<T[P]> }
  : T | null | undefined;

/**
 * Makes all properties of an object type readonly recursively.
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
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Extracts keys of an object type that have values of a specific type.
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Omits properties from an object type that have values of a specific type.
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Makes specified properties required while keeping others as-is.
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Computes the symmetric difference between two object types.
 */
export type Diff<T, U> = Omit<T, keyof U> & Omit<U, keyof T>;

/**
 * Computes the intersection of two object types (properties present in both).
 */
export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

/**
 * Merges two object types, combining their properties.
 */
export type Merge<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T> & Diff<U, T>,
> = Pick<I, keyof I>;

/**
 * Subtracts properties of one object type from another.
 */
export type Substract<T extends object, U extends object> = Omit<T, keyof U>;

/**
 * Represents either all properties present or none of them.
 */
export type AllOrNone<T> = T | { [P in keyof T]?: never };

/**
 * Represents exactly one property from an object type being present.
 */
export type OneOf<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T];

/**
 * Represents exactly two properties from an object type being present.
 */
export type TwoOf<T> = {
  [K in keyof T]: { [L in Exclude<keyof T, K>]: Pick<T, K | L> }[Exclude<
    keyof T,
    K
  >];
}[keyof T];

/**
 * Prettifies a complex type by expanding it for better readability in tooltips.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Extracts all nested keys of an object type as dot-separated strings.
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
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
