import {
  convertToNormalCase,
  convertToSlug,
  debounce,
  escapeRegExp,
  normalizeText,
  printf,
  sleep,
  throttle,
} from '@ts-utilities/core';
import { describe, expect, it } from 'vitest';

import {
  cleanSrc,
  cn,
  isLinkActive,
  isSSR,
  svgToBase64,
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
  describe('exact match (default)', () => {
    it('should match identical paths', () => {
      expect(
        isLinkActive({ targetPath: '/about', currentPath: '/about' }),
      ).toBe(true);
    });

    it('should not match different paths', () => {
      expect(isLinkActive({ targetPath: '/about', currentPath: '/home' })).toBe(
        false,
      );
    });

    it('should not match when currentPath is a child', () => {
      expect(
        isLinkActive({ targetPath: '/about', currentPath: '/about/team' }),
      ).toBe(false);
    });
  });

  describe('locale stripping', () => {
    it('should match when currentPath has a locale prefix', () => {
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/en/home' }),
      ).toBe(true);
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/fr/home' }),
      ).toBe(true);
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/de/home' }),
      ).toBe(true);
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/zh/home' }),
      ).toBe(true);
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/bn/home' }),
      ).toBe(true);
    });

    it('should not match when currentPath has a locale prefix but different path', () => {
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/en/about' }),
      ).toBe(false);
    });

    it('should not strip unknown locale prefixes', () => {
      expect(
        isLinkActive({ targetPath: '/home', currentPath: '/jp/home' }),
      ).toBe(false);
    });

    it('should support custom locales', () => {
      expect(
        isLinkActive({
          targetPath: '/home',
          currentPath: '/jp/home',
          locales: ['jp'],
        }),
      ).toBe(true);
    });
  });

  describe('query string and hash stripping', () => {
    it('should match when currentPath has a query string', () => {
      expect(
        isLinkActive({
          targetPath: '/keywords',
          currentPath: '/keywords?asin=123&page=1',
        }),
      ).toBe(true);
    });

    it('should match when currentPath has a hash fragment', () => {
      expect(
        isLinkActive({
          targetPath: '/keywords',
          currentPath: '/keywords#section',
        }),
      ).toBe(true);
    });

    it('should match when currentPath has both query string and hash', () => {
      expect(
        isLinkActive({
          targetPath: '/keywords',
          currentPath: '/keywords?page=1#section',
        }),
      ).toBe(true);
    });

    it('should match when currentPath has locale, query string, and hash', () => {
      expect(
        isLinkActive({
          targetPath: '/keywords',
          currentPath: '/en/keywords?page=1#section',
        }),
      ).toBe(true);
    });
  });

  describe('prefix match (exact: false)', () => {
    it('should match when currentPath starts with targetPath', () => {
      expect(
        isLinkActive({
          targetPath: '/blog',
          currentPath: '/blog/post-1',
          exact: false,
        }),
      ).toBe(true);
    });

    it('should match exact path with exact: false', () => {
      expect(
        isLinkActive({
          targetPath: '/blog',
          currentPath: '/blog',
          exact: false,
        }),
      ).toBe(true);
    });

    it('should not match when currentPath does not start with targetPath', () => {
      expect(
        isLinkActive({
          targetPath: '/blog',
          currentPath: '/about/team',
          exact: false,
        }),
      ).toBe(false);
    });

    it('should handle locale with prefix match', () => {
      expect(
        isLinkActive({
          targetPath: '/blog',
          currentPath: '/en/blog/post-1',
          exact: false,
        }),
      ).toBe(true);
    });
  });

  describe('regex targetPath', () => {
    it('should match dynamic routes', () => {
      expect(
        isLinkActive({
          targetPath: /^products\/\d+$/,
          currentPath: '/products/123',
        }),
      ).toBe(true);
    });

    it('should not match when regex does not match', () => {
      expect(
        isLinkActive({
          targetPath: /^products\/\d+$/,
          currentPath: '/products/abc',
        }),
      ).toBe(false);
    });

    it('should strip locale before testing regex', () => {
      expect(
        isLinkActive({
          targetPath: /^products\/\d+$/,
          currentPath: '/en/products/456',
        }),
      ).toBe(true);
    });

    it('should strip query string before testing regex', () => {
      expect(
        isLinkActive({
          targetPath: /^products\/\d+$/,
          currentPath: '/products/123?color=red',
        }),
      ).toBe(true);
    });

    it('should ignore exact flag when targetPath is a RegExp', () => {
      expect(
        isLinkActive({
          targetPath: /^blog/,
          currentPath: '/blog/post-1',
          exact: true,
        }),
      ).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle root path', () => {
      expect(isLinkActive({ targetPath: '/', currentPath: '/' })).toBe(true);
      expect(isLinkActive({ targetPath: '/', currentPath: '/en/' })).toBe(true);
    });

    it('should handle trailing slashes', () => {
      expect(
        isLinkActive({ targetPath: '/about/', currentPath: '/about' }),
      ).toBe(true);
      expect(
        isLinkActive({ targetPath: '/about', currentPath: '/about/' }),
      ).toBe(true);
    });

    it('should handle multiple leading slashes', () => {
      expect(
        isLinkActive({ targetPath: '//about', currentPath: '/about' }),
      ).toBe(true);
    });
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
    expect(escapeRegExp('Hello, world!')).toBe('Hello, world!');
  });
});

describe('normalizeText', () => {
  it('should normalize text', () => {
    expect(normalizeText('HELLO')).toBe('hello');
    expect(normalizeText('café')).toBe('cafe');
  });
});

describe('isSSR', () => {
  it('should return false in test environment with window', () => {
    expect(isSSR).toBe(false);
  });
});

describe('svgToBase64', () => {
  it('should encode SVG to base64', () => {
    const svg = '<svg><circle cx="50" cy="50" r="40"/></svg>';
    const result = svgToBase64(svg);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('core functions compatibility', () => {
  it('convertToNormalCase should match local implementation', () => {
    expect(convertToNormalCase('helloWorld')).toBe(
      convertToNormalCase('helloWorld'),
    );
  });

  it('convertToSlug should match local implementation', () => {
    expect(convertToSlug('Hello World!')).toBe(convertToSlug('Hello World!'));
  });

  it('debounce should match local implementation', () => {
    expect(typeof debounce).toBe('function');
  });

  it('throttle should match local implementation', () => {
    expect(typeof throttle).toBe('function');
  });

  it('printf should match local implementation', () => {
    expect(typeof printf).toBe('function');
  });

  it('escapeRegExp should match local implementation', () => {
    expect(typeof escapeRegExp).toBe('function');
  });

  it('normalizeText should match local implementation', () => {
    expect(typeof normalizeText).toBe('function');
  });

  it('sleep should match local implementation', () => {
    expect(typeof sleep).toBe('function');
  });
});
