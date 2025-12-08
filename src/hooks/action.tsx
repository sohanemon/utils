import * as React from 'react';
import { useIsomorphicEffect } from '.';

/**
 * Type definition for an action function that takes input and returns a promise.
 */
type ActionType<Input, Result> = (input: Input) => Promise<Result>;
/**
 * Possible states for the action execution.
 */
type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Options for configuring the useAction hook behavior.
 */
interface UseActionOptions<_Input, Result> {
  /** Callback executed when the action succeeds. */
  onSuccess?: (data: Result) => void;
  /** Callback executed when the action fails. */
  onError?: (error: Error) => void;
  /** Callback executed when the action completes (success or failure). */
  onSettled?: () => void;
}

/**
 * Hook for managing async actions with loading states and callbacks.
 *
 * Provides a clean API for executing async operations with built-in state management,
 * error handling, and lifecycle callbacks. Supports both synchronous and asynchronous consumption.
 *
 * @template Input - The type of input the action accepts
 * @template Result - The type of result the action returns
 * @param action - The async function to execute
 * @param options - Configuration options for callbacks
 * @returns Object with execution methods, state, and data
 *
 * @example
 * ```tsx
 * const { execute, isLoading, data, error } = useAction(
 *   async (userId: string) => {
 *     const user = await fetchUser(userId);
 *     return user;
 *   },
 *   {
 *     onSuccess: (user) => console.log('User loaded:', user),
 *     onError: (err) => console.error('Failed to load user:', err),
 *   }
 * );
 *
 * // Execute the action
 * const handleClick = () => execute('user123');
 * ```
 */
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
