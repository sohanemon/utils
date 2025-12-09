# sohanemon/utils

![npm version](https://img.shields.io/npm/v/@sohanemon/utils)
![npm downloads](https://img.shields.io/npm/dm/@sohanemon/utils)
![License](https://img.shields.io/npm/l/@sohanemon/utils)
![Tests](https://github.com/sohanemon/sohanemon-utils/actions/workflows/test.yml/badge.svg)

## Description

`sohanemon/utils` is a comprehensive collection of utility functions, hooks, components, and types designed to simplify common tasks in modern web development. It includes utilities for object manipulation, async operations, scheduling, data transformation, React hooks for state management and effects, UI components, and advanced TypeScript types. The library is built with TypeScript and is fully typed, ensuring a smooth and error-free development experience.

## Features

- **Object Utilities**: Functions to access and manipulate nested object properties, extend objects, and more.
- **Data Transformation**: Deep merging, null-to-undefined conversion, slug generation, text normalization, and more.
- **Async Operations**: Polling, scheduling, debouncing, throttling, and safe async execution.
- **Cookie Management**: Functions to set, get, delete, and check for cookies.
- **Class Name Merging**: A utility to merge class names with Tailwind CSS and custom logic.
- **React Hooks**: Hooks for media queries, effects, state management (local/session storage, URL params), DOM calculations, async operations, scheduling, and more.
- **UI Components**: React components for HTML injection, media wrapping, responsive indicators, scrollable markers, and Iconify icons.
- **TypeScript Types**: Advanced utility types for deep partials, requireds, readonly, guards, and type-level logic gates.
- **Browser Utilities**: Clipboard operations, scroll management, SSR detection, and more.

## Installation

You can install `sohanemon/utils` using npm or yarn:

```bash
npm install @sohanemon/utils
```

or

```bash
yarn add @sohanemon/utils
```

## Usage

### Importing Utilities

You can import individual utilities, hooks, components, or types as needed:

```typescript
import { cn, getObjectValue, setClientSideCookie, hydrate, poll } from '@sohanemon/utils';
import { useAsync, useLocalStorage } from '@sohanemon/utils';
import { HtmlInjector, ResponsiveIndicator } from '@sohanemon/utils';
import type { DeepPartial, Primitive } from '@sohanemon/utils';
```

### Examples

#### Class Name Merging

```typescript
import { cn } from '@sohanemon/utils';

const className = cn('bg-blue-500', 'text-white', 'p-4', 'rounded-lg');
```

#### Object Utilities

```typescript
import { getObjectValue, extendProps } from '@sohanemon/utils';

const obj = { a: { b: { c: 1 } } };
const value = getObjectValue(obj, 'a.b.c'); // 1

const extended = extendProps({ a: 1 }, { b: 'hello' }); // { a: 1, b: 'hello' }
```

#### Data Transformation

```typescript
import { hydrate, deepmerge, convertToSlug, normalizeText } from '@sohanemon/utils';

const cleaned = hydrate({ a: null, b: { c: null } }); // { a: undefined, b: { c: undefined } }

// Deep merge objects
const merged = deepmerge({ user: { name: 'John' } }, { user: { age: 30 } });
// { user: { name: 'John', age: 30 } }

// Compose functions automatically
const composed = deepmerge(
  { onFinish() { console.log('first') } },
  { onFinish() { console.log('second') } },
  { functionMerge: 'compose' }
);
// composed.onFinish() logs 'first' then 'second'

// Merge functions with custom logic
const combined = deepmerge(
  { onFinish() { console.log('first') } },
  { onFinish(v) { console.log('second', v) } },
  {
    customMerge: (key, target, source) => {
      if (typeof target === 'function' && typeof source === 'function') {
        return (...args) => { target(...args); source(...args); };
      }
      return source;
    }
  }
);
// combined.onFinish('done') logs 'first' then 'second done'

const slug = convertToSlug('Hello World!'); // 'hello-world'
const normalized = normalizeText('Café', { removeAccents: true }); // 'cafe'
```

#### Async Operations

```typescript
import { poll, shield, sleep } from '@sohanemon/utils';

const result = await poll(async () => {
  const status = await checkStatus();
  return status === 'ready' ? status : null;
}, { interval: 2000, timeout: 30000 });

const [error, data] = await shield(fetchData());
```

#### Cookie Management

```typescript
import { setClientSideCookie, getClientSideCookie } from '@sohanemon/utils';

setClientSideCookie('username', 'sohanemon', 7);
const { value } = getClientSideCookie('username'); // 'sohanemon'
```

#### Debounce and Throttle

```typescript
import { debounce, throttle } from '@sohanemon/utils';

const debouncedFunction = debounce(() => console.log('Debounced!'), 300);
const throttledFunction = throttle(() => console.log('Throttled!'), 300);
```

#### React Hooks

```typescript
import { useAsync, useLocalStorage, useMediaQuery, useCopyToClipboard, useScrollTracker } from '@sohanemon/utils';

const { data, isLoading } = useAsync(async (signal) => {
  return await fetchData(signal);
}, { mode: 'auto' });

const [value, setValue] = useLocalStorage('key', { count: 0 });

const isMobile = useMediaQuery('sm');

const { isCopied, copy } = useCopyToClipboard();

const { scrolledPast, direction } = useScrollTracker({ threshold: 300 });
```

#### UI Components

```tsx
import { HtmlInjector, ResponsiveIndicator, Iconify } from '@sohanemon/utils';

<HtmlInjector html="<p>Injected HTML</p>" />
<ResponsiveIndicator />
<Iconify icon="mdi:home" />
```

#### TypeScript Types

```typescript
import type { DeepPartial, Nullable, KeysOfType } from '@sohanemon/utils';

type PartialUser = DeepPartial<User>;
type NullableUser = Nullable<User>;
type StringKeys = KeysOfType<User, string>;
```

## API Documentation

### Functions

#### Class Name Merging
```typescript
cn(...inputs: ClassValue[]): string
```

#### Object Utilities
```typescript
getObjectValue<T, K extends Array<string | number>, D>(
  obj: T,
  path: K,
  defaultValue: D
): Exclude<GetValue<T, K>, undefined> | D;

getObjectValue<T, K extends Array<string | number>>(
  obj: T,
  path: K
): GetValue<T, K> | undefined;

getObjectValue<T, S extends string, D>(
  obj: T,
  path: S,
  defaultValue: D
): Exclude<GetValue<T, SplitPath<S>>, undefined> | D;

getObjectValue<T, S extends string>(
  obj: T,
  path: S
): GetValue<T, SplitPath<S>> | undefined;

extendProps<T extends object, P extends object>(
  base: T,
  props: P
): T & P;
```

#### Data Transformation
```typescript
hydrate<T>(data: T): Hydrate<T>

deepmerge<T extends Record<string, any>, S extends Record<string, any>[]>(
  target: T,
  ...sources: S
): TMerged<T | S[number]>

deepmerge<T extends Record<string, any>, S extends Record<string, any>[]>(
  target: T,
  sources: S,
  options?: DeepMergeOptions
): TMerged<T | S[number]>

convertToSlug(str: string): string

normalizeText(
  str?: string | null,
  options?: {
    lowercase?: boolean;
    removeAccents?: boolean;
    removeNonAlphanumeric?: boolean;
  }
): string

convertToNormalCase(inputString: string): string

escapeRegExp(str: string): string

printf(format: string, ...args: unknown[]): string
```

#### Async & Scheduling
```typescript
poll<T>(
  cond: () => Promise<T | null | false | undefined>,
  options?: {
    interval?: number;
    timeout?: number;
    signal?: AbortSignal;
    jitter?: boolean;
  }
): Promise<T>

schedule(task: Task, options?: ScheduleOpts): void

shield<T, E = Error>(operation: Promise<T>): Promise<[E | null, T | null]>
shield<T, E = Error>(operation: () => T): [E | null, T | null]

sleep(time?: number, signal?: AbortSignal): Promise<void>

debounce<F extends (...args: any[]) => any>(
  function_: F,
  wait?: number,
  options?: { immediate?: boolean }
): DebouncedFunction<F>

throttle<F extends (...args: any[]) => any>(
  function_: F,
  wait?: number,
  options?: { leading?: boolean; trailing?: boolean }
): ThrottledFunction<F>
```

#### Cookie Management
```typescript
setClientSideCookie(name: string, value: string, days?: number, path?: string): void
deleteClientSideCookie(name: string, path?: string): void
hasClientSideCookie(name: string): boolean
getClientSideCookie(name: string): { value: string | undefined }
```

#### Browser Utilities
```typescript
copyToClipboard(value: string, onSuccess?: () => void): void

scrollTo(
  containerSelector: string | React.RefObject<HTMLDivElement>,
  to: 'top' | 'bottom'
): void

goToClientSideHash(id: string, opts?: ScrollIntoViewOptions): void

isSSR: boolean

svgToBase64(str: string): string

isLinkActive(options: {
  path: string;
  currentPath: string;
  locales?: string[];
  exact?: boolean;
}): boolean

isNavActive(href: string, path: string): boolean // deprecated

cleanSrc(src: string): string
```

### React Hooks

#### State & Effects
```typescript
useAction<Input, Result>(
  action: ActionType<Input, Result>,
  options?: UseActionOptions<Input, Result>
): {
  execute: (input: Input) => void;
  executeAsync: (input: Input) => Promise<Result>;
  reset: () => void;
  useExecute: (input: Input) => void;
  data: Result | null;
  error: Error | null;
  input: Input | undefined;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

useAsync<TData, TError extends Error = Error>(
  asyncFn: (signal: AbortSignal) => Promise<TData>,
  options?: UseAsyncOptions<TData, TError>
): UseAsyncReturn<TData, TError>

useLocalStorage<T extends Record<string, any>>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>]

useSessionStorage<T extends Record<string, any>>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>]

useUrlParams<T extends string | number | boolean>(
  key: string,
  defaultValue: T
): [T, (value: T) => void]

useDebounce<T>(state: T, delay?: number): T

useTimeout(callback: () => void, delay?: number | null): void

useEffectOnce(effect: React.EffectCallback): void

useUpdateEffect(effect: React.EffectCallback, deps: React.DependencyList): void

useIsomorphicEffect: typeof React.useLayoutEffect | typeof React.useEffect
```

#### UI & Interaction
```typescript
useMediaQuery(tailwindBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`): boolean

useClickOutside(callback: () => void): React.RefObject<HTMLDivElement>

useCopyToClipboard(options?: { timeout?: number }): {
  isCopied: boolean;
  copy: (value: string) => void;
}

useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void

useQuerySelector<T extends Element>(selector: string | React.RefObject<T | null>): T | null

useIsClient(): boolean

useLockScroll(): void

useIntersection(options?: UseIntersectionOptions): {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
}

useIsScrolling(): {
  isScrolling: boolean;
  scrollableContainerRef: React.RefObject<HTMLElement>;
}

useIsAtTop(options?: { offset?: number }): {
  scrollableContainerRef: React.RefObject<HTMLElement>;
  isAtTop: boolean;
}

useScrollTracker(options?: {
  threshold?: number;
  container?: string | React.RefObject<HTMLElement | null>;
}): {
  scrolledPast: boolean;
  direction: 'forward' | 'backward';
}
```

#### DOM & Layout
```typescript
useDomCalculation(options: CalculationProps): { height: number; width: number }

useHeightCalculation(options: CalculationProps2): number
```

#### Scheduling
```typescript
useSchedule(options?: ScheduleOpts): (task: Task) => void

useScheduledEffect(
  effect: () => void | (() => void),
  deps?: React.DependencyList,
  options?: ScheduleOpts
): void
```

### Components

```typescript
Iconify: React.Component (from @iconify/react)

HtmlInjector: React.Component<{ html: string; className?: string }>

MediaWrapper: React.Component<{
  src: string;
  alt?: string;
  className?: string;
  lazy?: boolean;
}>

ResponsiveIndicator: React.Component<{
  className?: string;
  showText?: boolean;
}>

ScrollableMarker: React.Component<{
  className?: string;
  children?: React.ReactNode;
}>
```

### Types

#### Utility Types
```typescript
Keys<T extends object>: keyof T
Values<T extends object>: T[keyof T]
DeepPartial<T>: T with all properties optional recursively
SelectivePartial<T, K>: T with selected keys optional
DeepRequired<T>: T with all properties required recursively
SelectiveRequired<T, K>: T with selected keys required
Never<T>: Object with never values
Nullable<T>: T with null added to primitives
Optional<T>: T with undefined added to primitives
Nullish<T>: T with null|undefined added to primitives
Maybe<T>: T with all properties optional and nullish
DeepReadonly<T>: T with all properties readonly recursively
Mutable<T>: T with readonly removed
KeysOfType<T, U>: Keys of T where value is U
OmitByType<T, U>: T without properties of type U
RequiredKeys<T, K>: T with selected keys required
Diff<T, U>: Properties in T or U but not both
Intersection<T, U>: Common properties
Merge<T, U>: Merged object
Substract<T, U>: T without U properties
AllOrNone<T>: T or empty object
OneOf<T>: Union of single property objects
TwoOf<T>: Union of two property objects
Prettify<T>: Clean type representation
NestedKeyOf<T>: All nested keys as strings
Without<T, U>: T without U keys
DeepMergeOptions: {
  arrayMerge?: 'replace' | 'concat' | 'merge' | ((target: any[], source: any[]) => any[]);
  clone?: boolean;
  customMerge?: (key: string | symbol, targetValue: any, sourceValue: any) => any;
  functionMerge?: 'replace' | 'compose';
  maxDepth?: number;
}
```

#### Type Guards & Primitives
```typescript
Primitive: string | number | bigint | boolean | symbol | null | undefined
Falsy: false | '' | 0 | null | undefined

isFalsy(val: unknown): val is Falsy
isNullish(val: unknown): val is null | undefined
isPrimitive(val: unknown): val is Primitive
isPlainObject(value: unknown): value is Record<string, any>
```

#### Logic Gates
```typescript
BUFFER<T>: T
IMPLIES<T, U>: true if T extends U
XOR_Binary<T, U>: T | U with exclusions
XNOR_Binary<T, U>: T & U | neither
AND<T extends any[]>: All true
OR<T extends any[]>: At least one true
XOR<T extends any[]>: Odd number true
XNOR<T extends any[]>: Even number true
NOT<T>: Never properties
NAND<T extends any[]>: NOT AND
NOR<T extends any[]>: NOT OR
```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to the project.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Sohan Emon**: [sohanemon@outlook.com](mailto:sohanemon@outlook.com)
- **GitHub**: [sohanemon](https://github.com/sohanemon)
