describe("publications list page", () => {
  beforeEach(() => {
    cy.visit("/publications");
  });

  it("has a title and description", () => {
    cy.findByTestId("publications-title").findByText("Publications");
    cy.findByTestId("landing-page-description").contains("Browse peer-reviewed publications and preprints");
  });

  it("lists at least nine peer-reviewed publications, with links", () => {
    cy.findByTestId("publication-tab-Peer-Reviewed").should("have.attr", "aria-selected", "true");
    cy.findAllByTestId("panel-title")
      .should("have.length.at.least", 9)
      .first()
      .should("have.attr", "href")
      .and("match", /^\/browse\/publication\//);
  });

  it("has a preprint tab", () => {
    cy.findByTestId("publication-tab-Preprint").then(($tab) => {
      if ($tab.text().includes("(0)")) {
        cy.wrap($tab).should("be.disabled");
      } else {
        cy.wrap($tab).click().should("have.attr", "aria-selected", "true");
        cy.findAllByTestId("panel-title").should("have.length.at.least", 1);
      }
    });
  });
});
