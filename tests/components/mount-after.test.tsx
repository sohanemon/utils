import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MountAfter } from '../../src/components/mount-after';

describe('MountAfter', () => {
  it('should render children immediately when delay is 0', () => {
    render(
      <MountAfter>
        <div data-testid="child">Content</div>
      </MountAfter>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render children immediately by default', () => {
    render(
      <MountAfter>
        <span data-testid="default">Default</span>
      </MountAfter>,
    );

    expect(screen.getByTestId('default')).toBeInTheDocument();
  });

  it('should show fallback before delay elapses', () => {
    render(
      <MountAfter delay={1000} fallback={<div data-testid="fallback">Loading...</div>}>
        <div data-testid="child">Delayed content</div>
      </MountAfter>,
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('should render children after delay elapses', () => {
    vi.useFakeTimers();

    render(
      <MountAfter delay={500} fallback={<div>Loading...</div>}>
        <div data-testid="child">Delayed content</div>
      </MountAfter>,
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Delayed content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should render null fallback by default', () => {
    vi.useFakeTimers();

    const { container } = render(
      <MountAfter delay={100}>
        <div>Content</div>
      </MountAfter>,
    );

    expect(container.innerHTML).toBe('');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should clean up timer on unmount', () => {
    vi.useFakeTimers();

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(
      <MountAfter delay={1000}>
        <div>Content</div>
      </MountAfter>,
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
