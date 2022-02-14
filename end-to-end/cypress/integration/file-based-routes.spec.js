describe('file-based-routes', () => {
  context('macbook-size', () => {
    beforeEach(() => {
      cy.viewport('macbook-15')
    })
    it('has working preview pages', () => {
      cy.visit('/');
      cy.contains('Resources').click();
      cy.contains('Cell Type Annotations').click();
      cy.contains('HuBMAP Data Portal Previews demonstrate functionality');
      cy.contains('Rahul Satija');
      // Vitessce loads, pulling data from the network.
      // Are incidental network requests ok, as long as tests don't depend on them?
    });
    it('has working docs pages', () => {
      cy.visit('/');
      cy.contains('Resources').click();
      cy.contains('FAQ');
      cy.contains('About');
      cy.contains('Technical').click();
      cy.contains('HIVE Software Engineering Principles')
    });
    it('has working publication pages', () => {
      // TODO: When we link to it from the menu, follow the link instead.
      cy.visit('/publication');
      cy.contains('Blue B. Lake');
      // be.visible is a hack: https://github.com/cypress-io/cypress/issues/695
      cy.contains('An atlas of healthy and injured cell states').should('be.visible').click();
      cy.contains('Understanding kidney disease relies upon');
      cy.contains('www.biorxiv.org/content/10.1101/2021.07.28.454201');
      cy.contains('Blue B. Lake, Rajasree Menon');
      cy.contains('Corresponding Author: Sanjay Jain');
    });
  });
});
