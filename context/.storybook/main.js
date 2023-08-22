const path = require('path');
const { alias } = require('../build-utils/alias');
module.exports = {
  stories: ['../app/static/js/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', 'storybook-addon-swc'],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      // extend alias with our own
      ...config.resolve?.alias,
      ...alias,
    };
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    return config;
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
