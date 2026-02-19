'use client';

import * as React from 'react';
import { isSSR } from '../functions';
import { useScheduledEffect } from './schedule';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS | `max-${keyof typeof BREAKPOINTS}`;

type MediaQueryMap<T> = { DEFAULT: T } & Partial<Record<Breakpoint, T>>;

const isMediaQueryMap = <T,>(arg: unknown): arg is MediaQueryMap<T> =>
  typeof arg === 'object' && arg !== null && 'DEFAULT' in arg;

const toQuery = (bp: Breakpoint) =>
  bp.startsWith('max-')
    ? `(max-width: ${BREAKPOINTS[bp.slice(4) as keyof typeof BREAKPOINTS] - 1}px)`
    : `(min-width: ${BREAKPOINTS[bp as keyof typeof BREAKPOINTS]}px)`;

/**
 * Hook to get responsive values based on breakpoints.
 * Returns the value for the first matching breakpoint or DEFAULT.
 * For max-* breakpoints, matches in declared order. For min breakpoints,
 * returns the first match (largest breakpoint wins).
 *
 * @param map - An object with DEFAULT (required) and optional breakpoint values.
 * @returns The value for the matching breakpoint or DEFAULT.
 */
export function useMediaQuery<T>(map: MediaQueryMap<T>): T;
/**
 * Hook to check if a media query matches (boolean check).
 * Supports Tailwind breakpoints or custom media queries.
 */
export function useMediaQuery(query: Breakpoint | `(${string})`): boolean;

export function useMediaQuery<T>(
  input: MediaQueryMap<T> | Breakpoint | `(${string})`,
): T | boolean {
  if (isMediaQueryMap<T>(input)) {
    const entries = React.useMemo(
      () =>
        Object.keys(input)
          .filter(
            (k): k is Breakpoint =>
              k !== 'DEFAULT' && input[k as Breakpoint] !== undefined,
          )
          .map((k) => ({
            key: k,
            query: toQuery(k),
            value: input[k as Breakpoint]!,
          })),
      [...Object.keys(input).map((k) => input[k as Breakpoint])],
    );

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

  const parsedQuery = input.startsWith('(')
    ? input
    : toQuery(input as Breakpoint);

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(parsedQuery).matches;
  });

  useScheduledEffect(() => {
    if (typeof window === 'undefined') return;

    const matchMedia = window.matchMedia(parsedQuery);

    const handleChange = () => {
      setMatches(matchMedia.matches);
    };

    handleChange();
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [parsedQuery]);

  return matches;
}

export type { MediaQueryMap };
