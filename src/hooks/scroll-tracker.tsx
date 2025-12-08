import * as React from 'react';
import { ScrollTrackerContext } from '../components/scroll-tracker';
import { useScheduledEffect } from './schedule';

interface UseScrollTrackerOptions {
  threshold?: number;
  container?: string | React.RefObject<HTMLElement | null>;
}

interface ScrollTrackerState {
  scrolledPast: boolean;
  direction: 'forward' | 'backward';
}

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
