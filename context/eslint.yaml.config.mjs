import yml from 'eslint-plugin-yml';
import yamlParser from 'yaml-eslint-parser';

export default [
  {
    files: ['**/*.{yml,yaml}'],
    plugins: {
      yml,
    },
    languageOptions: {
      parser: yamlParser,
    },
    rules: {
      ...yml.configs.standard.rules,
      ...yml.configs.prettier.rules,
    },
  },
];