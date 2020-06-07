module.exports = {
  testPathIgnorePatterns: ['jest.config.js', '/node_modules/', '/cypress/'],
  setupFilesAfterEnv: ['./setuptests.js'],
  moduleNameMapper: {
    '^components(.*)$': '<rootDir>/app/static/js/components$1',
    '^static(.*)$': '<rootDir>/app/static/$1',
    '^test-utils.js': '<rootDir>/test-utils.js',
  },
};
