import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

// Environment-specific configurations
import jestConfig from './eslint.jest.config.mjs';
import storybookConfig from './eslint.storybook.config.mjs';
import cypressConfig from './eslint.cypress.config.mjs';
import markdownConfig from './eslint.markdown.config.mjs';
import yamlConfig from './eslint.yaml.config.mjs';

export default defineConfig(
  // Global ignores
  {
    ignores: [
      '**/public/',
      '**/app/organ/*.y*ml',
      '**/app/templates/**/*.html',
      '**/app/static/js/maintenance/*.html',
      '**/__tests/fixtures/*.json',
      '**/*.fixture.json',
      '**/*.test.json',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.bundle.js',
      '@storybook/types/dist',
      '**/storybook-static/**',
      '**/__tests__/**/*.fixture.*',
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,
  
  // Shared configuration for all JS/JSX/TS/TSX files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier,
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
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-filename-extension': 'off',
      'react/sort-comp': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',
      'react/forbid-prop-types': 'off',
      'react/jsx-key': 'error',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-bind': 'off',

      // Import rules
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'error',

      // A11y rules
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['Switch'],
        },
      ],

      // General rules
      camelcase: 'off',
      'no-underscore-dangle': [
        'error',
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
      'no-param-reassign': [
        'error',
        {
          ignorePropertyModificationsFor: ['state'],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/material',
              message:
                'Please import directly from @mui/material/[Component], e.g. `import Box from "@mui/material/Box"` to avoid tree-shaking issues.',
            },
          ],
          patterns: ['@mui/material/*/*'],
        },
      ],

      // Prettier
      'prettier/prettier': 'error',
    },
  },

  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // TypeScript-specific rules
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Build utilities configuration
  {
    files: ['**/build-utils/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
  // Environment-specific configurations
  ...jestConfig,
  ...storybookConfig,
  ...cypressConfig,
  ...markdownConfig,
  ...yamlConfig,
);