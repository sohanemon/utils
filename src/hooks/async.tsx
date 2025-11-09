'use client';

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
  asyncFn: () => Promise<TData>,
  options: UseAsyncOptions<TData, TError> = {},
): UseAsyncReturn<TData, TError> {
  const { mode = 'manual', deps, onSuccess, onError, onSettled } = options;

  const [data, setData] = React.useState<TData | undefined>(undefined);
  const [error, setError] = React.useState<TError | undefined>(undefined);
  const [status, setStatus] = React.useState<AsyncStatus>('idle');

  const isMountedRef = React.useRef(true);

  const memoizedOnSuccess = React.useCallback(onSuccess || (() => {}), [
    onSuccess,
  ]);
  const memoizedOnError = React.useCallback(onError || (() => {}), [onError]);
  const memoizedOnSettled = React.useCallback(onSettled || (() => {}), [
    onSettled,
  ]);

  const execute = React.useCallback(async (): Promise<TData> => {
    setStatus('pending');
    setError(undefined);

    try {
      const result = await asyncFn();

      if (isMountedRef.current) {
        setData(result);
        setStatus('success');
        await memoizedOnSuccess(result);
        await memoizedOnSettled(result, undefined);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      const typedError = error as TError;

      if (isMountedRef.current) {
        setError(typedError);
        setStatus('error');
        await memoizedOnError(typedError);
        await memoizedOnSettled(undefined, typedError);
      }

      throw error;
    }
  }, [asyncFn, memoizedOnSuccess, memoizedOnError, memoizedOnSettled]);

  React.useEffect(() => {
    if (mode === 'auto') {
      execute();
    }
  }, [asyncFn, mode, execute]);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  React.useEffect(
    () => {
      if (deps && mode === 'auto') {
        execute();
      }
    },
    deps ? deps : [],
  );

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
