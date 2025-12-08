'use client';
import * as React from 'react';
import { useMediaQuery } from '../hooks';

/**
 * Supported Tailwind CSS breakpoints for the MediaWrapper component.
 */
type BreakPoints =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'max-sm'
  | 'max-md'
  | 'max-lg'
  | 'max-xl'
  | 'max-2xl';
/**
 * Props for the MediaWrapper component.
 */
type MediaWrapperProps = React.ComponentProps<'div'> & {
  /** The breakpoint at which to switch between the main component and fallback. */
  breakpoint: BreakPoints;
  /** The component to render when the breakpoint matches. Defaults to 'div'. */
  as?: React.ElementType;
  /** The component to render when the breakpoint doesn't match. Defaults to React.Fragment. */
  fallback?: React.ElementType;
  /** Class name to apply to the fallback component. */
  classNameFallback?: string;
};

/**
 * Conditionally renders different components based on Tailwind CSS breakpoints.
 *
 * Renders the main component when the viewport matches the specified breakpoint,
 * otherwise renders the fallback component. Useful for responsive component switching.
 *
 * @param props - The component props
 * @returns The appropriate component based on the current breakpoint
 *
 * @example
 * ```tsx
 * // Show different content on mobile vs desktop
 * <MediaWrapper breakpoint="md" as="article" fallback="aside">
 *   <p>This shows on medium screens and up</p>
 * </MediaWrapper>
 *
 * // Use max-breakpoint for "up to" behavior
 * <MediaWrapper breakpoint="max-lg" as="nav" fallback="div">
 *   <ul>Horizontal nav on large screens</ul>
 * </MediaWrapper>
 * ```
 */
export function MediaWrapper({
  breakpoint,
  as = 'div',
  fallback = React.Fragment,
  className: classNameOriginal,
  classNameFallback,
  ...props
}: MediaWrapperProps) {
  const overMedia = useMediaQuery(breakpoint.split('-').pop() as `(${string})`);
  const isMax = breakpoint.startsWith('max');
  const useFallback = overMedia === isMax;

  // Conditionally determining which component to render,
  // and what className should be passed to it.
  const Wrapper = useFallback ? fallback : as;
  const className = useFallback ? classNameFallback : classNameOriginal;

  return <Wrapper className={className} {...props} />;
}
