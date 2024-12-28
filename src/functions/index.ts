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

/**
 * Creates a debounced function that delays invoking the provided function until
 * after the specified wait time has elapsed since the last invocation.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay (default is 1000ms)
 * @returns - A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait = 1000
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Creates a throttled function that invokes the provided function at most once
 * every specified wait time.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to wait (default is 1000ms)
 * @returns - A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait = 1000
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}
