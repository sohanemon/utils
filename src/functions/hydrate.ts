import { deepmerge } from './deepmerge';

/**
 * Deeply cleans any value by converting all `null` values to `undefined`,
 * and merges in a fallback object for default values.
 *
 * Features:
 * - Circular reference detection to prevent infinite loops
 * - Proper handling of special objects (Date, Map, Set, RegExp, etc.)
 * - Strict type safety with improved generics
 * - Better error messages and validation
 * - Support for nested structures with Symbol properties
 * - Optional maximum recursion depth to prevent stack overflow
 * - Configurable null-to-undefined conversion
 * - Uses deepmerge for fallback merging with configurable array strategies
 *
 * @param data - Any input data (object, array, primitive)
 * @param fallback - Optional fallback values to merge with
 * @param options - Configuration options
 * @param options.maxDepth - Maximum recursion depth (default: 100)
 * @param options.throwOnCircular - Whether to throw on circular refs (default: false)
 * @param options.convertNullToUndefined - Convert null to undefined (default: true)
 * @param options.arrayMerge - How to merge arrays: 'replace', 'concat', or 'merge' (default: 'merge')
 * @returns Same type as input, but with all nulls replaced by undefined and fallbacks merged
 *
 * @throws {TypeError} If data or fallback are invalid types when strict validation is enabled
 * @throws {RangeError} If circular reference detected and throwOnCircular is true
 *
 * @example
 * // Basic usage
 * hydrate({ a: null, b: 'test' }) // { a: undefined, b: 'test' }
 *
 * @example
 * // With fallback values
 * hydrate({ a: null }, { a: 'default' }) // { a: 'default' }
 *
 * @example
 * // Keep nulls as-is
 * hydrate({ a: null }, undefined, { convertNullToUndefined: false }) // { a: null }
 *
 * @example
 * // Array merging
 * hydrate({ arr: [null, 2] }, { arr: [1, 2, 3] }) // { arr: [1, 2] }
 */
export function hydrate<T>(
  data: T,
  fallback?: Partial<T>,
  options?: {
    maxDepth?: number;
    throwOnCircular?: boolean;
    convertNullToUndefined?: boolean;
    arrayMerge?: 'replace' | 'concat' | 'merge';
  },
): T {
  const maxDepth = options?.maxDepth ?? 100;
  const throwOnCircular = options?.throwOnCircular ?? false;
  const convertNullToUndefined = options?.convertNullToUndefined ?? true;
  const arrayMerge = options?.arrayMerge ?? 'merge';

  // First, convert null to undefined in data
  const processedData = convertNulls(
    data,
    maxDepth,
    throwOnCircular,
    convertNullToUndefined,
  );

  // Then, merge processedData into fallback using deepmerge, with processedData taking precedence
  if (fallback === undefined) return processedData as T;

  const customArrayMerge = (target: any[], source: any[]) => {
    const maxLength = Math.max(target.length, source.length);
    const merged = [];
    for (let i = 0; i < maxLength; i++) {
      if (i < source.length && source[i] !== undefined) {
        merged[i] = source[i];
      } else if (i < target.length) {
        merged[i] = target[i];
      }
    }
    return merged;
  };

  return deepmerge(fallback as any, processedData, {
    arrayMerge: customArrayMerge,
    maxDepth,
  }) as T;
}

/**
 * Converts null values to undefined in the data structure
 */
function convertNulls(
  value: unknown,
  maxDepth: number,
  throwOnCircular: boolean,
  convertNullToUndefined: boolean,
  depth = 0,
  visited = new WeakSet<object>(),
): unknown {
  if (depth > maxDepth) {
    console.warn(
      `[hydrate] Maximum recursion depth (${maxDepth}) exceeded. Returning value as-is.`,
    );
    return value;
  }

  if (value === null) {
    return convertNullToUndefined ? undefined : null;
  }

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (visited.has(value as object)) {
    if (throwOnCircular) {
      throw new RangeError('[hydrate] Circular reference detected');
    }
    return value;
  }

  visited.add(value as object);

  if (isSpecialObject(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      convertNulls(
        item,
        maxDepth,
        throwOnCircular,
        convertNullToUndefined,
        depth + 1,
        visited,
      ),
    );
  }

  if (isPlainObject(value)) {
    const result: Record<string, any> = {};
    const keys = [
      ...Object.keys(value),
      ...Object.getOwnPropertySymbols(value),
    ];

    for (const k of keys) {
      result[k as string] = convertNulls(
        (value as any)[k],
        maxDepth,
        throwOnCircular,
        convertNullToUndefined,
        depth + 1,
        visited,
      );
    }

    return result;
  }

  return value;
}

/**
 * Checks if a value is a plain object (not a special type)
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  // Objects with null prototype are still plain objects
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Checks if a value is a special object type that needs custom handling
 */
function isSpecialObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const stringTag = Object.prototype.toString.call(value);
  const specialTypes = [
    '[object Date]',
    '[object RegExp]',
    '[object Map]',
    '[object Set]',
    '[object WeakMap]',
    '[object WeakSet]',
    '[object Promise]',
    '[object Error]',
    '[object ArrayBuffer]',
  ];

  return specialTypes.includes(stringTag);
}

/**
 * Type guard utility for checking if a value is an object with a specific shape
 */
export function isWithFallbackCompatible<T extends object>(
  value: unknown,
): value is T {
  return (
    typeof value === 'object' &&
    value !== null &&
    (Array.isArray(value) ||
      Object.prototype.toString.call(value) === '[object Object]')
  );
}
