'use client';
import * as React from 'react';
import { type Breakpoint, useMediaQuery } from '../hooks';

type MediaProps = {
  /** Tailwind breakpoint to match. Use `md` for min-width, `max-md` for max-width. */
  breakpoint: Breakpoint;
  children: React.ReactNode;
  /** Rendered when the viewport doesn't match. Defaults to nothing. */
  fallback?: React.ReactNode;
};

/**
 * Conditionally renders children based on a single Tailwind breakpoint.
 *
 * Renders children when the viewport matches the breakpoint, otherwise renders
 * the fallback (defaults to nothing). No wrapper element.
 *
 * @example
 * ```tsx
 * // Show on md screens and up
 * <Media breakpoint="md">
 *   <DesktopSidebar />
 * </Media>
 *
 * // Show on mobile, hide on desktop
 * <Media breakpoint="max-md" fallback={<DesktopLayout />}>
 *   <MobileLayout />
 * </Media>
 * ```
 */
export function Media({ breakpoint, children, fallback }: MediaProps) {
  const matches = useMediaQuery(breakpoint);

  return <>{matches ? children : fallback}</>;
}
