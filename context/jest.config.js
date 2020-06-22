module.exports = {
  testPathIgnorePatterns: ['jest.config.js', '/node_modules/', '/cypress/'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/test-utils/__mocks__/style.js',
    '^components(.*)$': '<rootDir>/app/static/js/components$1',
    '^static(.*)$': '<rootDir>/app/static/$1',
    '^test-utils(.*)$': '<rootDir>/test-utils$1',
    'metadata-field-descriptions$': '<rootDir>/ingest-validation-tools/docs/field-descriptions.yaml',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.ya?ml$': '<rootDir>/test-utils/loaders/ymlLoader.js',
  },
};
