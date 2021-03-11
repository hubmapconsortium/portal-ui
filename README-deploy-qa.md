# Portal redeployment and QA

Monday/Wednesday, before 5pm:
*   **John/Ilan** will look at [portal PRs](https://github.com/hubmapconsortium/portal-ui/pulls), and nudge people to merge approved PRs, or get approvals on older PRs. 

Monday/Wednesday, after 5pm: (Or any time that Nils asks for a release...)
*   Harvard TC (**John/Ilan**) makes a new Docker image from portal-ui master.
*   Harvard TC announces on the [portal-deployment channel](https://hubmapconsortium.slack.com/archives/C016TK0APV2) that DEV/TEST/STAGE will be redeployed.
*   Harvard TC redeploys to DEV/TEST/STAGE, makes sure the homepage loads, and announces redeployment.

Tuesday/Thursday testing:
*   Harvard TC (**Tiffany/Chuck**) runs through a brief manual QA test on [https://portal-prod.stage.hubmapconsortium.org/](https://portal-prod.stage.hubmapconsortium.org/).
*   Small quirks are filed as issues.
*   If there are big problems, notify Nils and ask if PROD redeploy can be deferred till next Tuesday/Thursday.

Tuesday/Thursday hand-off:



*   Tester posts to portal-deployment that the image v#.#.# has been tested, and is ready for deployment. Flag [@Zhou (Joe) Yuan](https://hubmapconsortium.slack.com/team/ULCT8GZJ4).

Tuesday/Thursday afternoon:



*   Someone in Pittsburgh deploys that image to both STAGE and PROD.
*   Post to portal-deployment when complete.


# Portal Testing {#portal-testing}

**NOTE: The tester should have the console and the network open when they’re clicking around, so we can watch for errors/unnecessary network requests. (To see both at the same time, bring up Network, and then hit “esc”. Works on FF and Chrome.)**


## Homepage: {#homepage}



*   Header should have the following:
    *    A clickable “HuBMAP” button in the top left that redirect to the homepage
    *   Clickable “Donors,” “Datasets,” “Samples,” a “Collections” button that send you to a url like [https://portal.test.hubmapconsortium.org/search?entity_type[0]=](https://portal.test.hubmapconsortium.org/search?entity_type[0]=) except “Collections” which links to [https://portal.test.hubmapconsortium.org/collections](https://portal.test.hubmapconsortium.org/collections)
*   Icon Buttons under the header should also link to these search fields (same URLS) except “[Number of] Centers” button which links to [https://hubmapconsortium.org/funded-research-tmc/](https://hubmapconsortium.org/funded-research-tmc/)
*   There should be a bar graph showing each assay and its count under the header and the icon buttons
*   Under the bar graph should be a “What is the HuBMAP Data Portal?” Section
*   Under the “What is the HuBMAP Data Portal?” Section there should be a little flow chart with clickable links about searching and submitting data
*   Under the flowchart there are data use guidelines and an email to which users can submit questions
    *   Next to this there should be a twitter feed from the HuBMAP account.
*   Finally there should be little boxes containing information and clickable links about the HuBMAP Consortium, the NIH Common Fund, and how to submit data.


## Search Page (General): {#search-page-general}



*   Every facet on the left side (with check boxes) should be able to checked or unchecked
    *   These changes should influence what shows in the search results table
    *   More than one check mark within one category should be the union operation, and more than one between categories should be intersection operation on the results
    *   If you select a facet that has less than a certain number of results (i.e if there are only females if you select “Black”), the other facets should disappear
    *   BMI and Age should be selectable via the sliders under the bar graph
*   The search box will allow you to perform text searches against the elasticsearch index. Enter a search term, hit enter and entities matching the query across any of its fields will be displayed.


## Datasets {#datasets}

(To do each of these navigate to browse/dataset/uuid_below):

A dataset page will always have the following sections



*   **Summary** 
*   **Attribution**
*   **Provenance**
*   **Files**

A dataset page may have the following sections



*   **Visualization**
*   **Protocols**
*   **Metadata**

How to Check Each Section

**Summary**



*   At the top there should be:
    *   a link to docs about the Assay/Analysis performed.
    *   To the right of this should be the status (QA, Error etc.) and a link to the entity json response

**Visualization**



*   There should be a visualization or no visualization under this top section, depending on whether or not there are visualizable results

    **[CODEX + SPRM](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=CODEX%20%5BCytokit%20%2B%20SPRM%5D&entity_type[0]=Dataset)**

    *   In Vitessce there should be a layer controller, a spatial component, data set metadata, a component to select antigen expression levels, a section to select clusterings, and a heatmap of antigen expression levels.
    *   You should be able to zoom in and out of the image smoothly and interact with each part
    *   If there are no cell segmentations, then the configuration should only have a spatial view, a layer controller, and a data set metadata section
    *   You should be able to change which tile you are looking at using the top right selector

	**[sc###-seq [TYPE]](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=scRNA-seq%20%2810x%20Genomics%29%20%5BSalmon%5D&entity_type[0]=Dataset)**



*   There should be a scatterplot and a left-hand side cell sets pane
*   Each cell should have as ID a nucleotide sequence. The clusters should simply be numbered

**	Imaging Assay [Image Pyramid]**



*   You should be able to zoom in and out, change channels, and add channels
*   For **[seqFish](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=seqFISH%20%5BImage%20Pyramid%5D&entity_type[0]=Dataset)**, you should be able to change the z-level using the selector in the top right

**Attribution**



*   Attribution should include the name of the center (TMC) attributed to the dataset and the dataset creator’s name and email address.

**Provenance**



*   The provenance table should have three columns ‘Donors’, ‘Samples’ and ‘Datasets’.  
    *   The ‘Donors’ column should have a single tile. 
    *   The ‘Samples’ column can have any number of tiles and the first tile should be an ‘Organ’. 
        *   Sample tiles with different specimen types (e.g. Organ, Organ Piece, Fresh frozen oct block) should be separated by a down arrow.
    *   The ‘Datasets’ column should at least include a tile with an inverted color scheme representing the current entity. In some cases there will be additional dataset tiles preceding the inverted tile, there should be a down arrow separating each tile.
*   Clicking on the ‘Graph’ tab in the provenance table should reveal a workflow visualization.
*   In some cases an additional tab, ‘Analysis Details’, will be present clicking on that tab should reveal links to either github or view.commonwl. 

**Files**



*   Files will always have a Bulk Transfer section and will also display a file browser if files are available.


## My Lists {#my-lists}

On Donor/Sample/Dataset pages



*   A ‘Save’ button which opens a dialog to save the entity. Once saved, a success alert should appear at the top of the page, the save button should switch to an ‘Edit Saved Status’ button and the entity should exist in the ‘My Saved Items’ table on the ‘My Lists’ page.
*   The ‘Edit Saved Status’ button opens a dialog which allows you to add the saved entity to multiple saved lists at once. Once submitted a success alert should appear at the top of the page.

On the My Lists page

Manual QA WIP

It’s helpful to perform each action with the devtools console and networking tabs open to detect errors, warnings and generally monitor each page’s requests.

**Home Page**



*   Centers/Donors/Samples/Datasets counts should each have values.
*   Bar chart should be populated.
*   Tweets sidebar should be populated.
*   Mobile menu should contain the same links as the desktop app bar.

**Search Pages**



*   Performing a search should alter results.
*   Sidebar facets and filtering should alter results.
*   HuBMAP ID (table view) and tiles (tile view) should link to the correct detail page.
*   Sorting in header row (table view) and dropdown (tile view) should work.
*   Logging in should result in additional data with updated facets in the status section of the sidebar.
*   If needed delete ‘has_exited_dataset_search_tutorial’  in local storage to begin the search tutorial. The search tutorial should traverse its steps beginning to end. (Dataset search page only).
*   Dev Search page (/dev-search) should load without error.

**Detail Pages. **Confirm the below for a variety of entities spread across assay types for datasets, specimen types for samples, and groups for donors.



    *   Table of contents sidebar should reflect the sections on the page starting with ‘Summary’. Clicking a link should bring you to the appropriate section.
    *   Scrolling past the summary section should reveal a header below the primary app bar.
    *   Clicking on the file button in the summary should open a new tab with JSON shown.
    *   The provenance section can include up to three tabs, ‘Table’, ‘Graph’ and ‘Analysis Details’ please review dataset pages until you’ve reviewed each at least once.
        *   The table should include equal sized tiles populated with metadata. The tile which represents the current page should have a majority purple background.
        *   The graph should include nodes which end with a node representing the current page. Clicking a node should reveal a detail pane below.
        *   The analysis details sections should include links to GitHub and CWL viewer.
    *   The files section is only present for those datasets with available files. Please review datasets until a files section is present. You should be able to click to open directories until a file is shown. Clicking on the file should download once you’ve agreed to the DUA.
    *   Find a dataset with a ‘Visualization’ section and a Vitessce component.

    **[CODEX + SPRM](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=CODEX%20%5BCytokit%20%2B%20SPRM%5D&entity_type[0]=Dataset)**

    *   In Vitessce there should be a layer controller, a spatial component, data set metadata, a component to select antigen expression levels, a section to select clusterings, and a heatmap of antigen expression levels.
    *   You should be able to zoom in and out of the image smoothly and interact with each part
    *   If there are no cell segmentations, then the configuration should only have a spatial view, a layer controller, and a data set metadata section
    *   You should be able to change which tile you are looking at using the top right selector

	**[sc###-seq [TYPE]](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=scRNA-seq%20%2810x%20Genomics%29%20%5BSalmon%5D&entity_type[0]=Dataset)**



*   There should be a scatterplot and a left-hand side cell sets pane
*   Each cell should have as ID a nucleotide sequence. The clusters should simply be numbered

	Imaging Assay [Image Pyramid]



*   You should be able to zoom in and out, change channels, and add channels
*   For **[seqFish](https://portal-prod.stage.hubmapconsortium.org/search?mapped_data_types[0]=seqFISH%20%5BImage%20Pyramid%5D&entity_type[0]=Dataset)**, you should be able to change the z-level using the selector in the top right

**Saved Lists**



*   Visit the ‘My Lists’ page and create a list. Once created the list should be displayed below ‘All Created Lists’.
*   Visit a detail page and click the ‘Save’ button in the summary section, returning to the ‘My Lists’ page should show the entity below the ‘My Saved Items’ section. Click the checkbox to add the item to an existing list. The new item should show in both the list’s entity counts and on the list’s detail page.

**Preview Pages**



*   Each preview page should load. The pages ‘Multimodal Molecular Imaging Data’ and ‘Cell Type Annotations’ should have a working Vitessce component.

**Collections Page**



*   The collections page should contain a list of panels which contain information about a collection and link to the respective collection.

**Collection Page**



*   The contacts, datasets, creators tables should be populated. The organ column in the datasets table should be empty for now.