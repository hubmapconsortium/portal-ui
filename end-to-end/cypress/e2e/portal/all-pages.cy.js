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

describe("Pages all load", () => {
  const pages = [
    { url: "/", testId: "home-page-title", name: "Home" },
    { url: "/search?entity_type[0]=Dataset", testId: "entity-header", name: "Datasets" },
    { url: "/cells", testId: "molecular-data-queries-title", name: "Molecular Data Queries" },
    { url: "/organ", testId: "organs-title", name: "Organs" },
    { url: "/biomarkers", testId: "biomarkers-title", name: "Biomarkers" },
    { url: "/collections", testId: "collections-title", name: "Collections" },
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
