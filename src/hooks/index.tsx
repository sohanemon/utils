'use client';

import {
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const useClickOutside = (
  callback: () => void = () => alert('clicked outside')
) => {
  const ref = useRef<HTMLDivElement>(null);
  const listener = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  });
  return ref;
};

export function useMediaQuery(
  tailwindBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`
) {
  const parsedQuery = useMemo(() => {
    switch (tailwindBreakpoint) {
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
        return tailwindBreakpoint;
    }
  }, [tailwindBreakpoint]);

  const getMatches = (parsedQuery: string) => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(parsedQuery).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches(parsedQuery));

  function handleChange() {
    setMatches(getMatches(parsedQuery));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(parsedQuery);
    handleChange();
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedQuery]);

  return matches;
}

export function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}

export function useUpdateEffect(effect: EffectCallback, deps: any[]) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useDebounce<T>(state: T, delay: number = 500): T {
  const [debouncedState, setDebouncedState] = useState<T>(state);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedState(state), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [state, delay]);

  return debouncedState;
}

export const useIsomorphicEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useTimeout(callback: () => void, delay: number | null = 1000) {
  const savedCallback = useRef(callback);
  useIsomorphicEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
}

export function useWindowEvent<K extends string = keyof WindowEventMap>(
  type: K,
  listener: K extends keyof WindowEventMap
    ? (this: Window, ev: WindowEventMap[K]) => void
    : (this: Window, ev: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, [type, listener]);
}
