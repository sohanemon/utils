/**
 * A helper to run sync or async operations safely without try/catch.
 *
 * Returns a tuple `[error, data]`:
 * - `error`: the thrown error (if any), otherwise `null`
 * - `data`: the resolved value (if successful), otherwise `null`
 *
 * @example
 * ```ts
 * // Synchronous error handling
 * const [err, value] = shield(() => {
 *   if (Math.random() > 0.5) throw new Error('Random failure');
 *   return 'success';
 * });
 * if (err) {
 *   console.error('Operation failed:', err);
 * } else {
 *   console.log('Result:', value);
 * }
 *
 * // Asynchronous error handling
 * const [asyncErr, result] = await shield(async () => {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) throw new Error('API error');
 *   return response.json();
 * });
 * if (asyncErr) {
 *   console.error('API call failed:', asyncErr);
 * } else {
 *   processData(result);
 * }
 *
 * // API calls with fallbacks
 * const [fetchErr, data] = await shield(fetchUserData(userId));
 * const userData = fetchErr ? getCachedUserData(userId) : data;
 *
 * // File operations
 * const [fileErr, content] = shield(() => readFileSync('config.json'));
 * if (fileErr) {
 *   console.warn('Could not read config, using defaults');
 *   return defaultConfig;
 * }
 * ```
 *
 * @example
 * ```ts
 * // In async functions
 * async function safeApiCall() {
 *   const [err, result] = await shield(callExternalAPI());
 *   if (err) {
 *     await logError(err);
 *     return null;
 *   }
 *   return result;
 * }
 *
 * // In event handlers
 * function handleSubmit(formData) {
 *   const [validationErr, validatedData] = shield(() => validateForm(formData));
 *   if (validationErr) {
 *     showValidationError(validationErr);
 *     return;
 *   }
 *   submitData(validatedData);
 * }
 * ```
 */
export function shield<T, E = Error>(
  operation: Promise<T>,
): Promise<[E | null, T | null]>;

export function shield<T, E = Error>(operation: () => T): [E | null, T | null];

export function shield<T, E = Error>(
  operation: Promise<T> | (() => T),
): [E | null, T | null] | Promise<[E | null, T | null]> {
  if (operation instanceof Promise) {
    return operation
      .then<[E | null, T | null]>((value) => [null, value])
      .catch<[E | null, T | null]>((error: unknown) => [error as E, null]);
  }

  try {
    const data = operation();
    return [null, data];
  } catch (error) {
    console.log(`\x1b[31m🛡 [shield]\x1b[0m ${operation.name} failed →`, error);
    return [error as E, null];
  }
}
