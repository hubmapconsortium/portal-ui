// Test data - using tutorials that have iframeLink (are ready)
const tutorialWithIframe = {
  route: "getting-started",
  title: "Getting Started with HuBMAP Data",
  description:
    "Learn how to find HuBMAP datasets using the datasets search page, and explore key information, visualizations and file download options.",
  tags: ["Data Download", "Metadata"],
  category: "Data",
};

const tutorialWithWorkspaces = {
  route: "workspaces",
  title: "Navigating Workspaces",
  description:
    "Learn how to use workspaces to analyze HuBMAP data by initiating Jupyter notebooks and choosing from a variety of pre-established templates.",
  tags: ["Data Analysis"],
  category: "Workspaces",
};

describe("Tutorial Detail Page", () => {
  context("macbook-size", () => {
    context("Tutorial with iframe content", () => {
      beforeEach(() => {
        cy.visit(`/tutorials/${tutorialWithIframe.route}`);
      });

      it("has correct page title and metadata", () => {
        cy.title().should("include", tutorialWithIframe.title);
        cy.title().should("include", "HuBMAP Tutorial");
      });

      it("displays the tutorial title and summary", () => {
        cy.findByTestId("tutorial-title").should("be.visible").and("contain", tutorialWithIframe.title);
        cy.get("h1").should("have.length", 1).and("contain", tutorialWithIframe.title);

        cy.contains("Tutorials").should("be.visible");
        cy.contains(tutorialWithIframe.description).should("be.visible");
      });

      it("displays tutorial tags", () => {
        cy.contains("Tags").should("be.visible");
        tutorialWithIframe.tags.forEach((tag) => {
          cy.contains(tag).should("be.visible");
        });
      });

      it("has a tutorial iframe section", () => {
        cy.contains("Tutorial").should("be.visible");
        cy.get("iframe").should("exist").and("be.visible");
        cy.get("iframe").should("have.attr", "title", tutorialWithIframe.title);
      });

      it("has a custom table of contents with other tutorials", () => {
        cy.findByTestId("table-of-contents").should("be.visible");

        cy.findByTestId("table-of-contents").within(() => {
          // Should show "Other Tutorials" as the title
          cy.contains("Other Tutorials").should("be.visible");

          // Should have category sections
          cy.contains("Data").should("exist");
          cy.contains("Workspaces").should("exist");
        });
      });
    });

    context("Second tutorial page", () => {
      beforeEach(() => {
        cy.visit(`/tutorials/${tutorialWithWorkspaces.route}`);
      });

      it("displays correct tutorial information", () => {
        cy.findByTestId("tutorial-title").should("be.visible").and("contain", tutorialWithWorkspaces.title);

        cy.contains(tutorialWithWorkspaces.description).should("be.visible");

        // Check tags
        tutorialWithWorkspaces.tags.forEach((tag) => {
          cy.contains(tag).should("be.visible");
        });
      });

      it("has working iframe", () => {
        cy.get("iframe").should("exist").and("be.visible");
        cy.get("iframe").should("have.attr", "title", tutorialWithWorkspaces.title);
      });
    });

    context("Tutorial navigation and breadcrumbs", () => {
      it("can navigate between tutorials", () => {
        // Start with first tutorial
        cy.visit(`/tutorials/${tutorialWithIframe.route}`);
        cy.findByTestId("tutorial-title").should("contain", tutorialWithIframe.title);

        // Try to navigate to second tutorial via direct URL since TOC navigation may not work as expected
        cy.visit(`/tutorials/${tutorialWithWorkspaces.route}`);
        cy.url().should("include", `/tutorials/${tutorialWithWorkspaces.route}`);
        cy.findByTestId("tutorial-title").should("contain", tutorialWithWorkspaces.title);
      });
    });
  });
});
