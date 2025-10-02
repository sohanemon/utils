export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;
export type Falsy = false | '' | 0 | null | undefined;

export const isFalsy = (val: unknown): val is Falsy => !val;
export const isNullish = (val: unknown): val is null | undefined => val == null;
export const isPrimitive = (val: unknown): val is Primitive => {
  if (val === null || val === undefined) {
    return true;
  }
  switch (typeof val) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol': {
      return true;
    }
    default:
      return false;
  }
};
