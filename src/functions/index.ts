import { type ClassValue, clsx } from 'clsx';
import type * as React from 'react';
import { extendTailwindMerge } from 'tailwind-merge';
import { withFluid } from '@fluid-tailwind/tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  const twMerge = extendTailwindMerge(withFluid);
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

export const scrollTo = (
  containerSelector: string | React.RefObject<HTMLDivElement>,
  to: 'top' | 'bottom'
) => {
  let container: HTMLDivElement | null;

  if (typeof containerSelector === 'string') {
    container = document.querySelector(containerSelector);
  } else if (containerSelector.current) {
    container = containerSelector.current;
  } else {
    return;
  }

  if (container) {
    container.scrollTo({
      top: to === 'top' ? 0 : container.scrollHeight - container.clientHeight,
      behavior: 'smooth',
    });
  }
};

export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return cookieValue;
};
