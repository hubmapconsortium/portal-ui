module.exports = {
  testPathIgnorePatterns: ['jest.config.js', '/node_modules/', '/cypress/'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test-utils/__mocks__/file.js',
    '^.+\\.css$': '<rootDir>/test-utils/__mocks__/style.js',
    '^components(.*)$': '<rootDir>/app/static/js/components$1',
    '^static(.*)$': '<rootDir>/app/static/$1',
    '^test-utils(.*)$': '<rootDir>/test-utils$1',
    '^helpers(.*)$': '<rootDir>/app/static/js/helpers/$1',
    '^hooks(.*)$': '<rootDir>/app/static/js/hooks/$1',
    '^shared-styles(.*)$': '<rootDir>/app/static/js/shared-styles/$1',
    '^theme$': '<rootDir>/app/static/js/theme.jsx',
    'metadata-field-descriptions$': '<rootDir>/ingest-validation-tools/docs/field-descriptions.yaml',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.ya?ml$': '<rootDir>/test-utils/loaders/ymlLoader.js',
  },
};
