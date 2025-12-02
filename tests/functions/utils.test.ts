import { describe, expect, it } from 'vitest';
import {
  cleanSrc,
  cn,
  convertToNormalCase,
  convertToSlug,
  debounce,
  escapeRegExp,
  isLinkActive,
  isSSR,
  normalizeText,
  printf,
  sleep,
  svgToBase64,
  throttle,
} from '../../src/functions/utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active', false && 'inactive')).toBe(
      'base active',
    );
  });
});

describe('isLinkActive', () => {
  it('should check if link is active with locales', () => {
    expect(isLinkActive({ path: '/home', currentPath: '/en/home' })).toBe(true);
    expect(isLinkActive({ path: '/home', currentPath: '/en/about' })).toBe(
      false,
    );
  });
});

describe('cleanSrc', () => {
  it('should remove /public/ prefix', () => {
    expect(cleanSrc('/public/image.jpg')).toBe('/image.jpg');
  });
});

describe('convertToNormalCase', () => {
  it('should convert various cases to normal case', () => {
    expect(convertToNormalCase('helloWorld')).toBe('Hello World');
    expect(convertToNormalCase('hello_world')).toBe('Hello World');
    expect(convertToNormalCase('hello-world')).toBe('Hello World');
  });
});

describe('convertToSlug', () => {
  it('should convert string to slug', () => {
    expect(convertToSlug('Hello World!')).toBe('hello-world');
    expect(convertToSlug('Déjà Vu')).toBe('deja-vu');
  });
});

describe('isSSR', () => {
  it('should return false in test environment with window', () => {
    expect(isSSR).toBe(false); // vitest with happy-dom provides window
  });
});

describe('svgToBase64', () => {
  it('should encode SVG to base64', () => {
    const svg = '<svg></svg>';
    expect(svgToBase64(svg)).toBe(Buffer.from(svg).toString('base64'));
  });
});

describe('sleep', () => {
  it('should resolve after timeout', async () => {
    const start = Date.now();
    await sleep(10);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(10);
  });
});

describe('debounce', () => {
  it('should debounce function calls', async () => {
    let count = 0;
    const debounced = debounce(() => count++, 10);
    debounced();
    debounced();
    debounced();
    await sleep(15);
    expect(count).toBe(1);
  });
});

describe('throttle', () => {
  it('should throttle function calls', async () => {
    let count = 0;
    const throttled = throttle(() => count++, 10, { trailing: false });
    throttled();
    throttled();
    throttled();
    await sleep(15);
    expect(count).toBe(1);
  });
});

describe('printf', () => {
  it('should format strings', () => {
    expect(printf('%s %s', 'Hello', 'World')).toBe('Hello World');
  });
});

describe('escapeRegExp', () => {
  it('should escape regex special characters', () => {
    expect(escapeRegExp('a.b')).toBe('a\\.b');
  });
});

describe('normalizeText', () => {
  it('should normalize text', () => {
    expect(normalizeText('HELLO')).toBe('hello');
    expect(normalizeText('café')).toBe('cafe');
  });
});

// Note: scrollTo, copyToClipboard, mergeRefs, goToClientSideHash require DOM/browser environment, skip for now
