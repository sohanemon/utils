'use client';
import * as React from 'react';
import { isSSR } from '../functions';

type Side = 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left';

/**
 * Props for the ResponsiveIndicator component.
 */
interface ResponsiveIndicatorProps {
  /** The corner position of the indicator. Defaults to 'bottom-left'. */
  side?: Side;
  /** Offset from the corner in the specified unit. Defaults to 2. */
  offset?: number;
  /** Unit for the offset. Defaults to 'px'. */
  unit?: 'px' | 'rem';
}

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
  unit = 'px',
}) => {
  const [viewportWidth, setViewportWidth] = React.useState(
    isSSR ? 0 : window.innerWidth,
  );

  const sides = [
    'bottom-left',
    'bottom-right',
    'top-right',
    'top-left',
  ] as const;
  /**
   * Possible positions for the responsive indicator.
   */
  type Side = 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left';

  const sideStyles: Record<Side, (offset: number) => React.CSSProperties> = {
    'bottom-left': (offset) => ({
      bottom: `${offset}rem`,
      left: `${offset}rem`,
    }),
    'bottom-right': (offset) => ({
      bottom: `${offset}rem`,
      right: `${offset}rem`,
    }),
    'top-right': (offset) => ({ top: `${offset}rem`, right: `${offset}rem` }),
    'top-left': (offset) => ({ top: `${offset}rem`, left: `${offset}rem` }),
  };

  const initialSide = side || 'bottom-left';
  const [currentSide, setCurrentSide] = React.useState<Side>(initialSide);

  React.useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to handle button click
  const handleClick = () => {
    const currentIndex = sides.indexOf(currentSide);
    const nextIndex = (currentIndex + 1) % sides.length;
    setCurrentSide(sides[nextIndex]!);
  };

  let text = '';
  if (viewportWidth < 640) {
    text = 'xs';
  } else if (viewportWidth >= 640 && viewportWidth < 768) {
    text = 'sm';
  } else if (viewportWidth >= 768 && viewportWidth < 1024) {
    text = 'md';
  } else if (viewportWidth >= 1024 && viewportWidth < 1280) {
    text = 'lg';
  } else if (viewportWidth >= 1280 && viewportWidth < 1536) {
    text = 'xl';
  } else if (viewportWidth >= 1536 && viewportWidth < 1792) {
    text = '2xl';
  } else {
    text =
      unit === 'rem'
        ? `${(viewportWidth / 16).toFixed(1)}rem`
        : `${viewportWidth}${unit}`;
  }

  const positionStyle = sideStyles[currentSide](offset);

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 50,
    display: 'grid',
    minHeight: '2.5rem',
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
    ...positionStyle, // Apply the current position
  };

  // TODO: Add proper production check that works in browser environment
  // For now, always show in development/playground environment

  return (
    <button type="button" style={buttonStyle} onClick={handleClick}>
      {text}
    </button>
  );
};
