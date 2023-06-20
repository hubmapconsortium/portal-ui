// This test was written against a existing publication in the dev/test env and will need to be updated if that publication is deleted

const publicationId = "cd03fa15322492f4173cdbdc30c74a62";
const title = "sdarfg";

describe("Publication page", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
      cy.visit(`/browse/publication/${publicationId}`);
    });
    it("has a title, abstract, manuscript link, citation, data types, organs, and publication date listed", () => {
      cy.findByTestId("entity-title").contains(title);
      cy.findByTestId("publication-abstract").should("exist");
      cy.findByTestId("publication-manuscript-link").should("exist");
      cy.findByTestId("publication-citation").should("exist");
      cy.findByTestId("publication-data-types").contains("CODEX");
      cy.findByTestId("publication-organs").contains("Lymph Node");
      cy.findByTestId("publication-date").contains("2023-02-27");
    });
    it("has a table of contents with links to the publication summary, data, files, authors, and provenance", () => {
      cy.findByTestId("table-of-contents")
        .should("contain", "Summary")
        .and("contain", "Data")
        .and("contain", "Files")
        .and("contain", "Authors")
        .and("contain", "Provenance");
    });
    it('has a "Data" section with tabs for tables of donors, samples, and datasets', () => {
      // Donors tab is active by default
      cy.findByTestId("donors-tab")
        .should("exist")
        .and("contain", "Donors")
        .and("contain", "(1)");
      cy.findAllByTestId("donor-row").should("have.length", 1);

      // Samples tab needs to be clicked to activate
      cy.findByTestId("samples-tab")
        .should("exist")
        .and("contain", "Samples")
        .and("contain", "(3)")
        .click();
      cy.wait(100);
      cy.findAllByTestId("sample-row").should("have.length", 3);

      // Datasets tab needs to be clicked to activate
      cy.findByTestId("datasets-tab")
        .should("exist")
        .and("contain", "Datasets")
        .and("contain", "(1)")
        .click();
      cy.wait(100);
      cy.findAllByTestId("dataset-row").should("have.length", 1);
    });

    it('has dynamic links to the search page that change when different tabs in the "Data" section are clicked', () => {
      describe("donors tab link", () => {
        cy.visit(`/browse/publication/${publicationId}`);
        cy.findByTestId("donors-tab")
          .should("exist")
          .and("have.attr", "aria-selected", "true");
        cy.findByTestId("view-related-data-button")
          .invoke("attr", "href")
          .then((href) =>
            cy.visit(href).then(() => {
              cy.title().should("include", "Donors");
            })
          );
      });
      describe("samples tab link", () => {
        cy.visit(`/browse/publication/${publicationId}`);
        cy.findByTestId("samples-tab")
          .should("exist")
          .and("have.attr", "aria-selected", "false")
          .click();
        cy.wait(100);
        cy.findByTestId("view-related-data-button")
          .invoke("attr", "href")
          .then((href) =>
            cy.visit(href).then(() => {
              cy.title().should("include", "Samples");
            })
          );
      });
      describe("datasets tab link", () => {
        cy.visit(`/browse/publication/${publicationId}`);
        cy.findByTestId("datasets-tab")
          .should("exist")
          .and("have.attr", "aria-selected", "false")
          .click();
        cy.wait(100);
        cy.findByTestId("view-related-data-button")
          .invoke("attr", "href")
          .then((href) =>
            cy.visit(href).then(() => {
              cy.title().should("include", "Datasets");
            })
          );
      });
    });

    it("has a visible Entity Header when the user scrolls down the page", () => {
      cy.findByTestId("entity-header").should("not.exist");
      cy.scrollTo("bottom");
      cy.findByTestId("entity-header")
        .should("be.visible")
        .and("contain", title);
    });
  });
});
