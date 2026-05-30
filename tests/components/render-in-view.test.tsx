import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RenderInView } from '../../src/components/render-in-view';

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

describe('RenderInView', () => {
  it('should render fallback when not intersecting', () => {
    render(
      <RenderInView fallback={<div data-testid="fallback">Loading</div>}>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('should render children when sentinel intersects', () => {
    render(
      <RenderInView fallback={<div data-testid="fallback">Loading</div>}>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    triggerIntersection(true);

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('should persist children when mode=persist after leaving viewport', () => {
    render(
      <RenderInView fallback={<div data-testid="fallback">Loading</div>}>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    triggerIntersection(true);
    expect(screen.getByTestId('child')).toBeInTheDocument();

    triggerIntersection(false);
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('should unmount children when mode=unmount and leaving viewport', () => {
    render(
      <RenderInView mode="unmount" fallback={<div data-testid="fallback">Loading</div>}>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    triggerIntersection(true);
    expect(screen.getByTestId('child')).toBeInTheDocument();

    triggerIntersection(false);
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('should render null when no fallback and not intersecting', () => {
    const { container } = render(
      <RenderInView>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    // only the zero-size sentinel span is rendered
    expect(container.querySelectorAll('span').length).toBe(1);
  });

  it('should render a zero-size sentinel span', () => {
    render(
      <RenderInView>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    const spans = document.querySelectorAll('span');
    const sentinel = Array.from(spans).find(
      (s) => s.style.width === '0px',
    );
    expect(sentinel).not.toBeNull();
    expect(sentinel!.style.height).toBe('0px');
  });

  it('should pass rootMargin to IntersectionObserver via options', () => {
    render(
      <RenderInView options={{ rootMargin: '200px 0px' }}>
        <div>Content</div>
      </RenderInView>,
    );

    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '200px 0px' },
    );
  });

  it('should call observe on mount', () => {
    render(
      <RenderInView>
        <div>Content</div>
      </RenderInView>,
    );

    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = render(
      <RenderInView>
        <div>Content</div>
      </RenderInView>,
    );

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should preserve space when preserveSpace is true', () => {
    render(
      <RenderInView preserveSpace>
        <div data-testid="child">Content</div>
      </RenderInView>,
    );

    triggerIntersection(true);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
