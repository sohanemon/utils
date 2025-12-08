'use client';

import { useScheduledEffect } from '../hooks/schedule';

/**
 * A component that automatically marks scrollable elements with a data attribute.
 *
 * Monitors the DOM for elements that can scroll and adds `data-scrollable="true"`
 * attribute to them. Useful for styling scrollable elements or applying scroll-specific behavior.
 * Uses MutationObserver to handle dynamic content changes.
 *
 * @returns null (invisible component that manages scrollable element detection)
 *
 * @example
 * ```tsx
 * // Include once in your app to mark all scrollable elements
 * <ScrollableMarker />
 *
 * // Then style scrollable elements in CSS
 * [data-scrollable="true"] {
 *   border: 1px solid blue;
 * }
 * ```
 */
export function ScrollableMarker() {
  useScheduledEffect(() => {
    const root = document.body;
    if (!root) return;

    const isScrollable = (el: HTMLElement): boolean => {
      const style = getComputedStyle(el);
      if (
        style.overflow === 'hidden' &&
        style.overflowY === 'hidden' &&
        style.overflowX === 'hidden'
      )
        return false;
      const canScrollY =
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        el.scrollHeight > el.clientHeight;
      const canScrollX =
        (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
        el.scrollWidth > el.clientWidth;
      return canScrollY || canScrollX;
    };

    const markScrollable = (el: HTMLElement) => {
      if (isScrollable(el)) el.dataset['scrollable'] = 'true';
      else delete el.dataset['scrollable'];
    };

    const scanTree = (node: HTMLElement) => {
      markScrollable(node);
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i] as HTMLElement;
        scanTree(child);
      }
    };

    requestIdleCallback(() => scanTree(root));

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n instanceof HTMLElement) scanTree(n);
          });
        } else if (m.type === 'attributes' && m.target instanceof HTMLElement) {
          markScrollable(m.target);
        }
      }
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
