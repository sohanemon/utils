import { type RefObject, useEffect, useRef, useState } from 'react';

export interface InViewOptions {
  /**
   * IntersectionObserver rootMargin.
   * @example "200px 0px" — trigger 200px before entering viewport
   * @default "0px"
   */
  rootMargin?: string;
  /**
   * Stop observing after first intersection.
   * @default false
   */
  once?: boolean;
}

export function createObserver(
  ref: RefObject<Element | null>,
  onIntersect: (inView: boolean) => void,
  options: InViewOptions,
) {
  const { rootMargin = '0px', once = false } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          const visible = entry.isIntersecting;
          onIntersect(visible);
          if (visible && once) observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);
}

/**
 * Returns a ref and a boolean indicating whether the element is in view.
 *
 * @example
 * const [ref, inView] = useInView({ once: true });
 * <div ref={ref}>{inView ? 'visible' : 'hidden'}</div>
 */
export function useInView<T extends Element = Element>(
  options: InViewOptions = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  createObserver(ref as RefObject<Element | null>, setInView, options);

  return [ref, inView];
}

type ViewEvent = 'in' | 'out';

/**
 * Runs a callback when the element enters or exits the viewport.
 *
 * @param event   - `"in"` fires when entering, `"out"` fires when exiting
 * @param callback - Side effect to run on the event
 * @param options  - IntersectionObserver options
 *
 * @example
 * const ref = useViewEffect('in', () => startAnimation(), { once: true });
 * <div ref={ref} />
 */
export function useViewEffect<T extends Element = Element>(
  event: ViewEvent,
  callback: () => void,
  options: InViewOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  createObserver(
    ref as RefObject<Element | null>,
    (inView) => {
      if (event === 'in' && inView) callbackRef.current();
      if (event === 'out' && !inView) callbackRef.current();
    },
    options,
  );

  return ref;
}
