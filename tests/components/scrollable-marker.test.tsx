import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
