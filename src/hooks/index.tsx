'use client';

import { copyToClipboard } from '../functions';
import * as React from 'react';

export * from './action';

/**
 * Hook to detect clicks outside of a referenced element.
 * @param callback - A function to invoke when a click outside is detected.
 * @returns A React ref object to attach to the target element.
 */
export const useClickOutside = (
  callback: () => void = () => alert('clicked outside')
): React.RefObject<HTMLDivElement> => {
  const ref = React.useRef<HTMLDivElement>(null);
  const listener = (e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
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

/**
 * Hook to match a media query based on Tailwind CSS breakpoints or custom queries.
 * @param tailwindBreakpoint - The Tailwind breakpoint or custom query string.
 * @returns A boolean indicating whether the media query matches.
 */
export function useMediaQuery(
  tailwindBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`
): boolean {
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

  const [matches, setMatches] = React.useState<boolean>(
    getMatches(parsedQuery)
  );

  const handleChange = () => {
    setMatches(getMatches(parsedQuery));
  };

  useIsomorphicEffect(() => {
    const matchMedia = window.matchMedia(parsedQuery);
    handleChange();
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [parsedQuery]);

  return matches;
}

/**
 * Runs an effect only once when the component mounts.
 * @param effect - The effect callback function.
 */
export function useEffectOnce(effect: React.EffectCallback): void {
  React.useEffect(effect, []);
}

/**
 * Runs an effect only when dependencies update, excluding the initial render.
 * @param effect - The effect callback function.
 * @param deps - Dependency array for the effect.
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
): void {
  const isInitialMount = React.useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only update specific
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, deps);
}

/**
 * Debounces a state value with a specified delay.
 * @param state - The state value to debounce.
 * @param delay - The debounce delay in milliseconds (default: 500ms).
 * @returns The debounced state value.
 */
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

/**
 * Hook to handle effects with layout synchronization in the browser.
 */
export const useIsomorphicEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * Hook to invoke a callback after a specified timeout.
 * @param callback - The callback function to invoke.
 * @param delay - The timeout delay in milliseconds (default: 1000ms).
 */
export function useTimeout(
  callback: () => void,
  delay: number | null = 1000
): void {
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

/**
 * Hook to add and remove a window event listener.
 * @param type - The type of the event to listen for.
 * @param listener - The event listener callback.
 * @param options - Options for the event listener.
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void {
  React.useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, [type, listener, options]);
}

/**
 * Tuple type for session storage value and updater.
 */
type SessionStorageValue<T> = [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Hook to persist state in session storage.
 * @param key - The key for session storage.
 * @param defaultValue - The default value if no value is found in session storage.
 * @returns A tuple of the stored value and an updater function.
 */
export const useSessionStorage = <T extends Record<string, any>>(
  key: string,
  defaultValue: T
): SessionStorageValue<T> => {
  const [storedValue, setStoredValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    const value = sessionStorage.getItem(key);
    if (value) {
      setStoredValue(JSON.parse(value));
    }
  }, [key]);

  const updateStoredValue = (valueOrFn: React.SetStateAction<T>) => {
    let newValue: T;
    if (typeof valueOrFn === 'function') {
      newValue = (valueOrFn as (prevState: T) => T)(storedValue);
    } else {
      newValue = valueOrFn;
    }
    sessionStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, updateStoredValue];
};

/**
 * Tuple type for local storage value and updater.
 */
type LocalStorageValue<T> = [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Hook to persist state in local storage.
 * @param key - The key for local storage.
 * @param defaultValue - The default value if no value is found in local storage.
 * @returns A tuple of the stored value and an updater function.
 */
export const useLocalStorage = <T extends Record<string, any>>(
  key: string,
  defaultValue: T
): LocalStorageValue<T> => {
  const [storedValue, setStoredValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    const value = localStorage.getItem(key);
    if (value) {
      setStoredValue(JSON.parse(value));
    }
  }, [key]);

  const updateStoredValue = (valueOrFn: React.SetStateAction<T>) => {
    let newValue: T;
    if (typeof valueOrFn === 'function') {
      newValue = (valueOrFn as (prevState: T) => T)(storedValue);
    } else {
      newValue = valueOrFn;
    }
    localStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, updateStoredValue];
};

/**
 * Hook to manage URL parameters as state.
 * @param key - The URL parameter key.
 * @param defaultValue - The default value if the parameter is not present.
 * @returns A tuple of the parameter value and a setter function.
 */
export const useUrlParams = <T extends string | number | boolean>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(key);
    if (paramValue !== null) {
      setValue(paramValue as T);
    }
  }, [key]);

  const updateValue = (newValue: T) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, String(newValue));
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
    setValue(newValue);
  };

  return [value, updateValue];
};

/**
 * Hook to select a DOM element by CSS selector.
 * @param selector - The CSS selector string.
 * @returns The selected DOM element or null if not found.
 */
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

/**
 * Hook to detect if the code is running on the client side.
 * @returns A boolean indicating whether the code is running on the client.
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook to lock scroll by disabling body overflow.
 */
export function useLockScroll(): void {
  React.useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}

/**
 * Hook to copy text to the clipboard and track the copy status.
 * @param timeout - The timeout duration in milliseconds to reset the copy status (default: 2000ms).
 * @returns An object with the `isCopied` state and `copy` function.
 */
export function useCopyToClipboard({ timeout = 2000 }: { timeout?: number }) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

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

/**
 * Properties for height calculation.
 */
type CalculationProps2 = {
  blockIds: string[];
  dynamic?: boolean | string;
  margin?: number;
  substract?: boolean;
};

/**
 *
 * Hook to calculate the height of an element based on viewport and other block heights.
 * @param params - Configuration object for height calculation.
 * @returns The calculated height.
 */
export const useHeightCalculation = ({
  blockIds = [],
  margin = 0,
  substract = true,
  dynamic = false,
}: CalculationProps2): number => {
  const [height, setTableHeight] = React.useState<number>(500);

  const handleResize = () => {
    const blockHeight = blockIds.reduce(
      (prevHeight, id) =>
        prevHeight + (document.getElementById(id)?.clientHeight || 0),
      0
    );
    const height = substract
      ? window.innerHeight - blockHeight - margin
      : blockHeight + margin;
    setTableHeight(height);
  };

  useIsomorphicEffect(() => {
    handleResize();
    if (!dynamic) return;

    if (typeof dynamic === 'string') {
      const resizableElement = document.getElementById(dynamic);
      const resizeObserver = new ResizeObserver((entries) => {
        for (const _ of entries) handleResize();
      });

      if (resizableElement) resizeObserver.observe(resizableElement);
      return () => resizeObserver?.disconnect();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
};

/**
 * Properties for DOM calculation.
 */
type CalculationProps = {
  blockIds: string[];
  dynamic?: boolean | string;
  margin?: number;
  substract?: boolean;
  onChange?: (results: {
    blocksHeight: number;
    blocksWidth: number;
    remainingWidth: number;
    remainingHeight: number;
  }) => void;
};

/**
 * Hook to calculate dimensions (height and width) of an element based on viewport and other block dimensions.
 * @param params - Configuration object for dimension calculation.
 * @returns An object containing the calculated height and width.
 */
export const useDomCalculation = ({
  blockIds = [],
  margin = 0,
  substract = true,
  dynamic = false,
  onChange,
}: CalculationProps): { height: number; width: number } => {
  const [dimensions, setDimensions] = React.useState<{
    height: number;
    width: number;
  }>({
    height: 500,
    width: 500,
  });

  const handleCalculation = React.useCallback(() => {
    const blocksHeight = blockIds.reduce(
      (prevHeight, id) =>
        prevHeight + (document.getElementById(id)?.clientHeight || 0),
      0
    );

    const blocksWidth = blockIds.reduce(
      (prevWidth, id) =>
        prevWidth + (document.getElementById(id)?.clientWidth || 0),
      0
    );

    const height = substract
      ? window.innerHeight - blocksHeight - margin
      : blocksHeight + margin;

    const width = substract
      ? window.innerWidth - blocksWidth - margin
      : blocksWidth + margin;

    setDimensions((prev) => {
      // Only update state if dimensions have actually changed
      if (prev.height === height && prev.width === width) {
        return prev;
      }
      return { height, width };
    });

    onChange?.({
      blocksWidth,
      blocksHeight,
      remainingWidth: width,
      remainingHeight: height,
    });
  }, [blockIds, margin, substract, onChange]);

  useIsomorphicEffect(() => {
    handleCalculation();

    const cleanups: Array<() => void> = [];

    if (blockIds.length > 0) {
      const observer = new MutationObserver((mutations) => {
        let shouldRecalculate = false;
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              if (
                blockIds.includes(node.id) ||
                blockIds.some((id) => node.querySelector(`#${CSS.escape(id)}`))
              ) {
                shouldRecalculate = true;
                break;
              }
            }
          }
          if (shouldRecalculate) break;
          for (const node of mutation.removedNodes) {
            if (node instanceof Element) {
              if (
                blockIds.includes(node.id) ||
                blockIds.some((id) => node.querySelector(`#${CSS.escape(id)}`))
              ) {
                shouldRecalculate = true;
                break;
              }
            }
          }
          if (shouldRecalculate) break;
        }
        if (shouldRecalculate) {
          handleCalculation();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      cleanups.push(() => observer.disconnect());
    }

    if (dynamic) {
      if (typeof dynamic === 'string') {
        const resizableElement = document.getElementById(dynamic);
        if (resizableElement) {
          const resizeObserver = new ResizeObserver(handleCalculation);
          resizeObserver.observe(resizableElement);
          cleanups.push(() => resizeObserver.unobserve(resizableElement));
          cleanups.push(() => resizeObserver.disconnect());
        }
      } else {
        window.addEventListener('resize', handleCalculation);
        cleanups.push(() =>
          window.removeEventListener('resize', handleCalculation)
        );
      }
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [handleCalculation, dynamic, blockIds.join(',')]);

  return dimensions;
};

/**
 * Hook to detect if the user is scrolling.
 * @returns An object containing the isScrolling state and a ref to the scrollable container.
 */

export const useIsScrolling = () => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollableContainerRef = React.useRef<HTMLElement>(null);

  useEffectOnce(() => {
    const mainElement = scrollableContainerRef.current;

    if (!mainElement) return;

    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Set a timeout to mark scrolling as finished after delay
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    handleScroll();

    mainElement.addEventListener('scroll', handleScroll);

    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  });

  return {
    isScrolling,
    scrollableContainerRef,
  };
};

/**
 * Hook to detect if the user is at the top of the page.
 * @returns An object containing the isAtTop state and a ref to the scrollable container.
 */

export const useIsAtTop = ({ offset }: { offset?: number } = {}) => {
  const [isAtTop, setIsAtTop] = React.useState(true);

  const scrollableContainerRef = React.useRef<HTMLElement>(null);

  useEffectOnce(() => {
    const mainElement = scrollableContainerRef.current;

    if (!mainElement) return;

    const handleScroll = () => {
      const scrolled = mainElement.scrollTop > (offset ?? 10);
      setIsAtTop(!scrolled);
    };

    handleScroll();

    mainElement.addEventListener('scroll', handleScroll);

    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  });

  return { scrollableContainerRef, isAtTop };
};
