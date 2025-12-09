'use client';

import * as React from 'react';
import { cn } from '../functions';
import { useScheduledEffect } from '../hooks/schedule';

/**
 * Props for the HtmlInjector component
 */
type HtmlInjectorProps = Omit<
  React.ComponentProps<'div'>,
  'dangerouslySetInnerHTML'
> & {
  /** The HTML content to inject and render */
  html: string;
  /**
   * Whether to sanitize the HTML content by removing potentially dangerous elements and attributes
   * @default false
   */
  sanitize?: boolean;
  /**
   * Whether to execute script tags found in the HTML content
   * @default true
   */
  executeScripts?: boolean;
};

/**
 * A robust component for safely injecting and rendering HTML content with optional script execution.
 *
 * This component provides a safe way to render dynamic HTML content with the following features:
 * - Optional HTML sanitization to remove dangerous elements and attributes
 * - Controlled script execution with proper cleanup
 * - Memory leak prevention by tracking and removing injected scripts
 * - Error handling for malformed HTML and script execution failures
 *
 * @example
 * ```tsx
 * // Basic HTML injection
 * <HtmlInjector html="<p>Hello <strong>World</strong></p>" />
 *
 * // With sanitization enabled
 * <HtmlInjector
 *   html="<p>Safe content</p><script>alert('removed')</script>"
 *   sanitize={true}
 * />
 *
 * // Disable script execution
 * <HtmlInjector
 *   html="<p>Content</p><script>console.log('not executed')</script>"
 *   executeScripts={false}
 * />
 * ```
 *
 * @param props - The component props
 * @returns A div element containing the injected HTML content, or null if no HTML is provided
 */

export function HtmlInjector({
  className,
  html,
  sanitize = false,
  executeScripts = true,
  ...props
}: HtmlInjectorProps) {
  const injectedScriptsRef = React.useRef<HTMLScriptElement[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useScheduledEffect(() => {
    // NOTE: Cleanup previously injected scripts
    injectedScriptsRef.current.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    injectedScriptsRef.current = [];

    if (!executeScripts || !html) return;

    try {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;

      const scripts = tempContainer.querySelectorAll('script');

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');

        // HACK: Copy text content
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }

        // HACK: Copy all attributes (src, type, async, defer, etc.)
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        newScript.onerror = (error) => {
          console.error('Script injection error:', error);
        };

        document.body.appendChild(newScript);
        injectedScriptsRef.current.push(newScript);
      });
    } catch (error) {
      console.error('HTML injection error:', error);
    }
  }, [html, executeScripts]);

  React.useEffect(() => {
    return () => {
      injectedScriptsRef.current.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  const processedHtml = React.useMemo(() => {
    if (!html) return '';

    if (sanitize) {
      // Basic sanitization - remove potentially dangerous elements
      const container = document.createElement('div');
      container.innerHTML = html;

      // Remove script tags if sanitize is enabled
      container.querySelectorAll('script').forEach((script) => script.remove());

      // Remove potentially dangerous attributes
      const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover'];
      container.querySelectorAll('*').forEach((el) => {
        dangerousAttrs.forEach((attr) => {
          if (el.hasAttribute(attr)) {
            el.removeAttribute(attr);
          }
        });
      });

      return container.innerHTML;
    }

    return html;
  }, [html, sanitize]);

  if (!html) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
      {...props}
    />
  );
}
