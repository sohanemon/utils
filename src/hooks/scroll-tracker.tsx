import * as React from 'react';
import { ScrollTrackerContext } from '../components/scroll-tracker';
import { useScheduledEffect } from './schedule';

/**
 * Options for the useScrollTracker hook.
 */
interface UseScrollTrackerOptions {
  /** The scroll distance threshold to consider as "scrolled past". Defaults to 300. */
  threshold?: number;
  /** CSS selector or ref to the scrollable container. Defaults to window. */
  container?: string | React.RefObject<HTMLElement | null>;
}

/**
 * State returned by the useScrollTracker hook.
 */
interface ScrollTrackerState {
  /** Whether the scroll position has exceeded the threshold. */
  scrolledPast: boolean;
  /** The current scroll direction. */
  direction: 'forward' | 'backward';
}

/**
 * Hook to track scroll position and direction relative to a threshold.
 *
 * Monitors scroll events on a specified container (or window) and provides
 * information about whether the user has scrolled past a threshold and the scroll direction.
 *
 * @param options - Configuration options for scroll tracking
 * @returns Object containing scroll state: scrolledPast and direction
 *
 * @example
 * ```tsx
 * const { scrolledPast, direction } = useScrollTracker({ threshold: 200 });
 *
 * if (scrolledPast) {
 *   // Show sticky header or hide elements
 * }
 *
 * if (direction === 'forward') {
 *   // User is scrolling down
 * }
 * ```
 */
export const useScrollTracker = ({
  threshold = 300,
  container,
}: UseScrollTrackerOptions = {}) => {
  const contextContainer = React.useContext(ScrollTrackerContext);

  const [state, setState] = React.useState<ScrollTrackerState>({
    scrolledPast: false,
    direction: 'forward',
  });

  const prevScrollRef = React.useRef(0);

  const updateScrollState = (current: number) => {
    const prev = prevScrollRef.current;
    const newDirection: ScrollTrackerState['direction'] =
      current > prev ? 'forward' : 'backward';

    setState({
      scrolledPast: current > threshold,
      direction: newDirection,
    });

    prevScrollRef.current = current;
  };

  useScheduledEffect(() => {
    let element: HTMLElement | null = null;

    if (typeof container === 'string') {
      element = document.querySelector(container);
    } else if (container?.current) {
      element = container.current;
    } else if (contextContainer?.current) {
      element = contextContainer.current;
    }

    const target = element || window;
    const scrollProperty = element ? 'scrollTop' : 'scrollY';

    const handleScroll = () => {
      const current = (target as any)[scrollProperty];
      updateScrollState(current);
    };

    target.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => target.removeEventListener('scroll', handleScroll);
  }, [container, contextContainer, threshold]);

  return state;
};
