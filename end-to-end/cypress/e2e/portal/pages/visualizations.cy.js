// One representative dataset per visualization variant, from the release QA checklist.
// Each is Published with a visualization in both the test and prod indexes.
// Processed datasets redirect to their raw parent, scrolled to `#section-<hubmap id>`.
// `envs` limits a dataset to the API_ENVs where it can render: the Salmon datasets' files are missing from
// assets.test (404 as of 2026-10-02), so those only run against prod.
const datasets = [
  {
    name: "CODEX [Cytokit + SPRM]",
    uuid: "69c70762689b20308bb049ac49653342",
    views: ["Spatial", "Spatial Layers", "Scatterplot (t-SNE)", "Cell Sets", "Antigen List", "Heatmap"],
  },
  { name: "seqFISH", uuid: "c6a254b2dc2ed46b002500ade163a7cc", views: ["Spatial", "Spatial Layers"] },
  { name: "MALDI IMS", uuid: "3bc3ad124014a632d558255626bf38c9", views: ["Spatial", "Spatial Layers"] },
  { name: "NanoDESI", uuid: "6b93107731199733f266bbd0f3bc9747", views: ["Spatial", "Spatial Layers"] },
  {
    name: "Slide-seq [Salmon]",
    uuid: "a1d17fdd270a69c813b872a927dfa5f3",
    views: ["Scatterplot (UMAP)", "Cell Sets", "Gene List", "Heatmap", "Expression by Cell Set", "Spatial"],
    envs: ["prod"],
  },
  {
    name: "snRNA-seq [Salmon] (zarr)",
    uuid: "0b590c9e3a62178da592e85572e2f1bf",
    views: ["Scatterplot (UMAP)", "Cell Sets", "Gene List", "Heatmap", "Expression by Cell Set"],
    envs: ["prod"],
  },
  {
    name: "snRNA-seq [Salmon] (JSON)",
    uuid: "c019a1cd35aab4d2b4a6ff221e92aaab",
    views: ["Scatterplot (UMAP)", "Cell Sets"],
  },
  {
    name: "sciATAC-seq [SnapATAC]",
    uuid: "d4493657cde29702c5ed73932da5317c",
    views: ["Scatterplot (UMAP)", "Cell Sets"],
  },
];

// Vitessce data loads from the assets server and can be slow on the test env.
const vitessceTimeout = { timeout: 90000 };

describe("Dataset visualizations", () => {
  datasets.forEach(({ name, uuid, views, envs }) => {
    it(`${name} renders every Vitessce view without errors`, function () {
      cy.env(["API_ENV"]).then(({ API_ENV = "test" }) => {
        if (envs && !envs.includes(API_ENV)) this.skip();
      });
      cy.visit(`/browse/dataset/${uuid}`);
      cy.findByTestId("entity-title").should("be.visible");
      cy.location("hash").then((hash) => {
        // Hubmap IDs contain dots, so match the id attribute instead of using `#id`.
        const section = hash ? `[id="${decodeURIComponent(hash.slice(1))}"]` : "#visualization";
        cy.get(section).scrollIntoView().find(".vitessce-container", vitessceTimeout).as("vitessce");
      });
      cy.get("@vitessce")
        .scrollIntoView()
        .within(() => {
          cy.get("[role=main]", vitessceTimeout).should("have.length.at.least", 1);
          cy.get("[role=main][aria-busy=true]", vitessceTimeout).should("not.exist");
          // portal-visualization builder errors render as text in a Description view, not as error UI.
          cy.root().should("not.contain", "Error while generating the Vitessce configuration");
          cy.get('[aria-label="Open error info"]').should("not.exist");
          cy.get("canvas").should("exist");
          cy.get("[role=banner] [role=heading]").then(($titles) => {
            const titles = [...$titles].map((el) => el.textContent);
            views.forEach((view) => expect(titles).to.include(view));
          });
        });
    });
  });
});
