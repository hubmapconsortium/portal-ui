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

  webpackFinal: async (config) => {
    // exclude svgs from the default file loader
    config.module?.rules?.forEach((rule) => {
      if (
        // Typescript really wants us to make sure rule is an object
        typeof rule === 'object' &&
        rule != null &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        // Here's the actual check
        rule.test.test('.svg')
      ) {
        rule.exclude = /\.svg$/;
      }
    });

    // add aliases and svgr loader
    return merge(config, {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: [
              {
                loader: '@svgr/webpack',
              },
            ],
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
