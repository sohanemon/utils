import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaWrapper } from '../../src/components/media-wrapper';

describe('MediaWrapper', () => {
  const mockMatchMedia = vi.fn();
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = mockMatchMedia;
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  it('should render main element when breakpoint matches', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <MediaWrapper breakpoint="md" as="section" data-testid="wrapper">
        <p>Content</p>
      </MediaWrapper>,
    );

    const el = screen.getByTestId('wrapper');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('SECTION');
  });

  it('should render fallback element when breakpoint does not match', () => {
    render(
      <MediaWrapper breakpoint="md" as="article" fallback="aside" data-testid="wrapper">
        <p>Content</p>
      </MediaWrapper>,
    );

    const el = screen.getByTestId('wrapper');
    expect(el.tagName).toBe('ASIDE');
  });

  it('should render React.Fragment when no breakpoint match and no fallback', () => {
    const { container } = render(
      <MediaWrapper breakpoint="md" as="div">
        <span data-testid="child">Content</span>
      </MediaWrapper>,
    );

    // Fragment — no wrapper element, children are direct
    expect(container.querySelector('div')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should apply className to main element when breakpoint matches', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <MediaWrapper breakpoint="md" as="div" className="main-class" data-testid="wrapper">
        <p>Content</p>
      </MediaWrapper>,
    );

    expect(screen.getByTestId('wrapper')).toHaveClass('main-class');
  });

  it('should apply classNameFallback to fallback element when breakpoint does not match', () => {
    render(
      <MediaWrapper
        breakpoint="md"
        as="div"
        fallback="div"
        className="main-class"
        classNameFallback="fallback-class"
        data-testid="wrapper"
      >
        <p>Content</p>
      </MediaWrapper>,
    );

    expect(screen.getByTestId('wrapper')).toHaveClass('fallback-class');
  });

  it('should work with max- breakpoints', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <MediaWrapper breakpoint="max-md" as="nav" fallback="div" data-testid="wrapper">
        <p>Content</p>
      </MediaWrapper>,
    );

    const el = screen.getByTestId('wrapper');
    expect(el.tagName).toBe('NAV');
  });
});
