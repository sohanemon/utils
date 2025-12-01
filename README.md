# sohanemon/utils

![npm version](https://img.shields.io/npm/v/@sohanemon/utils)
![npm downloads](https://img.shields.io/npm/dm/@sohanemon/utils)
![License](https://img.shields.io/npm/l/@sohanemon/utils)
![Tests](https://github.com/sohanemon/sohanemon-utils/actions/workflows/test.yml/badge.svg)

## Description

`sohanemon/utils` is a collection of utility functions and hooks designed to simplify common tasks in modern web development. It includes utilities for handling objects, cookies, class name merging, and more. The library is built with TypeScript and is fully typed, ensuring a smooth and error-free development experience.

## Features

- **Object Utilities**: Functions to manipulate and access nested object properties.
- **Cookie Management**: Functions to set, get, delete, and check for cookies.
- **Class Name Merging**: A utility to merge class names with Tailwind CSS and custom logic.
- **Responsive Media Queries**: Hooks to detect media queries based on Tailwind CSS breakpoints.
- **Debounce and Throttle**: Utilities to control the rate of function execution.
- **Copy to Clipboard**: A hook to copy text to the clipboard and track the copy status.
- **Local Storage Management**: A hook to persist state in local storage.
- **URL Parameter Management**: A hook to manage URL parameters as state.
- **DOM Calculation**: Hooks to calculate dimensions of elements based on viewport and other block dimensions.

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

You can import individual utilities or hooks as needed:

```javascript
import { cn, getObjectValue, setClientSideCookie } from '@sohanemon/utils';
```

### Examples

#### Class Name Merging

```javascript
import { cn } from '@sohanemon/utils';

const className = cn('bg-blue-500', 'text-white', 'p-4', 'rounded-lg');
```

#### Object Utilities

```javascript
import { getObjectValue } from '@sohanemon/utils';

const obj = { a: { b: { c: 1 } } };
const value = getObjectValue(obj, 'a.b.c'); // 1
```

#### Cookie Management

```javascript
import { setClientSideCookie, getClientSideCookie } from '@sohanemon/utils';

setClientSideCookie('username', 'sohanemon', 7);
const { value } = getClientSideCookie('username'); // 'sohanemon'
```

#### Responsive Media Queries

```javascript
import { useMediaQuery } from '@sohanemon/utils';

const isMobile = useMediaQuery('sm');
```

#### Debounce and Throttle

```javascript
import { debounce, throttle } from '@sohanemon/utils';

const debouncedFunction = debounce(() => console.log('Debounced!'), 300);
const throttledFunction = throttle(() => console.log('Throttled!'), 300);
```

#### Copy to Clipboard

```javascript
import { useCopyToClipboard } from '@sohanemon/utils/hooks';

const { isCopied, copy } = useCopyToClipboard();

return (
  <div>
    <button onClick={() => copy('Hello, World!')}>Copy</button>
    {isCopied && <span>Copied!</span>}
  </div>
);
```

#### Local Storage Management

```javascript
import { useLocalStorage } from '@sohanemon/utils/hooks';

const [value, setValue] = useLocalStorage('myKey', 'initialValue');

return (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  </div>
);
```

#### URL Parameter Management

```javascript
import { useUrlParams } from '@sohanemon/utils/hooks';

const [param, setParam] = useUrlParams('myParam', 'defaultValue');

return (
  <div>
    <input
      type="text"
      value={param}
      onChange={(e) => setParam(e.target.value)}
    />
  </div>
);
```

#### DOM Calculation

```javascript
import { useDomCalculation } from '@sohanemon/utils/hooks';

const { height, width } = useDomCalculation({
  blockIds: ['header', 'footer'],
  margin: 20,
  substract: true,
});

return (
  <div style={{ height, width }}>
    Content
  </div>
);
```

## API Documentation

### Class Name Merging

```typescript
cn(...inputs: ClassValue[]): string
```

### Object Utilities

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
```

### Cookie Management

```typescript
setClientSideCookie(name: string, value: string, days?: number, path?: string): void
deleteClientSideCookie(name: string, path?: string): void
hasClientSideCookie(name: string): boolean
getClientSideCookie(name: string): { value: string | undefined }
```

### Responsive Media Queries

```typescript
useMediaQuery(tailwindBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `(${string})`): boolean
```

### Debounce and Throttle

```typescript
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

### Copy to Clipboard

```typescript
useCopyToClipboard({ timeout?: number }): { isCopied: boolean; copy: (value: string) => void }
```

### Local Storage Management

```typescript
useLocalStorage<T extends Record<string, any>>(key: string, defaultValue: T): LocalStorageValue<T>
```

### URL Parameter Management

```typescript
useUrlParams<T extends string | number | boolean>(key: string, defaultValue: T): [T, (value: T) => void]
```

### DOM Calculation

```typescript
useDomCalculation({
  blockIds: string[];
  dynamic?: boolean | string;
  margin?: number;
  substract?: boolean;
  onChange?: (results: {
    blocksHeight: number;
    blocksWidth: number;
    remainingWidth: number;
    remainingHeight: number;
  }) => void;
}): { height: number; width: number }
```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to the project.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Sohan Emon**: [sohanemon@outlook.com](mailto:sohanemon@outlook.com)
- **GitHub**: [sohanemon](https://github.com/sohanemon)
