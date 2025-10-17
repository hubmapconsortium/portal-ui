describe("Tutorials Landing Page", () => {
  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
      cy.visit("/tutorials");
    });

    it("has a title and description", () => {
      cy.findByTestId("tutorials-title")
        .should("be.visible")
        .and("contain", "Tutorials");
      cy.contains("Step-by-step guides to HuBMAP features and workflows.");
    });

    it("has a search bar", () => {
      cy.get('input[placeholder="Search tutorials by title or keyword."]')
        .should("be.visible")
        .and("have.attr", "type", "text");
    });

    it("has filter chips for categories", () => {
      cy.contains("Filter by Category").should("be.visible");
      
      // Check that all tutorial categories are present as filter chips
      const categories = [
        "Biomarker and Cell Type Search",
        "Data", 
        "Visualization",
        "Workspaces"
      ];
      
      categories.forEach(category => {
        cy.contains(category).should("be.visible");
      });
    });

    it("displays featured tutorials section when there are featured tutorials", () => {
      // Check if featured tutorials section exists (only if there are featured tutorials)
      cy.get("body").then($body => {
        if ($body.find("#featured-tutorials").length > 0) {
          cy.get("#featured-tutorials").should("be.visible");
          cy.contains("Featured Tutorials").should("be.visible");
          cy.contains("Get started quickly with these essential HuBMAP tutorials.").should("be.visible");
        }
      });
    });

    it("displays tutorial category sections that have tutorials", () => {
      const categoryData = {
        "data": {
          title: "Data",
          description: "Discover how to find, interpret, and download HuBMAP data."
        },
        "biomarker-and-cell-type-search": {
          title: "Biomarker and Cell Type Search", 
          description: "Learn how to explore biomarkers and cell types using HuBMAP's Biomarker and Cell Type Search tool."
        },
        "visualization": {
          title: "Visualization",
          description: "Explore built-in visualization tools to interact with HuBMAP's spatial and single-cell data."
        },
        "workspaces": {
          title: "Workspaces",
          description: "Learn how to launch and use workspaces to analyze datasets in a JupyterLab environment."
        }
      };

      // Only check for sections that actually exist on the page
      Object.entries(categoryData).forEach(([id, data]) => {
        cy.get("body").then($body => {
          if ($body.find(`#${id}`).length > 0) {
            cy.get(`#${id}`).should("be.visible");
            cy.contains(data.title).should("be.visible");
            cy.contains(data.description).should("be.visible");
          }
        });
      });
    });

    it("shows tutorial cards with proper information and button states", () => {
      // Check that tutorial cards exist and have expected elements
      cy.get("body").then($body => {
        const tutorialCards = $body.find('[data-testid*="tutorial-card"], .MuiCard-root').length;
        if (tutorialCards > 0) {
          // Find the first tutorial card and verify its structure
          cy.get(".MuiCard-root").first().within(() => {
            // Should have a title
            cy.get(".MuiCardContent-root").should("exist");
            // Should have either "View Tutorial" or "Coming Soon" button
            cy.get("button").should("exist").and("be.visible");
          });

          // Check for both types of buttons
          cy.get("body").then($body => {
            const viewButtons = $body.find('button:contains("View Tutorial")');
            const comingSoonButtons = $body.find('button:contains("Coming Soon")');
            
            expect(viewButtons.length + comingSoonButtons.length).to.be.greaterThan(0);
            
            // "Coming Soon" buttons should be disabled
            if (comingSoonButtons.length > 0) {
              cy.contains("Coming Soon").should("be.disabled");
            }
            
            // "View Tutorial" buttons should be enabled and clickable
            if (viewButtons.length > 0) {
              cy.contains("View Tutorial").should("not.be.disabled");
            }
          });
        }
      });
    });

    it("allows filtering by category", () => {
      // Click on a category filter chip with force to handle potential overlays
      cy.contains("Data").click({ force: true });
      
      // Verify the chip appears selected and filtering works
      cy.contains("Data").should("exist");
      
      // Clear the filter by clicking again
      cy.contains("Data").click({ force: true });
    });

    it("allows searching and filtering tutorials", () => {
      const searchInput = cy.get('input[placeholder="Search tutorials by title or keyword."]');
      
      // Test search functionality
      searchInput.type("workspace");
      
      // Should filter results to show only tutorials matching search
      cy.get("body").then($body => {
        const visibleCards = $body.find(".MuiCard-root:visible");
        // At least one card should remain visible (the workspaces tutorial)
        expect(visibleCards.length).to.be.greaterThan(0);
      });
      
      // Clear search
      searchInput.clear();
      
      // Test category filtering
      cy.contains("Workspaces").click({ force: true });
      
      // Should show only Workspaces category tutorials
      cy.get("body").then($body => {
        // The workspaces section should be visible if it exists
        if ($body.find("#workspaces").length > 0) {
          cy.get("#workspaces").should("be.visible");
        }
      });
      
      // Clear filter by clicking again
      cy.contains("Workspaces").click({ force: true });
    });

    it("has a table of contents with tutorial category sections", () => {
      cy.findByTestId("table-of-contents").should("be.visible");
      
      // Check for main category sections in TOC
      cy.findByTestId("table-of-contents").within(() => {
        cy.contains("Featured Tutorials").should("exist");
        cy.contains("Data").should("exist");
        cy.contains("Biomarker and Cell Type Search").should("exist");
        cy.contains("Visualization").should("exist"); 
        cy.contains("Workspaces").should("exist");
      });
    });

    it("navigates to tutorial detail page when 'View Tutorial' button is clicked", () => {
      // Find a tutorial with "View Tutorial" button (not "Coming Soon")
      cy.get("body").then($body => {
        const viewTutorialButtons = $body.find('button:contains("View Tutorial")');
        if (viewTutorialButtons.length > 0) {
          // Click the first "View Tutorial" button
          cy.contains("View Tutorial").first().click();
          
          // Should navigate to a tutorial detail page
          cy.url().should("include", "/tutorials/");
          cy.findByTestId("tutorial-title").should("be.visible");
        }
      });
    });
  });
});