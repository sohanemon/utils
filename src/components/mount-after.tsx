import { useEffect, useRef, useState } from 'react';

type MountedState = 'pending' | 'mounted' | 'unmounted';

/**
 * Props for the <MountAfter> component.
 */
interface MountAfterProps {
  /**
   * Delay in milliseconds before mounting children.
   * @default 0
   */
  delay?: number;
  /**
   * Content shown while in pending (pre-mount) state.
   * @default null
   */
  fallback?: React.ReactNode;
  /** Content rendered after delay elapses. */
  children: React.ReactNode;
}

/**
 * Delays rendering of children by a configurable timeout.
 *
 * Useful for preventing content flash, coordinating staggered
 * animations, or deferring render-heavy trees until after
 * the initial paint. When `delay` is 0 (default), children
 * mount immediately with no pending state.
 *
 * @param props - The component props
 * @returns The fallback during the pending state, then children once mounted
 *
 * @example
 * ```tsx
 * // Mount immediately (no delay)
 * <MountAfter>
 *   <ExpensiveComponent />
 * </MountAfter>
 *
 * // Mount after 500ms with a loading indicator
 * <MountAfter delay={500} fallback={<Spinner />}>
 *   <ExpensiveComponent />
 * </MountAfter>
 * ```
 */
export function MountAfter({
  delay = 0,
  fallback = null,
  children,
}: MountAfterProps) {
  const [state, setState] = useState<MountedState>(
    delay === 0 ? 'mounted' : 'pending',
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (delay === 0) return;

    timerRef.current = setTimeout(() => setState('mounted'), delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay]);

  if (state === 'pending') return <>{fallback}</>;
  return <>{children}</>;
}
