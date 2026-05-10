'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children into a DOM element at the specified container.
 *
 * @param props - The component props.
 * @param props.children - The content to render in the portal.
 * @param props.container - The target container selector or ref.
 *   - Selector string: `#id`, `.class`, or `[attribute]`
 *   - React ref: A RefObject pointing to an existing DOM element.
 * @returns The portal component or null if container not found.
 *
 * @example
 * ```tsx
 * // Using ID selector
 * <Portal container="#modal-root">
 *   <Modal />
 * </Portal>
 *
 * // Using class selector
 * <Portal container=".portal-container">
 *   <Content />
 * </Portal>
 *
 * // Using ref
 * const containerRef = useRef<HTMLDivElement>(null);
 * <Portal container={containerRef}>
 *   <Content />
 * </Portal>
 * ```
 */
interface PortalProps {
  children: React.ReactNode;
  container:
    | `#${string}`
    | `.${string}`
    | `[${string}]`
    | React.RefObject<HTMLElement>;
}

export function Portal({ children, container }: PortalProps) {
  const targetRef = useRef<Element | null>(null);

  if (!targetRef.current) {
    targetRef.current =
      typeof container === 'string'
        ? document.querySelector(container)
        : container.current;
  }

  if (!targetRef.current) return null;

  return createPortal(children, targetRef.current);
}
