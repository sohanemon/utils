import { type ClassValue, clsx } from 'clsx';
import type * as React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge class names with Tailwind CSS and additional custom merging logic.
 *
 * @param {...ClassValue[]} inputs - Class names to merge.
 * @returns {string} - A string of merged class names.
 *
 * @example
 * ```ts
 * cn('px-2 py-1', 'bg-red-500') // 'px-2 py-1 bg-red-500'
 * cn('px-2', 'px-4') // 'px-4' (Tailwind resolves conflicts)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
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
 *
 * @example
 * ```ts
 * isNavActive('/about', '/about/team') // true
 * isNavActive('/contact', '/about') // false
 * ```
 */
export function isNavActive(href: string, path: string): boolean {
  console.warn('isNavActive is deprecated. Use isLinkActive instead.');
  const regex = new RegExp(`^/?${href}(/|$)`);
  return regex.test(path);
}

/**
 * Checks if a link is active, considering optional localization prefixes.
 *
 * Compares paths while ignoring locale prefixes (e.g., /en/, /fr/) for consistent
 * navigation highlighting across different language versions of the same page.
 *
 * @param params - Parameters object.
 * @param params.path - The target path of the link.
 * @param params.currentPath - The current browser path.
 * @param params.locales - Supported locale prefixes to ignore during comparison.
 * @param params.exact - Whether to require exact path match (default: true). If false, checks if current path starts with target path.
 * @returns True if the link is active, false otherwise.
 *
 * @example
 * ```ts
 * // Exact match
 * isLinkActive({ path: '/about', currentPath: '/about' }) // true
 * isLinkActive({ path: '/about', currentPath: '/about/team' }) // false
 *
 * // With locales
 * isLinkActive({ path: '/about', currentPath: '/en/about' }) // true
 * isLinkActive({ path: '/about', currentPath: '/fr/about' }) // true
 *
 * // Partial match
 * isLinkActive({ path: '/blog', currentPath: '/blog/post-1', exact: false }) // true
 * ```
 */
export function isLinkActive({
  path,
  currentPath,
  locales = ['en', 'es', 'de', 'zh', 'bn', 'fr', 'it', 'nl'],
  exact = true,
}: {
  path: string;
  currentPath: string;
  locales?: string[];
  exact?: boolean;
}): boolean {
  const localeRegex = new RegExp(`^/?(${locales.join('|')})/`);
  const normalizePath = (p: string): string => {
    return p
      .replace(localeRegex, '') // Remove localization prefix (e.g., en/, fr/, etc.)
      .replace(/^\/+|\/+$/g, ''); // Trim leading and trailing slashes
  };

  const normalizedPath = normalizePath(path);
  const normalizedCurrentPath = normalizePath(currentPath);

  return exact
    ? normalizedPath === normalizedCurrentPath
    : normalizedCurrentPath.startsWith(normalizedPath);
}

/**
 * Cleans a file path by removing the `/public/` prefix if present.
 *
 * Useful when working with static assets that may have been processed
 * or when normalizing paths between development and production environments.
 *
 * @param src - The source path to clean.
 * @returns The cleaned path with `/public/` prefix removed and whitespace trimmed.
 *
 * @example
 * ```ts
 * cleanSrc('/public/images/logo.png') // '/images/logo.png'
 * cleanSrc('images/logo.png') // 'images/logo.png'
 * cleanSrc('  /public/docs/readme.md  ') // '/docs/readme.md'
 * ```
 */
export function cleanSrc(src: string) {
  let cleanedSrc = src;
  if (src.includes('/public/')) {
    cleanedSrc = src.replace('/public/', '/');
  }

  return cleanedSrc.trim();
}

/**
 * Smoothly scrolls to the top or bottom of a specified container.
 *
 * Provides smooth scrolling animation to either end of a scrollable element.
 * Accepts either a CSS selector string or a React ref to the container element.
 *
 * @param containerSelector - The CSS selector string or React ref for the scrollable container.
 * @param to - Direction to scroll: 'top' for top of container, 'bottom' for bottom.
 *
 * @example
 * ```ts
 * // Scroll to top using selector
 * scrollTo('.main-content', 'top');
 *
 * // Scroll to bottom using ref
 * scrollTo(containerRef, 'bottom');
 * ```
 */
export const scrollTo = (
  containerSelector: string | React.RefObject<HTMLDivElement>,
  to: 'top' | 'bottom',
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
 * Copies a given string to the clipboard using the modern Clipboard API.
 *
 * Safely attempts to copy text to the user's clipboard. Falls back gracefully
 * if the Clipboard API is not available or if the operation fails.
 *
 * @param value - The text value to copy to the clipboard.
 * @param onSuccess - Optional callback executed after successful copy operation.
 *
 * @example
 * ```ts
 * copyToClipboard('Hello World!', () => {
 *   console.log('Text copied successfully');
 * });
 * ```
 */
export const copyToClipboard = (value: string, onSuccess = () => {}) => {
  if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
    return;
  }

  if (!value) {
    return;
  }

  navigator.clipboard.writeText(value).then(onSuccess);
};

/**
 * Converts various case styles (camelCase, PascalCase, kebab-case, snake_case) into readable normal case.
 *
 * Transforms technical naming conventions into human-readable titles by:
 * - Adding spaces between words
 * - Capitalizing the first letter of each word
 * - Handling common separators (-, _, camelCase boundaries)
 *
 * @param inputString - The string to convert (supports camelCase, PascalCase, kebab-case, snake_case).
 * @returns The converted string in normal case (title case).
 *
 * @example
 * ```ts
 * convertToNormalCase('camelCase') // 'Camel Case'
 * convertToNormalCase('kebab-case') // 'Kebab Case'
 * convertToNormalCase('snake_case') // 'Snake Case'
 * convertToNormalCase('PascalCase') // 'Pascal Case'
 * ```
 */
export function convertToNormalCase(inputString: string) {
  const splittedString = inputString.split('.').pop();
  const string = splittedString || inputString;
  const words = string.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[-_|�\s]+/);
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
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
    (match) => charMap[match] || match,
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
 *
 * @example
 * ```ts
 * if (isSSR) {
 *   // Server-side only code
 *   console.log('Running on server');
 * } else {
 *   // Client-side only code
 *   window.addEventListener('load', () => {});
 * }
 * ```
 */
export const isSSR = typeof window === 'undefined';

/**
 * Converts an SVG string to a Base64-encoded string.
 *
 * @param str - The SVG string to encode
 * @returns - Base64-encoded string representation of the SVG
 *
 * @example
 * ```ts
 * const svg = '<svg><circle cx="50" cy="50" r="40"/></svg>';
 * const base64 = svgToBase64(svg);
 * // Use in data URL: `data:image/svg+xml;base64,${base64}`
 * ```
 */
export const svgToBase64 = (str: string) =>
  isSSR ? Buffer.from(str).toString('base64') : window.btoa(str);

/**
 * Pauses execution for the specified time.
 *
 * `signal` allows cancelling the sleep via AbortSignal.
 *
 * @param time - Time in milliseconds to sleep (default is 1000ms)
 * @param signal - Optional AbortSignal to cancel the sleep early
 * @returns - A Promise that resolves after the specified time or when aborted
 */
export const sleep = (time = 1000, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal?.aborted) return resolve();

    const id = setTimeout(() => {
      cleanup();
      resolve();
    }, time);

    function onAbort() {
      clearTimeout(id);
      cleanup();
      resolve();
    }

    function cleanup() {
      signal?.removeEventListener('abort', onAbort);
    }

    // only add listener if a signal was supplied
    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

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
 * ```ts
 * // Basic debouncing
 * const log = debounce((message: string) => console.log(message), 200);
 * log('Hello'); // Logs "Hello" after 200ms if no other call is made.
 * console.log(log.isPending); // true if the timer is active.
 *
 * // Immediate execution
 * const save = debounce(() => saveToServer(), 500, { immediate: true });
 * save(); // Executes immediately, then waits 500ms for subsequent calls
 *
 * // Check pending state
 * const debouncedSearch = debounce(searchAPI, 300);
 * debouncedSearch('query');
 * if (debouncedSearch.isPending) {
 *   showLoadingIndicator();
 * }
 * ```
 */
export function debounce<F extends (...args: any[]) => any>(
  function_: F,
  wait = 100,
  options?: { immediate: boolean },
): DebouncedFunction<F> {
  if (typeof function_ !== 'function') {
    throw new TypeError(
      `Expected the first parameter to be a function, got \`${typeof function_}\`.`,
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
 * ```ts
 * // Basic throttling (leading edge by default)
 * const log = throttle((message: string) => console.log(message), 200);
 * log('Hello'); // Logs "Hello" immediately
 * log('World'); // Ignored for 200ms
 * console.log(log.isPending); // true if within throttle window
 *
 * // Trailing edge only
 * const trailingLog = throttle(() => console.log('trailing'), 200, {
 *   leading: false,
 *   trailing: true
 * });
 * trailingLog(); // No immediate execution
 * // After 200ms: logs "trailing"
 *
 * // Both edges
 * const bothLog = throttle(() => console.log('both'), 200, {
 *   leading: true,
 *   trailing: true
 * });
 * bothLog(); // Immediate execution
 * // After 200ms: executes again if called during window
 * ```
 */
export function throttle<F extends (...args: any[]) => any>(
  function_: F,
  wait = 100,
  options?: { leading?: boolean; trailing?: boolean },
): ThrottledFunction<F> {
  if (typeof function_ !== 'function') {
    throw new TypeError(
      `Expected the first parameter to be a function, got \`${typeof function_}\`.`,
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

/**
 * Formats a string by replacing each '%s' placeholder with the corresponding argument.
 *
 * Mimics the basic behavior of C's printf for %s substitution. Supports both
 * variadic arguments and array-based argument passing. Extra placeholders
 * are left as-is, missing arguments result in empty strings.
 *
 * @param format - The format string containing '%s' placeholders.
 * @param args - The values to substitute, either as separate arguments or a single array.
 * @returns The formatted string with placeholders replaced by arguments.
 *
 * @example
 * ```ts
 * // Basic usage with separate arguments
 * printf("%s love %s", "I", "Bangladesh") // "I love Bangladesh"
 *
 * // Using array of arguments
 * printf("%s love %s", ["I", "Bangladesh"]) // "I love Bangladesh"
 *
 * // Extra placeholders remain unchanged
 * printf("%s %s %s", "Hello", "World") // "Hello World %s"
 *
 * // Missing arguments become empty strings
 * printf("%s and %s", "this") // "this and "
 *
 * // Multiple occurrences
 * printf("%s %s %s", "repeat", "repeat", "repeat") // "repeat repeat repeat"
 * ```
 */
export function printf(format: string, ...args: unknown[]): string {
  const replacements: unknown[] =
    args.length === 1 && Array.isArray(args[0]) ? (args[0] as unknown[]) : args;

  let idx = 0;
  return format.replace(/%s/g, () => {
    const arg = replacements[idx++];
    return arg === undefined ? '' : String(arg);
  });
}

/**
 * Merges multiple refs into a single ref callback.
 *
 * @param refs - An array of refs to merge.
 * @returns - A function that updates the merged ref with the provided value.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const ref1 = useRef<HTMLDivElement>(null);
 *   const ref2 = useRef<HTMLDivElement>(null);
 *
 *   const mergedRef = mergeRefs(ref1, ref2);
 *
 *   return <div ref={mergedRef}>Content</div>;
 * };
 * ```
 */

export type MergeRefs = <T>(
  ...refs: Array<React.Ref<T> | undefined>
) => React.RefCallback<T>;

export const mergeRefs: MergeRefs = <T>(...refs: any[]) => {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.RefObject<T | null>).current = value;
      }
    }
  };
};

/**
 * Navigates to the specified client-side hash without triggering SSR.
 *
 * Smoothly scrolls to an element by ID and updates the URL hash.
 * Use `scroll-margin-top` CSS property to add margins for fixed headers.
 *
 * @param id - The ID of the element (without #) to navigate to.
 * @param opts - Additional options for scrollIntoView.
 *
 * @example
 * ```ts
 * // Navigate to an element
 * goToClientSideHash('section-about');
 *
 * // With custom scroll behavior
 * goToClientSideHash('contact', { behavior: 'auto', block: 'center' });
 * ```
 */

export function goToClientSideHash(id: string, opts?: ScrollIntoViewOptions) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start', ...opts });
  window.history.pushState(null, '', `#${id}`);
}

/**
 * Escapes a string for use in a regular expression.
 *
 * @param str - The string to escape
 * @returns - The escaped string safe for use in RegExp constructor
 *
 * @example
 * ```ts
 * const escapedString = escapeRegExp('Hello, world!');
 * // escapedString === 'Hello\\, world!'
 *
 * const regex = new RegExp(escapeRegExp(userInput));
 * ```
 */

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalizes a string by:
 * - Applying Unicode normalization (NFC)
 * - Optionally removing diacritic marks (accents)
 * - Optionally trimming leading/trailing non-alphanumeric characters
 * - Optionally converting to lowercase
 *
 * @param str - The string to normalize
 * @param options - Normalization options
 * @param options.lowercase - Whether to convert the result to lowercase (default: true)
 * @param options.removeAccents - Whether to remove diacritic marks like accents (default: true)
 * @param options.removeNonAlphanumeric - Whether to trim non-alphanumeric characters from the edges (default: true)
 * @returns The normalized string
 *
 * @example
 * ```ts
 * normalizeText('Café') // 'cafe'
 * normalizeText('  Hello!  ') // 'hello'
 * normalizeText('José', { removeAccents: false }) // 'josé'
 * ```
 */
export function normalizeText(
  str?: string | null,
  options: {
    lowercase?: boolean;
    removeAccents?: boolean;
    removeNonAlphanumeric?: boolean;
  } = {},
): string {
  if (!str) return '';

  const {
    lowercase = true,
    removeAccents = true,
    removeNonAlphanumeric = true,
  } = options;

  let result = str.normalize('NFC');

  if (removeAccents) {
    result = result.normalize('NFD').replace(/\p{M}/gu, ''); // decompose and remove accents
  }

  if (removeNonAlphanumeric) {
    result = result.replace(/^[^\p{L}\p{N}]*|[^\p{L}\p{N}]*$/gu, ''); // trim edges
  }

  if (lowercase) {
    result = result.toLocaleLowerCase();
  }

  return result;
}
