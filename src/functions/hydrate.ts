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
 * ```ts
 * // Basic object hydration
 * hydrate({ name: null, age: 25 }) // { name: undefined, age: 25 }
 *
 * // Nested object hydration
 * hydrate({
 *   user: { email: null, profile: { avatar: null } },
 *   settings: { theme: 'dark' }
 * })
 * // { user: { email: undefined, profile: { avatar: undefined } }, settings: { theme: 'dark' } }
 *
 * // Array hydration
 * hydrate([null, 'hello', null, 42]) // [undefined, 'hello', undefined, 42]
 *
 * // Mixed data structures
 * hydrate({
 *   posts: [null, { title: 'Hello', content: null }],
 *   metadata: { published: null, tags: ['react', null] }
 * })
 * ```
 *
 * @example
 * ```ts
 * // API response normalization
 * const apiResponse = await fetch('/api/user');
 * const rawData = await apiResponse.json(); // May contain null values
 * const normalizedData = hydrate(rawData); // Convert nulls to undefined
 *
 * // Database result processing
 * const dbResult = query('SELECT * FROM users'); // Some fields may be NULL
 * const cleanData = hydrate(dbResult); // Normalize for consistent handling
 *
 * // Form data sanitization
 * const formData = getFormValues(); // May have null values from empty fields
 * const sanitizedData = hydrate(formData); // Prepare for validation/state
 * ```
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
