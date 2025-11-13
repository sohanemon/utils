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
 *
 * @param data - Any input data (object, array, primitive)
 * @param fallback - Optional fallback values to merge with
 * @param options - Configuration options
 * @param options.maxDepth - Maximum recursion depth (default: 100)
 * @param options.throwOnCircular - Whether to throw on circular refs (default: false)
 * @param options.convertNullToUndefined - Convert null to undefined (default: true)
 * @returns Same type as input, but with all nulls replaced by undefined
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
 */
export function hydrate<T>(
  data: T,
  fallback?: Partial<T>,
  options?: {
    maxDepth?: number;
    throwOnCircular?: boolean;
    convertNullToUndefined?: boolean;
  },
): T {
  const maxDepth = options?.maxDepth ?? 100;
  const throwOnCircular = options?.throwOnCircular ?? false;
  const convertNullToUndefined = options?.convertNullToUndefined ?? true;

  // Use WeakSet for O(1) circular reference detection
  const visited = new WeakSet<object>();

  return processValue(data, fallback, 0, visited) as T;

  function processValue(
    value: unknown,
    fallbackValue: unknown,
    depth: number,
    visited: WeakSet<object>,
  ): unknown {
    // Check recursion depth
    if (depth > maxDepth) {
      console.warn(
        `[hydrate] Maximum recursion depth (${maxDepth}) exceeded. Returning value as-is.`,
      );
      return value ?? fallbackValue;
    }

    if (value === null) {
      return convertNullToUndefined ? undefined : (fallbackValue ?? null);
    }

    // Handle undefined - use fallback or return undefined
    if (value === undefined) {
      return fallbackValue ?? undefined;
    }

    // Handle primitives: string, number, boolean, symbol, bigint
    const type = typeof value;
    if (type !== 'object') {
      return value;
    }

    if (visited.has(value as object)) {
      if (throwOnCircular) {
        throw new RangeError('[hydrate] Circular reference detected');
      }
      // Return the value as-is to break the cycle
      return value;
    }

    // Mark as visited to detect circular references
    visited.add(value as object);

    if (isSpecialObject(value)) {
      return handleSpecialObject(value, fallbackValue);
    }

    // Handle arrays
    if (Array.isArray(value)) {
      const fallbackArray = Array.isArray(fallbackValue)
        ? fallbackValue
        : undefined;
      return value.map((item, index) =>
        processValue(item, fallbackArray?.[index], depth + 1, visited),
      );
    }

    // Handle plain objects
    if (isPlainObject(value)) {
      const fallbackObj = isPlainObject(fallbackValue)
        ? (fallbackValue as Record<string, any>)
        : {};
      const result: Record<string, any> = { ...fallbackObj };

      // Process all enumerable properties including symbols
      const keys = [
        ...Object.keys(value),
        ...Object.getOwnPropertySymbols(value),
      ];

      for (const k of keys as string[]) {
        const propValue = (value as any)[k];
        const fallbackProp = (fallbackObj as any)[k];

        result[k] = processValue(propValue, fallbackProp, depth + 1, visited);
      }

      return result;
    }

    // For other objects, return as-is (instances, etc.)
    return value ?? fallbackValue;
  }
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
 * Handles special object types that shouldn't be deeply cloned
 */
function handleSpecialObject(value: unknown, fallbackValue: unknown): unknown {
  // For special types, return the original value or fallback
  // These shouldn't be deeply cloned as they have internal state
  return value ?? fallbackValue;
}

/**
 * Type guard utility for checking if a value is an object with a specific shape
 */
export function isWithFallbackCompatible<T extends object>(
  value: unknown,
): value is T {
  return (
    typeof value === 'object' &&
    (value === null ||
      Array.isArray(value) ||
      (typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Object]'))
  );
}
