/**
 * Type representing a path split into segments
 * @template S - The original path string type
 */
type SplitPath<S extends string> = S extends `${infer First}.${infer Rest}`
  ? [First, ...SplitPath<Rest>]
  : [S];

/**
 * Recursive type to resolve nested object types based on path
 * @template T - Current object type
 * @template K - Array of path segments
 */
type GetValue<T, K extends Array<string | number>> = K extends [
  infer First,
  ...infer Rest,
]
  ? First extends keyof T
  ? GetValue<T[First], Rest extends Array<string | number> ? Rest : []>
  : First extends `${number}`
  ? T extends any[]
  ? GetValue<T[number], Rest extends Array<string | number> ? Rest : []>
  : undefined
  : undefined
  : T;

/**
 * Get a nested value from an object using array path segments
 * @template T - Object type
 * @template K - Path segments array type
 * @template D - Default value type
 * @param obj - Source object
 * @param path - Array of path segments
 * @param defaultValue - Fallback value if path not found
 * @returns Value at path or default value
 *
 * @example
 * getObjectValue({a: [{b: 1}]}, ['a', 0, 'b']) // 1
 */
export function getObjectValue<T, K extends Array<string | number>, D>(
  obj: T,
  path: K,
  defaultValue: D
): Exclude<GetValue<T, K>, undefined> | D;

/**
 * Get a nested value from an object using array path segments
 * @template T - Object type
 * @template K - Path segments array type
 * @param obj - Source object
 * @param path - Array of path segments
 * @returns Value at path or undefined
 *
 * @example
 * getObjectValue({a: [{b: 1}]}, ['a', 0, 'b']) // 1
 */
export function getObjectValue<T, K extends Array<string | number>>(
  obj: T,
  path: K
): GetValue<T, K> | undefined;

/**
 * Get a nested value from an object using dot notation path
 * @template T - Object type
 * @template S - Path string literal type
 * @template D - Default value type
 * @param obj - Source object
 * @param path - Dot-separated path string
 * @param defaultValue - Fallback value if path not found
 * @returns Value at path or default value
 *
 * @example
 * getObjectValue({a: [{b: 1}]}, 'a.0.b', 2) // 1
 */
export function getObjectValue<T, S extends string, D>(
  obj: T,
  path: S,
  defaultValue: D
): Exclude<GetValue<T, SplitPath<S>>, undefined> | D;

/**
 * Get a nested value from an object using dot notation path
 * @template T - Object type
 * @template S - Path string literal type
 * @param obj - Source object
 * @param path - Dot-separated path string
 * @returns Value at path or undefined
 *
 * @example
 * getObjectValue({a: [{b: 1}]}, 'a.0.b') // 1
 */
export function getObjectValue<T, S extends string>(
  obj: T,
  path: S
): GetValue<T, SplitPath<S>> | undefined;

/**
 * Implementation of deep object value retrieval with type safety
 * @param obj - Source object
 * @param path - Path specification (string or array)
 * @param defaultValue - Optional fallback value
 * @returns Value at path or default/undefined
 */
export function getObjectValue(
  obj: any,
  path: string | Array<string | number>,
  defaultValue?: any
): any {
  // Validate path type and handle edge cases
  if (typeof path !== 'string' && !Array.isArray(path)) {
    return defaultValue;
  }

  // Ensure pathArray is always an array
  const pathArray = (() => {
    if (Array.isArray(path)) return path;
    if (path === '') return [];
    return String(path)
      .split('.')
      .filter((segment) => segment !== '');
  })();

  // Final safety check for array type
  if (!Array.isArray(pathArray)) {
    return defaultValue;
  }

  let current = obj;

  for (const key of pathArray) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    // Convert numeric strings to numbers for arrays
    const actualKey =
      typeof key === 'string' && Array.isArray(current) && /^\d+$/.test(key)
        ? Number.parseInt(key, 10)
        : key;

    current = current[actualKey as keyof typeof current];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Extend an object or function with additional properties while
 * preserving the original type information.
 *
 * Works with both plain objects and callable functions since
 * functions in JavaScript are objects too.
 *
 * @template T The base object or function type
 * @template P The additional properties type
 *
 * @param base - The object or function to extend
 * @param props - An object containing properties to attach
 *
 * @returns The same object/function, augmented with the given properties
 *
 * @example
 * // Extend an object
 * const obj = extendProps({ a: 1 }, { b: "hello" });
 * // obj has { a: number; b: string }
 *
 * // Extend a function
 * const fn = (x: number) => x * 2;
 * const enhanced = extendProps(fn, { name: "doubler" });
 * // enhanced is callable and also has { name: string }
 */
export function extendProps<T extends object, P extends object>(
  base: T,
  props: P,
): T & P {
  return Object.assign(base, props);
}
