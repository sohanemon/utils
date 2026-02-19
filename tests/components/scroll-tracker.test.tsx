import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import {
  ScrollTracker,
  ScrollTrackerContext,
} from '../../src/components/scroll-tracker';

describe('ScrollTracker', () => {
  it('should render children', () => {
    render(
      <ScrollTracker>
        <div data-testid="child">Test content</div>
      </ScrollTracker>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should provide context with ref', () => {
    let capturedRef: React.RefObject<HTMLElement> | null = null;

    const TestConsumer = () => {
      capturedRef = React.useContext(ScrollTrackerContext);
      return <div>Test</div>;
    };

    render(
      <ScrollTracker>
        <TestConsumer />
      </ScrollTracker>,
    );

    expect(capturedRef).toBeDefined();
    expect(capturedRef).toBeInstanceOf(Object);
  });

  it('should work with single child element', () => {
    render(
      <ScrollTracker>
        <div>
          <p>Paragraph</p>
          <span>Span</span>
        </div>
      </ScrollTracker>,
    );

    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Span')).toBeInTheDocument();
  });
});
