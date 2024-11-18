describe("portal-ui", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });
    it("has nice 404", () => {
      // Homepage
      cy.visit("/no-such-page", { failOnStatusCode: false });
      cy.contains("Page Not Found");
      cy.contains("If this page should exist, submit a bug report.");
    });

    it("handles click-through", () => {
      // Homepage
      cy.visit("/");
      cy.contains("Human BioMolecular Atlas Program Data Portal");

      cy.contains("Data");
      cy.contains("Resources");

      // Static pages are tested separately.

      cy.findByTestId(`${encodeURI("Your Profile")}-dropdown`).click();

      // login
      // Don't click! We shouldn't depend on Globus in tests.
      cy.findByTestId("auth-button").contains("Log In");

      // TODO: groups_token is now required for search results, so we can pass it
      // back to the client to make the Elasticsearch request. I don't want to go
      // too far into mocking server state, since it would be tricky,
      // and much of this may be moving to the client, in any case.
      // // Donors browse
      // cy.contains('Donors').click();
      // cy.contains('Browse donor')
      //
      // // Donors details
      // cy.contains('TODO: name').click();
      // cy.contains('Warning!');
      // cy.contains('Mock Entity');
      // // Provenance
      // cy.contains('undefined - Input');
      // // Vitessce
      // cy.contains('Scatterplot (UMAP)')
      // cy.contains('1 cells');
      //
      // // Samples browse
      // cy.contains('Samples').click();
      // cy.contains('Browse sample');
      //
      // // Sample details
      // cy.contains('TODO: name').click();
      // cy.contains('Warning!');
      // cy.contains('Mock Entity');
    });

    it("has working preview pages", () => {
      cy.visit("/");
      cy.contains("Resources").click();
      cy.contains("Cell Type Annotations").click();
      cy.contains("HuBMAP Data Portal Previews demonstrate functionality");
      cy.contains("Rahul Satija");
      // Vitessce loads, pulling data from the network.
      // Are incidental network requests ok, as long as tests don't depend on them?
    });
    it("has links to docs pages", () => {
      cy.visit("/");
      cy.contains("Resources").click();
      cy.contains("FAQ");
      cy.contains("About");
      cy.contains("Technical");
    });
  });
});
