import { useState, useTransition, useCallback } from 'react';
import { useIsomorphicEffect } from '.';

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
  const { initialArgs, callback = {}, mode = 'onTrigger' } = opts;

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
        startTransition(() => {
          (async () => {
            const response = await fn(args);
            setValue(response);
            onSuccess?.(response);
          })();
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

  useIsomorphicEffect(() => {
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
