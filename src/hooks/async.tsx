import * as React from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

type OnSuccess<TData> = (data: TData) => void | Promise<void>;
type OnError<TError extends Error = Error> = (
  error: TError,
) => void | Promise<void>;
type OnSettled<TData, TError extends Error = Error> = (
  data: TData | undefined,
  error: TError | undefined,
) => void | Promise<void>;

interface UseAsyncOptions<TData = unknown, TError extends Error = Error> {
  mode?: 'auto' | 'manual';
  deps?: React.DependencyList;
  onSuccess?: OnSuccess<TData>;
  onError?: OnError<TError>;
  onSettled?: OnSettled<TData, TError>;
}

interface UseAsyncReturn<TData, TError extends Error = Error> {
  data: TData | undefined;
  error: TError | undefined;
  status: AsyncStatus;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: () => Promise<TData>;
}

/**
 * A fully typesafe async hook inspired by TanStack Query
 * @param asyncFn - Async function that returns data
 * @param options - Configuration options including callbacks
 * @returns Object with data, error, status and helper methods
 */
export function useAsync<TData, TError extends Error = Error>(
  asyncFn: (signal: AbortSignal) => Promise<TData>,
  options: UseAsyncOptions<TData, TError> = {},
): UseAsyncReturn<TData, TError> {
  const { mode = 'manual', deps, onSuccess, onError, onSettled } = options;

  const [data, setData] = React.useState<TData | undefined>(undefined);
  const [error, setError] = React.useState<TError | undefined>(undefined);
  const [status, setStatus] = React.useState<AsyncStatus>('idle');

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const memoizedOnSuccess = React.useCallback(onSuccess || (() => {}), [
    onSuccess,
  ]);
  const memoizedOnError = React.useCallback(onError || (() => {}), [onError]);
  const memoizedOnSettled = React.useCallback(onSettled || (() => {}), [
    onSettled,
  ]);

  const execute = React.useCallback(async (): Promise<TData> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setStatus('pending');
    setError(undefined);

    try {
      const result = await asyncFn(signal);

      if (!signal.aborted) {
        setData(result);
        setStatus('success');
        await memoizedOnSuccess(result);
        await memoizedOnSettled(result, undefined);
      }

      return result;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return undefined as TData;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      const typedError = error as TError;

      if (!signal.aborted) {
        setError(typedError);
        setStatus('error');
        await memoizedOnError(typedError);
        await memoizedOnSettled(undefined, typedError);
      }

      throw error;
    }
  }, [asyncFn, memoizedOnSuccess, memoizedOnError, memoizedOnSettled]);

  React.useEffect(() => {
    if (mode === 'auto' && !deps) {
      execute();
    }
  }, [asyncFn, mode, execute, deps]);

  React.useEffect(
    () => {
      if (deps && mode === 'auto') {
        execute();
      }
    },
    deps ? deps : [],
  );

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    error,
    status,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute,
  };
}
