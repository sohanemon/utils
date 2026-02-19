'use client';

import * as React from 'react';
import { isSSR } from '../functions';
import { useScheduledEffect } from './schedule';

/**
 * Breakpoint widths matching Tailwind CSS defaults
 * @see https://tailwindcss.com/docs/responsive-design
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS | `max-${keyof typeof BREAKPOINTS}`;

/**
 * Priority order for breakpoint matching (larger min-width first, then max-width)
 * This ensures mobile-first approach: larger breakpoints take precedence
 */
const BREAKPOINT_PRIORITY: Breakpoint[] = [
  '2xl',
  'xl',
  'lg',
  'md',
  'sm',
  'max-2xl',
  'max-xl',
  'max-lg',
  'max-md',
  'max-sm',
];

type MediaQueryMap<T> = { DEFAULT: T } & Partial<Record<Breakpoint, T>>;

const isMediaQueryMap = <T,>(arg: unknown): arg is MediaQueryMap<T> =>
  typeof arg === 'object' && arg !== null && 'DEFAULT' in arg;

/**
 * Converts a breakpoint name to a media query string
 * @example 'md' → '(min-width: 768px)'
 * @example 'max-md' → '(max-width: 767px)'
 */
const toQuery = (bp: Breakpoint) =>
  bp.startsWith('max-')
    ? `(max-width: ${BREAKPOINTS[bp.slice(4) as keyof typeof BREAKPOINTS] - 1}px)`
    : `(min-width: ${BREAKPOINTS[bp as keyof typeof BREAKPOINTS]}px)`;

/**
 * React hook for responsive design with CSS media queries.
 *
 * @example
 * // Boolean check for a single breakpoint
 * const isMobile = useMediaQuery('max-md');
 * const isDesktop = useMediaQuery('lg');
 *
 * @example
 * // Range queries (AND logic) - check multiple conditions
 * // True when viewport is between md and lg (768px - 1023px)
 * const isTablet = useMediaQuery(['md', 'max-lg']);
 *
 * @example
 * // Custom media queries
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * @example
 * // Responsive values with breakpoint map
 * const columns = useMediaQuery({
 *   DEFAULT: 1,      // < 640px
 *   sm: 2,           // 640px+
 *   lg: 4,           // 1024px+
 * });
 */
export function useMediaQuery<T>(map: MediaQueryMap<T>): T;
export function useMediaQuery(
  query: Breakpoint | `(${string})` | (Breakpoint | `(${string})`)[],
): boolean;

export function useMediaQuery<T>(
  input:
    | MediaQueryMap<T>
    | Breakpoint
    | `(${string})`
    | (Breakpoint | `(${string})`)[],
): T | boolean {
  if (isMediaQueryMap<T>(input)) {
    const entries = React.useMemo(() => {
      const inputKeys = Object.keys(input).filter(
        (k): k is Breakpoint =>
          k !== 'DEFAULT' && input[k as Breakpoint] !== undefined,
      );

      const sortedKeys = BREAKPOINT_PRIORITY.filter((bp) =>
        inputKeys.includes(bp),
      );

      return sortedKeys.map((k) => ({
        key: k,
        query: toQuery(k),
        value: input[k as Breakpoint]!,
      }));
    }, [...Object.keys(input).map((k) => input[k as Breakpoint])]);

    const [value, setValue] = React.useState<T>(() => {
      if (isSSR) return input.DEFAULT;
      for (const { query, value } of entries) {
        if (window.matchMedia(query).matches) return value;
      }
      return input.DEFAULT;
    });

    const entriesRef = React.useRef(entries);
    entriesRef.current = entries;

    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const updateValue = () => {
        for (const { query, value } of entriesRef.current) {
          if (window.matchMedia(query).matches) {
            setValue(value);
            return;
          }
        }
        setValue(input.DEFAULT);
      };

      const listeners = entriesRef.current.map(({ query }) => {
        const mql = window.matchMedia(query);
        mql.addEventListener('change', updateValue);
        return mql;
      });

      updateValue();

      return () => {
        for (const mql of listeners) {
          mql.removeEventListener('change', updateValue);
        }
      };
    }, [input.DEFAULT, entries]);

    return value;
  }

  const queries = Array.isArray(input) ? input : [input];
  const parsedQueries = React.useMemo(
    () =>
      queries.map((q) => (q.startsWith('(') ? q : toQuery(q as Breakpoint))),
    [queries],
  );

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return parsedQueries.every((q) => window.matchMedia(q).matches);
  });

  useScheduledEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAll = () => {
      setMatches(parsedQueries.every((q) => window.matchMedia(q).matches));
    };

    const listeners = parsedQueries.map((q) => {
      const mql = window.matchMedia(q);
      mql.addEventListener('change', checkAll);
      return mql;
    });

    checkAll();

    return () => {
      for (const mql of listeners) {
        mql.removeEventListener('change', checkAll);
      }
    };
  }, [parsedQueries]);

  return matches;
}

export type { MediaQueryMap };
export { BREAKPOINTS };
