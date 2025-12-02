import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    exports: true,
    platform: 'neutral',
    skipNodeModulesBundle: true,
  },
  {
    entry: ['./src/hooks', './src/components'],
    format: ['esm'],
    minify: true,
    platform: 'browser',
    treeshake: true,
  },
]);
