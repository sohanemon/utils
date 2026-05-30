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

export interface UseInViewParams<T extends Element = Element>
  extends InViewOptions {
  ref: RefObject<T | null>;
}

/**
 * Observes the element via the provided ref and returns whether it's in view.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const inView = useInView({ ref, once: true });
 * <div ref={ref}>{inView ? 'visible' : 'hidden'}</div>
 */
export function useInView<T extends Element = Element>(
  params: UseInViewParams<T>,
): boolean {
  const { ref, ...options } = params;
  const [inView, setInView] = useState(false);

  createObserver(ref as RefObject<Element | null>, setInView, options);

  return inView;
}

export interface UseViewEffectParams<T extends Element = Element>
  extends InViewOptions {
  ref: RefObject<T | null>;
  /** Fires when the element enters the viewport. */
  onEnter?: () => void;
  /** Fires when the element exits the viewport. */
  onExit?: () => void;
}

/**
 * Runs callbacks when the element enters or exits the viewport.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useViewEffect({ ref, onEnter: () => startAnimation(), once: true });
 * <div ref={ref} />
 */
export function useViewEffect<T extends Element = Element>(
  params: UseViewEffectParams<T>,
): void {
  const { ref, onEnter, onExit, ...options } = params;
  const onEnterRef = useRef(onEnter);
  const onExitRef = useRef(onExit);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onExitRef.current = onExit;
  });

  createObserver(
    ref as RefObject<Element | null>,
    (inView) => {
      if (inView) onEnterRef.current?.();
      else onExitRef.current?.();
    },
    options,
  );
}
