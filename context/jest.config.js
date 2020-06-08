module.exports = {
  testPathIgnorePatterns: ['jest.config.js', '/node_modules/', '/cypress/'],
  setupFilesAfterEnv: ['./test-utils/setuptests.js'],
  moduleNameMapper: {
    '\\.css$': require.resolve('./test-utils/style-mock'),
    '^components(.*)$': '<rootDir>/app/static/js/components$1',
    '^static(.*)$': '<rootDir>/app/static/$1',
    '^test-utils': '<rootDir>/test-utils/test-utils.js',
  },
};
