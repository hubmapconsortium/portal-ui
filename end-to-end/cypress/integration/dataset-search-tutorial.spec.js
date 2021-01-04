function traverseSteps(steps){
  cy.wrap(steps).each((step, i) => {
    cy.findByText(step.content).should('exist');
    cy.findByText(`${step.title} (${i+1}/${steps.length})`).should('exist');
    if (i < steps.length - 1) {
      cy.findByRole('button', { name: 'Next' }).click();
    } else {
      cy.findByRole('button', { name: 'Finish Tutorial' }).click();
    }
    
  });
};

function assertTileView(){
  cy.findByTestId('tile-view-toggle-button').should('have.attr', 'aria-pressed', 'true');
  cy.findByTestId('search-results-tiles').should('exist');
  cy.findByTestId('search-tiles-sort-button').should('exist');
}

function assertTableView(){
  cy.findByTestId('table-view-toggle-button').should('have.attr', 'aria-pressed', 'true');
  cy.findByTestId('search-results-table').should('exist');
  cy.findByTestId('search-tiles-sort-button').should('not.be.visible');
}

import { sortTileViewStepTitle, defaultSteps, stepToAddIfViewMoreExists } from '../../../context/app/static/js/components/tutorials/SearchDatasetTutorial/config';
describe('dataset search tutorial', () => {
    context('macbook-size', () => {
      beforeEach(() => {
        cy.viewport('macbook-15')
      })

      it('traverses the steps', () => {
        cy.visit('/search?entity_type[0]=Dataset',);
        cy.findByText("Begin the Dataset Search Tutorial").click();
        const stepsCopy = [...defaultSteps];
        stepsCopy.splice(1, 0, stepToAddIfViewMoreExists);
        traverseSteps(stepsCopy);
        cy.findByText("Begin the Dataset Search Tutorial").should('not.exist');
      });

      it('shows the correct search view', () => {
        cy.visit('/search?entity_type[0]=Dataset');
        cy.findByTestId('tile-view-toggle-button').click();
        assertTileView();
        cy.findByText("Begin the Dataset Search Tutorial").click();
        assertTableView();
        for(let i = 0; i < 5; i++){
          cy.findByRole('button', { name: 'Next' }).click();
        };
        cy.findByText('Sort Search Results for Tile View (6/6)').should('exist');
        assertTileView();
        cy.findByRole('button', { name: 'Back' }).click();
        assertTableView();
      });
    });
});
