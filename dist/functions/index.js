import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function isNavActive(href, path) {
    const regex = new RegExp(`^\/?${href}(\/|$)`);
    return regex.test(path);
}
export function cleanSrc(src) {
    if (src.includes('/public/'))
        return src.replace('/public/', '/');
    return src;
}
