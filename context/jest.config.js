module.exports = {
  testPathIgnorePatterns: ['jest.config.js', '/node_modules/', '/cypress/'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/test-utils/style-mock',
    '^components(.*)$': '<rootDir>/app/static/js/components$1',
    '^static(.*)$': '<rootDir>/app/static/$1',
    '^test-utils$': '<rootDir>/test-utils/test-utils.js',
    'search-schema-definitions$': '<rootDir>/search-schema/data/definitions.yaml',
    'metadata-field-descriptions$': '<rootDir>/ingest-validation-tools/docs/field-descriptions.yaml',
  },
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.ya?ml$': '<rootDir>/test-utils/ymlLoader.js',
  },
};
