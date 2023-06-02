describe("file-based-routes", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
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
