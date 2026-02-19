import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ResponsiveIndicator } from '../../src/components/responsive-indicator';

describe('ResponsiveIndicator', () => {
  const mockMatchMedia = vi.fn();
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = mockMatchMedia;
    // Default: no breakpoints match (xs)
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

  it('should render button', () => {
    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show "xs" when no breakpoints match', () => {
    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('xs');
  });

  it('should show "sm" when sm breakpoint matches', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 640px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('sm');
  });

  it('should show "md" when md breakpoint matches', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('md');
  });

  it('should show "lg" when lg breakpoint matches', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 1024px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('lg');
  });

  it('should show "xl" when xl breakpoint matches', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 1280px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('xl');
  });

  it('should show "2xl" when 2xl breakpoint matches', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 1536px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('2xl');
  });

  it('should show viewport width in rem when beyond 2xl with default unit', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 1536px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'innerWidth', {
      value: 1792,
      writable: true,
    });

    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    // Default unit is 'rem', so 1792px / 16 = 112rem
    expect(button).toHaveTextContent('112.0rem');
  });

  it('should show viewport width in px when unit is px and beyond 2xl', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(min-width: 1536px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'innerWidth', {
      value: 1792,
      writable: true,
    });

    render(<ResponsiveIndicator unit="px" />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('1792px');
  });

  it('should handle click to change position', () => {
    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('should have default position styles', () => {
    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button.style.bottom).toBe('2rem');
    expect(button.style.left).toBe('2rem');
  });

  it('should accept custom side prop', () => {
    render(<ResponsiveIndicator side="top-right" />);
    const button = screen.getByRole('button');
    expect(button.style.top).toBe('2rem');
    expect(button.style.right).toBe('2rem');
  });

  it('should accept custom offset prop', () => {
    render(<ResponsiveIndicator offset={3} />);
    const button = screen.getByRole('button');
    expect(button.style.bottom).toBe('3rem');
    expect(button.style.left).toBe('3rem');
  });

  it('should accept custom unit prop', () => {
    render(<ResponsiveIndicator offset={16} unit="px" />);
    const button = screen.getByRole('button');
    expect(button.style.bottom).toBe('16px');
    expect(button.style.left).toBe('16px');
  });

  it('should cycle through positions on click', () => {
    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');

    // Initial: bottom-left
    expect(button.style.bottom).toBe('2rem');
    expect(button.style.left).toBe('2rem');

    // Click to bottom-right
    fireEvent.click(button);
    expect(button.style.bottom).toBe('2rem');
    expect(button.style.right).toBe('2rem');

    // Click to top-right
    fireEvent.click(button);
    expect(button.style.top).toBe('2rem');
    expect(button.style.right).toBe('2rem');

    // Click to top-left
    fireEvent.click(button);
    expect(button.style.top).toBe('2rem');
    expect(button.style.left).toBe('2rem');

    // Click back to bottom-left
    fireEvent.click(button);
    expect(button.style.bottom).toBe('2rem');
    expect(button.style.left).toBe('2rem');
  });
});
