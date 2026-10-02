// Parses "X Results Shown | Y Total Results" below the results table.
const parseTotal = ($p) =>
  Number(
    $p
      .text()
      .match(/([\d,]+) Total Results/)[1]
      .replace(/,/g, ""),
  );

function totalResults() {
  return cy.contains("p", /Total Results/).then(parseTotal);
}

// Retries until the total satisfies `check`, so it waits out the search debounce and refetch.
function totalResultsShould(check) {
  cy.contains("p", /Total Results/).should(($p) => check(expect(parseTotal($p))));
}

function waitForResults() {
  // tbody rows can be loading skeletons; HuBMAP ID links only render with real hits.
  cy.findAllByTestId("hubmap-id-link").should("have.length.at.least", 1);
}

["datasets", "samples", "donors"].forEach((type) => {
  describe(`${type} search`, () => {
    beforeEach(() => {
      cy.visit(`/search/${type}`);
      waitForResults();
    });

    it("narrows results with a free-text search", () => {
      totalResults().then((initial) => {
        cy.get('input[aria-label="Freetext search"]').type("kidney");
        totalResultsShould((total) => total.to.be.lessThan(initial));
      });
    });

    it("warns when a search has no results", () => {
      cy.get('input[aria-label="Freetext search"]').type("zzqxjvwk");
      cy.contains("No results found. Login to view more results.").should("be.visible");
    });

    it("narrows results with a facet, and clears it", () => {
      totalResults().then((initial) => {
        cy.findByTestId("search-facets").find('input[type="checkbox"][name$="-checkbox"]').first().check();
        totalResultsShould((total) => total.to.be.lessThan(initial));
        cy.findByTestId("clear-filters-button").click();
        totalResultsShould((total) => total.to.equal(initial));
      });
    });

    it("sorts by a column header", () => {
      cy.get("th .MuiTableSortLabel-root").first().as("sort").click();
      cy.get("@sort")
        .should("have.class", "Mui-active")
        .then(($sort) => {
          const first = $sort.hasClass("MuiTableSortLabel-directionAsc") ? "Asc" : "Desc";
          cy.get("@sort").click();
          cy.get("@sort").should("have.class", `MuiTableSortLabel-direction${first === "Asc" ? "Desc" : "Asc"}`);
        });
      waitForResults();
    });

    it("switches to tile view, with tiles linking to detail pages", () => {
      cy.findByTestId("tile-view-toggle-button").click();
      cy.get(`a[href^="/browse/${type.slice(0, -1)}/"]`).should("have.length.at.least", 1);
      cy.findByTestId("table-view-toggle-button").click();
      cy.findByTestId("search-results-table").should("be.visible");
    });

    it("links HuBMAP IDs to detail pages", () => {
      cy.findAllByTestId("hubmap-id-link").first().click();
      cy.findByTestId("entity-title").should("be.visible");
    });

    it("downloads a metadata TSV", () => {
      cy.window().then((win) => cy.spy(win.URL, "createObjectURL").as("createObjectURL"));
      cy.contains("button", "Download").click();
      cy.contains("#download-menu li", "Download Metadata").click();
      // The TSV is built client-side from every hit; all datasets take a while on the test env.
      cy.get("@createObjectURL", { timeout: 60000 })
        .should("have.been.called")
        .then((spy) => spy.getCall(0).args[0].text())
        .should("match", /^uuid\t/);
    });

    it("opens LineUp", () => {
      cy.get(`button[title="Visualize ${type}' metadata in Lineup."]`).click();
      cy.get("[role=dialog]").should("contain", "Lineup Visualization");
    });
  });
});

describe("datasets search only", () => {
  beforeEach(() => {
    cy.visit("/search/datasets");
    waitForResults();
  });

  it("disables bulk download until datasets are selected", () => {
    cy.contains("button", "Download").click();
    cy.contains("#download-menu li", "Download Datasets").should("have.attr", "aria-disabled", "true");
  });

  it("filters by a nested dataset type", () => {
    // Dataset Type is hierarchical: expand Histology to reach PAS Stained Microscopy.
    cy.get('input[name="Histology-checkbox"]').closest(".MuiAccordionSummary-root").find("[role=presentation]").click();
    cy.get('input[name="PAS Stained Microscopy-checkbox"]').check();
    cy.location("search").should("eq", "?dataset_type=Histology.PAS+Stained+Microscopy");
    waitForResults();
  });

  it("shows PAS microscopy thumbnails in tile view", function () {
    // This dataset's thumbnail is missing from assets.test (404 as of 2026-10-02), so this only runs with API_ENV=prod.
    cy.env(["API_ENV"]).then(({ API_ENV = "test" }) => {
      if (API_ENV !== "prod") this.skip();
    });
    // Only some PAS datasets have thumbnails, and not on the first page, so pick one that does.
    cy.visit("/search/datasets?dataset_type=Histology.PAS+Stained+Microscopy");
    waitForResults();
    cy.get('input[aria-label="Freetext search"]').type("HBM484.RDZR.494");
    cy.findAllByTestId("hubmap-id-link").should("have.length", 1);
    cy.findByTestId("tile-view-toggle-button").click();
    cy.get('a[href^="/browse/dataset/"] img[src$="/thumbnail.jpg"]').should(($imgs) => {
      expect(
        [...$imgs].some((img) => img.naturalWidth > 0),
        "a thumbnail loaded",
      ).to.be.true;
    });
  });
});

describe("search errors", () => {
  // Without an error state, a failed request left the results as loading skeletons forever.
  [
    { name: "the search request", method: "POST", url: "**/v3/portal/search" },
    { name: "the field mapping request the search waits on", method: "GET", url: "**/v3/portal/mapping" },
  ].forEach(({ name, method, url }) => {
    it(`shows an error when ${name} fails`, () => {
      cy.intercept(method, url, { statusCode: 500, body: {} });
      cy.visit("/search/datasets");
      cy.contains("Search results could not be loaded (HTTP 500).").should("be.visible");
      cy.findAllByTestId("hubmap-id-link").should("not.exist");
    });
  });
});
