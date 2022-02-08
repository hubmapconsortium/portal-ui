describe('portal-ui-maintenance', () => {
    it('has expected text', () => {
      cy.visit('http://localhost:8000');
      cy.contains('Portal Maintenance');
      cy.contains('Portal unavailable for scheduled maintenance.');
  });
});
