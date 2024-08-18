import * as React from 'react';
type BreakPoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'max-sm' | 'max-md' | 'max-lg' | 'max-xl' | 'max-2xl';
type MediaWrapperProps = React.ComponentProps<'div'> & {
    breakpoint: BreakPoints;
    as?: React.ElementType;
    fallback?: React.ElementType;
    classNameFallback?: string;
};
export declare function MediaWrapper({ breakpoint, as, fallback, classNameFallback, className: classNameOriginal, ...props }: MediaWrapperProps): any;
export {};
