export type Keys<T extends object> = keyof T;
export type Values<T extends object> = T[keyof T];

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type SelectivePartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type DeepRequired<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<T[K]> }
      : T;

export type Never<T> = {
  [K in keyof T]: never;
};

export type DeepReadonly<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type Diff<T, U> = Omit<T, keyof U> & Omit<U, keyof T>;

export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

export type Merge<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T> & Diff<U, T>,
> = Pick<I, keyof I>;

export type Substract<T extends object, U extends object> = Omit<T, keyof U>;

export type AllOrNone<T> = T | { [P in keyof T]?: never };

export type OneOf<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T];

export type TwoOf<T> = {
  [K in keyof T]: { [L in Exclude<keyof T, K>]: Pick<T, K | L> }[Exclude<
    keyof T,
    K
  >];
}[keyof T];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

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
