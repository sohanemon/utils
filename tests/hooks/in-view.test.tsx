import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInView, useViewEffect } from '../../src/hooks/in-view';

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

let observerCallback: ObserverCallback;
let originalIntersectionObserver: typeof IntersectionObserver;
let mockObserve: ReturnType<typeof vi.fn>;
let mockDisconnect: ReturnType<typeof vi.fn>;

function makeEntry(isIntersecting: boolean): IntersectionObserverEntry {
  return { isIntersecting } as IntersectionObserverEntry;
}

function triggerIntersection(isIntersecting: boolean) {
  act(() => {
    observerCallback([makeEntry(isIntersecting)]);
  });
}

beforeEach(() => {
  mockObserve = vi.fn();
  mockDisconnect = vi.fn();
  originalIntersectionObserver = globalThis.IntersectionObserver;

  globalThis.IntersectionObserver = vi.fn(
    function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      observerCallback = callback as ObserverCallback;
      this.observe = mockObserve;
      this.disconnect = mockDisconnect;
      this.unobserve = vi.fn();
      this.takeRecords = vi.fn();
      this.root = null;
      this.rootMargin = options?.rootMargin ?? '';
      this.thresholds = [];
    },
  ) as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  globalThis.IntersectionObserver = originalIntersectionObserver;
  vi.clearAllMocks();
});

function UseInViewHarness({
  options,
  onInView,
}: {
  options?: { rootMargin?: string; once?: boolean };
  onInView?: (inView: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView({ ref, ...options });
  onInView?.(inView);
  return <div ref={ref} data-testid="target" />;
}

function UseViewEffectHarness({
  onEnter,
  onExit,
  options,
}: {
  onEnter?: () => void;
  onExit?: () => void;
  options?: { rootMargin?: string; once?: boolean };
}) {
  const ref = useRef<HTMLDivElement>(null);
  useViewEffect({ ref, onEnter, onExit, ...options });
  return <div ref={ref} data-testid="target" />;
}

describe('useInView', () => {
  it('should return inView=false initially', () => {
    let captured = true;
    render(<UseInViewHarness onInView={(v) => { captured = v; }} />);
    expect(captured).toBe(false);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it('should return inView=true when element intersects', () => {
    let captured = false;
    render(<UseInViewHarness onInView={(v) => { captured = v; }} />);

    triggerIntersection(true);
    expect(captured).toBe(true);
  });

  it('should return inView=false when element leaves viewport', () => {
    let captured = false;
    render(<UseInViewHarness onInView={(v) => { captured = v; }} />);

    triggerIntersection(true);
    expect(captured).toBe(true);

    triggerIntersection(false);
    expect(captured).toBe(false);
  });

  it('should disconnect after first intersection when once=true', () => {
    render(<UseInViewHarness options={{ once: true }} />);

    triggerIntersection(true);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should not disconnect on repeat intersections when once=false', () => {
    render(<UseInViewHarness />);

    triggerIntersection(true);
    expect(mockDisconnect).not.toHaveBeenCalled();

    triggerIntersection(false);
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it('should call observe on mount', () => {
    render(<UseInViewHarness />);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it('should disconnect on unmount', () => {
    const { unmount } = render(<UseInViewHarness />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should pass rootMargin to IntersectionObserver', () => {
    render(<UseInViewHarness options={{ rootMargin: '200px 0px' }} />);

    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '200px 0px' },
    );
  });
});

describe('useViewEffect', () => {
  it('should fire onEnter when intersecting', () => {
    const onEnter = vi.fn();
    render(<UseViewEffectHarness onEnter={onEnter} />);

    triggerIntersection(true);
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('should not fire onEnter when not intersecting', () => {
    const onEnter = vi.fn();
    render(<UseViewEffectHarness onEnter={onEnter} />);

    triggerIntersection(false);
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('should fire onExit when leaving viewport', () => {
    const onExit = vi.fn();
    render(<UseViewEffectHarness onExit={onExit} />);

    triggerIntersection(false);
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('should not fire onExit when intersecting', () => {
    const onExit = vi.fn();
    render(<UseViewEffectHarness onExit={onExit} />);

    triggerIntersection(true);
    expect(onExit).not.toHaveBeenCalled();
  });

  it('should fire both onEnter and onExit at correct times', () => {
    const onEnter = vi.fn();
    const onExit = vi.fn();
    render(<UseViewEffectHarness onEnter={onEnter} onExit={onExit} />);

    triggerIntersection(true);
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onExit).not.toHaveBeenCalled();

    triggerIntersection(false);
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('should use latest callbacks via ref (no stale closure on re-render)', () => {
    let captured = '_none_';
    const Hello = ({ msg }: { msg: string }) => {
      const ref = useRef<HTMLDivElement>(null);
      useViewEffect({
        ref,
        onEnter: () => { captured = msg; },
      });
      return <div ref={ref} data-testid="target" />;
    };

    const { rerender } = render(<Hello msg="first" />);
    triggerIntersection(true);
    expect(captured).toBe('first');

    captured = '_none_';
    rerender(<Hello msg="second" />);
    triggerIntersection(false);
    triggerIntersection(true);
    expect(captured).toBe('second');
  });

  it('should disconnect on unmount', () => {
    const { unmount } = render(
      <UseViewEffectHarness onEnter={vi.fn()} />,
    );
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
