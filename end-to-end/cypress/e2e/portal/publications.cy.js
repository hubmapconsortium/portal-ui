describe("publications list page", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
      cy.visit("/publications");
    });
    it("has a title, subtitle, and description at the top", () => {
      cy.findByTestId("landing-page-title").findByText("Publications");
      cy.findByTestId("landing-page-description").contains(
        "The following publications"
      );
    });
    it("has tabs for published and preprint entities", () => {
      cy.findByTestId("publication-tabs").should("exist");
      const publishedTab = cy.findByTestId("publication-tab-published");
      const preprintTab = cy.findByTestId("publication-tab-preprint");
      const tabs = [publishedTab, preprintTab];
      // publishedTab.should("have.attr", "aria-selected", "true");
      // preprintTab.should("have.attr", "aria-selected", "false");
      tabs.forEach((tab) => {
        tab.should("exist").then(($tab) => {
          if ($tab.text().includes("(0)")) {
            tab.should("be.disabled");
          } else {
            tab.should("not.be.disabled");
          }
        });
      });
    });
    it("has clickable publication links", () => {
      const publishedTab = cy.findByTestId("publication-tab-published");
      const preprintTab = cy.findByTestId("publication-tab-preprint");
      publishedTab.should("exist").then(($pubTab) => {
        if ($pubTab.text().includes("(0)")) {
          preprintTab.click();
          cy.wait(1000);
        }
      });
      cy.findAllByTestId("panel-title").should("exist").and.should("have.attr", "href")
    });
  });
});
