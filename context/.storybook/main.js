const path = require("path")

module.exports = {
  "stories": [
    '../app/static/js/shared-styles/**/*.stories.js'
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "webpackFinal": async (config) => {
    config.resolve.alias['js'] = path.resolve(__dirname, '../app/static/js/')
    return config
  }
}