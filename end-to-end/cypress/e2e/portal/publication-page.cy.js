// TODO: This will need to be updated when TEST is overwritten with prod data.
const publicationId = "0bac279e054856ca1b98a2bfb28bb011";
const title =
  "Vitessce: integrative visualization of multimodal and spatially-resolved single-cell data";

describe("Publication page", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
      cy.intercept(
        {
          hostname: "hubmapconsortium.org",
          url: new RegExp(`.*${publicationId}\/data.*`),
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
        "https://osf.io/y8thv"
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
      cy.findByTestId("publication-date").contains("2021-10-18");
    });
    it("has a table of contents with links to the summary, data, visualizations, files, authors, and provenance sections", () => {
      cy.findByTestId("table-of-contents")
        .should("contain", "Summary")
        .and("contain", "Data")
        .and("contain", "Visualizations")
        .and("contain", "Files")
        .and("contain", "Authors")
        .and("contain", "Provenance");
    });
    it('has a "Data" section with tabs for tables of donors, samples, and datasets', () => {
      // Donors tab is active by default
      cy.findByTestId("donors-tab")
        .should("exist")
        .and("contain", "Donors")
        .and("contain", "(2)");
      cy.findAllByTestId("donor-row").should("have.length", 2);

      // Samples tab needs to be clicked to activate
      cy.findByTestId("samples-tab")
        .should("exist")
        .and("have.attr", "aria-selected", "false")
        .and("contain", "Samples")
        .and("contain", "(7)")
        .click();
      cy.findByTestId("samples-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findAllByTestId("sample-row").should("have.length", 7);

      // Datasets tab needs to be clicked to activate
      cy.findByTestId("datasets-tab")
        .should("exist")
        .and("have.attr", "aria-selected", "false")
        .and("contain", "Datasets")
        .and("contain", "(3)")
        .click();

      cy.findByTestId("datasets-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findAllByTestId("dataset-row").should("have.length", 3);
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

    it("has a visible Entity Header when the user scrolls down the page", () => {
      cy.findByTestId("entity-header").should("not.exist");
      cy.scrollTo("bottom");
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
        cy.findByTestId(`vignette-${i}-button`).click();
        cy.findByTestId(`vignette-${i}-button`).should(
          "have.attr",
          "aria-expanded",
          "true"
        );
        cy.findByTestId(`vignette-${i}-content`).should("be.visible");
      });
    });

    it("has a link to the files in Globus", () => {
      cy.findByTestId("files")
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

    it('has a "Provenance" section with toggleable "table" and "graph" tabs', () => {
      cy.get("#provenance")
        .should("exist")
        .and("contain", "Provenance")
        .and("contain", "Table")
        .and("contain", "Graph");
      cy.findByTestId("prov-table-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.findByTestId("prov-graph-tab").should(
        "have.attr",
        "aria-selected",
        "false"
      );
      cy.findByTestId("prov-graph-tab").click();
      cy.findByTestId("prov-table-tab").should(
        "have.attr",
        "aria-selected",
        "false"
      );
      cy.findByTestId("prov-graph-tab").should(
        "have.attr",
        "aria-selected",
        "true"
      );
    });
  });
});
