import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  setClientSideCookie,
  getClientSideCookie,
  deleteClientSideCookie,
  hasClientSideCookie,
} from '../../src/functions/cookie';

describe('cookie functions', () => {
  let mockCookie = '';

  beforeEach(() => {
    mockCookie = '';
    vi.spyOn(document, 'cookie', 'get').mockImplementation(() => mockCookie);
    vi.spyOn(document, 'cookie', 'set').mockImplementation((value) => {
      mockCookie = value;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setClientSideCookie', () => {
    it('should set a cookie without expiration', () => {
      setClientSideCookie('test', 'value');
      expect(document.cookie).toBe('test=value; path=/');
    });

    it('should set a cookie with expiration', () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      setClientSideCookie('test', 'value', 1);
      const expectedDate = new Date('2023-01-02T00:00:00Z').toUTCString();
      expect(document.cookie).toBe(
        `test=value; expires=${expectedDate}; path=/`,
      );

      vi.useRealTimers();
    });

    it('should set a cookie with custom path', () => {
      setClientSideCookie('test', 'value', undefined, '/custom');
      expect(document.cookie).toBe('test=value; path=/custom');
    });

    it('should handle empty value', () => {
      setClientSideCookie('test', '');
      expect(document.cookie).toBe('test=; path=/');
    });

    it('should handle special characters in value', () => {
      setClientSideCookie('test', 'value with spaces');
      expect(document.cookie).toBe('test=value with spaces; path=/');
    });
  });

  describe('getClientSideCookie', () => {
    it('should return the cookie value when exists', () => {
      document.cookie = 'test=value; other=cookie';
      const result = getClientSideCookie('test');
      expect(result).toEqual({ value: 'value' });
    });

    it('should return undefined value when cookie does not exist', () => {
      document.cookie = 'other=cookie';
      const result = getClientSideCookie('test');
      expect(result).toEqual({ value: undefined });
    });

    it('should handle multiple cookies', () => {
      document.cookie = 'first=1; second=2; third=3';
      expect(getClientSideCookie('first')).toEqual({ value: '1' });
      expect(getClientSideCookie('second')).toEqual({ value: '2' });
      expect(getClientSideCookie('third')).toEqual({ value: '3' });
    });

    it('should handle empty cookie value', () => {
      document.cookie = 'test=; other=value';
      const result = getClientSideCookie('test');
      expect(result).toEqual({ value: '' });
    });
  });

  describe('deleteClientSideCookie', () => {
    it('should delete a cookie', () => {
      document.cookie = 'test=value';
      deleteClientSideCookie('test');
      expect(document.cookie).toBe(
        'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
      );
    });

    it('should delete a cookie with custom path', () => {
      deleteClientSideCookie('test', '/custom');
      expect(document.cookie).toBe(
        'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/custom',
      );
    });
  });

  describe('hasClientSideCookie', () => {
    it('should return true when cookie exists', () => {
      document.cookie = 'test=value';
      expect(hasClientSideCookie('test')).toBe(true);
    });

    it('should return false when cookie does not exist', () => {
      document.cookie = 'other=value';
      expect(hasClientSideCookie('test')).toBe(false);
    });

    it('should handle multiple cookies', () => {
      document.cookie = 'first=1; second=2';
      expect(hasClientSideCookie('first')).toBe(true);
      expect(hasClientSideCookie('second')).toBe(true);
      expect(hasClientSideCookie('third')).toBe(false);
    });

    it('should handle empty cookie value', () => {
      document.cookie = 'test=';
      expect(hasClientSideCookie('test')).toBe(true);
    });
  });

  describe('integration', () => {
    it('should set, get, check existence, and delete a cookie', () => {
      // Initially no cookie
      expect(hasClientSideCookie('test')).toBe(false);
      expect(getClientSideCookie('test')).toEqual({ value: undefined });

      // Set cookie
      setClientSideCookie('test', 'value', 1);
      expect(hasClientSideCookie('test')).toBe(true);
      expect(getClientSideCookie('test')).toEqual({ value: 'value' });

      // Delete cookie
      deleteClientSideCookie('test');
      // Note: in this simple mock, delete sets the cookie to the delete string
      // In real browsers, the cookie would be removed
      expect(document.cookie).toBe(
        'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
      );
    });

    it('should handle cookie overwriting', () => {
      setClientSideCookie('test', 'first');
      expect(getClientSideCookie('test')).toEqual({ value: 'first' });

      setClientSideCookie('test', 'second');
      expect(getClientSideCookie('test')).toEqual({ value: 'second' });
    });
  });
});
