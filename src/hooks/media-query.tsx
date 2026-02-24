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
const toQuery = (bp: Breakpoint): string =>
  bp.startsWith('max-')
    ? `(max-width: ${BREAKPOINTS[bp.slice(4) as keyof typeof BREAKPOINTS] - 1}px)`
    : `(min-width: ${BREAKPOINTS[bp as keyof typeof BREAKPOINTS]}px)`;

/**
 * Stable serialization key for a MediaQueryMap — used as a memo dep
 * instead of spreading object values into the dep array.
 */
const serializeMap = <T,>(map: MediaQueryMap<T>): string =>
  BREAKPOINT_PRIORITY.filter((bp) => bp in map)
    .map((bp) => `${bp}:${String(map[bp as Breakpoint])}`)
    .join(',') + `:DEFAULT:${String(map.DEFAULT)}`;

/**
 * React hook for responsive design with CSS media queries.
 *
 * @example
 * // Boolean check for a single breakpoint
 * const isMobile = useMediaQuery('max-md');
 * const isDesktop = useMediaQuery('lg');
 *
 * @example
 * // Range queries (AND logic) — true when viewport is between md and lg
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
 *   DEFAULT: 1,   // < 640px
 *   sm: 2,        // 640px+
 *   lg: 4,        // 1024px+
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
  // ─── Map path ───────────────────────────────────────────────────────────────
  if (isMediaQueryMap<T>(input)) {
    // Stable memo key: serialise only the values that affect output order/value.
    // Avoids the illegal spread-into-deps anti-pattern and survives inline objects.
    const mapKey = serializeMap(input);

    const entries = React.useMemo(() => {
      const inputKeys = (Object.keys(input) as string[]).filter(
        (k): k is Breakpoint => k !== 'DEFAULT',
      );
      return BREAKPOINT_PRIORITY.filter((bp) => inputKeys.includes(bp)).map(
        (bp) => ({
          bp,
          query: toQuery(bp),
          value: input[bp as Breakpoint]!,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapKey]);

    const getMatch = React.useCallback(
      (mqls: MediaQueryList[]): T => {
        for (let i = 0; i < mqls.length; i++) {
          // mqls and entries are always co-indexed — safe to assert
          if (mqls[i]!.matches) return entries[i]!.value;
        }
        return input.DEFAULT;
      },
      [entries, input.DEFAULT],
    );

    const [value, setValue] = React.useState<T>(() => {
      if (isSSR) return input.DEFAULT;
      // Build MQLs once for the initial evaluation; the effect will own them afterward.
      for (const { query, value } of entries) {
        if (window.matchMedia(query).matches) return value;
      }
      return input.DEFAULT;
    });

    React.useEffect(() => {
      // Create one MQL per entry and reuse them for both checking and listening.
      const mqls = entries.map(({ query }) => window.matchMedia(query));

      const update = () => setValue(getMatch(mqls));

      for (const mql of mqls) mql.addEventListener('change', update);

      // Re-evaluate immediately in case the viewport changed between render and effect.
      update();

      return () => {
        for (const mql of mqls) mql.removeEventListener('change', update);
      };
    }, [entries, getMatch]);

    return value;
  }

  // ─── Boolean path ────────────────────────────────────────────────────────────
  const queries = Array.isArray(input) ? input : [input];

  // Stable string key — avoids the new-array-reference problem that made
  // useMemo a no-op when `queries` was derived inside the render.
  const queryKey = queries.join('||');

  const parsedQueries = React.useMemo(
    () =>
      queries.map((q) => (q.startsWith('(') ? q : toQuery(q as Breakpoint))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryKey],
  );

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (isSSR) return false;
    return parsedQueries.every((q) => window.matchMedia(q).matches);
  });

  // useScheduledEffect keeps timing consistent with the map path's useEffect
  // and avoids SSR flicker — intentional, not an oversight.
  useScheduledEffect(() => {
    // Build MQLs once and reuse in checkAll — no repeated matchMedia() calls.
    const mqls = parsedQueries.map((q) => window.matchMedia(q));

    const checkAll = () => setMatches(mqls.every((mql) => mql.matches));

    for (const mql of mqls) mql.addEventListener('change', checkAll);

    // Sync state in case it drifted during the deferred schedule window.
    checkAll();

    return () => {
      for (const mql of mqls) mql.removeEventListener('change', checkAll);
    };
  }, [parsedQueries]);

  return matches;
}

export type { MediaQueryMap };
export { BREAKPOINTS };
