import "@testing-library/cypress/add-commands";

// Upstream API flakiness is absorbed by retries; a 5xx page from the portal itself is a bug.
// Match on Accept, not resourceType: link-click navigations report resourceType "other".
beforeEach(() => {
  cy.intercept({ url: `${Cypress.config("baseUrl")}/**`, headers: { accept: /^text\/html/ } }, (req) =>
    req.continue((res) => {
      if (res.statusCode >= 500) {
        throw new Error(`Portal returned ${res.statusCode} for ${req.url}`);
      }
    }),
  );
});

// React 19 error boundaries swallow render errors, so uncaught:exception never sees them.
// Rethrow from the page as soon as any error UI renders; Cypress then fails the test.
// Tests that expect error UI opt out with cy.on("uncaught:exception", ...).
const errorUI = "[data-testid=error-boundary], [data-testid=visualization-error], [data-testid=prov-graph-error]";

Cypress.on("window:before:load", (win) => {
  const observer = new win.MutationObserver(() => {
    const el = win.document.querySelector(errorUI);
    if (el) {
      observer.disconnect();
      throw new Error(`Error UI rendered (${el.dataset.testid}): ${el.textContent.slice(0, 500)}`);
    }
  });
  observer.observe(win.document, { childList: true, subtree: true });
});
