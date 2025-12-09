import React, { useState } from 'react';
import {
  ResponsiveIndicator,
  ScrollTracker,
  ScrollableMarker,
} from '../../src/components';
import {
  useMediaQuery,
  useDebounce,
  useLocalStorage,
  useCopyToClipboard,
  useIsScrolling,
  useIsAtTop,
  useIntersection,
} from '../../src/hooks';
import { mergeRefs } from '../../src/functions';

function App() {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useLocalStorage('theme', { mode: 'light' });
  const { isCopied, copy } = useCopyToClipboard({});
  const { isScrolling, scrollableContainerRef } = useIsScrolling();
  const { isAtTop, scrollableContainerRef: atTopRef } = useIsAtTop();
  // Intersection hook for the main scroll container
  const { ref: scrollIntersectionRef, isIntersecting } = useIntersection({
    threshold: 0.3,
    onInteractionStart: () =>
      console.log('Scroll container intersection started'),
    onInteractionEnd: () => console.log('Scroll container intersection ended'),
  });

  // Separate intersection hook for standalone demo
  const {
    ref: standaloneIntersectionRef,
    isIntersecting: standaloneIsIntersecting,
  } = useIntersection({
    threshold: 0.5,
    onInteractionStart: () =>
      console.log('Standalone element entered viewport'),
    onInteractionEnd: () => console.log('Standalone element left viewport'),
  });

  // Merge refs for the main scroll container (scrolling + atTop + intersection)
  const mergedRef = mergeRefs(
    scrollableContainerRef,
    atTopRef,
    scrollIntersectionRef,
  );

  const isMobile = useMediaQuery('md');
  const debouncedSearch = useDebounce(searchTerm, 300);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Sohanemon Utils Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test and explore React utility components and hooks
          </p>
        </header>

        {/* Responsive Indicator */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Responsive Indicator
          </h2>
          <ResponsiveIndicator />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Current breakpoint:{' '}
            {isMobile ? 'Mobile (< 768px)' : 'Desktop (≥ 768px)'}
          </p>
        </section>

        {/* Hooks Demo */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Hooks Demo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debounce */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                useDebounce
              </h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Debounced value: {debouncedSearch}
              </p>
            </div>

            {/* Local Storage */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                useLocalStorage
              </h3>
              <button
                onClick={() =>
                  setTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' })
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Toggle Theme: {theme.mode}
              </button>
            </div>

            {/* Copy to Clipboard */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                useCopyToClipboard
              </h3>
              <button
                onClick={() => copy('Hello from Sohanemon Utils!')}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {isCopied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            {/* Counter */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                State Management
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCount(count - 1)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {count}
                </span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Components */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Scroll Behaviors Demo
          </h2>

          {/* Single Scroll Container with All Behaviors */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              Unified Scroll Container
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Is Scrolling
                </div>
                <div
                  className={`text-lg font-bold ${isScrolling ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isScrolling ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                  At Top
                </div>
                <div
                  className={`text-lg font-bold ${isAtTop ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isAtTop ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Intersecting
                </div>
                <div
                  className={`text-lg font-bold ${isIntersecting ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isIntersecting ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            <div
              ref={mergedRef as React.Ref<HTMLDivElement>}
              className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700"
            >
              <ScrollableMarker />

              {/* Top section - for intersection testing */}
              <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Intersection Test Area
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This area will trigger intersection events when it
                  enters/leaves the viewport. Scroll up and down to see the
                  intersection status change.
                </p>
              </div>

              {/* Content sections */}
              <div className="space-y-6">
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-gray-600 rounded-lg shadow-sm"
                  >
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                      Content Block {i + 1}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This is scrollable content. Try scrolling to see how the
                      behaviors change: • Is Scrolling detects scroll activity •
                      At Top shows when you're at the very top • Intersection
                      triggers when the yellow area enters/leaves view
                    </p>
                    {i === 7 && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Mid-point:</strong> You're about halfway
                          through the content!
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom section */}
              <div className="mt-8 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  End of Content
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You've reached the bottom! Scroll back up to see all the
                  behaviors in action.
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Tracker Demo */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              Scroll Tracker Context
            </h3>
            <ScrollTracker>
              <div className="h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="p-2 bg-white dark:bg-gray-600 rounded text-sm"
                    >
                      Context-tracked item {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollTracker>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This container uses ScrollTracker context for advanced scroll
              management
            </p>
          </div>
        </section>

        {/* Additional Hook Examples */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Additional Hook Examples
          </h2>

          {/* Intersection Observer Demo with separate element */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              Standalone Intersection Observer
            </h3>
            <div className="h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
              <div className="h-20 mb-4 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Scroll to see intersection demo
                </p>
              </div>
              <div
                ref={standaloneIntersectionRef}
                className={`h-20 flex items-center justify-center rounded transition-colors duration-300 ${
                  standaloneIsIntersecting
                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                    : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                <p className="font-semibold text-center">
                  {standaloneIsIntersecting
                    ? '🎉 Element is visible!'
                    : '👁️ Element not in viewport'}
                </p>
              </div>
              <div className="h-20 mt-4 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Keep scrolling...
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This demonstrates intersection on a separate element (not merged
              with scroll behaviors)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
