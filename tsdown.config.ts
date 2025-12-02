import { defineConfig } from 'tsdown';

export default defineConfig({
  platform: 'neutral',
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  exports: true,
  skipNodeModulesBundle: true,
  entry: [
    './src/index.ts',
    './src/hooks/index.tsx',
    './src/components/index.tsx',
  ],
});
