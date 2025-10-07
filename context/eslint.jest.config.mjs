import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

export default [
  {
    files: [
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__mocks__/**/*.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      'test-utils/**/*.{js,jsx,ts,tsx}',
    ],
    plugins: {
      jest,
      'jest-dom': jestDom,
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        jest: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        jest: {
          jestConfigFile: './jest.config.js',
        },
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...jestDom.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,

      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      'jest/no-standalone-expect': [
        'error',
        {
          additionalTestBlockFunctions: ['test.each'],
        },
      ],
      'jest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect*'],
        },
      ],
    },
  },
];