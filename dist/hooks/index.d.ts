import { EffectCallback } from 'react';
export declare const useClickOutside: (callback?: () => void) => any;
export declare function useMediaQuery(tailwindBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`): any;
export declare const useSwiperRef: () => any[];
export declare function useEffectOnce(effect: EffectCallback): void;
export declare function useUpdateEffect(effect: EffectCallback, deps: any[]): void;
export declare const useIsomorphicEffect: any;
export declare function useTimeout(callback: () => void, delay?: number | null): void;
export declare function useWindowEvent<K extends string = keyof WindowEventMap>(type: K, listener: K extends keyof WindowEventMap ? (this: Window, ev: WindowEventMap[K]) => void : (this: Window, ev: CustomEvent) => void, options?: boolean | AddEventListenerOptions): void;
