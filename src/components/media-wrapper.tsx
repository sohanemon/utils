'use client';
import * as React from 'react';
import { useMediaQuery } from '../hooks';
type BreakPoints =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'max-sm'
  | 'max-md'
  | 'max-lg'
  | 'max-xl'
  | 'max-2xl';
type MediaWrapperProps = React.ComponentProps<'div'> & {
  breakpoint: BreakPoints;
  as?: React.ElementType;
  fallback?: React.ElementType;
  classNameFallback?: string;
};

export function MediaWrapper({
  breakpoint,
  as = 'div',
  fallback = React.Fragment,
  classNameFallback,
  className: classNameOriginal,
  ...props
}: MediaWrapperProps) {
  const overMedia = useMediaQuery(breakpoint.split('-').pop() as `(${string})`);
  const isMax = breakpoint.startsWith('max');
  const useFallback = overMedia === isMax;

  // Conditionally determining which component to render,
  // and what className should be passed to it.
  const Wrapper = useFallback ? fallback : as;
  const className = useFallback ? classNameFallback : classNameOriginal;

  return <Wrapper className={className} {...props} />;
}
