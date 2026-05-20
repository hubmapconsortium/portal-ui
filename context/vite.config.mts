import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as { version: string };

// Emit a webpack-manifest-plugin-compatible manifest.json so Flask's
// flask_static_digest.py can keep mapping `main.js` -> the hashed asset name
// without changes. Vite's native manifest uses a nested object format, which
// would otherwise require backend changes.
function webpackStyleManifest(): Plugin {
  return {
    name: 'webpack-style-manifest',
    apply: 'build',
    writeBundle({ dir }, bundle) {
      const compat: Record<string, string> = {};
      const outDir = dir ?? '.';
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.isEntry && chunk.name) {
          compat[`${chunk.name}.js`] = `/static/public/${chunk.fileName}`;
        }
      }
      // Also expose the vendor chunk (created via manualChunks below).
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && !chunk.isEntry && chunk.name === 'vendors') {
          compat['vendors.js'] = `/static/public/${chunk.fileName}`;
        }
      }
      writeFileSync(resolve(outDir, 'manifest.json'), JSON.stringify(compat, null, 2));
    },
  };
}

export default defineConfig(({ command }) => ({
  base: '/static/public/',
  appType: 'custom',
  build: {
    outDir: resolve(__dirname, 'app/static/public'),
    emptyOutDir: true,
    sourcemap: 'hidden',
    manifest: false,
    rollupOptions: {
      input: { main: resolve(__dirname, 'app/static/js/index.tsx') },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks(id) {
          if (id.includes('/node_modules/')) return 'vendors';
        },
      },
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
      'txml/txml': 'txml/dist/txml',
    },
    dedupe: ['react', 'react-dom', '@mui/material', 'styled-components'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', 'styled-components'],
  },
  plugins: [
    react({
      plugins: [['@swc/plugin-styled-components', { displayName: true, ssr: false }]],
    }),
    svgr({
      svgrOptions: { exportType: 'default' },
      include: '**/*.svg',
    }),
    webpackStyleManifest(),
    viteCompression(),
    ...(command === 'build' && process.env.ANALYZE
      ? [visualizer({ filename: resolve(__dirname, 'app/static/public/report.html'), open: false })]
      : []),
  ],
  server: {
    port: 5001,
    strictPort: true,
    proxy: {
      '^(?!/static/public/).*': 'http://localhost:5000',
    },
  },
}));
