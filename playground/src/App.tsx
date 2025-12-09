import { useState } from 'react';
import { useWorker } from '../../src/hooks';

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
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
    </div>
  );
}

export default App;
