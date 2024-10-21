// describe("Home page", () => {
//   context("macbook-size", () => {
//     beforeEach(() => {
//       cy.viewport("macbook-15");
//       cy.visit("/");
//       });
//     it("loads", () => {
//       cy.url().should("include", "/");
//     });
//     it("has a title at the top", () => {
//       cy.findByTestId("home-page-title").contains("Human BioMolecular Atlas Program Data Portal");
//     });
//   })
// });

describe("Landing pages all load", () => {
  const pages = [
    { url: "/biomarkers", testId: "biomarkers-title", name: "Biomarkers" },
    { url: "/collections", testId: "collections-title", name: "Collections" },
    { url: "/search?entity_type[0]=Dataset", testId: "entity-header", name: "Datasets" },
    { url: "/dev-search", testId: "dev-search-title", name: "Dev Search" },
    { url: "/diversity", testId: "diversity-title", name: "Donor Diversity" },
    { url: "/search?entity_type[0]=Donor", testId: "entity-header", name: "Donors" },
    { url: "/", testId: "home-page-title", name: "Home" },
    { url: "/my-lists", testId: "my-lists-title", name: "My Lists" },
    { url: "/workspaces", testId: "my-workspaces-title", name: "My Workspaces" },
    { url: "/cells", testId: "molecular-data-queries-title", name: "Molecular Data Queries" },
    { url: "/organ", testId: "organs-title", name: "Organs" },
    { url: "/profile", testId: "login-alert", name: "Profile" },
    { url: "/publications", testId: "publications-title", name: "Publications" },
    { url: "/search?entity_type[0]=Sample", testId: "entity-header", name: "Samples" },
    { url: "/services", testId: "services-title", name: "Services" },
    { url: "/templates", testId: "templates-title", name: "Templates" },
    { url: "/tutorials", testId: "tutorials-title", name: "Tutorials" },
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
