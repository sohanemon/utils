'use client';
import { useEffect, useLayoutEffect, useMemo, useTransition, useCallback, useRef, useState, } from 'react';
export const useClickOutside = (callback = () => alert('clicked outside')) => {
    const ref = useRef(null);
    const listener = (e) => {
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
export function useMediaQuery(tailwindBreakpoint) {
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
    const getMatches = (parsedQuery) => {
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
export function useEffectOnce(effect) {
    useEffect(effect, []);
}
export function useUpdateEffect(effect, deps) {
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
        else {
            return effect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
export function useDebounce(state, delay = 500) {
    const [debouncedState, setDebouncedState] = useState(state);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedState(state), delay);
        return () => {
            clearTimeout(timer);
        };
    }, [state, delay]);
    return debouncedState;
}
export const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
export function useTimeout(callback, delay = 1000) {
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
export function useWindowEvent(type, listener, options) {
    useEffect(() => {
        window.addEventListener(type, listener, options);
        return () => window.removeEventListener(type, listener, options);
    }, [type, listener]);
}
// Custom hook for using local storage with a specified key and default value
export const useLocalStorage = (key, defaultValue) => {
    const [storedValue, setStoredValue] = useState(defaultValue);
    // Use effect to retrieve the stored value from local storage on component mount
    useEffect(() => {
        const value = localStorage.getItem(key);
        if (value) {
            setStoredValue(JSON.parse(value));
        }
    }, [key]);
    // Function to update the stored value in local storage and state
    const updateStoredValue = (valueOrFn) => {
        let newValue;
        if (typeof valueOrFn === 'function') {
            const updateFunction = valueOrFn;
            newValue = updateFunction(storedValue);
        }
        else {
            newValue = valueOrFn;
        }
        localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
    };
    return [storedValue, updateStoredValue];
};
// Custom hook for using URL parameters with a specified key and default value
export const useUrlParams = (key, defaultValue) => {
    const [value, setValue] = useState(defaultValue);
    // Use effect to retrieve the value from URL parameters on component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(key);
        if (value !== null) {
            setValue(value);
        }
    }, [key]);
    // Function to update the value in URL parameters and state
    const updateValue = (newValue) => {
        const params = new URLSearchParams(window.location.search);
        params.set(key, String(newValue));
        window.history.pushState({}, '', `${window.location.pathname}?${params}`);
        setValue(newValue);
    };
    return [value, updateValue];
};
export const useAsync = (fn, opts = {}) => {
    const { initialArgs, callback = {}, mode = "onTrigger" } = opts;
    const { onSuccess, onError, onExecute, onSettle } = callback;
    const [isLoading, setIsLoading] = useState(false);
    const [result, setValue] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();
    const execute = useCallback(async (args) => {
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
        }
        catch (error) {
            setError(error);
            onError?.(error);
        }
        finally {
            setIsLoading(false);
            onSettle?.();
        }
    }, [fn, onExecute, onSuccess, onError, onSettle]);
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
