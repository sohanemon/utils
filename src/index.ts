import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNavActive(href: string, path: string) {
  return href === '/' ? path === '/' : path?.includes(href);
}

export function cleanSrc(src: string) {
  if (src.includes('/public/')) return src.replace('/public/', '/');
  return src;
}
