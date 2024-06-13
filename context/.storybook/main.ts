import type { StorybookConfig } from '@storybook/react-webpack5';
import { merge } from 'webpack-merge';
import { alias } from '../build-utils/alias';
import path from 'path';

const prodConfigPath = path.resolve(__dirname, '../build-utils/webpack.prod.js');

const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  stories: ['../app/static/js/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-swc',
    '@chromatic-com/storybook',
    '@storybook/addon-webpack5-compiler-swc',
  ],

  webpackFinal: async (config, { configType }) => {
    // merge aliases and svgr loader into the storybook webpack config
    return merge(config, {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
          },
        ],
      },
      resolve: {
        alias: alias,
      },
    });
  },

  typescript: {
    check: true,
    reactDocgen: 'react-docgen',
  },
};
export default config;
