'use client';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

export const ScrollTrackerContext =
  React.createContext<React.RefObject<HTMLElement> | null>(null);

interface ScrollTrackerProps {
  children: React.ReactNode;
}

export const ScrollTracker = ({ children }: ScrollTrackerProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <ScrollTrackerContext.Provider value={ref as React.RefObject<HTMLElement>}>
      <Slot ref={ref}>{children}</Slot>
    </ScrollTrackerContext.Provider>
  );
};
