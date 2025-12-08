import * as React from 'react';
import { ScrollTrackerContext } from '../components/scroll-tracker';
import { useScheduledEffect } from './schedule';

interface UseScrollTrackerOptions {
  threshold?: number;
  container?: React.RefObject<HTMLElement | null>;
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
  const effectiveContainer = container ?? contextContainer;

  const [state, setState] = React.useState<ScrollTrackerState>({
    scrolledPast: false,
    direction: 'forward',
  });

  const prevScrollRef = React.useRef(0);

  const updateScrollState = (current: number) => {
    const prev = prevScrollRef.current;
    const newDirection: 'forward' | 'backward' =
      current > prev ? 'forward' : 'backward';

    setState({
      scrolledPast: current > threshold,
      direction: newDirection,
    });

    prevScrollRef.current = current;
  };

  useScheduledEffect(() => {
    const element = effectiveContainer?.current;
    const target = element || window;
    const scrollProperty = element ? 'scrollTop' : 'scrollY';

    const handleScroll = () => {
      const current = (target as any)[scrollProperty];
      updateScrollState(current);
    };

    target.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => target.removeEventListener('scroll', handleScroll);
  }, [effectiveContainer, threshold]);

  return state;
};
