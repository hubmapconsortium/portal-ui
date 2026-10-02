const geneSymbol = "MMRN1";
const geneName = "Multimerin 1";
const genePath = `/genes/${geneSymbol}`;
const geneTitle = `${geneName} (${geneSymbol})`;

describe("Gene Detail Page", () => {
  context("macbook-size", () => {
    // Group tests that don't require navigation or state changes
    context("page content and structure", () => {
      beforeEach(() => {
        // Ensure we're always on the correct page before each test
        cy.url().then((url) => {
          if (!url.includes(genePath)) {
            cy.visit(genePath);
          }
        });

        // Wait for the page to fully load before running tests
        cy.findByRole("heading", { level: 2, name: geneTitle }).should("contain", geneSymbol);
        cy.get("#summary").should("exist");
        cy.get("#cell-types").should("exist");

        // Scroll to ensure the datasets section is visible and wait for it to load
        cy.get("#datasets").should("exist").scrollIntoView();
      });

      it("displays the correct page title and gene name", () => {
        // The "Gene" entity type is the page's only h1; the gene name and symbol are the h2 below it.
        cy.get("h1").should("have.length", 1).and("contain", "Gene");
        cy.findByRole("heading", { level: 2, name: geneTitle })
          .should("contain", geneName)
          .and("contain", geneSymbol);

        // Test that the page title is set correctly
        cy.title().should("include", geneSymbol);
        cy.title().should("include", "HuBMAP");
      });

      it("displays the summary section with gene description and references", () => {
        // Check that summary section exists
        cy.get("#summary")
          .should("exist")
          .within(() => {
            // Check for gene description section
            cy.findByText("Description").should("exist");

            // Check for known references section
            cy.findByText("Known References").should("exist");

            // Check for relevant pages section with biomarkers and search links
            cy.findByText("Biomarkers").should("exist");
            cy.findByText("Biomarker and Cell Type Search").should("exist");

            // Verify the links are clickable and point to correct URLs (but don't click them)
            cy.contains("a", "Biomarkers").should("have.attr", "href", "/biomarkers");
            cy.contains("a", "Biomarker and Cell Type Search").should(
              "have.attr",
              "href",
              "/search/biomarkers-cell-types",
            );
          });
      });

      // The cell type, indexed dataset, and datasets overview content comes from scFind. Its dev and prod
      // endpoints time out from outside the portal's servers (as of 2026-10-01), so it isn't asserted here.

      it("displays the explore with biomarker tool button in datasets section", () => {
        cy.get("#datasets")
          .should("exist")
          .scrollIntoView()
          .within(() => {
            cy.findByText("Explore with Biomarker and Cell Type Search Tool").should("exist");
            // Check the href attribute but don't click the link
            cy.contains("a", "Explore with Biomarker and Cell Type Search Tool").should(
              "have.attr",
              "href",
              "/search/biomarkers-cell-types",
            );
          });
      });
    });

    // Group tests that require navigation (each needs a fresh page load)
    context("navigation functionality", () => {
      it("has working navigation to biomarker and cell type search page", () => {
        cy.visit(genePath);

        // Click on the biomarker search link from summary section
        cy.contains("a", "Biomarker and Cell Type Search").click();

        // Verify navigation to search page
        cy.url().should("include", "/search/biomarkers-cell-types");
        cy.title().should("include", "Biomarker");
      });

      it("has working navigation to biomarkers page", () => {
        cy.visit(genePath);

        // Click on the biomarkers link from summary section
        cy.contains("a", "Biomarkers").click();

        // Verify navigation to biomarkers page
        cy.url().should("include", "/biomarkers");
      });
    });
  });
});
