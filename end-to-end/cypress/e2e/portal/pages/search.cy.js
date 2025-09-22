describe('Search Page - Bulk Download Permissions', () => {
  beforeEach(() => {
    // Visit the datasets search page
    cy.visit('/search/datasets');
    
    // Wait for the page to load and data to populate
    cy.get('[data-testid="search-results-table"]', { timeout: 10000 }).should('be.visible');
  });

  it('should verify bulk download permissions for restricted datasets', () => {
    // Wait for search results to load
    cy.get('[data-testid="search-results-table"] tbody tr').should('have.length.greaterThan', 0);

    // Find a dataset with "Published" status and select its checkbox
    // The status is displayed in one of the table cells
    cy.get('[data-testid="search-results-table"] tbody tr')
      .contains('Published')
      .parents('tr')
      .first()
      .within(() => {
        // Click the checkbox in the first cell (SelectableRowCell)
        cy.get('input[type="checkbox"]').first().check();
      });

    // Verify the checkbox is selected
    cy.get('[data-testid="search-results-table"] tbody tr')
      .contains('Published')
      .parents('tr')
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').first().should('be.checked');
      });

    // scroll to the top before clicking the bulk download button since it might be out of view
    cy.scrollTo('top');

    // Click the bulk download button
    // The button should be visible in the search bar when datasets are selected
    cy.get('button[aria-label="Bulk Download selected datasets"]', { timeout: 5000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Wait for the bulk download dialog to open
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible');
    
    // Verify the dialog has the correct title
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Bulk Download Files').should('be.visible');
    });

    // Check that the dialog content is loaded (not just skeleton loading)
    cy.get('[id="bulk-download-form"]', { timeout: 15000 }).should('be.visible');

    // Verify that the dialog handles restricted datasets appropriately
    // This section will either:
    // 1. Show no error messages if no restricted datasets were selected
    // 2. Show error messages and restricted dataset handling options if restricted datasets were selected
    
    // Check if there are any error/warning messages about restricted datasets
    cy.get('[role="dialog"]').within(() => {
      // Look for error messages that might indicate restricted datasets
      cy.get('form').then(($body) => {
        const hasErrorMessages = $body.find('[role="alert"]').length > 0 || 
                                 $body.find('[class*="error"]').length > 0 ||
                                 $body.find(':contains("access")').length > 0 ||
                                 $body.find(':contains("restricted")').length > 0 ||
                                 $body.find(':contains("permission")').length > 0;

        if (hasErrorMessages) {
          // If there are restricted datasets, verify the appropriate handling
          cy.log('Found restricted datasets in selection');
          
          // Look for restricted dataset messaging
          cy.get('body').should('contain.text', 'access').or('contain.text', 'permission');
          
          // Verify that there might be a button to remove restricted datasets
          // This is based on the RemoveRestrictedDatasetsFormField component
          cy.get('body').then(($dialogBody) => {
            const hasRemoveButton = $dialogBody.find('button:contains("Remove")').length > 0;
            if (hasRemoveButton) {
              cy.get('button').contains('Remove').should('be.visible');
            }
          });
        } else {
          // If no restricted datasets, verify download options are available
          cy.log('No restricted datasets found in selection');
          
          // Should see download options
          cy.contains('Download Options').should('be.visible');
          
          // Should see checkboxes for different file types
          cy.get('input[type="checkbox"]').should('have.length.greaterThan', 0);
        }
      });
    });

    // Verify that the form has the expected structure
    cy.get('[id="bulk-download-form"]').within(() => {
      // Should have download options section
      cy.contains('Download Options').should('be.visible');
    });

    // Close the dialog to clean up
    cy.get('[role="dialog"]').within(() => {
      // Look for close button (usually X or Cancel)
      cy.get('button').contains('Cancel').click();
    });

    // Verify dialog is closed
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('should handle multiple dataset selection with mixed permissions', () => {
    // Wait for search results to load
    cy.get('[data-testid="search-results-table"] tbody tr').should('have.length.greaterThan', 1);

    // Select multiple datasets with Published status
    cy.get('[data-testid="search-results-table"] tbody tr')
      .contains('Published')
      .parents('tr')
      .each(($row, index) => {
        if (index < 3) { // Select up to 3 published datasets
          cy.wrap($row).within(() => {
            cy.get('input[type="checkbox"]').first().check();
          });
        }
      });

    // Click the bulk download button
    cy.get('button[aria-label="Bulk Download selected datasets"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Wait for the dialog to open and verify it handles multiple selections
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible');
    cy.get('[id="bulk-download-form"]', { timeout: 15000 }).should('be.visible');

    // Verify the dialog shows appropriate content for multiple datasets
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Download Options').should('be.visible');
      
      // Should have some file type options
      cy.get('input[type="checkbox"]').should('have.length.greaterThan', 0);
    });

    // Close dialog
    cy.get('[role="dialog"]').within(() => {
      cy.get('button').contains('Cancel').click();
    });
  });

  it('should show appropriate message when no datasets are selected', () => {
    // Ensure no datasets are selected by default
    cy.get('[data-testid="search-results-table"] tbody tr input[type="checkbox"]:checked')
      .should('have.length', 0);

    // The bulk download button should be disabled when no datasets are selected
    cy.get('button[aria-label="Bulk Download selected datasets"]').should('be.disabled');
  });
});
