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

import { sortTileViewStepTitle, defaultSteps, stepToAddIfViewMoreExists } from '../../../context/app/static/js/components/tutorials/SearchDatasetTutorial/config';
describe('traverses default tutorial steps', () => {
    context('macbook-size', () => {
      beforeEach(() => {
        cy.viewport('macbook-15')
      })

      it('begin the tutorial', () => {
        cy.visit('/');
        cy.visit('/search?entity_type[0]=Dataset',);
        cy.findByText("Begin the Dataset Search Tutorial").click();
        const stepsCopy = [...defaultSteps];
        stepsCopy.splice(1, 0, stepToAddIfViewMoreExists);
        traverseSteps(stepsCopy);
      });

    });
});
