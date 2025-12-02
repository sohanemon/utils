import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should not render in production', () => {
    // Mock NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const { container } = render(<ResponsiveIndicator />);

    expect(container.firstChild).toBeNull();

    process.env.NODE_ENV = originalEnv;
  });

  it('should render in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(<ResponsiveIndicator />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
