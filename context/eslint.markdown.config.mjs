import markdown from 'eslint-plugin-markdown';

export default [
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    processor: 'markdown/markdown',
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
];