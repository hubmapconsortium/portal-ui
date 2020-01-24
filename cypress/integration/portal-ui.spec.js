describe('portal-ui', () => {
  it('works', () => {
    // Homepage
    cy.visit('/');
    cy.contains('Welcome to HuBMAP');
    cy.contains('Human BioMolecular Atlas Program: Supported by the NIH Common Fund.');

    // Donors browse
    cy.contains('Donors').click();
    cy.contains('Browse donor')

    // Donors details
    cy.contains('TODO: name').click();
    cy.contains('Warning!');
    cy.contains('Mock Entity');
    // Provenance
    cy.contains('undefined - Input');
    // Vitessce
    cy.contains('Scatterplot (t-SNE)')
    cy.contains('4839 cells');

    // Samples browse
    cy.contains('Samples').click();
    cy.contains('Browse sample');

    // Sample details
    cy.contains('TODO: name').click();
    cy.contains('Warning!');
    cy.contains('Mock Entity');

    // Help
    cy.contains('Help').click();
    cy.contains('TODO: Say something helpful here!');

    // Login
    cy.contains('Login');
    // Don't click! We shouldn't depend on Globus in tests.
  });
});
