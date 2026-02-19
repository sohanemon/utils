import * as React from 'react';
import { useState } from 'react';
import { useMediaQuery, useWorker } from '../../src/hooks';
import { ResponsiveIndicator } from '../../src/components/responsive-indicator.tsx';

// 1. Shared heavy compute
const heavyCompute = (iterations: number): { result: number; time: number } => {
  const start = Date.now();
  let result = 0;

  for (let i = 0; i < iterations; i++) {
    result += Math.sin(i) * Math.cos(i);
    for (let j = 0; j < 100; j++) {
      Math.sqrt(Math.random() * Math.PI);
    }
    console.info('⚡[App.tsx:11] result:', result);
  }

  const end = Date.now();
  return { result, time: end - start };
};

function App() {
  const [syncResult, setSyncResult] = useState<number | null>(null);
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Demo for the new useWorker hook
  const { execute, data, isLoading } = useWorker(heavyCompute);

  // Media Query Demo
  const isMobile = useMediaQuery('max-sm');
  const isTablet = useMediaQuery(['md', 'max-lg']);
  const isDesktop = useMediaQuery('lg');
  const isLargeDesktop = useMediaQuery('xl');

  // Responsive values
  const containerPadding = useMediaQuery({
    DEFAULT: 'p-4',
    sm: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  });

  const headingSize = useMediaQuery({
    DEFAULT: 'text-xl',
    sm: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  });

  // Dark mode detection
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );

  // Custom range query example
  const isPortrait = useMediaQuery('(orientation: portrait)');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Media Query Demo Section */}
        <section
          className={`bg-white rounded-lg shadow-sm ${containerPadding}`}
        >
          <h1 className={`${headingSize} font-bold text-gray-900 mb-6`}>
            📱 useMediaQuery Demo
          </h1>

          {/* Breakpoint Detection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Current Breakpoint
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                  isMobile
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">📱</div>
                <div className="font-medium">Mobile</div>
                <div className="text-xs opacity-75">max-sm</div>
                {isMobile && (
                  <div className="text-xs mt-1 font-bold">ACTIVE</div>
                )}
              </div>

              <div
                className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                  isTablet
                    ? 'bg-purple-100 border-purple-500 text-purple-800'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">📲</div>
                <div className="font-medium">Tablet</div>
                <div className="text-xs opacity-75">md - lg</div>
                {isTablet && (
                  <div className="text-xs mt-1 font-bold">ACTIVE</div>
                )}
              </div>

              <div
                className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                  isDesktop && !isLargeDesktop
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">💻</div>
                <div className="font-medium">Desktop</div>
                <div className="text-xs opacity-75">lg - xl</div>
                {isDesktop && !isLargeDesktop && (
                  <div className="text-xs mt-1 font-bold">ACTIVE</div>
                )}
              </div>

              <div
                className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                  isLargeDesktop
                    ? 'bg-orange-100 border-orange-500 text-orange-800'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">🖥</div>
                <div className="font-medium">Large</div>
                <div className="text-xs opacity-75">xl+</div>
                {isLargeDesktop && (
                  <div className="text-xs mt-1 font-bold">ACTIVE</div>
                )}
              </div>
            </div>
          </div>

          {/* Responsive Grid Demo */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Responsive Grid (
              {isMobile ? '1 col' : isTablet ? '2 cols' : '3 cols'})
            </h2>
            <div
              className={`grid gap-4 ${
                isMobile
                  ? 'grid-cols-1'
                  : isTablet
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
              }`}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md"
                >
                  <div className="text-3xl font-bold mb-2">Card {i}</div>
                  <p className="text-sm opacity-90">
                    This grid adapts based on your viewport size using
                    useMediaQuery
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* System Preferences */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              System Preferences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <div className="text-2xl mb-2">{isDarkMode ? '🌙' : '☀'}</div>
                <div className="font-medium">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  prefers-color-scheme: {isDarkMode ? 'dark' : 'light'}
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  prefersReducedMotion
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-green-50 border-green-300 text-green-800'
                }`}
              >
                <div className="text-2xl mb-2">
                  {prefersReducedMotion ? '🚫' : '✨'}
                </div>
                <div className="font-medium">
                  {prefersReducedMotion ? 'Reduced Motion' : 'Animations On'}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  prefers-reduced-motion:{' '}
                  {prefersReducedMotion ? 'reduce' : 'no-preference'}
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  isPortrait
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                    : 'bg-teal-50 border-teal-300 text-teal-800'
                }`}
              >
                <div className="text-2xl mb-2">{isPortrait ? '📱' : '🖥'}</div>
                <div className="font-medium">
                  {isPortrait ? 'Portrait' : 'Landscape'}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  orientation: {isPortrait ? 'portrait' : 'landscape'}
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Value Demo */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Current Container Padding:
            </h3>
            <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm">
              {containerPadding}
            </code>
            <p className="text-sm text-gray-600 mt-2">
              This value changes based on viewport:{' '}
              <strong>DEFAULT (p-4)</strong> → <strong>sm (p-6)</strong> →{' '}
              <strong>lg (p-8)</strong> → <strong>xl (p-12)</strong>
            </p>
          </div>
        </section>

        {/* Worker Demo Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ⚡ Legit Sync vs Worker Comparison
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* √ True Sync Blocking */}
            <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-800 mb-3">
                🚫 Synchronous (Blocks UI)
              </h4>
              <p className="text-sm text-red-700 mb-4">
                Heavy computation runs on the main thread.
              </p>

              <button
                disabled={isComparing}
                onClick={() => {
                  setIsComparing(true);
                  const { result, time } = heavyCompute(500000);
                  setSyncResult(result);
                  setSyncTime(time);
                  setIsComparing(false);
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-red-300"
              >
                {isComparing ? 'Working...' : 'Run Sync'}
              </button>

              {syncResult !== null && (
                <div className="mt-3 text-sm">
                  <div className="font-semibold text-red-800">
                    Result: {syncResult.toFixed(2)}
                  </div>
                  <div className="text-red-600">
                    Time: {syncTime}ms (UI was blocked)
                  </div>
                </div>
              )}
            </div>

            {/* √ Worker Non-Blocking */}
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-3">
                ✅ Worker (Non-blocking)
              </h4>
              <p className="text-sm text-green-700 mb-4">
                Runs in background via Web Worker.
              </p>

              <button
                disabled={isComparing}
                onClick={() => {
                  execute(500000);
                }}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-green-300"
              >
                {isLoading ? 'Working...' : 'Run Worker'}
              </button>

              {data?.result !== null && (
                <div className="mt-3 text-sm">
                  <div className="font-semibold text-green-800">
                    Result: {data?.result.toFixed(2)}
                  </div>
                  <div className="text-green-600">
                    Time: {data?.time}ms (UI stayed responsive)
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <ResponsiveIndicator />
    </div>
  );
}

export default App;
