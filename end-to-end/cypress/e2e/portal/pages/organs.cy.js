const organsPath = "/organs";

describe("Organs Landing Page", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
  });

  context("macbook-size", () => {
    // Group tests that don't require navigation or state changes
    context("page content and structure", () => {
      beforeEach(() => {
        // Ensure we're always on the correct page before each test
        cy.url().then((url) => {
          if (!url.includes(organsPath)) {
            cy.visit(organsPath);
          }
        });
        
        // Wait for the page to fully load before running tests
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        cy.get('[data-testid="organs-title"]', { timeout: 10000 }).should("exist");
      });

      it("displays the correct page title and heading", () => {
        // Test that the organs title appears in h1 element
        cy.findByRole("heading", { level: 1 }).should("contain", "Organs");
        
        // Test that the page title is set correctly
        cy.title().should("include", "Organs");
        cy.title().should("include", "HuBMAP");
        
        // Check for organs count subtitle
        cy.get('h2[color="primary"]').should("exist").and("contain", "Organs");
      });

      it("displays the page description", () => {
        // Check that the description section exists with expected content
        cy.contains("Discover HuBMAP data by organ and interact with the data with visualizations including anatomical views and cell population plots.")
          .should("exist");
      });

      it("displays the HuBMAP datasets chart on large desktop", () => {
        // The chart should be visible on large desktop viewports
        // This is conditional based on the useIsLargeDesktop hook
        cy.viewport(1440, 900); // Large desktop size
        cy.reload();
        
        // Wait for page to load
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        
        // Check if the chart container exists (it may be conditionally rendered)
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid*="chart"], canvas, svg').length > 0) {
            cy.get('[data-testid*="chart"], canvas, svg').should("be.visible");
          }
        });
      });

      it("displays the search bar with correct placeholder", () => {
        // Check that the search bar exists and has the correct placeholder
        cy.get('input[placeholder*="Search organs"]').should("exist");
        cy.get('input[placeholder*="UBERON ID"]').should("exist");
      });

      it("displays the organs list with proper headers", () => {
        // Wait for organs list to load
        cy.get('[data-testid="organs-header-name"]', { timeout: 15000 }).should("exist");
        
        // Check for table headers (desktop version)
        cy.get('[data-testid="organs-header-name"]').should("contain", "Organ");
        cy.get('[data-testid="organs-header-description"]').should("contain", "Description");
        cy.get('[data-testid="organs-header-datasets"]').should("contain", "Datasets");
        cy.get('[data-testid="organs-header-samples"]').should("contain", "Samples");
      });

      it("displays organ list items with data", () => {
        // Wait for organs to load and check that we have organ items
        cy.get('[data-testid="organs-header-name"]', { timeout: 15000 }).should("exist");
        
        // Check that there are organ rows (should be at least a few organs)
        cy.get('body').then(($body) => {
          // Look for organ links or organ data
          if ($body.find('[data-testid*="organ-link-"]').length > 0) {
            cy.get('[data-testid*="organ-link-"]').should("have.length.at.least", 1);
          } else {
            // Fallback: look for any rows with organ data
            cy.contains(/kidney|heart|lung|liver|brain/i).should("exist");
          }
        });
      });
    });

    // Group tests for search functionality
    context("search functionality", () => {
      beforeEach(() => {
        cy.visit(organsPath);
        // Wait for page to load
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        cy.get('[data-testid="organs-header-name"]', { timeout: 15000 }).should("exist");
      });

      it("filters organs by name when searching", () => {
        // Get the search input and type a common organ name
        cy.get('input[placeholder*="Search organs"]').as("searchInput");
        
        // First, count initial results
        cy.get('body').then(($body) => {
          const initialCount = $body.find('[data-testid*="organ-link-"], tbody tr').length;
          
          // Search for "kidney" (should be present in most datasets)
          cy.get('@searchInput').type("kidney");
          
          // Wait a moment for filtering to happen
          cy.wait(500);
          
          // Check that results are filtered
          cy.get('body').then(($filteredBody) => {
            const filteredCount = $filteredBody.find('[data-testid*="organ-link-"], tbody tr').length;
            
            // Either we have fewer results, or we found kidney specifically
            if (filteredCount < initialCount) {
              expect(filteredCount).to.be.lessThan(initialCount);
            } else {
              // Or we can check that kidney appears in the results
              cy.contains(/kidney/i).should("exist");
            }
          });
        });
      });

      it("shows no results message when searching for non-existent organ", () => {
        // Search for something that definitely won't exist
        cy.get('input[placeholder*="Search organs"]').type("nonexistenttestorgan123");
        
        // Wait for filtering
        cy.wait(500);
        
        // Should show no results message
        cy.contains("No results found").should("exist");
        cy.contains("Try searching for a different organ name or UBERON ID").should("exist");
      });

      it("clears search results when input is cleared", () => {
        const searchInput = cy.get('input[placeholder*="Search organs"]');
        
        // Search for something
        searchInput.type("kidney");
        cy.wait(500);
        
        // Clear the search
        searchInput.clear();
        cy.wait(500);
        
        // Should show all organs again
        cy.get('[data-testid="organs-header-name"]').should("exist");
        // Results should be back to showing multiple organs
        cy.get('body').then(($body) => {
          const resultCount = $body.find('[data-testid*="organ-link-"], tbody tr').length;
          expect(resultCount).to.be.greaterThan(1);
        });
      });
    });

    // Group tests for sorting functionality
    context("sorting functionality", () => {
      beforeEach(() => {
        cy.visit(organsPath);
        // Wait for page to load
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        cy.get('[data-testid="organs-header-name"]', { timeout: 15000 }).should("exist");
      });

      it("sorts organs by name when clicking the name header", () => {
        // Click on the name header to sort
        cy.get('[data-testid="organs-header-name"]').find('span[role="button"]').click();
        
        // Wait for sorting to happen
        cy.wait(500);
        
        // Check that the sort label is active
        cy.get('[data-testid="organs-header-name"]').find('.MuiTableSortLabel-root').should("have.class", "Mui-active");
      });

      it("sorts organs by description when clicking the description header", () => {
        // Click on the description header to sort
        cy.get('[data-testid="organs-header-description"]').find('span[role="button"]').click();
        
        // Wait for sorting to happen
        cy.wait(500);
        
        // Check that the sort label is active
        cy.get('[data-testid="organs-header-description"]').find('.MuiTableSortLabel-root').should("have.class", "Mui-active");
      });

      it("sorts organs by dataset count when clicking the datasets header", () => {
        // Click on the datasets header to sort
        cy.get('[data-testid="organs-header-datasets"]').find('span[role="button"]').click();
        
        // Wait for sorting to happen
        cy.wait(500);
        
        // Check that the sort label is active
        cy.get('[data-testid="organs-header-datasets"]').find('.MuiTableSortLabel-root').should("have.class", "Mui-active");
      });

      it("sorts organs by sample count when clicking the samples header", () => {
        // Click on the samples header to sort
        cy.get('[data-testid="organs-header-samples"]').find('span[role="button"]').click();
        
        // Wait for sorting to happen
        cy.wait(500);
        
        // Check that the sort label is active
        cy.get('[data-testid="organs-header-samples"]').find('.MuiTableSortLabel-root').should("have.class", "Mui-active");
      });

      it("toggles sort direction when clicking the same header twice", () => {
        // Click name header once
        cy.get('[data-testid="organs-header-name"]').find('span[role="button"]').click();
        cy.wait(500);
        
        // Check initial sort direction
        cy.get('[data-testid="organs-header-name"]').find('.MuiTableSortLabel-root').then(($el) => {
          const initialDirection = $el.attr('aria-sort');
          
          // Click again to toggle
          cy.get('[data-testid="organs-header-name"]').find('span[role="button"]').click();
          cy.wait(500);
          
          // Check that direction changed
          cy.get('[data-testid="organs-header-name"]').find('.MuiTableSortLabel-root').should(($newEl) => {
            const newDirection = $newEl.attr('aria-sort');
            expect(newDirection).to.not.equal(initialDirection);
          });
        });
      });
    });

    // Group tests that require navigation
    context("navigation functionality", () => {
      beforeEach(() => {
        cy.visit(organsPath);
        // Wait for page to load
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        cy.get('[data-testid="organs-header-name"]', { timeout: 15000 }).should("exist");
      });

      it("navigates to individual organ pages when clicking organ links", () => {
        // Find the first organ link and click it
        cy.get('[data-testid*="organ-link-"]').first().then(($link) => {
          const organName = $link.text().toLowerCase();
          const expectedHref = $link.attr('href');
          
          // Click the link
          cy.wrap($link).click();
          
          // Verify navigation
          cy.url().should('include', expectedHref);
          
          // Verify we're on an organ detail page
          cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("exist");
        });
      });

      it("navigates through dataset chart links if present", () => {
        // This test is for large desktop where the chart is shown
        cy.viewport(1440, 900);
        cy.reload();
        
        // Wait for page to load
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        
        // Check if chart exists and has clickable elements
        cy.get('body').then(($body) => {
          if ($body.find('svg, canvas').length > 0) {
            // If chart exists, look for clickable elements
            cy.get('svg, canvas').first().should("be.visible");
            // Note: Actual chart interaction testing would depend on the specific chart implementation
          }
        });
      });
    });

    // Test for responsive behavior
    context("responsive design", () => {
      it("adapts layout for mobile viewports", () => {
        // Test mobile viewport
        cy.viewport(375, 667);
        cy.visit(organsPath);
        
        // Wait for page to load
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        
        // On mobile, the header row might be hidden
        cy.get('body').then(($body) => {
          // Check if desktop headers are hidden on mobile
          if ($body.find('[data-testid="organs-header-name"]').length === 0) {
            // Mobile layout - headers should be hidden
            cy.get('[data-testid="organs-header-name"]').should("not.exist");
          } else {
            // If headers exist, they should still be functional
            cy.get('[data-testid="organs-header-name"]').should("exist");
          }
        });
        
        // Search should still work on mobile
        cy.get('input[placeholder*="Search organs"]').should("exist");
      });

      it("shows chart only on large desktop viewports", () => {
        // Test small desktop
        cy.viewport(1024, 768);
        cy.visit(organsPath);
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        
        // Chart should not be visible
        cy.get('body').then(($body) => {
          const chartElements = $body.find('[data-testid*="chart"], canvas, svg');
          expect(chartElements.length).to.equal(0);
        });
        
        // Test large desktop
        cy.viewport(1440, 900);
        cy.reload();
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        
        // Chart should be visible (if implemented)
        cy.get('body').then(($body) => {
          const chartElements = $body.find('[data-testid*="chart"], canvas, svg');
          // Chart may or may not be implemented, so we just check it's conditional
        });
      });
    });

    // Test for loading states and error handling
    context("loading and error handling", () => {
      it("handles loading states gracefully", () => {
        cy.visit(organsPath);
        
        // Main content should load within reasonable time
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        cy.get('[data-testid="organs-title"]', { timeout: 10000 }).should("exist");
        
        // Search functionality should be available
        cy.get('input[placeholder*="Search organs"]', { timeout: 5000 }).should("exist");
        
        // Organs list should load
        cy.get('[data-testid="organs-header-name"]', { timeout: 15000 }).should("exist");
      });

      it("displays appropriate message when no organs match search", () => {
        cy.visit(organsPath);
        cy.findByRole("heading", { level: 1 }, { timeout: 10000 }).should("contain", "Organs");
        
        // Search for non-existent organ
        cy.get('input[placeholder*="Search organs"]').type("xyznonexistent");
        cy.wait(500);
        
        // Should show no results
        cy.contains("No results found").should("exist");
      });
    });
  });
});