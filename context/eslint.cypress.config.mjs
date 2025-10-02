import cypress from 'eslint-plugin-cypress';

export default [
  {
    files: ['**/end-to-end/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,

      'import/no-extraneous-dependencies': 'off',
    },
  },
];