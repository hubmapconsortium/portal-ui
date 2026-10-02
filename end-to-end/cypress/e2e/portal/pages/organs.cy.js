describe("Organs landing page", () => {
  beforeEach(() => {
    cy.visit("/organs");
    cy.findByTestId("organs-title").should("contain", "Organs");
  });

  it("lists organs, merging left and right", () => {
    cy.get('[data-testid^="organ-link-"]').should("have.length.at.least", 10);
    cy.findAllByTestId("organ-link-Kidney").should("have.length", 1);
    cy.get('[data-testid^="organ-link-"]').each(($link) => expect($link.text()).not.to.match(/\((Left|Right)\)/));
  });

  it("filters organs by search", () => {
    cy.get('input[placeholder="Search organs by name or UBERON ID."]').type("kidney");
    cy.findByTestId("organ-link-Kidney").should("be.visible");
    cy.findByTestId("organ-link-Heart").should("not.exist");
  });

  it("shows a message when no organs match", () => {
    cy.get('input[placeholder="Search organs by name or UBERON ID."]').type("zzqxjvwk");
    cy.contains("No results found").should("be.visible");
  });

  it("links to organ detail pages", () => {
    cy.findByTestId("organ-link-Kidney").click();
    cy.location("pathname").should("eq", "/organs/kidney");
  });
});

describe("Organ detail pages", () => {
  it("Kidney has every section", () => {
    cy.visit("/organs/kidney");
    cy.findByTestId("entity-title").should("contain", "Kidney");
    cy.findByTestId("table-of-contents").find('a[href^="#"]').first().should("contain", "Summary");
    cy.get("#summary").within(() => {
      cy.get('a[href="http://purl.obolibrary.org/obo/UBERON_0002113"]').should("exist");
      cy.get('a[href*="ccf-asct-reporter"][href*="kidney"]').should("exist");
    });
    ["#human-reference-atlas", "#assays", "#samples"].forEach((id) => cy.get(id).should("exist"));
    cy.get("#assays").find("tbody tr").should("have.length.at.least", 1);
    // Bars link with target="_parent"; check the href rather than clicking, which would navigate the Cypress runner.
    cy.get('#assays svg a[aria-label*="datasets with assay type"]')
      .first()
      .should("have.attr", "href")
      .and("match", /^\/search\/datasets\?/);
  });

  it("an organ without datasets loads without data sections", () => {
    cy.visit("/organs/tonsil");
    cy.findByTestId("entity-title").should("contain", "Tonsil");
    cy.get("#summary").should("exist");
    cy.get("#assays").should("not.exist");
  });
});
