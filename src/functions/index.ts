/**
 * Utility to merge class names with Tailwind CSS and additional custom merging logic.
 *
 * @param {...ClassValue[]} inputs - Class names to merge.
 * @returns {string} - A string of merged class names.
 */
import { type ClassValue, clsx } from 'clsx';
import type * as React from 'react';
import { extendTailwindMerge } from 'tailwind-merge';
import { withFluid } from '@fluid-tailwind/tailwind-merge';

export * from './cookie';
export * from './object';

export function cn(...inputs: ClassValue[]) {
  const twMerge = extendTailwindMerge(withFluid);
  return twMerge(clsx(inputs));
}

/**
 * @deprecated Use isLinkActive instead.
 *
 * Determines if a navigation link is active based on the current path.
 *
 * @param  href - The target URL.
 * @param  path - The current browser path.
 * @returns - True if the navigation is active, false otherwise.
 */
export function isNavActive(href: string, path: string): boolean {
  console.warn('isNavActive is deprecated. Use isLinkActive instead.');
  const regex = new RegExp(`^/?${href}(/|$)`);
  return regex.test(path);
}

/**
 * Checks if a link is active, considering optional localization prefixes.
 *
 * @param {Object} params - Parameters object.
 * @param {string} params.path - The target path of the link.
 * @param {string} params.currentPath - The current browser path.
 * @param {string[]} [params.locales=['en', 'es', 'de', 'zh', 'bn', 'fr', 'it', 'nl']] - Supported locale prefixes.
 * @returns {boolean} - True if the link is active, false otherwise.
 */
export function isLinkActive({
  path,
  currentPath,
  locales = ['en', 'es', 'de', 'zh', 'bn', 'fr', 'it', 'nl'],
}: {
  path: string;
  currentPath: string;
  locales?: string[];
}): boolean {
  const localeRegex = new RegExp(`^/?(${locales.join('|')})/`);
  const normalizePath = (p: string): string => {
    return p
      .replace(localeRegex, '') // Remove localization prefix (e.g., en/, fr/, etc.)
      .replace(/^\/+|\/+$/g, ''); // Trim leading and trailing slashes
  };

  const normalizedPath = normalizePath(path);
  const normalizedCurrentPath = normalizePath(currentPath);

  return normalizedPath === normalizedCurrentPath;
}

/**
 * Cleans a file path by removing the `/public/` prefix if present.
 *
 * @param  src - The source path to clean.
 * @returns - The cleaned path.
 */
export function cleanSrc(src: string) {
  if (src.includes('/public/')) return src.replace('/public/', '/');
  return src;
}

/**
 * Smoothly scrolls to the top or bottom of a specified container.
 *
 * @param  containerSelector - The CSS selector or React ref for the container.
 * @param  to - Specifies whether to scroll to the top or bottom.
 */
export const scrollTo = (
  containerSelector: string | React.RefObject<HTMLDivElement>,
  to: 'top' | 'bottom'
) => {
  let container: HTMLDivElement | null;

  if (typeof containerSelector === 'string') {
    container = document.querySelector(containerSelector);
  } else if (containerSelector.current) {
    container = containerSelector.current;
  } else {
    return;
  }

  if (container) {
    container.scrollTo({
      top: to === 'top' ? 0 : container.scrollHeight - container.clientHeight,
      behavior: 'smooth',
    });
  }
};

/**
 * Copies a given string to the clipboard.
 *
 * @param  value - The value to copy to the clipboard.
 * @param  [onSuccess=() => {}] - Optional callback executed after successful copy.
 */
export const copyToClipboard = (value: string, onSuccess = () => { }) => {
  if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
    return;
  }

  if (!value) {
    return;
  }

  navigator.clipboard.writeText(value).then(onSuccess);
};

/**
 * Converts camelCase, PascalCase, kebab-case, snake_case into normal case.
 *
 * @param  inputString - The string need to be converted into normal case
 * @returns - Normal Case
 */
export function convertToNormalCase(inputString: string) {
  const splittedString = inputString.split('.').pop();
  const string = splittedString || inputString;
  const words = string.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[-_|​\s]+/);
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(' ');
}

const from = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
const to = 'aaaaaeeeeiiiioooouuuunc------';

/**
 * Converts a string to a URL-friendly slug by trimming, converting to lowercase,
 * replacing diacritics, removing invalid characters, and replacing spaces with hyphens.
 * @param {string} [str] - The input string to convert.
 * @returns {string} The generated slug.
 * @example
 * convertToSlug("Hello World!"); // "hello-world"
 * convertToSlug("Déjà Vu"); // "deja-vu"
 */
export const convertToSlug = (str: string): string => {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // Trim the string and convert it to lowercase.
  let slug = str.trim().toLowerCase();

  // Build a mapping of accented characters to their non-accented equivalents.
  const charMap: Record<string, string> = {};
  for (let i = 0; i < from.length; i++) {
    charMap[from.charAt(i)] = to.charAt(i);
  }

  // Replace all accented characters using the mapping.
  slug = slug.replace(
    new RegExp(`[${from}]`, 'g'),
    (match) => charMap[match] || match
  );

  return (
    slug
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Collapse consecutive hyphens
      .replace(/^-+/, '') // Remove leading hyphens
      .replace(/-+$/, '') || // Remove trailing hyphens
    ''
  );
};

/**
 * Checks if the code is running in a server-side environment.
 *
 * @returns - True if the code is executed in SSR (Server-Side Rendering) context, false otherwise
 */
export const isSSR = typeof window === 'undefined';

/**
 * Converts an SVG string to a Base64-encoded string.
 *
 * @param str - The SVG string to encode
 * @returns - Base64-encoded string representation of the SVG
 */
export const svgToBase64 = (str: string) =>
  isSSR ? Buffer.from(str).toString('base64') : window.btoa(str);

/**
 * Pauses execution for the specified time.
 *
 * @param time - Time in milliseconds to sleep (default is 1000ms)
 * @returns - A Promise that resolves after the specified time
 */
export const sleep = (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

type DebouncedFunction<F extends (...args: any[]) => any> = {
  (...args: Parameters<F>): ReturnType<F> | undefined;
  readonly isPending: boolean;
};

/**
 * Creates a debounced function that delays invoking the provided function until
 * after the specified `wait` time has elapsed since the last invocation.
 *
 * If the `immediate` option is set to `true`, the function will be invoked immediately
 * on the leading edge of the wait interval. Subsequent calls during the wait interval
 * will reset the timer but not invoke the function until the interval elapses again.
 *
 * The returned function includes the `isPending` property to check if the debounce
 * timer is currently active.
 *
 * @typeParam F - The type of the function to debounce.
 *
 * @param function_ - The function to debounce.
 * @param wait - The number of milliseconds to delay (default is 100ms).
 * @param options - An optional object with the following properties:
 *   - `immediate` (boolean): If `true`, invokes the function on the leading edge
 *     of the wait interval instead of the trailing edge.
 *
 * @returns A debounced version of the provided function, enhanced with the `isPending` property.
 *
 * @throws {TypeError} If the first parameter is not a function.
 * @throws {RangeError} If the `wait` parameter is negative.
 *
 * @example
 * const log = debounce((message: string) => console.log(message), 200);
 * log('Hello'); // Logs "Hello" after 200ms if no other call is made.
 * console.log(log.isPending); // true if the timer is active.
 */
export function debounce<F extends (...args: any[]) => any>(
  function_: F,
  wait = 100,
  options?: { immediate: boolean }
): DebouncedFunction<F> {
  if (typeof function_ !== 'function') {
    throw new TypeError(
      `Expected the first parameter to be a function, got \`${typeof function_}\`.`
    );
  }

  if (wait < 0) {
    throw new RangeError('`wait` must not be negative.');
  }

  const immediate = options?.immediate ?? false;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<F> | undefined;
  let lastContext: ThisParameterType<F> | undefined;
  let result: ReturnType<F> | undefined;

  function run(this: ThisParameterType<F>): ReturnType<F> | undefined {
    result = function_.apply(lastContext, lastArgs!);
    lastArgs = undefined;
    lastContext = undefined;
    return result;
  }

  const debounced = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): ReturnType<F> | undefined {
    lastArgs = args;
    lastContext = this;

    if (timeoutId === undefined && immediate) {
      result = run.call(this);
    }

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(run.bind(this), wait);
    return result;
  } as DebouncedFunction<F>;

  Object.defineProperty(debounced, 'isPending', {
    get() {
      return timeoutId !== undefined;
    },
  });

  return debounced;
}

type ThrottledFunction<F extends (...args: any[]) => any> = {
  (...args: Parameters<F>): ReturnType<F> | undefined;
  readonly isPending: boolean;
};

/**
 * Creates a throttled function that invokes the provided function at most once
 * every `wait` milliseconds.
 *
 * If the `leading` option is set to `true`, the function will be invoked immediately
 * on the leading edge of the throttle interval. If the `trailing` option is set to `true`,
 * the function will also be invoked at the end of the throttle interval if additional
 * calls were made during the interval.
 *
 * The returned function includes the `isPending` property to check if the throttle
 * timer is currently active.
 *
 * @typeParam F - The type of the function to throttle.
 *
 * @param function_ - The function to throttle.
 * @param wait - The number of milliseconds to wait between invocations (default is 100ms).
 * @param options - An optional object with the following properties:
 *   - `leading` (boolean): If `true`, invokes the function on the leading edge of the interval.
 *   - `trailing` (boolean): If `true`, invokes the function on the trailing edge of the interval.
 *
 * @returns A throttled version of the provided function, enhanced with the `isPending` property.
 *
 * @throws {TypeError} If the first parameter is not a function.
 * @throws {RangeError} If the `wait` parameter is negative.
 *
 * @example
 * const log = throttle((message: string) => console.log(message), 200);
 * log('Hello'); // Logs "Hello" immediately if leading is true.
 * console.log(log.isPending); // true if the timer is active.
 */
export function throttle<F extends (...args: any[]) => any>(
  function_: F,
  wait = 100,
  options?: { leading?: boolean; trailing?: boolean }
): ThrottledFunction<F> {
  if (typeof function_ !== 'function') {
    throw new TypeError(
      `Expected the first parameter to be a function, got \`${typeof function_}\`.`
    );
  }

  if (wait < 0) {
    throw new RangeError('`wait` must not be negative.');
  }

  const leading = options?.leading ?? true;
  const trailing = options?.trailing ?? true;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<F> | undefined;
  let lastContext: ThisParameterType<F> | undefined;
  let lastCallTime: number | undefined;
  let result: ReturnType<F> | undefined;

  function invoke() {
    lastCallTime = Date.now();
    result = function_.apply(lastContext, lastArgs!);
    lastArgs = undefined;
    lastContext = undefined;
  }

  function later() {
    timeoutId = undefined;
    if (trailing && lastArgs) {
      invoke();
    }
  }

  const throttled = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): ReturnType<F> | undefined {
    const now = Date.now();
    const timeSinceLastCall = lastCallTime
      ? now - lastCallTime
      : Number.POSITIVE_INFINITY;

    lastArgs = args;
    lastContext = this;

    if (timeSinceLastCall >= wait) {
      if (leading) {
        invoke();
      } else {
        timeoutId = setTimeout(later, wait);
      }
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(later, wait - timeSinceLastCall);
    }

    return result;
  } as ThrottledFunction<F>;

  Object.defineProperty(throttled, 'isPending', {
    get() {
      return timeoutId !== undefined;
    },
  });

  return throttled;
}
