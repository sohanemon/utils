import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function isNavActive(href, path) {
    return href === '/' ? path === '/' : path?.includes(href);
}
export function cleanSrc(src) {
    if (src.includes('/public/'))
        return src.replace('/public/', '/');
    return src;
}
