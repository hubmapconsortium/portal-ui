const collection = {
  uuid: "3ae4ddfc175d768af5526a010bfe95aa",
  hubmapId: "HBM585.QPDV.454",
  title: "Spatiotemporal coordination at the maternal-fetal interface",
  doi: "10.35079/hbm585.qpdv.454",
};

describe("Collections", () => {
  it("lists collections with links, HuBMAP IDs, and dataset counts", () => {
    cy.visit("/collections");
    cy.findByTestId("collections-title").should("be.visible");
    cy.findAllByTestId("panel-title")
      .should("have.length.at.least", 1)
      .first()
      .should("have.attr", "href")
      .and("match", /^\/browse\/collection\//);
    cy.findAllByTestId("panel-title")
      .first()
      .parent()
      .invoke("text")
      .should("match", /\(HBM\d{3}\.[A-Z]{4}\.\d{3}\)/);
    cy.get('[aria-label="Number of Datasets"]').first().invoke("text").should("match", /^\d+$/);
  });

  it("has a detail page with citation, datasets, and contributors", () => {
    cy.visit(`/browse/collection/${collection.uuid}`);
    cy.findByTestId("entity-title").should("contain", collection.title);
    cy.get("#summary").within(() => {
      cy.contains("Citation");
      cy.get('[aria-label="This DOI link leads to the page you are currently viewing. Click to copy."]').should(
        "contain",
        collection.doi,
      );
      cy.contains("a", "View DataCite Page").should(
        "have.attr",
        "href",
        `https://commons.datacite.org/doi.org/${collection.doi}`,
      );
    });
    cy.get("#datasets").find("tbody tr").should("have.length.at.least", 1);
    cy.findByTestId("contributors").within(() => {
      cy.findAllByTestId("contributor-row").should("have.length.at.least", 1);
      cy.get('a[href^="https://orcid.org/"]').should("have.length.at.least", 1);
    });
  });
});
