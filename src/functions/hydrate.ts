import { isPlainObject } from '../types';

type Hydrate<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? Hydrate<U>[]
    : T extends object
      ? { [K in keyof T]: Hydrate<T[K]> }
      : T;

/**
 * Converts all `null` values to `undefined` in the data structure recursively.
 *
 * @param data - Any input data (object, array, primitive)
 * @returns Same type as input, but with all nulls replaced by undefined
 *
 * @example
 * hydrate({ a: null, b: 'test' }) // { a: undefined, b: 'test' }
 * hydrate([null, 1, { c: null }]) // [undefined, 1, { c: undefined }]
 */
export function hydrate<T>(data: T): Hydrate<T> {
  return convertNulls(data) as Hydrate<T>;
}

function convertNulls(value: unknown): unknown {
  if (value === null) return undefined;

  if (typeof value !== 'object' || value === null) return value;

  if (Array.isArray(value)) {
    return value.map(convertNulls);
  }

  if (isPlainObject(value)) {
    const result: Record<string, any> = {};
    for (const key in value) {
      result[key] = convertNulls(value[key]);
    }
    return result;
  }

  return value;
}
