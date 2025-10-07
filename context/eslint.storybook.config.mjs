import storybook from 'eslint-plugin-storybook';

export default [
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,

      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'storybook/no-redundant-story-name': 'off',
    },
  },
];