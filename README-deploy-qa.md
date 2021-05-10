# Portal deployment and QA

## Deployment

Monday/Wednesday, before 5pm:
*   **John/Ilan** will review warnings from the portal in CloudWatch, and triage as appropriate. There should be no errors we get used to ignoring.
*   **John/Ilan** will look at [portal PRs](https://github.com/hubmapconsortium/portal-ui/pulls), and nudge people to merge approved PRs, or get approvals on older PRs. 

Monday/Wednesday, after 5pm: (Or any time that Nils asks for a release...)
*   Harvard TC (**John/Ilan**) makes a new Docker image from portal-ui master.
*   Harvard TC announces on [`#portal-deployment`](https://hubmapconsortium.slack.com/archives/C016TK0APV2) that DEV/TEST/STAGE will be redeployed.
*   Harvard TC redeploys to DEV/TEST/STAGE, makes sure the homepage loads, and announces redeployment.

Tuesday/Thursday testing:
*   Harvard TC (**Tiffany/Chuck**) runs through a brief manual QA test on [`https://portal-prod.stage.hubmapconsortium.org/`](https://portal-prod.stage.hubmapconsortium.org/); Details below.
*   Small quirks are filed as issues.
*   If there are big problems, ping Chuck, and decide whether production release can just wait till the next regularly scheduled release, or if a redeploy is needed sooner. Post an update to `#portal-deployment`.

Tuesday/Thursday hand-off:
*   Tester posts to `#portal-deployment` that the image `v#.#.#` has been tested, and is ready for deployment. Flag `@Zhou (Joe) Yuan`.

Tuesday/Thursday afternoon:
*   Zhou deploys that image to PROD,
*   and posts to `#portal-deployment` when complete.

## QA

- For QA, use the STAGE instance configured to hit the PROD APIs: [`https://portal-prod.stage.hubmapconsortium.org/`](https://portal-prod.stage.hubmapconsortium.org).
- It’s helpful to have the console and networking tabs open: To see both at the same time, bring up Network, and then hit “esc”.

### Home Page

*   Centers/Donors/Samples/Datasets counts should each have values.
*   Bar chart should be populated.
*   Tweets sidebar should be populated.
*   Mobile menu should contain the same links as the desktop app bar.

### Search Pages

*   Performing a search should alter results.
*   Sidebar facets and filtering should alter results.
*   HuBMAP ID (table view) and tiles (tile view) should link to the correct detail page.
*   Sorting in header row (table view) and dropdown (tile view) should work.
*   Logging in should result in additional data with updated facets in the status section of the sidebar.
*   If needed delete `has_exited_dataset_search_tutorial`  in local storage to begin the search tutorial. The search tutorial should traverse its steps beginning to end. (Dataset search page only).
*   [Dev Search](https://portal-prod.stage.hubmapconsortium.org/dev-search) should load without error.

### Detail Pages

Confirm the below for a variety of entities spread across assay types for datasets, specimen types for samples, and groups for donors.

*   Table of contents sidebar should reflect the sections on the page starting with ‘Summary’. Clicking a link should bring you to the appropriate section.
*   Scrolling past the summary section should reveal a header below the primary app bar.
*   Clicking on the file button in the summary should open a new tab with JSON shown.
*   The provenance section can include up to three tabs, ‘Table’, ‘Graph’ and ‘Analysis Details’. Please review dataset pages until you’ve reviewed each at least once.
    *   The table should include equal sized tiles populated with metadata. The tile which represents the current page should have a majority purple background.
    *   The graph should include nodes which end with a node representing the current page. Clicking a node should reveal a detail pane below.
    *   The analysis details sections should include links to GitHub and CWL viewer.
*   The files section is only present for those datasets with available files. Please review datasets until a files section is present. You should be able to click to open directories until a file is shown. Clicking on the file should download once you’ve agreed to the DUA.
*   Find a dataset with a ‘Visualization’ section and a Vitessce component.

**[CODEX + SPRM](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=CODEX%20%5BCytokit%20%2B%20SPRM%5D&entity_type[0]=Dataset)**

*   In Vitessce there should be a layer controller, a spatial component, data set metadata, a component to select antigen expression levels, a section to select clusterings, and a heatmap of antigen expression levels.
*   You should be able to zoom in and out of the image smoothly and interact with each part.
*   If there are no cell segmentations, then the configuration should only have a spatial view, a layer controller, and a data set metadata section.
*   You should be able to change which tile you are looking at using the top right selector.

**[sc###-seq [TYPE]](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=scRNA-seq%20%2810x%20Genomics%29%20%5BSalmon%5D&entity_type[0]=Dataset)**

*   There should be a scatterplot and a left-hand side cell sets pane.
*   Each cell should have as ID a nucleotide sequence. The clusters should simply be numbered.

Imaging Assay [Image Pyramid]

*   You should be able to zoom in and out, change channels, and add channels.
*   For **[seqFish](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=seqFISH&entity_type[0]=Dataset)**, you should be able to change the z-level using the selector in the top right.

### Saved Lists

*   Visit the ‘My Lists’ page and create a list. Once created the list should be displayed below ‘All Created Lists’.
*   Visit a detail page and click the ‘Save’ button in the summary section, returning to the ‘My Lists’ page should show the entity below the ‘My Saved Items’ section. Click the checkbox to add the item to an existing list. The new item should show in both the list’s entity counts and on the list’s detail page.

### Preview Pages

*   Each preview page should load. The pages ‘Multimodal Molecular Imaging Data’ and ‘Cell Type Annotations’ should have a working Vitessce component.

### Collections Page

*   The collections page should contain a list of panels which contain information about a collection and link to the respective collection.

### Collection Page

*   The contacts, datasets, creators tables should be populated. The organ column in the datasets table should be empty for now.
