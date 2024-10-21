describe("Detail page types all load", () => {
  const pages = [
    { name: "Collection", url: "/collections", testId: "panel-title" },
    { name: "Dataset", url: "/search?entity_type[0]=Dataset", testId: "hubmap-id-link" },
    { name: "Donor", url: "/search?entity_type[0]=Donor", testId: "hubmap-id-link" },
    { name: "Organ", url: "/organ", testId: "organ-tile" },
    { name: "Publication", url: "/publications", testId: "panel-title" },
    { name: "Sample", url: "/search?entity_type[0]=Sample", testId: "hubmap-id-link" },
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


describe("Landing pages all load", () => {
  const pages = [
    { name: "Biomarkers", url: "/biomarkers", testId: "biomarkers-title" },
    { name: "Collections", url: "/collections", testId: "collections-title" },
    { name: "Datasets", url: "/search?entity_type[0]=Dataset", testId: "search-header" },
    { name: "Dev Search", url: "/dev-search", testId: "dev-search-title" },
    { name: "Donor Diversity", url: "/diversity", testId: "diversity-title" },
    { name: "Donors", url: "/search?entity_type[0]=Donor", testId: "search-header" },
    { name: "Home", url: "/", testId: "home-page-title" },
    { name: "My Lists", url: "/my-lists", testId: "my-lists-title" },
    { name: "My Workspaces", url: "/workspaces", testId: "my-workspaces-title" },
    { name: "Molecular Data Queries", url: "/cells", testId: "molecular-data-queries-title" },
    { name: "Organs", url: "/organ", testId: "organs-title" },
    { name: "Profile", url: "/profile", testId: "login-alert" },
    { name: "Publications", url: "/publications", testId: "publications-title" },
    { name: "Samples", url: "/search?entity_type[0]=Sample", testId: "search-header" },
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
