const previews = [
  { path: "multimodal-molecular-imaging-data", title: "Multimodal Molecular Imaging Data" },
  { path: "multimodal-mass-spectrometry-imaging-data", title: "Multimodal Mass Spectrometry Imaging Data" },
  { path: "cell-type-annotations", title: "Cell Type Annotations" },
];

describe("Preview pages", () => {
  it("are linked from the Resources menu", () => {
    cy.visit("/");
    cy.findByTestId("Resources-dropdown").click();
    previews.forEach(({ path }) => cy.get(`.MuiDrawer-paper a[href="/preview/${path}"]`).should("exist"));
  });

  previews.forEach(({ path, title }) => {
    it(`${title} loads Vitessce`, () => {
      cy.visit(`/preview/${path}`);
      cy.get("h1").should("contain", title);
      cy.contains("HuBMAP Data Portal Previews demonstrate functionality");
      cy.get(".vitessce-container", { timeout: 60000 }).find("canvas").should("exist");
    });
  });
});
