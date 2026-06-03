import vitest from '@vitest/eslint-plugin';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';

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
      vitest,
      'jest-dom': jestDom,
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...jestDom.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,

      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      'vitest/no-standalone-expect': [
        'error',
        {
          additionalTestBlockFunctions: ['test.each'],
        },
      ],
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect*'],
        },
      ],
    },
  },
];
