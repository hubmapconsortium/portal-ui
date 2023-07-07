module.exports = {
  restoreMocks: true,
  testPathIgnorePatterns: ['jest.config.js', '/node_modules/', '/cypress/'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test-utils/__mocks__/file.js',
    '^.+\\.(css|scss)$': '<rootDir>/test-utils/__mocks__/style.js',
    '^js/(.*)$': '<rootDir>/app/static/js/$1',
    '^test-utils/(.*)$': '<rootDir>/test-utils/$1',
    'metadata-field-descriptions$': '<rootDir>/ingest-validation-tools/docs/field-descriptions.yaml',
    'metadata-field-types$': '<rootDir>/ingest-validation-tools/docs/field-types.yaml',
    'metadata-field-entities$': '<rootDir>/ingest-validation-tools/docs/field-entities.yaml',
  },
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
    '^.+\\.ya?ml$': '<rootDir>/test-utils/loaders/ymlLoader.js',
  },
};
