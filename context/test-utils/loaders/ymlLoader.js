// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml');

module.exports = {
  process(src) {
    const jsonObj = yaml.load(src, { json: true });
    return `module.exports = ${JSON.stringify(jsonObj)};`;
  },
};
