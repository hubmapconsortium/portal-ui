describe("Tutorials Landing Page", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.visit("/tutorials");
    });

    it("has a title and description", () => {
      cy.findByTestId("tutorials-title").should("be.visible").and("contain", "Tutorials");
      cy.contains("Step-by-step guides to HuBMAP features and workflows.");
    });

    it("has a search bar", () => {
      cy.get('input[placeholder="Search tutorials by title or keyword."]')
        .should("be.visible")
        .and("have.attr", "type", "text");
    });

    it("has filter chips for categories", () => {
      cy.contains("Filter by Category").should("be.visible");

      // Check that all tutorial categories are present as filter chips
      const categories = ["Biomarker and Cell Type Search", "Data", "Visualization", "Workspaces"];

      categories.forEach((category) => {
        cy.contains(category).should("be.visible");
      });
    });

    it("filters tutorials by search", () => {
      cy.get('input[placeholder="Search tutorials by title or keyword."]').type("workspace");
      cy.contains("Navigating Workspaces").should("be.visible");
      cy.contains("Getting Started with HuBMAP Data").should("not.exist");
    });

    it("has a table of contents with tutorial category sections", () => {
      cy.findByTestId("table-of-contents").should("be.visible");

      // Check for main category sections in TOC
      cy.findByTestId("table-of-contents").within(() => {
        cy.contains("Featured Tutorials").should("exist");
        cy.contains("Data").should("exist");
        cy.contains("Biomarker and Cell Type Search").should("exist");
        cy.contains("Visualization").should("exist");
        cy.contains("Workspaces").should("exist");
      });
    });

    it("navigates to a tutorial detail page from 'View Tutorial'", () => {
      cy.contains("a", "View Tutorial").first().click();
      cy.location("pathname").should("match", /^\/tutorials\/.+/);
      cy.findByTestId("tutorial-title").should("be.visible");
    });
  });
});
