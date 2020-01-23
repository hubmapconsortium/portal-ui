describe('portal-ui', () => {
  beforeEach(() => {
    // Any request we do not explicitly route will return 404,
    // so we won't end up depending on outside resources by accident.
    cy.server({ force404: true });
  });

  it('works', () => {
    cy.visit('http://localhost:5001/');
    cy.contains('Welcome to HuBMAP');
  });
});
