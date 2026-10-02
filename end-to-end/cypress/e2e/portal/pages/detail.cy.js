const entities = [
  // seqFISH, with processed data, files, and a visualization.
  { type: "dataset", uuid: "c6a254b2dc2ed46b002500ade163a7cc", provenance: true, files: true },
  { type: "sample", uuid: "c18dbe465fe2dfddd96b0382c6c4b38b", provenance: true },
  { type: "donor", uuid: "03b82562be364ef03017f7861e60d723" },
];

entities.forEach(({ type, uuid, provenance, files }) => {
  describe(`${type} detail page`, () => {
    beforeEach(() => {
      cy.visit(`/browse/${type}/${uuid}`);
      cy.findByTestId("entity-title").should("be.visible");
    });

    it("has a table of contents whose links all resolve, starting with Summary", () => {
      cy.findByTestId("table-of-contents")
        .find('a[href^="#"]')
        .should("have.length.at.least", 2)
        .first()
        .should("contain", "Summary");
      cy.findByTestId("table-of-contents")
        .find('a[href^="#"]')
        .each(($a) => {
          // Processed-data subsections render after the TOC lists them, so retry. Ids contain dots.
          cy.get(`[id="${$a.attr("href").slice(1)}"]`).should("exist");
        });
    });

    it("serves its JSON", () => {
      cy.request(`/browse/${type}/${uuid}.json`).its("body.uuid").should("eq", uuid);
    });

    it("has a populated metadata table", () => {
      cy.get("#metadata").find("tbody tr").should("have.length.at.least", 1);
    });

    if (provenance) {
      it("has provenance table and graph tabs", () => {
        cy.get("#provenance").scrollIntoView();
        cy.findByTestId("prov-table-tab").click().should("have.attr", "aria-selected", "true");
        cy.findByTestId("prov-graph-tab").click().should("have.attr", "aria-selected", "true");
        cy.get("#provenance-graph").should("be.visible");
      });
    }

    if (files) {
      it("has a file browser", () => {
        cy.findAllByTestId("file-browser").should("have.length.at.least", 1);
      });
    }
  });
});
