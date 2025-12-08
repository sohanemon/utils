'use client';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

/**
 * Context that provides a ref to the scrollable container managed by ScrollTracker.
 */
export const ScrollTrackerContext =
  React.createContext<React.RefObject<HTMLElement> | null>(null);

/**
 * Props for the ScrollTracker component.
 */
interface ScrollTrackerProps {
  /** The child elements to render within the scrollable container. */
  children: React.ReactNode;
}

/**
 * A component that provides a scrollable container and context for scroll tracking.
 *
 * Wraps children in a scrollable div and provides a context with a ref to the container.
 * Useful for components that need to track scroll position or attach scroll listeners.
 *
 * @param props - The component props
 * @returns A scrollable container with context provider
 *
 * @example
 * ```tsx
 * <ScrollTracker>
 *   <div>Scrollable content</div>
 * </ScrollTracker>
 * ```
 */
export const ScrollTracker = ({ children }: ScrollTrackerProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <ScrollTrackerContext.Provider value={ref as React.RefObject<HTMLElement>}>
      <Slot ref={ref}>{children}</Slot>
    </ScrollTrackerContext.Provider>
  );
};
