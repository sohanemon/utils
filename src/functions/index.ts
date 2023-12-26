import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNavActive(href: string, path: string) {
  const regex = new RegExp(`^\/?${href}(\/|$)`);
  return regex.test(path);
}

export function cleanSrc(src: string) {
  if (src.includes('/public/')) return src.replace('/public/', '/');
  return src;
}
