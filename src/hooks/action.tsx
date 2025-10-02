import * as React from 'react';
import { useIsomorphicEffect } from '.';

type ActionType<Input, Result> = (input: Input) => Promise<Result>;
type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseActionOptions<_Input, Result> {
  onSuccess?: (data: Result) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export const useAction = <Input, Result>(
  action: ActionType<Input, Result>,
  options?: UseActionOptions<Input, Result>,
) => {
  const [status, setStatus] = React.useState<Status>('idle');
  const [data, setData] = React.useState<Result | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [clientInput, setClientInput] = React.useState<Input | undefined>(
    undefined,
  );

  const [isTransitioning, startTransition] = React.useTransition();

  // Derived state booleans
  const isIdle = status === 'idle';
  const isLoading = status === 'loading' || isTransitioning;
  const isSuccess = status === 'success';
  const isError = status === 'error';

  const handleSuccess = React.useCallback(
    (result: Result) => {
      setData(result);
      setStatus('success');
      options?.onSuccess?.(result); // Call onSuccess if provided
      options?.onSettled?.(); // Call onSettled if provided
    },
    [options],
  );

  const handleError = React.useCallback(
    (err: Error) => {
      setError(err);
      setStatus('error');
      options?.onError?.(err); // Call onError if provided
      options?.onSettled?.(); // Call onSettled if provided
    },
    [options],
  );

  // Executes the action with the provided input, updating state accordingly
  const execute = React.useCallback(
    (input: Input) => {
      setClientInput(input);
      setStatus('loading');
      setError(null);

      startTransition(() => {
        action(input).then(handleSuccess).catch(handleError);
      });
    },
    [action, handleSuccess, handleError],
  );

  // Asynchronous version of execute for promise-based consumption
  const executeAsync = React.useCallback(
    (input: Input) => {
      return new Promise<Result>((resolve, reject) => {
        setClientInput(input);
        setStatus('loading');
        setError(null);

        startTransition(() => {
          action(input)
            .then((res) => {
              handleSuccess(res);
              resolve(res);
            })
            .catch((err: Error) => {
              handleError(err);
              reject(err);
            });
        });
      });
    },
    [action, handleSuccess, handleError],
  );

  // Resets the hook's state to its initial "idle" status
  const reset = React.useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
    setClientInput(undefined);
  }, []);

  // Hook to execute the action automatically on mount
  const useExecute = (input: Input) => {
    useIsomorphicEffect(() => {
      execute(input);
    }, []);
  };

  return {
    // Methods to trigger action
    execute,
    executeAsync,
    reset,

    // Hook for auto execution on mount
    useExecute,

    // Data and error objects
    data,
    error,
    input: clientInput,

    // Status booleans
    isIdle,
    isLoading,
    isSuccess,
    isError,
  };
};
