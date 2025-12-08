/**
 * Represents primitive JavaScript types including null and undefined.
 */
export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

/**
 * Represents all falsy values in JavaScript.
 */
export type Falsy = false | '' | 0 | null | undefined;

/**
 * Type guard that checks if a value is falsy.
 *
 * @param val - The value to check
 * @returns True if the value is falsy, false otherwise
 *
 * @example
 * if (isFalsy(value)) {
 *   console.log('Value is falsy');
 * }
 */
export const isFalsy = (val: unknown): val is Falsy => !val;
/**
 * Type guard that checks if a value is null or undefined.
 *
 * @param val - The value to check
 * @returns True if the value is null or undefined, false otherwise
 *
 * @example
 * if (isNullish(value)) {
 *   console.log('Value is null or undefined');
 * }
 */
export const isNullish = (val: unknown): val is null | undefined => val == null;
/**
 * Type guard that checks if a value is a primitive type.
 *
 * @param val - The value to check
 * @returns True if the value is a primitive, false otherwise
 *
 * @example
 * if (isPrimitive(value)) {
 *   console.log('Value is a primitive type');
 * }
 */
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
/**
 * Type guard that checks if a value is a plain object (not an array, function, etc.).
 *
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 *
 * @example
 * if (isPlainObject(value)) {
 *   console.log('Value is a plain object');
 * }
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
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
