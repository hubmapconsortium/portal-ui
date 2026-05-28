import { defineConfig, mergeConfig } from 'vitest/config';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from './vite.config.mts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Vitest config that inherits aliases, define, dedupe, and React/svgr/swc
// plugins from vite.config.mts. The Vite build/dev specific bits (the
// custom manifest emitter, the proxy, the maintenance entry) are no-ops
// in test runs and are safe to inherit.
export default mergeConfig(
  viteConfig({ command: 'serve', mode: 'test' }),
  defineConfig({
    resolve: {
      alias: {
        'test-utils': resolve(__dirname, 'test-utils'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test-utils/setupTests.ts'],
      // Eases reading legacy Jest stack traces.
      include: ['app/static/js/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['**/node_modules/**', '**/cypress/**', '**/end-to-end/**'],
      // The MSW + jsdom + node-fetch interaction breaks if MSW gets the
      // ``browser`` export condition; force the node entry by inlining MSW.
      server: {
        deps: {
          inline: ['msw', '@open-draft/deferred-promise', 'rettime', 'vitessce', /^@vitessce\//],
        },
      },
    },
  }),
);
