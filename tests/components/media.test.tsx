import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Media } from '../../src/components/media';

describe('Media', () => {
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

  it('should render children when breakpoint matches', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <Media breakpoint="md">
        <div data-testid="child">Visible</div>
      </Media>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render nothing when breakpoint does not match and no fallback', () => {
    render(
      <Media breakpoint="md">
        <div data-testid="child">Hidden</div>
      </Media>,
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('should render fallback when breakpoint does not match', () => {
    render(
      <Media breakpoint="md" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="child">Content</div>
      </Media>,
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('should render children and not fallback when breakpoint matches', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <Media breakpoint="md" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="child">Content</div>
      </Media>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('should work with max- breakpoints', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <Media breakpoint="max-md" fallback={<div data-testid="fallback">Desktop</div>}>
        <div data-testid="child">Mobile</div>
      </Media>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('should call useMediaQuery with the correct breakpoint', () => {
    const addEventListener = vi.fn();
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener: vi.fn(),
    });

    render(
      <Media breakpoint="lg">
        <div>Content</div>
      </Media>,
    );

    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});
