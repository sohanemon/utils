import { type ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
export declare function isNavActive(href: string, path: string): boolean;
export declare function kebabCase(camelCase: string): string;
export declare function cssColorVariable(colors: Record<string, string>): Record<string, string>;
export declare function cleanSrc(src: string): string;
