import { act, render, screen } from '@testing-library/react';
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
  options?: Parameters<typeof useInView>[0];
  onInView?: (inView: boolean) => void;
}) {
  const [ref, inView] = useInView(options);
  onInView?.(inView);
  return <div ref={ref} data-testid="target" />;
}

function UseViewEffectHarness({
  event,
  callback,
  options,
}: {
  event: 'in' | 'out';
  callback: () => void;
  options?: Parameters<typeof useViewEffect>[2];
}) {
  const ref = useViewEffect(event, callback, options);
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
  it('should fire callback on "in" event when intersecting', () => {
    const callback = vi.fn();
    render(<UseViewEffectHarness event="in" callback={callback} />);

    triggerIntersection(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not fire callback on "in" event when not intersecting', () => {
    const callback = vi.fn();
    render(<UseViewEffectHarness event="in" callback={callback} />);

    triggerIntersection(false);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should fire callback on "out" event when leaving viewport', () => {
    const callback = vi.fn();
    render(<UseViewEffectHarness event="out" callback={callback} />);

    triggerIntersection(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not fire callback on "out" event when intersecting', () => {
    const callback = vi.fn();
    render(<UseViewEffectHarness event="out" callback={callback} />);

    triggerIntersection(true);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should use latest callback via ref (no stale closure on re-render)', () => {
    let captured = '_none_';
    const Hello = ({ msg }: { msg: string }) => {
      const ref = useViewEffect('in', () => { captured = msg; });
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
      <UseViewEffectHarness event="in" callback={vi.fn()} />,
    );
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
