describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.findByTestId("home-page-title").should("be.visible");
  });

  it("has entity counts that link to their landing pages", () => {
    const counts = {
      donors: "/search/donors",
      samples: "/search/samples",
      datasets: "/search/datasets",
      collections: "/collections",
      publications: "/publications",
    };
    Object.entries(counts).forEach(([entity, href]) => {
      cy.get(`[aria-label="Number of unique ${entity}"]`)
        .should("not.be.empty")
        .closest("a")
        .should("have.attr", "href", href);
      cy.request(href).its("status").should("eq", 200);
    });
  });

  it("has a datasets chart whose bars link to filtered dataset searches", () => {
    cy.get("#hubmap-datasets").scrollIntoView();
    // The chart aggregates every dataset, which can take longer than the default timeout on the test env.
    cy.contains("label", "Compare by", { timeout: 60000 }).parent().find("[role=combobox]").click();
    cy.contains("li[role=option]", "Donor Sex").click();
    cy.get('svg a[aria-label*="donor sex"]')
      .first()
      .should("have.attr", "href")
      .and("match", /^\/search\/datasets\?/);
    // Bars link with target="_parent", which would navigate the Cypress runner itself.
    cy.get('svg a[aria-label*="donor sex"]').first().invoke("removeAttr", "target").click({ force: true });
    cy.location("pathname").should("eq", "/search/datasets");
    ["Donor Sex:", "Organ:"].forEach((chip) => cy.contains(".MuiChip-root", chip).should("be.visible"));
  });

  it("has the analysis and visualization slides", () => {
    [
      "Find Data Your Way",
      "Analyze Datasets in Cloud-based Workspaces",
      "Discover More About Biomarkers and Cell Types",
      "Explore HuBMAP Data",
    ].forEach((name) => cy.get(`[role=region][aria-label="${name}"]`).should("exist"));
  });

  it("has six featured publications", () => {
    cy.contains("Trusted by top institutions")
      .parent()
      .find('a[href^="/browse/publication/"]')
      .should("have.length", 6);
  });

  it("links to related tools and resources", () => {
    const links = {
      "Human Reference Atlas": "https://humanatlas.io/",
      Azimuth: "https://azimuth.hubmapconsortium.org/",
      FUSION: "http://fusion.hubmapconsortium.org/?utm_source=hubmap",
      "Antibody Validation Reports": "https://avr.xconsortia.org/",
      "Data Submission": "https://ingest.hubmapconsortium.org/",
      "Consortium Website": "https://hubmapconsortium.org/",
      "Common Fund": "https://commonfund.nih.gov/hubmap/",
      Protocols: "https://www.protocols.io/workspaces/human-biomolecular-atlas-program-hubmap-method-development/",
      Publications: "https://scholar.google.com/citations?user=CtGSN80AAAAJ",
    };
    Object.entries(links).forEach(([text, href]) => {
      cy.get(`a[href="${href}"]`).should("contain", text);
    });
  });

  it("has data and docs menus in the header", () => {
    cy.findByTestId("Data-dropdown").click();
    ["/search/datasets", "/search/samples", "/search/donors", "/organs", "/collections"].forEach((href) =>
      cy.get(`.MuiDrawer-paper a[href="${href}"]`).should("exist"),
    );
    cy.get('.MuiDrawer-paper button[aria-label="Close"]').click();
    cy.findByTestId("Resources-dropdown").click();
    ["Consortium FAQ", "About HuBMAP", "Technical Documentation"].forEach((text) =>
      cy.contains(".MuiDrawer-paper a", text).should("exist"),
    );
  });

  it("shows a login button, not a profile, when logged out", () => {
    cy.findByTestId(`${encodeURI("Your Profile")}-dropdown`).click();
    // Don't click: tests must not depend on Globus.
    cy.findByTestId("auth-button").should("contain", "Log In");
  });

  it("hides the datasets chart on narrow screens", () => {
    cy.viewport(375, 667);
    cy.findByTestId("home-page-title").should("be.visible");
    cy.get("#hubmap-datasets").should("not.exist");
  });
});

describe("Home page errors", () => {
  // Without an error state, failed requests left the counts and chart as loading skeletons forever.
  it("shows errors when the counts and chart requests fail", () => {
    cy.intercept("POST", "**/v3/portal/search", { statusCode: 500, body: {} });
    cy.visit("/");
    cy.contains("Entity counts could not be loaded (HTTP 500).").should("be.visible");
    cy.get('[aria-label="Number of unique datasets"]').closest("a").should("contain", "—");
    cy.get("#hubmap-datasets").scrollIntoView();
    cy.contains("The datasets chart could not be loaded (HTTP 500).").should("be.visible");
  });
});

describe("Error pages", () => {
  it("has a nice 404", () => {
    cy.visit("/no-such-page", { failOnStatusCode: false });
    cy.findByTestId("http-error").should("contain", "Page Not Found");
    cy.contains("If this page should exist, submit a bug report.");
  });

  // Proves the error UI gate in support/e2e.js fires: the test passes only if it fails with the gate's error.
  it("fails tests that render the error boundary", (done) => {
    cy.on("fail", (err) => {
      expect(err.message).to.include("Error UI rendered (error-boundary)");
      done();
    });
    cy.visit("/client-side-error");
    cy.findByTestId("error-boundary")
      .should("be.visible")
      .then(() => {
        throw new Error("The error UI gate did not fire");
      });
  });
});
