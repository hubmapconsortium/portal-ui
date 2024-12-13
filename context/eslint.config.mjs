/* eslint-disable import/no-extraneous-dependencies */
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import cypress from 'eslint-plugin-cypress';
import json from 'eslint-plugin-json';
import markdown from 'eslint-plugin-markdown';
import parser from 'yaml-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/public/',
      '**/app/organ/*.y*ml',
      '**/app/templates/**/*.html',
      '**/app/static/js/maintenance/*.html',
      '**/__tests/fixtures/*.json',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'airbnb',
      'airbnb/hooks',
      'prettier',
      'plugin:prettier/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
    ),
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      '@typescript-eslint': typescriptEslint,
      import: fixupPluginRules(_import),
      prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        CDN_URL: 'readonly',
        PACKAGE_VERSION: 'readonly',
        flaskData: 'readonly',
        groupsToken: 'readonly',
        isAuthenticated: 'readonly',
        userEmail: 'readonly',
        workspacesToken: 'readonly',
        userGroups: 'readonly',
        sentryEnv: 'readonly',
      },

      parser: tsParser,
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        webpack: {
          config: './build-utils/webpack.common.js',
        },
      },
    },

    rules: {
      camelcase: [0],

      'no-underscore-dangle': [
        2,
        {
          allow: ['_id', '_source'],
        },
      ],

      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      'react/jsx-filename-extension': [0],
      'import/extensions': [0],
      'react/sort-comp': [0],
      'react/jsx-one-expression-per-line': [0],
      'react/prop-types': [0],
      'react/forbid-prop-types': [0],
      'react/jsx-key': [2],

      'no-param-reassign': [
        2,
        {
          ignorePropertyModificationsFor: ['state'],
        },
      ],

      'react/require-default-props': [0],
      'import/prefer-default-export': [0],
      'react/jsx-props-no-spreading': [0],

      'jsx-a11y/label-has-associated-control': [
        2,
        {
          controlComponents: ['Switch'],
        },
      ],

      'react/jsx-no-bind': [0],

      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  ...compat
    .extends('plugin:@typescript-eslint/recommended-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked')
    .map((config) => ({
      ...config,
      files: ['**/**.{ts,tsx}'],
    })),
  {
    files: ['**/**.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'no-shadow': [0],
      '@typescript-eslint/no-shadow': ['error'],
    },
  },
  ...compat
    .extends('plugin:jest/recommended', 'plugin:jest-dom/recommended', 'plugin:testing-library/react')
    .map((config) => ({
      ...config,

      files: ['**/*.spec.{js,jsx,ts,tsx}', '**/__mocks__/**/*.{js,jsx,ts,tsx}', 'test-utils/**/*.{js,jsx,ts,tsx}'],
    })),
  {
    files: ['**/*.spec.{js,jsx,ts,tsx}', '**/__mocks__/**/*.{js,jsx,ts,tsx}', 'test-utils/**/*.{js,jsx,ts,tsx}'],

    plugins: {
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        ...jest.environments.globals.globals,
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
      'import/no-extraneous-dependencies': [0],
      '@typescript-eslint/no-var-requires': [0],

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

      '@typescript-eslint/no-empty-function': [0],
    },
  },
  ...compat.extends('plugin:storybook/recommended').map((config) => ({
    ...config,
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
  })),
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    rules: {
      'import/no-extraneous-dependencies': [0],
      '@typescript-eslint/no-empty-function': [0],
      'storybook/no-redundant-story-name': [0],
      '@typescript-eslint/no-unused-vars': [0],
    },
  },
  ...compat.extends('plugin:cypress/recommended').map((config) => ({
    ...config,
    files: ['**/end-to-end/**/*.{js,jsx,ts,tsx}'],
  })),
  {
    files: ['**/end-to-end/**/*.{js,jsx,ts,tsx}'],

    plugins: {
      cypress,
    },

    languageOptions: {
      globals: {
        ...cypress.environments.globals.globals,
      },
    },

    rules: {
      'import/no-extraneous-dependencies': [0],
    },
  },
  {
    files: ['**/build-utils/*.js'],

    rules: {
      '@typescript-eslint/no-var-requires': [0],
      'import/no-extraneous-dependencies': [0],
    },
  },
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      globals: {
        test: 'readonly',
      },
    },

    rules: {
      'import/no-extraneous-dependencies': [0],
      '@typescript-eslint/no-empty-function': [0],
      '@typescript-eslint/no-unsafe-return': [0],
    },
  },
  {
    files: ['**/*.json'],
    plugins: {
      json,
    },
    rules: {
      'no-unused-expressions': [0],
    },
  },
  ...compat.extends('plugin:markdown/recommended-legacy').map((config) => ({
    ...config,
    files: ['**/*.md'],
  })),
  {
    files: ['**/*.md'],

    plugins: {
      markdown,
      prettier: fixupPluginRules(prettier),
    },

    rules: {
      'no-console': [0],
      'import/no-unresolved': [0],
      'import/no-extraneous-dependencies': [0],
    },

    processor: 'markdown/markdown',
  },
  ...compat.extends('plugin:yml/standard', 'plugin:yml/prettier', 'prettier').map((config) => ({
    ...config,
    files: ['**/*.{yml,yaml}'],
  })),
  {
    files: ['**/*.{yml,yaml}'],

    languageOptions: {
      parser,
    },
  },
];
