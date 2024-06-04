module.exports = {
  restoreMocks: true,
  testPathIgnorePatterns: ['jest.config.js', '/cypress/'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test-utils/__mocks__/file.js',
    '^.+\\.(css|scss)$': '<rootDir>/test-utils/__mocks__/style.js',
    '^js/(.*)$': '<rootDir>/app/static/js/$1',
    '^test-utils/(.*)$': '<rootDir>/test-utils/$1',
    '@mui/styled-engine': '@mui/styled-engine-sc',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es|@mui/material|@mui/system|@mui/styled-engine-sc|@babel|pretty-bytes|uuid|chart-js)/)',
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
          experimental: {
            plugins: [
              [
                '@swc/plugin-styled-components',
                {
                  displayName: true,
                  ssr: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  testEnvironment: 'jsdom',
};
