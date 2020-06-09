// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml');

module.exports = {
  process(src) {
    const jsonObj = yaml.safeLoad(src, { json: true });
    return `module.exports = ${JSON.stringify(jsonObj)};`;
  },
};
