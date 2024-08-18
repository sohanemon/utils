'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useMediaQuery } from '../hooks';
export function MediaWrapper({ breakpoint, as = 'div', fallback = React.Fragment, classNameFallback, className: classNameOriginal, ...props }) {
    const overMedia = useMediaQuery(breakpoint.split('-').pop());
    const isMax = breakpoint.startsWith('max');
    const useFallback = overMedia === isMax;
    // Conditionally determining which component to render,
    // and what className should be passed to it.
    const Wrapper = useFallback ? fallback : as;
    const className = useFallback ? classNameFallback : classNameOriginal;
    return _jsx(Wrapper, { className: className, ...props });
}
