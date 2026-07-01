import markdown from '@eslint/markdown';

// `@eslint/markdown` is the official successor to `eslint-plugin-markdown`.
// Its recommended config registers the `markdown/markdown` processor so
// fenced code blocks inside `.md` files get linted with the matching JS/TS
// rules, but we suppress the usual import-resolver and console-noise rules
// that aren't meaningful for inline doc snippets.
export default [
  ...markdown.configs.recommended,
  {
    files: ['**/*.md'],
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
