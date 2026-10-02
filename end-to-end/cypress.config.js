const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  // Cypress.env() is deprecated; read env with cy.env().
  allowCypressEnv: false,
  // Absorbs upstream test-env slowness; real errors are gated in support/e2e.js.
  retries: { runMode: 2, openMode: 0 },
  // Test-env APIs are slow. Queries retry until this, so it only costs time on real failures.
  defaultCommandTimeout: 20000,
  // Flask's upstream calls have no timeout; gunicorn gives up at 120s.
  pageLoadTimeout: 120000,
  responseTimeout: 60000,
  // macbook-15. The table of contents only renders at >= 1440px.
  viewportWidth: 1440,
  viewportHeight: 900,
  e2e: {
    baseUrl: "http://localhost:5001",
  },
});
