'use client';

import * as React from 'react';
import { useScheduledEffect } from './schedule';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type MediaQueryMap<T> = { DEFAULT: T } & Partial<Record<Breakpoint, T>>;

const isMediaQueryMap = <T,>(arg: unknown): arg is MediaQueryMap<T> =>
  typeof arg === 'object' && arg !== null && 'DEFAULT' in arg;

/**
 * Hook to get responsive values based on breakpoints (mobile-first).
 * Returns the value for the largest matching breakpoint or DEFAULT.
 *
 * @param map - An object with DEFAULT (required) and optional breakpoint values.
 * @returns The value for the matching breakpoint or DEFAULT.
 *
 * @example
 * ```tsx
 * // String values
 * const fontSize = useMediaQuery({
 *   DEFAULT: 'text-sm',
 *   sm: 'text-base',
 *   lg: 'text-xl'
 * });
 * // Returns 'text-xl' on large screens, 'text-base' on small, 'text-sm' otherwise
 *
 * // Number values
 * const columns = useMediaQuery({
 *   DEFAULT: 1,
 *   sm: 2,
 *   lg: 3,
 *   xl: 4
 * });
 * // Returns 4 columns on xl, 3 on lg, 2 on sm, 1 otherwise
 *
 * // Mixed types
 * const component = useMediaQuery({
 *   DEFAULT: <MobileNav />,
 *   lg: <DesktopNav />
 * });
 * // Returns DesktopNav on large screens, MobileNav otherwise
 *
 * // With explicit type
 * const value = useMediaQuery<string | number>({
 *   DEFAULT: 'base',
 *   md: 123
 * });
 * ```
 */
export function useMediaQuery<T>(map: MediaQueryMap<T>): T;
/**
 * Hook to check if a media query matches (boolean check).
 * Supports Tailwind breakpoints or custom media queries.
 *
 * @param query - The Tailwind breakpoint ('sm' | 'md' | 'lg' | 'xl' | '2xl') or custom query string.
 * @returns A boolean indicating whether the media query matches.
 *
 * @example
 * ```tsx
 * // Tailwind breakpoints
 * const isMobile = useMediaQuery('md'); // true when screen >= 768px
 * const isLarge = useMediaQuery('lg'); // true when screen >= 1024px
 *
 * // Custom media queries
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isPortrait = useMediaQuery('(orientation: portrait)');
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * return (
 *   <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *     {isDark && <DarkModeToggle />}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(
  query: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`,
): boolean;
export function useMediaQuery<T>(
  input: MediaQueryMap<T> | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`,
): T | boolean {
  // Mapper object path
  if (isMediaQueryMap<T>(input)) {
    const [value, setValue] = React.useState<T>(() => {
      // SSR-safe: return DEFAULT on server, check on client
      if (typeof window === 'undefined') return input.DEFAULT;

      const breakpointConfigs: {
        key: Breakpoint;
        query: string;
        value: T | undefined;
      }[] = [
        { key: '2xl', query: '(min-width: 1536px)', value: input['2xl'] },
        { key: 'xl', query: '(min-width: 1280px)', value: input.xl },
        { key: 'lg', query: '(min-width: 1024px)', value: input.lg },
        { key: 'md', query: '(min-width: 768px)', value: input.md },
        { key: 'sm', query: '(min-width: 640px)', value: input.sm },
      ];

      const definedBreakpoints = breakpointConfigs.filter(
        (bp) => bp.value !== undefined,
      );

      for (const bp of definedBreakpoints) {
        if (window.matchMedia(bp.query).matches) {
          return bp.value as T;
        }
      }
      return input.DEFAULT;
    });

    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const breakpointConfigs: {
        key: Breakpoint;
        query: string;
        value: T | undefined;
      }[] = [
        { key: '2xl', query: '(min-width: 1536px)', value: input['2xl'] },
        { key: 'xl', query: '(min-width: 1280px)', value: input.xl },
        { key: 'lg', query: '(min-width: 1024px)', value: input.lg },
        { key: 'md', query: '(min-width: 768px)', value: input.md },
        { key: 'sm', query: '(min-width: 640px)', value: input.sm },
      ];

      const definedBreakpoints = breakpointConfigs.filter(
        (bp) => bp.value !== undefined,
      );

      const updateValue = () => {
        for (const bp of definedBreakpoints) {
          if (window.matchMedia(bp.query).matches) {
            setValue(bp.value as T);
            return;
          }
        }
        setValue(input.DEFAULT);
      };

      const listeners: MediaQueryList[] = [];
      for (const bp of definedBreakpoints) {
        const mql = window.matchMedia(bp.query);
        mql.addEventListener('change', updateValue);
        listeners.push(mql);
      }

      updateValue();

      return () => {
        for (const mql of listeners) {
          mql.removeEventListener('change', updateValue);
        }
      };
    }, [input]);

    return value;
  }

  // String query path (existing behavior)
  const parsedQuery = React.useMemo(() => {
    switch (input) {
      case 'sm':
        return '(min-width: 640px)';
      case 'md':
        return '(min-width: 768px)';
      case 'lg':
        return '(min-width: 1024px)';
      case 'xl':
        return '(min-width: 1280px)';
      case '2xl':
        return '(min-width: 1536px)';
      default:
        return input;
    }
  }, [input]);

  const getMatches = (query: string) => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = React.useState<boolean>(
    getMatches(parsedQuery),
  );

  useScheduledEffect(() => {
    if (typeof window === 'undefined') return;

    const matchMedia = window.matchMedia(parsedQuery);

    const handleChange = () => {
      setMatches(getMatches(parsedQuery));
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
