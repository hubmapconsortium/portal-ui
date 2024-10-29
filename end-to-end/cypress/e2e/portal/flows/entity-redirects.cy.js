/******************************************************************************************
 * 
 *  Tests whether entities redirect to the appropriate detail page.
 * 
 *  Description:
 *  ----------------------------------------------------------------------------
 *  Checks that the title element of each page type is visible and that the URL contains
 *  the expected UUID.
 * 
 ******************************************************************************************/

describe("Entity does not redirect unnecessarily", () => {
  const testCases = [
    {
      name: "Raw dataset",
      entityType: "dataset",
      uuid: "7b878dd4eceab573447ffd9b429afda8",
    },
    {
      name: "Donor",
      entityType: "donor",
      uuid: "03b82562be364ef03017f7861e60d723",
    },
    {
      name: "Sample",
      entityType: "sample",
      uuid: "c18dbe465fe2dfddd96b0382c6c4b38b",
    },
    {
      name: "Collection",
      entityType: "collection",
      uuid: "3ae4ddfc175d768af5526a010bfe95aa",
    },
  ];

  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });

    testCases.forEach(({ name, entityType, uuid }) => {
      it(`${name}`, () => {
        cy.visit(`/browse/${entityType}/${uuid}`, { failOnStatusCode: false });
        cy.url().should("include", `/browse/${entityType}/${uuid}`);
        cy.findByTestId("entity-title").should("exist").and("be.visible");
      });
    });
  });
});

describe("Entity redirects successfully", () => {
  const testCases = [
    {
      name: "Centrally processed dataset",
      entityType: "dataset",
      uuid: "8fd6bb5cd1a69fc699342eb118565734",
      expectedRedirectUuid: "1f3dd0d92f290e9a57db81ce5aea9284",
    },
    {
      name: "Lab processed dataset",
      entityType: "dataset",
      uuid: "9f37a9b1f6073e6e588ff7e0dd9493b5",
      expectedRedirectUuid: "c6a254b2dc2ed46b002500ade163a7cc",
    },
    {
      name: "Support dataset",
      entityType: "dataset",
      uuid: "72fc3a9360628f251090d030b245e217",
      expectedRedirectUuid: "bae7726744880f0d066980e617f1fff3",
    },
    // TODO: add EPICs when they are available
  ];

  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });

    testCases.forEach(({ name, entityType, uuid, expectedRedirectUuid }) => {
      it(`${name}`, () => {
        cy.visit(`/browse/${entityType}/${uuid}`, { failOnStatusCode: false });
        cy.url().should("include", `/browse/${entityType}/${expectedRedirectUuid}`);
        cy.findByTestId("entity-title").should("exist").and("be.visible");
      });
    });
  });
});

describe("Entity redirects to 404 when appropriate", () => {
  const testCases = [
    {
      name: "Invalid UUID",
      entityType: "dataset",
      uuid: "not-valid"
    },
  ];

  context("macbook-size", () => {
    beforeEach(() => {
      cy.viewport("macbook-15");
    });

    testCases.forEach(({ name, entityType, uuid }) => {
      it(`${name}`, () => {
        cy.visit(`/browse/${entityType}/${uuid}`, { failOnStatusCode: false });
        cy.contains("404").should("be.visible");
      });
    });
  });
});

