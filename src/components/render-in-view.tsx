import { type RefObject, useLayoutEffect, useRef, useState } from 'react';
import { createObserver, type InViewOptions } from '../hooks/in-view';

type RenderInViewMode = 'persist' | 'unmount';

interface RenderInViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * - `"persist"` — once mounted, stays mounted (default)
   * - `"unmount"` — unmounts when scrolled out of view
   * @default "persist"
   */
  mode?: RenderInViewMode;
  /**
   * Reserves measured height before mounting to prevent layout shift.
   * @default false
   */
  preserveSpace?: boolean;
  options?: InViewOptions;
}

/**
 * Renders children only when the sentinel enters the viewport.
 * Uses a zero-size sentinel so it never wraps or affects layout.
 *
 * @example
 * <RenderInView options={{ rootMargin: '200px 0px' }}>
 *   <HeavyComponent />
 * </RenderInView>
 */
export function RenderInView({
  children,
  fallback = null,
  mode = 'persist',
  preserveSpace = false,
  options = {},
}: RenderInViewProps) {
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const reservedHeightRef = useRef<number | null>(null);

  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const [reservedHeight, setReservedHeight] = useState<number | null>(null);

  createObserver(
    sentinelRef as RefObject<Element | null>,
    (visible) => {
      setInView(visible);
      if (visible && !hasBeenInView) setHasBeenInView(true);
    },
    options,
  );

  useLayoutEffect(() => {
    if (!preserveSpace) return;
    if (!contentRef.current) return;
    if (reservedHeightRef.current !== null) return;

    const height = contentRef.current.getBoundingClientRect().height;
    if (height > 0) {
      reservedHeightRef.current = height;
      setReservedHeight(height);
    }
  });

  const shouldRender = mode === 'unmount' ? inView : hasBeenInView;

  const placeholder =
    preserveSpace && reservedHeight !== null ? (
      <span
        aria-hidden
        style={{ display: 'block', height: reservedHeight, contain: 'strict' }}
      />
    ) : (
      fallback
    );

  return (
    <>
      <span
        ref={sentinelRef}
        aria-hidden
        style={{
          position: 'absolute',
          display: 'block',
          width: 0,
          height: 0,
          overflow: 'hidden',
          contain: 'strict',
        }}
      />
      {shouldRender ? (
        <span ref={contentRef} style={{ display: 'contents' }}>
          {children}
        </span>
      ) : (
        placeholder
      )}
    </>
  );
}
