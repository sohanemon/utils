import { isPlainObject } from '../types';

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
  defaultValue: D,
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
  path: K,
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
  defaultValue: D,
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
  path: S,
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
  defaultValue?: any,
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

// Advanced type helpers for deepmerge
type TAllKeys<T> = T extends any ? keyof T : never;

type TIndexValue<T, K extends PropertyKey, D = never> = T extends any
  ? K extends keyof T
    ? T[K]
    : D
  : never;

type TPartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

type TFunction = (...a: any[]) => any;

type TPrimitives =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | Date
  | TFunction;

type TMerged<T> = [T] extends [Array<any>]
  ? { [K in keyof T]: TMerged<T[K]> }
  : [T] extends [TPrimitives]
    ? T
    : [T] extends [object]
      ? TPartialKeys<{ [K in TAllKeys<T>]: TMerged<TIndexValue<T, K>> }, never>
      : T;

/**
 * Deeply merges multiple objects, with later sources taking precedence.
 * Handles nested objects, arrays, and special object types with circular reference detection.
 *
 * Features:
 * - Deep merging of nested objects
 * - Configurable array merging strategies
 * - Circular reference detection and handling
 * - Support for symbols and special objects (Date, RegExp, etc.)
 * - Type-safe with improved generics
 * - Optional cloning to avoid mutation
 * - Custom merge functions for specific keys
 *
 * @template T - The target object type
 * @param target - The target object to merge into
 * @param sources - Source objects to merge from (can have additional properties)
 * @param options - Configuration options
 * @param options.arrayMerge - How to merge arrays: 'replace' (default), 'concat', or 'merge'
 * @param options.clone - Whether to clone the target (default: true)
 * @param options.customMerge - Custom merge function for specific keys
 * @param options.maxDepth - Maximum recursion depth (default: 100)
 * @returns The merged object with proper typing
 *
 * @example
 * // Basic merge
 * deepmerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 *
 * @example
 * // Nested merge
 * deepmerge({ a: { x: 1 } }, { a: { y: 2 } }) // { a: { x: 1, y: 2 } }
 *
 * @example
 * // Array concat
 * deepmerge({ arr: [1] }, { arr: [2] }, { arrayMerge: 'concat' }) // { arr: [1, 2] }
 *
 * @example
 * // Sources with extra properties
 * deepmerge({ a: 1 }, { b: 2, c: 3 }) // { a: 1, b: 2, c: 3 }
 */
export function deepmerge<
  T extends Record<string, any>,
  S extends Record<string, any>[],
>(target: T, ...sources: S): TMerged<T | S[number]>;
export function deepmerge<
  T extends Record<string, any>,
  S extends Record<string, any>[],
>(
  target: T,
  sources: S,
  options?: {
    arrayMerge?: 'replace' | 'concat' | 'merge';
    clone?: boolean;
    customMerge?: (
      key: string | symbol,
      targetValue: any,
      sourceValue: any,
    ) => any;
    maxDepth?: number;
  },
): TMerged<T | S[number]>;
export function deepmerge<T extends Record<string, any>>(
  target: T,
  ...args: any[]
): Record<string, any> {
  let sources: Record<string, any>[];
  let options: {
    arrayMerge?: 'replace' | 'concat' | 'merge';
    clone?: boolean;
    customMerge?: (
      key: string | symbol,
      targetValue: any,
      sourceValue: any,
    ) => any;
    maxDepth?: number;
  } = {};

  // Check if last arg is options object
  const lastArg = args[args.length - 1];
  if (
    lastArg &&
    typeof lastArg === 'object' &&
    !Array.isArray(lastArg) &&
    (lastArg.arrayMerge ||
      lastArg.clone ||
      lastArg.customMerge ||
      lastArg.maxDepth !== undefined)
  ) {
    options = { ...options, ...lastArg };
    sources = args.slice(0, -1);
  } else {
    sources = args;
  }

  const {
    arrayMerge = 'replace',
    clone = true,
    customMerge,
    maxDepth = 100,
  } = options;

  const visited = new WeakMap<object, object>();

  return mergeObjects(target, sources, 0);

  function mergeObjects(target: any, sources: any[], depth: number): any {
    if (depth >= maxDepth) {
      console.warn(
        `[deepmerge] Maximum depth ${maxDepth} exceeded. Returning target as-is.`,
      );
      return target;
    }

    if (!isPlainObject(target) && !Array.isArray(target)) {
      // For primitives or special objects, return the last source or target
      for (const source of sources) {
        if (source !== undefined) return source;
      }
      return target;
    }

    let result = clone
      ? Array.isArray(target)
        ? [...target]
        : { ...target }
      : target;

    for (const source of sources) {
      if (source == null) continue;

      if (visited.has(source)) {
        // Circular reference, skip
        continue;
      }

      visited.set(source, result);

      if (Array.isArray(result) && Array.isArray(source)) {
        result = mergeArrays(result, source, arrayMerge);
      } else if (isPlainObject(result) && isPlainObject(source)) {
        const keys = new Set([
          ...Object.keys(result),
          ...Object.keys(source),
          ...Object.getOwnPropertySymbols(result),
          ...Object.getOwnPropertySymbols(source),
        ]);

        for (const key of keys) {
          const targetValue = (result as any)[key];
          const sourceValue = (source as any)[key];

          if (
            customMerge &&
            customMerge(key, targetValue, sourceValue) !== undefined
          ) {
            (result as any)[key] = customMerge(key, targetValue, sourceValue);
          } else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
            (result as any)[key] = mergeObjects(
              targetValue,
              [sourceValue],
              depth + 1,
            );
          } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            (result as any)[key] = mergeArrays(
              targetValue,
              sourceValue,
              arrayMerge,
            );
          } else if (sourceValue !== undefined) {
            (result as any)[key] = sourceValue;
          }
        }
      } else {
        // If types don't match, source takes precedence
        result = source;
      }
    }

    return result;
  }

  function mergeArrays(target: any[], source: any[], strategy: string): any[] {
    switch (strategy) {
      case 'concat':
        return [...target, ...source];
      case 'merge':
        const maxLength = Math.max(target.length, source.length);
        const merged = [];
        for (let i = 0; i < maxLength; i++) {
          if (i < target.length && i < source.length) {
            if (isPlainObject(target[i]) && isPlainObject(source[i])) {
              merged[i] = mergeObjects(target[i], [source[i]], 0);
            } else {
              merged[i] = source[i];
            }
          } else if (i < target.length) {
            merged[i] = target[i];
          } else {
            merged[i] = source[i];
          }
        }
        return merged;
      case 'replace':
      default:
        return [...source];
    }
  }
}
