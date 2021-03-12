import sampleMetadata from '../fixtures/provenance/sample-metadata';

describe('sample provenance', () => {
    context('macbook-size', () => {
      beforeEach(() => {
        cy.viewport('macbook-15')
      })

      it('should display the correct initial nodes', () => {
        cy.intercept('POST', 'https://search*.hubmapconsortium.org/portal/search', {
            statusCode: 200,
            body: {'sampleMetadata': 'a'},
        });
        cy.visit('/browse/sample/13129ad371683171b152618c83fd9e6f');
        cy.findByText('HBM666.CHPF.373')
        cy.findByText("Graph").click();

        const sampleEntityText = 'Sample - HBM666.CHPF.373';
        const nodesText = [
          'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
          'Register Donor Activity - HBM398.NBBW.527',
          'Donor - HBM547.NCQL.874',
          'Create Sample Activite - HBM665.NTZB.997',
          sampleEntityText,
        ];
      
        nodesText.forEach((text) => cy.findByText(text).should('exist'));
      });
});
});
