const geneSymbol = "MMRN1";
const geneName = "Multimerin 1"
const genePath = `/genes/${geneSymbol}`;

describe("Gene Detail Page", () => {
      beforeEach(() => {
        cy.viewport("macbook-15");
      });
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
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", geneSymbol);
        cy.get("#summary", { timeout: 10000 }).should("exist");
        cy.get("#cell-types", { timeout: 15000 }).should("exist");
        
        // Scroll to ensure the datasets section is visible and wait for it to load
        cy.get("#datasets", { timeout: 15000 }).should("exist").scrollIntoView();
      });

      it("displays the correct page title and gene name", () => {
        // Test that the gene full name and symbol appear in h1 element
        cy.findByRole("heading", { level: 1 }).should("contain", geneName).and("contain", geneSymbol);
        
        // Test that the page title is set correctly
        cy.title().should("include", geneSymbol);
        cy.title().should("include", "HuBMAP");
      });

      it("displays the summary section with gene description and references", () => {
        // Check that summary section exists
        cy.get("#summary").should("exist").within(() => {
          // Check for gene description section
          cy.findByText("Description").should("exist");

          // Check for known references section
          cy.findByText("Known References").should("exist");
          
          // Check for relevant pages section with biomarkers and search links
          cy.findByText("Biomarkers").should("exist");
          cy.findByText("Biomarker and Cell Type Search").should("exist");
          
          // Verify the links are clickable and point to correct URLs (but don't click them)
          cy.contains("a", "Biomarkers").should("have.attr", "href", "/biomarkers");
          cy.contains("a", "Biomarker and Cell Type Search").should("have.attr", "href", "/search/biomarkers-cell-types");
        });
      });

      it("displays the indexed datasets summary with organs and data types", () => {
        // Check that the cell types section exists with indexed datasets summary
        cy.get("#cell-types").should("exist").within(() => {
          cy.findByText(`Cell Types with ${geneSymbol} as Marker Gene`).should("exist");

          // Check for indexed datasets summary content
          cy.findByText("Organs").should("exist");
          cy.findByText("Data Types").should("exist");
          cy.findByText("View Indexed Datasets").should("exist");
          
          // Look for table headers
          cy.findByText("Cell Type").should("exist");
          cy.findByText("Cell Ontology ID").should("exist");
          cy.findByText("Cells Hit / Total Cells (%)").should("exist");
          cy.findByText("p-value").should("exist");
          
          // Check that there are cell type rows (at least one row should exist)
          cy.get("tbody tr").should("have.length.at.least", 1);
        });
      });

      it("displays the datasets overview section with interactive controls", () => {
        // Scroll to and check that datasets section exists
        cy.get("#datasets").should("exist").scrollIntoView().within(() => {
          cy.findByText(`Datasets with ${geneSymbol}`).should("exist");
          
          // Look for overview section
          cy.findByText("Datasets Overview").should("exist").scrollIntoView();
          
          // Check for interactive controls (but don't interact with them)
          cy.findByText("Plot Type").should("exist");
          cy.findByText("Comparison Group").should("exist");
          cy.findByText("Display As").should("exist");
          
          // Check for axis selectors
          cy.findAllByText("X-Axis").should("exist");
          cy.findAllByText("Y-Axis").should("exist");
          cy.findAllByText("Compare by").should("exist");
        });
      });


      it("displays the datasets list", () => {
        cy.get("#datasets").should("exist").scrollIntoView().within(() => {
          // Check for datasets list section
          cy.findByText("Datasets").should("exist");
          
          // Check for table with dataset rows
          cy.get("tbody tr").should("have.length.at.least", 1);
        });
      });

      it("displays the explore with biomarker tool button in datasets section", () => {
        cy.get("#datasets").should("exist").scrollIntoView().within(() => {
          cy.findByText("Explore with Biomarker and Cell Type Search Tool").should("exist");
          // Check the href attribute but don't click the link
          cy.contains("a", "Explore with Biomarker and Cell Type Search Tool")
            .should("have.attr", "href", "/search/biomarkers-cell-types");
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

    // Test for loading states - separate since it explicitly tests loading behavior
    context("loading and error handling", () => {

      it("handles loading states gracefully", () => {
        // Visit the gene page and check that skeleton loaders don't persist indefinitely
        cy.visit(genePath);
        
        // Main content should load within reasonable time
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", geneSymbol);
        cy.get("#summary", { timeout: 10000 }).should("exist");
        cy.get("#cell-types", { timeout: 15000 }).should("exist");
        cy.get("#datasets", { timeout: 15000 }).should("exist").scrollIntoView();
      });
    });
  });
});