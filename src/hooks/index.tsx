'use client';

import {
  type Dispatch,
  type EffectCallback,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useTransition,
  useCallback,
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
  }, [parsedQuery]);

  return matches;
}

export function useEffectOnce(effect: EffectCallback) {
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

export function useDebounce<T>(state: T, delay = 500): T {
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

// Define a tuple type for the local storage value and its update function
type LocalStorageValue<T> = [T, Dispatch<SetStateAction<T>>];

// Custom hook for using local storage with a specified key and default value
export const useLocalStorage = <T extends Record<string, any>>(
  key: string,
  defaultValue: T
): LocalStorageValue<T> => {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  // Use effect to retrieve the stored value from local storage on component mount
  useEffect(() => {
    const value = localStorage.getItem(key);
    if (value) {
      setStoredValue(JSON.parse(value));
    }
  }, [key]);

  // Function to update the stored value in local storage and state
  const updateStoredValue = (valueOrFn: SetStateAction<T>) => {
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
  const [value, setValue] = useState<T>(defaultValue);

  // Use effect to retrieve the value from URL parameters on component mount
  useEffect(() => {
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

interface UseAsyncOptions<T extends (...args: any) => any> {
  initialArgs?: Parameters<T>[0];
  callback?: {
    onSuccess?: (result: T) => void;
    onError?: (error: Error) => void;
    onExecute?: () => void;
    onSettle?: () => void;
  };
  mode?: 'onLoad' | 'onTrigger';
}

export const useAsync = <T extends (...args: any) => any>(
  fn: T,
  opts: UseAsyncOptions<T> = {}
) => {
  const { initialArgs, callback = {}, mode = "onTrigger" } = opts;

  const { onSuccess, onError, onExecute, onSettle } = callback;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setValue] = useState<Awaited<ReturnType<T>> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(
    async (args: Parameters<T>[0]) => {
      setIsLoading(true);
      setValue(null);
      setError(null);
      onExecute?.();
      try {
        startTransition(async () => {
          const response = await fn(args);
          setValue(response);
          onSuccess?.(response);
        });
      } catch (error) {
        setError(error as Error);
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
        onSettle?.();
      }
    },
    [fn, onExecute, onSuccess, onError, onSettle]
  );

  useEffect(() => {
    if (mode === 'onLoad') {
      execute(initialArgs);
    }
  }, []);

  return {
    execute,
    isLoading: isLoading || isPending,
    result,
    error,
  };
};
