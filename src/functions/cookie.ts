/**
 * Sets a client-side cookie with optional expiration and path.
 *
 * @param name - The name of the cookie
 * @param value - The value to store in the cookie
 * @param days - Optional number of days until the cookie expires
 * @param path - Optional path for the cookie (defaults to '/')
 *
 * @example
 * // Set a cookie that expires in 7 days
 * setClientSideCookie('userId', '12345', 7);
 *
 * @example
 * // Set a session cookie (no expiration)
 * setClientSideCookie('sessionId', 'abc123');
 */
export const setClientSideCookie = (
  name: string,
  value: string,
  days?: number,
  path = '/',
) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=${path}`;
};

/**
 * Deletes a client-side cookie by setting its expiration to a past date.
 *
 * @param name - The name of the cookie to delete
 * @param path - Optional path for the cookie (defaults to '/')
 *
 * @example
 * // Delete a cookie
 * deleteClientSideCookie('userId');
 */
export const deleteClientSideCookie = (name: string, path = '/') => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
};

/**
 * Checks if a client-side cookie exists.
 *
 * @param name - The name of the cookie to check
 * @returns True if the cookie exists, false otherwise
 *
 * @example
 * // Check if a cookie exists
 * if (hasClientSideCookie('userId')) {
 *   console.log('User is logged in');
 * }
 */
export const hasClientSideCookie = (name: string): boolean => {
  return document.cookie.split('; ').some((row) => row.startsWith(`${name}=`));
};

/**
 * Retrieves the value of a client-side cookie.
 *
 * @param name - The name of the cookie to retrieve
 * @returns An object containing the cookie value, or undefined if not found
 *
 * @example
 * // Get a cookie value
 * const { value } = getClientSideCookie('userId');
 * if (value) {
 *   console.log('User ID:', value);
 * }
 */
export const getClientSideCookie = (name: string) => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return { value: cookieValue };
};
