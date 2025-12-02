import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollableMarker } from '../../src/components/scrollable-marker';

describe('ScrollableMarker', () => {
  it('should render without crashing', () => {
    // Mock requestIdleCallback
    global.requestIdleCallback = vi.fn((cb) => {
      setTimeout(cb, 0);
      return 1;
    });

    const { container } = render(<ScrollableMarker />);

    expect(container).toBeDefined();

    vi.restoreAllMocks();
  });
});
