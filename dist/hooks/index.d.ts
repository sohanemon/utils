import { Dispatch, EffectCallback, SetStateAction } from 'react';
export declare const useClickOutside: (callback?: () => void) => any;
export declare function useMediaQuery(tailwindBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`): any;
export declare function useEffectOnce(effect: EffectCallback): void;
export declare function useUpdateEffect(effect: EffectCallback, deps: any[]): void;
export declare function useDebounce<T>(state: T, delay?: number): T;
export declare const useIsomorphicEffect: any;
export declare function useTimeout(callback: () => void, delay?: number | null): void;
export declare function useWindowEvent<K extends string = keyof WindowEventMap>(type: K, listener: K extends keyof WindowEventMap ? (this: Window, ev: WindowEventMap[K]) => void : (this: Window, ev: CustomEvent) => void, options?: boolean | AddEventListenerOptions): void;
type LocalStorageValue<T> = [T, Dispatch<SetStateAction<T>>];
export declare const useLocalStorage: <T extends Record<string, any>>(key: string, defaultValue: T) => LocalStorageValue<T>;
export declare const useUrlParams: <T extends string | number | boolean>(key: string, defaultValue: T) => [T, (value: T) => void];
export {};
