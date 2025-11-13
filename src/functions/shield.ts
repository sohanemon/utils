/**
 * A helper to run sync or async operations safely without try/catch.
 *
 * Returns a tuple `[error, data]`:
 * - `error`: the thrown error (if any), otherwise `null`
 * - `data`: the resolved value (if successful), otherwise `null`
 *
 * @example
 * ```ts
 * const [err, value] = shield(() => riskySync());
 * if (err) console.error(err);
 *
 * const [asyncErr, result] = await shield(fetchData());
 * if (asyncErr) throw asyncErr;
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
