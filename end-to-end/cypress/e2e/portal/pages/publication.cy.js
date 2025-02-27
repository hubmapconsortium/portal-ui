const publicationId = "2ced91fd6d543e79af90313e52ada57d";
const title =
  "Vitessce: integrative visualization of multimodal and spatially-resolved single-cell data";

describe("Publication page", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
      cy.intercept(
        {
          hostname: "hubmapconsortium.org",
          url: new RegExp(`${publicationId}\/data.*`),
        },
        (res) => res.destroy()
      ).then(() => {
        cy.visit(`/browse/publication/${publicationId}`);
      });
    });
    it("has a title", () => {
      cy.findByTestId("entity-title").contains(title);
    });
    it("has an abstract", () => {
      cy.findByTestId("publication-abstract").contains(
        "Vitessce is an open-source interactive visualization framework"
      );
    });
    it("has a manuscript link", () => {
      cy.findByTestId("publication-manuscript-link").contains(
        "https://www.nature.com/articles/s41592-024-02436-x"
      );
    });
    it("has a citation section", () => {
      cy.findByTestId("publication-citation")
        .should("contain", title)
        .and("contain", "Keller");
    });
    it("has data types listed", () => {
      cy.findByTestId("publication-data-types")
        .should("contain", "CODEX")
        .and("contain", "CODEX [Cytokit + SPRM]")
        .and("contain", "MALDI IMS");
    });
    it("has organs listed", () => {
      cy.findByTestId("publication-organs")
        .should("contain", "Kidney (Left)")
        .and("contain", "Spleen");
    });
    it("has a publication date", () => {
      cy.findByTestId("publication-date")
        .should("contain", "2024-09-27")
        .and("contain", "Publication Date");
    });
    it("has a table of contents with links to the summary, data, visualizations, bulk data transfer, authors, and provenance sections", () => {
      
      cy.findByTestId("table-of-contents")
        .should("contain", "Summary")
        .and("contain", "Data")
        .and("contain", "Visualizations")
        .and("contain", "Bulk Data Transfer")
        .and("contain", "Authors")
        .and("contain", "Provenance");
    });
    it('does not have a "files" section due to the lack of files to display', () => {
      cy.findByTestId("table-of-contents").should("not.contain", "Files");
    });
    xit('has a "Data" section with tabs for tables of donors, samples, and datasets', () => {
      // Donors tab is active by default
      cy.findByTestId("donors-tab")
        .should("exist")
        .and("contain", "Donors")
      cy.findAllByTestId("donor-row").should("have.length.of.at.least", 1);

      // Samples tab needs to be clicked to activate
      cy.findByTestId("samples-tab")
        .should("exist")
        .and("have.attr", "aria-selected", "false")
        .and("contain", "Samples")
        .click();
      cy.findByTestId("samples-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findAllByTestId("sample-row").should("have.length.of.at.least", 1);

      // Datasets tab needs to be clicked to activate
      cy.findByTestId("datasets-tab")
        .should("exist")
        .and("have.attr", "aria-selected", "false")
        .and("contain", "Datasets")
        .click();

      cy.findByTestId("datasets-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findAllByTestId("dataset-row").should("have.length.of.at.least", 1);
    });

    

    it("links to the donors search page when the Donors tab is active", () => {
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
    it("links to the samples search page when the Samples tab is active", () => {
      cy.findByTestId("samples-tab")
        .should("exist")
        .and("have.attr", "aria-selected", "false")
        .click();
      cy.findByTestId("samples-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findByTestId("view-related-data-button")
        .invoke("attr", "href")
        .then((href) =>
          cy.visit(href).then(() => {
            cy.title().should("include", "Samples");
          })
        );
    });

    it("links to the datasets search page when the Datasets tab is active", () => {
      cy.findByTestId("datasets-tab")
        .should("exist")
        .and("have.attr", "aria-selected", "false")
        .click();
      cy.findByTestId("datasets-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findByTestId("view-related-data-button")
        .invoke("attr", "href")
        .then((href) =>
          cy.visit(href).then(() => {
            cy.title().should("include", "Datasets");
          })
        );
    });

    // Disabled this test because it's flaky and fails for no good reason
    // This behavior would be better to test with unit tests
    xit("has a visible Entity Header when the user scrolls down the page", () => {
      cy.findByTestId("entity-header").should("not.exist");
      cy.scrollTo("bottom");
      cy.wait(200);
      cy.findByTestId("entity-header")
        .should("be.visible")
        .and("contain", title);
    });

    it("has six vignettes", () => {
      cy.findAllByTestId("vignette").should("have.length", 6);
    });

    it("has the first vignette expanded by default", () => {
      cy.findByTestId("vignette-0-button").should(
        "have.attr",
        "aria-expanded",
        "true"
      );
      cy.findByTestId("vignette-0-content").should("be.visible");
      ["1", "2", "3", "4", "5"].forEach((i) => {
        cy.findByTestId(`vignette-${i}-button`).should(
          "have.attr",
          "aria-expanded",
          "false"
        );
        cy.findByTestId(`vignette-${i}-content`).should("not.be.visible");
      });
    });

    it("expands other vignettes when they're clicked", () => {
      ["1", "2", "3", "4", "5"].forEach((i) => {
        // Force it to allow clicking while the button is animating since this is a bit flaky
        // Once we switch to `createRoot` this action should be performant enough to remove the { force: true }
        cy.findByTestId(`vignette-${i}-button`).click({ force: true });
        cy.findByTestId(`vignette-${i}-button`).should(
          "have.attr",
          "aria-expanded",
          "true"
        );
        cy.findByTestId(`vignette-${i}-content`).should("be.visible");
      });
    });

    it("has a link to the files in Globus", () => {
      cy.findByTestId("bulk-data-transfer")
        .should("contain", "Bulk Data Transfer")
        .and(
          "contain",
          "Files are available through the Globus Research Data Management System"
        );
    });

    it('has a "Authors" section with a list of author names, affiliations, and ORCIDs', () => {
      cy.findByTestId("authors").should("exist");
      cy.findByTestId("authors-name-header").should("exist");
      cy.findByTestId("authors-affiliation-header").should("exist");
      cy.findByTestId("authors-orcid-header").should("exist");
      cy.findAllByTestId("contributor-row").should("have.length", 6);
    });

    it('has a "Provenance" section with a "graph" tab', () => {
      cy.get("#provenance")
        .should("exist")
        .and("contain", "Provenance")
        .and("contain", "Graph");
      cy.findByTestId("prov-graph-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
    });
  });
});
