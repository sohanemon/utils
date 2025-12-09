import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResponsiveIndicator } from '../../src/components/responsive-indicator';

describe('ResponsiveIndicator', () => {
  it('should render button', () => {
    render(<ResponsiveIndicator />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show correct breakpoint text', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });

    render(<ResponsiveIndicator />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('xs');
  });

  it('should handle click to change position', () => {
    render(<ResponsiveIndicator />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Position changes, but hard to test without styles
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

  it('should show correct breakpoint texts for various widths', () => {
    const testCases = [
      { width: 500, expected: 'xs' },
      { width: 700, expected: 'sm' },
      { width: 800, expected: 'md' },
      { width: 1100, expected: 'lg' },
      { width: 1300, expected: 'xl' },
      { width: 1536, expected: '2xl' },
      { width: 1791, expected: '2xl' },
      { width: 1792, expected: '1792px' },
      { width: 2000, expected: '2000px' },
    ];

    testCases.forEach(({ width, expected }) => {
      cleanup();
      Object.defineProperty(window, 'innerWidth', {
        value: width,
        writable: true,
      });
      render(<ResponsiveIndicator />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(expected);
    });
  });

  it('should display width in rem when unit prop is "rem"', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1792,
      writable: true,
    });
    render(<ResponsiveIndicator unit="rem" />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('112.0rem'); // 1792 / 16 = 112
  });

  it('should display width in px by default', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1792,
      writable: true,
    });
    render(<ResponsiveIndicator />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('1792px');
  });
});
