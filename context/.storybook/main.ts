import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { resolve } from 'node:path';
import svgr from 'vite-plugin-svgr';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')) as { version: string };

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../app/static/js/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  staticDirs: ['../app/static/assets', '../app/static/storybook-public'],
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: {
          js: resolve(__dirname, '../app/static/js'),
          assets: resolve(__dirname, '../app/static/assets'),
          'shared-styles': resolve(__dirname, '../app/static/js/shared-styles'),
          package: resolve(__dirname, '../package.json'),
          '@mui/styled-engine': '@mui/styled-engine-sc',
        },
        dedupe: ['react', 'react-dom', '@mui/material', 'styled-components'],
      },
      define: {
        CDN_URL: JSON.stringify('https://d3evp8qu4tjncp.cloudfront.net'),
        PACKAGE_VERSION: JSON.stringify(pkg.version),
      },
      plugins: [svgr({ svgrOptions: { exportType: 'default' }, include: '**/*.svg' })],
    }),
  typescript: {
    check: true,
    reactDocgen: 'react-docgen',
  },
};

export default config;
