/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/__e2e__/**'],
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    isolate: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/__tests__/**',
        '**/__e2e__/**',
        '**/test-setup.ts',
        '**/main.ts',
        '**/env.d.ts',
        '**/routes.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
      ],
    },
  },
});
