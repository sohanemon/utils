'use client';
import * as React from 'react';
import { useMediaQuery } from '../hooks';

type Side = 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left';

/**
 * Props for the ResponsiveIndicator component.
 */
interface ResponsiveIndicatorProps {
  /** The corner position of the indicator. Defaults to 'bottom-left'. */
  side?: Side;
  /** Offset from the corner in the specified unit. Defaults to 2. */
  offset?: number;
  /** Unit for the offset. Defaults to 'rem'. */
  unit?: 'px' | 'rem';
}

const sides: Side[] = ['bottom-left', 'bottom-right', 'top-right', 'top-left'];

/**
 * A development-only component that displays the current Tailwind CSS breakpoint.
 *
 * Shows the current viewport size as a small indicator in one of the corners.
 * Automatically hides in production builds. Useful for responsive development.
 *
 * @param props - The component props
 * @returns A positioned indicator showing current breakpoint, or null in production
 *
 * @example
 * ```tsx
 * // Shows current breakpoint in bottom-left corner
 * <ResponsiveIndicator />
 *
 * // Shows in top-right with custom offset
 * <ResponsiveIndicator side="top-right" offset={1} unit="rem" />
 * ```
 */
export const ResponsiveIndicator: React.FC<ResponsiveIndicatorProps> = ({
  side,
  offset = 2,
  unit = 'rem',
}) => {
  const [currentSide, setCurrentSide] = React.useState<Side>(
    side ?? 'bottom-left',
  );

  const breakpoint = useMediaQuery({
    DEFAULT: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  });

  const [viewportWidth, setViewportWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const text =
    breakpoint === '2xl' && viewportWidth >= 1792
      ? unit === 'rem'
        ? `${(viewportWidth / 16).toFixed(1)}rem`
        : `${viewportWidth}${unit}`
      : breakpoint;

  const sideStyles: Record<Side, React.CSSProperties> = {
    'bottom-left': { bottom: `${offset}${unit}`, left: `${offset}${unit}` },
    'bottom-right': { bottom: `${offset}${unit}`, right: `${offset}${unit}` },
    'top-right': { top: `${offset}${unit}`, right: `${offset}${unit}` },
    'top-left': { top: `${offset}${unit}`, left: `${offset}${unit}` },
  };

  const handleClick = () => {
    const currentIndex = sides.indexOf(currentSide);
    const nextIndex = (currentIndex + 1) % sides.length;
    setCurrentSide(sides[nextIndex]!);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        position: 'fixed',
        zIndex: 50,
        display: 'grid',
        height: '2.5rem',
        minWidth: '2.5rem',
        borderRadius: '30px',
        placeContent: 'center',
        backgroundColor: '#2d3748',
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '1rem',
        color: '#ffffff',
        border: '2px solid #4a5568',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '0.5rem',
        transition: 'all 0.2s ease-in-out',
        ...sideStyles[currentSide],
      }}
    >
      {text}
    </button>
  );
};
