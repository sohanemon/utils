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
 * @param href - The target URL.
 * @param path - The current browser path.
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
