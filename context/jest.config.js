// Shared config for Jest with SWC and Styled Components plugin
const experimental = {
  plugins: [
    [
      '@swc/plugin-styled-components',
      {
        displayName: true,
        ssr: false,
      },
    ],
  ],
};

/** @type {import('jest').Config} */
const config = {
  globals: {
    CDN_URL: 'https://cdn_url.example.com/',
  },
  restoreMocks: true,
  testPathIgnorePatterns: ['jest.config.js', '/cypress/'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'mts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test-utils/__mocks__/file.js',
    '^.+\\.(css|scss)$': '<rootDir>/test-utils/__mocks__/style.js',
    '^js/(.*)$': '<rootDir>/app/static/js/$1',
    '^assets/(.*)$': '<rootDir>/app/static/assets/$1',
    '^test-utils/(.*)$': '<rootDir>/test-utils/$1',
    '@mui/styled-engine': '@mui/styled-engine-sc',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es|@mui/material|@mui/system|@mui/styled-engine-sc|@babel|pretty-bytes|uuid|chart-js|history|pdfjs-dist|until-async)/)',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
          },
          experimental,
        },
      },
    ],
    '^.+\\.(mjs|mts)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: false,
          },
          experimental,
        },
      },
    ],
  },
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: {
    // fix for `Cannot find module 'msw/node'`
    customExportConditions: [''],
  },
};

module.exports = config;
