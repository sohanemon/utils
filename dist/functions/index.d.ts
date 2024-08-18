import { type ClassValue } from 'clsx';
import type * as React from 'react';
export declare function cn(...inputs: ClassValue[]): string;
export declare function isNavActive(href: string, path: string): boolean;
export declare function cleanSrc(src: string): string;
export declare const scrollTo: (containerSelector: string | React.RefObject<HTMLDivElement>, to: "top" | "bottom") => void;
