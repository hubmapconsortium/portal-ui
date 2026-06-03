import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as { version: string };

// Standalone maintenance page. Unlike the main bundle, this one is a real
// SPA: Vite owns the HTML, JS, and assets, and the resulting build is
// served directly (e.g., via python -m http.server in the Cypress
// maintenance tests, or as a static page during real maintenance).
export default defineConfig({
  root: resolve(__dirname, 'app/static/js/maintenance'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'app/static/js/maintenance/public'),
    emptyOutDir: true,
    sourcemap: 'hidden',
    rollupOptions: {
      input: resolve(__dirname, 'app/static/js/maintenance/index.html'),
    },
  },
  define: {
    CDN_URL: JSON.stringify('https://d3evp8qu4tjncp.cloudfront.net'),
    PACKAGE_VERSION: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      js: resolve(__dirname, 'app/static/js'),
      assets: resolve(__dirname, 'app/static/assets'),
      'shared-styles': resolve(__dirname, 'app/static/js/shared-styles'),
      package: resolve(__dirname, 'package.json'),
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
    dedupe: ['react', 'react-dom', '@mui/material', 'styled-components'],
  },
  plugins: [
    react({
      plugins: [['@swc/plugin-styled-components', { displayName: true, ssr: false }]],
    }),
    svgr({
      svgrOptions: { exportType: 'default' },
      include: '**/*.svg',
    }),
  ],
  server: {
    port: 5002,
    strictPort: true,
  },
});
