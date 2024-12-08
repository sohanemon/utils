'use client';

import { copyToClipboard } from '../functions';
import * as React from 'react';

export * from './action';

export const useClickOutside = (
  callback: () => void = () => alert('clicked outside')
) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const listener = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  React.useEffect(() => {
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
  const parsedQuery = React.useMemo(() => {
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

  const [matches, setMatches] = React.useState(getMatches(parsedQuery));

  function handleChange() {
    setMatches(getMatches(parsedQuery));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const matchMedia = window.matchMedia(parsedQuery);
    handleChange();
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [parsedQuery]);

  return matches;
}

export function useEffectOnce(effect: React.EffectCallback) {
  React.useEffect(effect, []);
}

export function useUpdateEffect(effect: React.EffectCallback, deps: any[]) {
  const isInitialMount = React.useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, deps);
}

export function useDebounce<T>(state: T, delay = 500): T {
  const [debouncedState, setDebouncedState] = React.useState<T>(state);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedState(state), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [state, delay]);

  return debouncedState;
}

export const useIsomorphicEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export function useTimeout(callback: () => void, delay: number | null = 1000) {
  const savedCallback = React.useRef(callback);
  useIsomorphicEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, [type, listener]);
}

// Define a tuple type for the local storage value and its update function
type LocalStorageValue<T> = [T, React.Dispatch<React.SetStateAction<T>>];

// Custom hook for using local storage with a specified key and default value
export const useLocalStorage = <T extends Record<string, any>>(
  key: string,
  defaultValue: T
): LocalStorageValue<T> => {
  const [storedValue, setStoredValue] = React.useState<T>(defaultValue);

  // Use effect to retrieve the stored value from local storage on component mount
  React.useEffect(() => {
    const value = localStorage.getItem(key);
    if (value) {
      setStoredValue(JSON.parse(value));
    }
  }, [key]);

  // Function to update the stored value in local storage and state
  const updateStoredValue = (valueOrFn: React.SetStateAction<T>) => {
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let newValue;
    if (typeof valueOrFn === 'function') {
      const updateFunction = valueOrFn as (prevState: T) => T;
      newValue = updateFunction(storedValue);
    } else {
      newValue = valueOrFn;
    }
    localStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, updateStoredValue];
};

// Custom hook for using URL parameters with a specified key and default value
export const useUrlParams = <T extends string | number | boolean>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = React.useState<T>(defaultValue);

  // Use effect to retrieve the value from URL parameters on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(key);
    if (value !== null) {
      setValue(value as T);
    }
  }, [key]);

  // Function to update the value in URL parameters and state
  const updateValue = (newValue: T) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, String(newValue));
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
    setValue(newValue);
  };

  return [value, updateValue];
};

export const useQuerySelector = <T extends Element>(
  selector: string
): T | null => {
  const [element, setElement] = React.useState<T | null>(null);
  const elementRef = React.useRef<T | null>(null);

  React.useLayoutEffect(() => {
    const referenceElement = document.querySelector<T>(selector);
    if (!referenceElement) return;

    if (elementRef.current !== referenceElement) {
      elementRef.current = referenceElement;
      setElement(referenceElement);
    }

    const resizeObserver = new ResizeObserver(() => {
      // Only update state if the element reference changes
      if (elementRef.current !== referenceElement) {
        elementRef.current = referenceElement;
        setElement(referenceElement);
      }
    });

    resizeObserver.observe(referenceElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selector]);

  return element;
};

export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function useLockScroll() {
  React.useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}

export function useCopyToClipboard({ timeout = 2000 }) {
  const [isCopied, setIsCopied] = React.useState<Boolean>(false);

  const copy = (value: string) => {
    copyToClipboard(value, () => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copy };
}

type CalculationProps = {
  blockIds: string[];
  dynamic?: boolean;
  margin?: number;
};

export const useHeightCalculation = ({
  blockIds = [],
  margin = 0,
  dynamic = false,
}: CalculationProps) => {
  const [height, setTableHeight] = React.useState(500);

  const handleResize = () => {
    const blcokHeight = blockIds.reduce(
      (prevHeight, id) =>
        prevHeight + (document.getElementById(id)?.clientHeight || 0),
      0
    );
    setTableHeight(window.innerHeight - blcokHeight - margin);
  };

  useIsomorphicEffect(() => {
    handleResize();
    if (!dynamic) return;
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
};
