// Endpoints the portal should be configured with, per API_ENV (set by etc/test/test-cypress.sh).
// The prod list is the one the release QA checklist verifies on portal-prod.test.
const expectedEndpoints = {
  prod: {
    assets: "https://assets.hubmapconsortium.org",
    "entity-api": "https://entity.api.hubmapconsortium.org",
    gateway: "https://gateway.api.hubmapconsortium.org",
    "search-api": "https://search.api.hubmapconsortium.org/v3/portal/search",
    "workspaces-api": "https://workspaces.api.hubmapconsortium.org",
    "ontology-api": "https://ontology.api.hubmapconsortium.org",
  },
  test: {
    assets: "https://assets.test.hubmapconsortium.org",
    "entity-api": "https://entity-api.test.hubmapconsortium.org",
    gateway: "https://gateway.api.hubmapconsortium.org",
    "search-api": "https://search-api.test.hubmapconsortium.org/v3/portal/search",
    "ontology-api": "https://ontology.api.hubmapconsortium.org",
  },
};

describe("Services page", () => {
  it("lists the endpoints for API_ENV", () => {
    cy.visit("/services");
    cy.findByTestId("services-title").should("be.visible");
    cy.env(["API_ENV"]).then(({ API_ENV = "test" }) => {
      Object.entries(expectedEndpoints[API_ENV]).forEach(([service, endpoint]) => {
        cy.contains("tbody tr", new RegExp(`^${service}`))
          .find("td")
          .eq(2)
          .should("have.text", endpoint);
      });
    });
    ["ingest-api", "uuid-api"].forEach((service) => cy.contains("tbody tr", new RegExp(`^${service}`)).should("exist"));
  });
});
