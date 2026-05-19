import { Slot } from '@radix-ui/react-slot';
import { useLayoutEffect, useRef, useState } from 'react';

type ClosestResult = {
  hasClosest: boolean;
  closestElement: Element | null;
};

type WithClosestProps = {
  selector: string;
  children: (opts: ClosestResult) => React.ReactElement;
};

/**
 * A component that finds the closest ancestor element matching a CSS selector.
 *
 * Uses the native `.closest()` method to traverse up the DOM tree from the
 * rendered element and locate the nearest ancestor matching the provided selector.
 * Returns the found element and a boolean indicating whether a match exists.
 *
 * @param selector - A valid CSS selector string to match against ancestors
 * @param children - Render prop function that receives the closest element result
 * @returns The rendered element with the ref attached for DOM traversal
 *
 * @example
 * ```tsx
 * // Find the closest parent with class "modal"
 * <WithClosest selector=".modal">
 *   {({ hasClosest, closestElement }) => (
 *     <div>
 *       {hasClosest ? 'Inside modal' : 'Outside modal'}
 *     </div>
 *   )}
 * </WithClosest>
 * ```
 *
 * @example
 * ```tsx
 * // Find closest section ancestor
 * <WithClosest selector="section">
 *   {({ hasClosest, closestElement }) => (
 *     <span data-section-id={closestElement?.id} />
 *   )}
 * </WithClosest>
 * ```
 */
export function WithClosest({ selector, children }: WithClosestProps) {
  const ref = useRef<HTMLElement>(null);
  const [hasFinished, setIsFinished] = useState(false);
  const [closest, setClosest] = useState<ClosestResult>({
    hasClosest: false,
    closestElement: null,
  });

  useLayoutEffect(() => {
    if (ref.current) {
      const closestElement = ref.current.closest(selector);
      const hasClosest = closestElement !== null;

      setClosest({ hasClosest, closestElement });
    }
    setIsFinished(true);
  }, [selector]);

  // Frame 1: Render an empty, un-styled span so ref.current is populated
  // and .closest() can traverse up the DOM tree without painting anything.
  if (!hasFinished) {
    return <span ref={ref} />;
  }

  // Frame 2+: Render your actual user-controlled element with perfect data
  return <Slot ref={ref}>{children(closest)}</Slot>;
}
