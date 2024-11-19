/******************************************************************************************
 * 
 *  Tests whether all page types load successfully.
 * 
 *  Description:
 *  ----------------------------------------------------------------------------
 *  Checks that the title element of each page type is visible. Navigates to an example of
 *  each detail page by clicking on the first available option from the list/table.
 * 
 ******************************************************************************************/

describe("Landing pages all load", () => {
  const pages = [
    { name: "Biomarkers", url: "/biomarkers", testId: "biomarkers-title" },
    { name: "Collections", url: "/collections", testId: "collections-title" },
    { name: "Datasets", url: "/search/datasets", testId: "search-header" },
    { name: "Dev Search", url: "/dev-search", testId: "dev-search-title" },
    { name: "Donor Diversity", url: "/diversity", testId: "diversity-title" },
    { name: "Donors", url: "/search/donors", testId: "search-header" },
    { name: "Home", url: "/", testId: "home-page-title" },
    { name: "My Lists", url: "/my-lists", testId: "my-lists-title" },
    { name: "My Workspaces", url: "/workspaces", testId: "my-workspaces-title" },
    { name: "Molecular Data Queries", url: "/cells", testId: "molecular-data-queries-title" },
    { name: "Organs", url: "/organ", testId: "organs-title" },
    { name: "Profile", url: "/profile", testId: "login-alert" },
    { name: "Publications", url: "/publications", testId: "publications-title" },
    { name: "Samples", url: "/search/samples", testId: "search-header" },
    { name: "Services", url: "/services", testId: "services-title" },
    { name: "Templates", url: "/templates", testId: "templates-title" },
    { name: "Tutorials", url: "/tutorials", testId: "tutorials-title" },
  ];  

  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });

    pages.forEach((page) => {
      it(`loads ${page.name} page`, () => {
        cy.visit(page.url);
        cy.findByTestId(page.testId).should("exist").and("be.visible");
      });
    });
  });
});

describe("Entity detail page all load", () => {
  const pages = [
    { name: "Collection", url: "/collections", testId: "panel-title" },
    { name: "Dataset", url: "/search/datasets", testId: "hubmap-id-link" },
    { name: "Donor", url: "/search/donors", testId: "hubmap-id-link" },
    { name: "Organ", url: "/organ", testId: "organ-tile" },
    { name: "Publication", url: "/publications", testId: "panel-title" },
    { name: "Sample", url: "/search/samples", testId: "hubmap-id-link" },
  ];  

  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });

    pages.forEach((page) => {
      it(`loads a ${page.name} detail page`, () => {
        cy.visit(page.url);
        cy.findAllByTestId(page.testId).first().click();
        cy.findByTestId("entity-title").should("exist").and("be.visible");
      });
    });
  });
});

describe("Other detail pages all load", () => {
  const pages = [
    { name: "Tutorial", url: "/tutorials", testId: "tutorial-card", titleTestId: "tutorial-title" },
    { name: "Template", url: "/templates", testId: "template-card", titleTestId: "entity-title" },
  ];  

  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });

    pages.forEach((page) => {
      it(`loads a ${page.name} page`, () => {
        cy.visit(page.url);
        cy.findAllByTestId(page.testId).first().click();
        cy.findByTestId(page.titleTestId).should("exist").and("be.visible");
      });
    });
  });
});
