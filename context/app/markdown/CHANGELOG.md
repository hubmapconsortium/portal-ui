# Changelog

## v1.30.0 - 2025-07-29

- Fix misalignment visible in expandable tables.
- Fix export of grouped stacked bar chart with long x axis labels.
- Fix orientation of cell types landing page expand icons.



## v1.29.3 - 2025-07-24

- Check user's access to specific datasets for workspace and bulk download operations using new access endpoint.
- Prevent workspaces and lists from being named with only whitespace, which breaks links.
- Add grouped stacked bar charts to dataset overviews on molecular data query, cell type detail, and gene detail apges.
- Move expand icon in gene dataset table to left side.
- Fix initial sort for cell type landing page.
- Add whitespace to top of cell type landing page graph.
- Update portal-visualization to support vitessce configuation building for Xenium Assays.

## v1.29.2 - 2025-07-21

- Update data products endpoint.
- Fix bug where links in dataset workflow details could not be clicked.

## v1.29.1 - 2025-07-16

- Fix genes-info endpoint parameters.
- Add metadata endpoint for UDI demo site.
- Update portal-visualization version to fix the multiomic datasets' visualizations.

## v1.29.0 - 2025-07-11

- Update workspace and bulk data transfer dialogs to allow access to protected datasets.
- Update processed dataset analysis sections with more detailed workflow information.
- Update gene detail page to display relevant cell types and molecular data query results.
- Add tracking to biomarker landing page.
- Update Python dependencies to eliminate reported vulnerabilities.
- Update to Python 3.12.
- Update to NodeJS 22.
- Update outdated dependencies where possible to address security concerns.
- Implement Cell Types landing page.
- Add facets to filter datasets with annotations.
- Replace hard coded list of Azimuth annotated datasets with search query.
- Update Vitessce to v3.6.4.

## v1.28.1 - 2025-06-27

- Fix flipped 'up' and 'down' icons across the portal.

## v1.28.0 - 2025-06-26

Fix typo on Workspaces Sharing dialog.

- Add support for new "initializing" workspace state.
- Update gene detail page to display relevant cell types and molecular data query results.
- List associated publications on dataset detail pages.
- Update homepage news items as of June 2025.
- Open OpenKeyNav commands description when OpenKeyNav is enabled.

## v1.27.4 - 2025-06-13

- Allow multiple workspaces to run concurrently.
- Update eui import parameters to support 2.3 update.

## v1.27.3 - 2025-06-11

- Restore summary link to gene detail page table of contents.
- Remove `other` cells from gene detail page.
- Fix incorrect `biomarkers` link.

## v1.27.2 - 2025-06-11

- Fix bug where disabling OpenKeyNav did not have an effect.

## v1.27.1 - 2025-06-10

- Update gene detail page to display relevant cell types and molecular data query results.
- Address bugs related to OpenKeyNav integration.
- Updates portal-viz version to 0.4.7 to reflect support for visualizing zarr.zip files.

## v1.27.0 - 2025-06-05

- Add table of indexed cell types found in a given organ to organ pages.
- Integrate OpenKeyNav accessibility tool.
- Add the data products and scfind APIs to the service status page.

## v1.26.2 - 2025-05-29

- Fix gene pathways effect causing molecular data queries to fail.

## v1.26.1 - 2025-05-28

- Make admin banner mobile friendly.
- Added gene pathway selection to molecular data query page.
- Fix for continuously expanding assay charts on Organ pages.
- Fix search table sizing issues on Publication and Collection pages.
- Add facet to dataset search page to filter datasets to only those linked to a publication.
- Update ordering of data table tabs on Publication detail pages.
- Update publication header tags for SEO.

## v1.26.0 - 2025-05-16

- Update portal sitemap to include all relevant landing and detail pages.
- Add support for querying for datasets by gene using scFind.
- Update Collections detail pages.
- Update Collections landing page.
- Update Publications landing page.

## v1.25.1 - 2025-05-05

- Add analytics to main navigation.
- Update collections landing page metadata description.
- Update homepage description language.
- Update tab styling in Bulk Data Transfer section.
- Rolled back portal-viz version to address Visium scaling issue pending further clarification.
- Update molecular query and biomarker page layout.
- Add scFind as cell type lookup option.
- Update "What's New" section of the homepage for March and April.

## v1.25.0 - 2025-04-28

- Add analytics to homepage.
- Add eslint rule for MUI imports.
- Fix workspace sharing dialog text.
- Fix checkbox header styling on workspace landing page.

## v1.24.2 - 2025-04-24

- Add sharing functionality to workspaces.

## v1.24.1 - 2025-04-23

- Add analytics to organ pages.
- Enable easy links to the search page with hierarchical facets selected.

## v1.24.0 - 2025-04-14

- Add admin banner to top of portal header.
- Add SCFind API endpoint setup and relevant tests.
- Fix text on SnareSeq2 info banners.
- Hide links to Shiny apps in organ data products if unavailable.

## v1.23.1 - 2025-04-02

- Add event tracking for all data products sections on organ pages.
- Update unified dataset detail page to improve clarity surrounding SnareSeq2 datasets.
- Updated HTML titles and meta-descriptions for homepage, organ pages, dataset detail pages, donor detail pages, sample detail pages, collection pages, and publication pages.
- List publication contributors in original author order.
- Updated portal viz version to fix the scaling issue for Visium datasets spot layer.
- Update toggle color in dialogs for clarity.

## v1.23.0 - 2025-03-24

- Add support for additional deepcell annotations by updating to portal-visualization 0.4.2.

## v1.22.1 - 2025-03-10

- Show data products on pages for organs with laterality.

## v1.22.0 - 2025-03-07

- Add data products section to Organ pages.
- Update homepage timeline items to include SNARE-seq2, Cell Population Tool, and My Lists-related announcements.
- Update description on My Lists page for non-HuBMAP users.
- Update portal-viz version to address the scaling issue for EPIC segmentation masks.
- Update Ubuntu version used by GitHub CI.

## v1.21.1 - 2025-02-24

- Fix casing of ABO blood group chart titles on diversity page.
- Restrict "My Lists" feature to HuBMAP users only.

## v1.21.0 - 2025-02-20

- Use new `abo_blood_group_system` field in donor charts.
- Fix bug on search pages where range filter was not applied if the min value is zero.
- Update search page menu styles.

## v1.20.3 - 2025-02-13

- Add metrics for the "My Lists" feature.
- Update "My Lists" feature to persist across devices for logged-in users.
- Update "My Lists" UI and messaging.
- Update services page to include new UKV endpoint.

## v1.20.2 - 2025-02-12

- Fix collections tabs being unselectable.
- Fix display of provenance table for datasets with large ancestor trees.
- Fix bug allowing non-public datasets to be added to workspaces.
- Ensure ovary and fallopian tube organ pages are properly populated with left/right laterality datasets.
- Ensure urinary bladder organ page includes Bladder datasets.
- Ensure bladder organ icon displays appropriately.
- Ensure cell population plot controls drawer does not overlap the app bar.
- Sort "Recent Publications" on home page by publication date.
- Update processed dataset files section with link to Bulk Data Transfer section.

## v1.20.1 - 2025-02-06

- Fix cell population plot controls drawer positioning and scroll issues.
- Fix cell oppulation plot controls drawer not appearing when visualization is expanded.
- Improve position of metadata value bars in cell population plot.
- Updated Vitessce to fix the infinite loops happening for EPIC segmentation mask.
- Fix bug causing workspace title field in new workspace dialog to be cleared.

## v1.20.0 - 2025-02-05

- Fix overlap between expanded rows and violins when there are few datasets in cellpop visualization.
- Fix cellpop control position breaking on scroll.
- Fix cellpop expanded rows handling when data is being normalized.
- Updated portal-viz version to address the scaling issue on kaggle datasets visualizations.

## v1.19.5 - 2025-02-04

- Add an info banner to template pages without sample workspaces.
- Fix missing space and period in Azimuth link above cell population chart.
- Fix organ page crashing when marking dataset as visible while another dataset is expanded.
- Fix field outline overlapping with label of heatmap normalization control.
- Fix overlapping between violins in Cellpop visualizations.
- Add checks before trying to access a workspace's symlinked files (resolves 2023 workspaces API bug).

## v1.19.4 - 2025-01-31

- Fix Cell Population Plot table of contents title.
- Improve Cell Population Plot padding.
- Fix Cell Population Plot violin graph behavior.

## v1.19.3 - 2025-01-29

- Add scalable cell population plots to organ pages with compatible labeled datasets.

## v1.19.2 - 2025-01-27

- Fixes logic to provide parent uuid to the config builder.

## v1.19.1 - 2025-01-23

- Fix publications page crashing when supporting json data is completely missing.

## v1.19.0 - 2025-01-22

- Improve handling of empty vignette lists so that the publication page does not crash if an empty list is provided.
- Updated logic to access the builder for EPIC Segmentation masks using the epic vitessce-hint.

## v1.18.4 - 2025-01-15

- Updated homepage news items.
- Fix persistence of selected marker genes after redirect to primary dataset.
- Upgrade to Python 3.10.
- Introduce `uv` for python package management.

## v1.18.3 - 2025-01-10

- Fix provenance graph for datasets without descendants.

## v1.18.2 - 2025-01-07

- Fix metadata filter on dev-search.
- Only request workspaces token for workspaces users during auth routine.

## v1.18.1 - 2025-01-07

- Resolve accessibility issues related to arias and interactive controls throughout the portal.
- Update processed dataset files and analysis sections to match updated ingest metadata.
- Fix issue in push script where if the number of days since the last release is 0 the script returns early.
- Addressed accessibility issue on home page to ensure elements with scrollable content are accessible by keyboard.
- Addressed accessibility issue to ensure elements with scrollable content are accessible by keyboard.

## v1.18.0 - 2025-01-06

- Added informative alert upon successful bulk download manifest download.
- Update portal to account for refactored metadata from search api.

## v1.17.0 - 2024-12-19

- Update to ESLint v9.
- Update minor versions of development dependencies to resolve security concerns.
- Added discernible text to the links on stacked barcharts and tiles.
- Fixed accessibility issue regarding html element having a lang attribute.
- Bump portal-visualization version to 0.3.6 to resolve regression with vis-lifting image pyramid assays.

## v1.16.3 - 2024-12-13

- Fix a regression in portal-visualization which broke Vitessce view config generation.

## v1.16.2 - 2024-12-12

- Remove Multi-Assay Relationship section in favor of Dataset Relationships diagram.
- Updated Storybook and related dependencies to latest version (8.4.7)
- Updated SWC and plugins to support Storybook 8.4.7.
- Updated React Testing Library to v16.
- Updated `msw` to 2.6.8.
- Updated TypeScript to 5.7.2.
- Updated MUI to v6.
- Updated pillow to v11.
- Updated aiohttp to v3.10.11.
- Updated tornado to v6.4.
- Updated setuptools to v75.6.0.
- Updated react-pdf to v7.7.3.
- Updated cryptography to v43.0.1.
- Updated fonttools to v4.43.0.
- Updated urllib3 to v1.26.17.
- Updated certifi to v2023.7.22.
- Updated jupyterapp to v4.11.2.
- Updated wheel to v0.38.1.
- Updated werkzeug to v3.0.6.
- Updated zipp to v3.19.2.
- Updated scikit-learn to v1.5.0.
- Updated jinja2 to v3.1.4.
- Updated black to v24.3.0.
- Update portal-visualization to 0.3.3 which replaces calls to ingest-api with calls to search-api.

## v1.16.1 - 2024-12-06

- Fix bug where you could not scroll to deeper search pages.

## v1.16.0 - 2024-12-05

- Fix date picker bug on search page that prevented the user from selecting a year.

## v1.15.2 - 2024-12-02

- Disable date facet text input and update button color.
- Get dataset pipeline info from search-api not the soft assay endpoint.
- Update Workspaces feature access instructions.
- Add discernible text to buttons to support accessibility.

## v1.15.1 - 2024-11-26

- Add bulk file download option to the Bulk Download section of dataset detail pages.
- Ensure that helper menu/table of contents only appear when the browser is wide enough to show both fully.
- Fix missing publication dates for datasets on Publication pages.
- Fix scroll tracking on detail page table of contents so that processed dataset subsections are properly selected.
- Fix bug where tile dropdown on search pages was not displaying the selected field.
- Fix bug with date facet validation.
- Improve date picker styles.
- Fix order of search menus.

## v1.15.0 - 2024-11-20

- Fix spacing between organ icon and name on detail pages.
- Add dialog option to the Search, Publication, and Collection pages that generates a download manifest for files from selected datasets.
- Add warning banner to empty columns in provenance tables.
- Switch to using "Creation Date" for samples/donors and switch to using "Publication Date" or "Last Modified" for datasets.
- Remove invalid ORCID IDs from Attribution tables.
- Replace searchkit.

## v1.14.1 - 2024-11-13

- Fix minor graphical issues in homepage hero section.
- Use `Image Pyramid` pipeline name as a heuristic for whether a visualization link should be present in unified dataset table of contents.
- Update portal-viz hash to reflect the view adjustment for EPIC segmentation mask.
- Updated support for EPIC segmentation masks visualization.

## v1.14.0 - 2024-11-06

- Adjust ID fetching for infinite scroll table to ensure "select all" functionality works as expected.
- Fix View PDF button disappearing while PDF is processing.
- Remove square white background behind PDF modal's close button.
- Converted sample detail page to TypeScript.
- Add "View Vitessce Configuration" button to processed datasets with visualizations.
- Add space between footer columns to improve readability.
- Adjust homepage queries to exclude donors/samples without descended datasets.
- Adjust homepage queries to exclude datasets in a non-QA/Published state.
- Revise Collection DOI links to copy on click instead of opening a new tab that leads to the same page.
- Remove workspace menu button from publication pages.
- Fix styling for provenance graph to avoid tall, difficult to read graphs.

## v1.13.1 - 2024-10-31

- Fix parent UUID handling for multi-vitessce conf datasets.
- Fix EPIC Bulk Data Transfer section tabs and prevent these from crashing the page.
- Update support entity and processed/component dataset redirects to go only to the appropriate primary datasets.
- Fix bug causing table of contents on EPIC detail pages to show duplicate entries and not link to the correct sections.
- Label centrally processed dataset groups as HIVE in the helper panel.
- Fix typo in publication collections summary.
- Add group name to raw dataset summary section.
- Use assay_display_name instead of pipeline when labelling EPIC dataset sections.
- Update language in processed dataset sections from "pipeline" to "analysis".
- Display EPIC datasets as being generated via external processing in dataset relationship diagrams.

## v1.13.0 - 2024-10-23

- Add end-to-end tests that check whether all page types load successfully.
- Fix bug where expanding a processed dataset section leads to a shaking viewport.
- If a title or description in a processed dataset helper panel is truncated, show the full text on hover in a tooltip.
- Updated HRA EUI and organ-info web components to latest version

## v1.12.2 - 2024-10-17

- Add access levels to processed dataset helper panels.
- Use relevant access levels when determining whether or not to show workspace buttons on dataset detail pages.
- Add title to changelog page.
- Ensure visualizations for image pyramids use parent UUID to fetch notebooks.
- Restore missing columns to derived entities section.
- Remove Provenance section from donor page in favor of using derived data tables.
- Fix Webkit-specific bugs that caused the entity header to become misaligned.
- Resolve issues of header cutting off the top of detail pages and header shifting off-screen when scrolling.
- Switch to using metadata table with tabs component in the Sample and Donor pages.
- In the metadata sections of Dataset, Sample, and Donor pages, add tabs for any entities in the Provenance section with metadata.
- Update the metadata table component to show unique labels for each tab and to be scrollable when many tabs are present.
- Fix issue of Workspaces button being available for protected datasets in the Visualization section.

## v1.12.1 - 2024-10-10

- Prevent collections without a DOI from being counted on the homepage.
- Avoid page scrolling from using arrow keys on vitessce visualization.
- Prevent malformed provenance graph data from crashing the entire page.
- Improve readability of pipeline list in processed dataset sections.
- Append HuBMAP ID to errored datasets' URL anchors to avoid anchor duplication on dataset pages with multiple failed processing attempts.
- Improve entity header state handling of page resizes.
- Fix push script to correctly check latest minor version date.
- Sort publications by their date of publication.
- Update Unified View redirect toast to be more informative.
- Update group for HIVE-processed datasets to be 'HIVE'.

## v1.12.0 - 2024-10-07

- Fix bug on dataset detail page for workspace dialogs opened in succession for different processed datasets.
- Remove "Contact" and "Last Modified" columns from the Datasets table on Collections pages.
- Delete STAGE environment and spin up new portal instance on TEST

## v1.11.0 - 2024-10-02

- Add messaging where donors with ages > 89 are displayed on search and detail pages.
- Fix "Add to workspace" bug on dataset detail pages.
- Fix positioning of dropdown order menu on the tile view of the search page.
- Fix tabs moving around in bulk data transfer section on detail pages.
- Update unified datasets link in "What’s New" section on homepage to point to an example dataset detail page.
- Adjust size of "summary" view in entity headers dynamically based on the length of the content.
- Remove "Contact" section and add Attribution table with contributors for EPICs and Lab Processed datasets.

## v1.10.0 - 2024-09-25

- Only allow Globus group members to access sample workspaces.
- Fix bug where template examples with default resource options would not launch.

## v1.9.0 - 2024-09-24

- Fix bug where donor pages for donors without metadata do not display.
- Remove extra files accordion from processed datasets summary sections.
- Allow Jupyter notebooks for dataset visualizations to be downloaded by all users.

## v1.8.0 - 2024-09-19

- Fix Advanced Config marker issue.
- Remove extraneous tooltip from the non-selectable template grid.
- Fix "Copy to Clipboard" error when copying dataset IDs.
- Rely on template job type, not example job type (which is not always present).

## v1.7.0 - 2024-09-18

- Increase maximum resource options for workspace jobs from 2 CPUs to 16, 32GB of memory to 128GB and session length from 6 hours to 12.
- Add last modified date to template detail pages.

## v1.6.0 - 2024-09-17

- Add tracking to landing pages and detail pages for workspaces and templates.
- Fix bug causing detail page for unpublished collections to error.
- Drop support for collection creators.
- Add language to workspace environment sections to help users distinguish between environments.
- Update Launch Workspace dialogs to account for new R template.
- Add templates landing page and template detail pages.

## v1.5.0 - 2024-09-10

- Hide HuBMAP ID's for non-entity nodes in provenance graph.
- Improve combined provenance logic to safeguard against duplicate nodes/edges.
- Update menu choices for the workspace buttons in unified views dataset detail pages.

## v1.4.0 - 2024-09-06

- Add advanced configuration options to workspace job dialogs.
- Update attribution and processed dataset section language.
- Direct users to HuBMAP Help Desk for questions about internally processed datasets.
- Update workspace success toast to indicate whether the workspace has launched in a new tab or just been created.
- Centralize toast messages for workspaces into a single file.

## v1.3.0 - 2024-09-05

- Improve handling of loading/potentially undefined data in dataset relationship diagram.
- Ensure data product and file URLs use relevant dataset IDs when constructing.

## v1.2.0 - 2024-09-04

- Improve status icon visibility on collapsed processed dataset accordions.
- Add smooth scrolling for dataset relationships links.
- Make dataset relationship node behavior clearer by adding explanatory toast, tooltip, and using appropriate cursor.
- Expand processed datasets if navigated to via table of contents or dataset relationships node link.

## v1.1.0 - 2024-09-03

- Fix color of alerts' icons.
- Fix regression in 303 redirect.
- Fix descendants lookup query so it looks for either dataset descendants or image pyramid support descendants.

## v1.0.1 - 2024-08-28

- Add the HuBMAP ID search bar component to the "Launch New Workspace" dialog on the "My Workspaces" landing page.
- Deprecate `ancestors`, `descendants`, and their `immediate` variants to only look up by ID.
- Improve behavior of entity header at certain intermediate screen widths.
- Handle both contributors and creators fields for collections until the creators field is renamed to contributors.
- Adjust link for 10X Multiome/Visium news item to point to those assays specifically.
- Update language describing HRA/EUI/ASCT+B Reporter on the homepage and navigation.
- Update to Styled-Components v6.
- Standardize styling to use the same utility/theme provider throughout the site.
- Prevent helper panel overflow from long titles/descriptions.
- Prevent lifting of publication ancillary data on dataset pages.
- Remove excessive margin on section descriptions.
- Indicate disabled state on entity header items.
- Add tooltip to bulk download shortcut link.
- Restore assay graphs for datasets with no defined search terms but with present datasets.
- Remove duplicate HuBMAP ID from bulk data transfer panel links.
- Fix single-tab table styles so the single tab appears selected.
- Add tooltips to unlabeled status icons.
- Remove link from helper panel dataset ID display.
- Add "Relevant Pages" section to workspace detail pages.
- Update language and add an action button to toasts for successful workspace creation.
- Enable access to workspaces for users in HuBMAP Read or HuBMAP Workspaces globus groups.

## v1.0.0 - 2024-08-23

- Extend provenance table logic to handle missing entities.
- Fix handling of large search requests.
- Request less data for provenance table tiles.
- Add dataset relationships diagram.
- Fix multi-assay provenance overflow.
- Fix `push` script compatibility with mac OS.
- Update homepage news to inform users about unified dataset pages and multiomic dataset availability.
- Added processed datasets section to display all visualizations for a given raw dataset.
- Extended push script to support major version bumps.
- Update raw dataset detail pages to include processed dataset information.
- Update table of contents design.

## v0.103.1 - 2024-08-19

- Fix bug preventing visualization notebooks from being downloaded on dataset detail pages.
- Fix bug that prevented protected dataset ids from being displayed in "Launch New Workspace" dialog.
- Change banner above "Contributors" and "Attribution" sections from an alert to a styled paper component.

## v0.103.0 - 2024-08-15

- Clear workspace dropdown after adding a dataset to a workspace.
- Prevent already running workspaces from prompting the user to choose a job type.
- Disable "Launch Workspace" button when a workspace title is not provided.
- Fix spacing issue for alert banners that show in datasets section of the "Create New Workspace" dialog.
- Fixed view expansion in the visualization section to overflow within the container and not outside it.
- Update download button on Visualization section of detail pages to a Workspaces dropdown menu button.
- Update "What's New?" homepage listing with June 2024 user facing updates.

## v0.102.5 - 2024-08-06

- Add a check for "Contacts" data to display in the Contributors table of the detail pages of datasets, collections, and publications.

## v0.102.4 - 2024-08-02

- Update attribution and contributors sections for processed datasets.
- Updated the font color for the selected and unselected tabular tabs.

## v0.102.3 - 2024-08-01

- Fix issue of "Launch Workspace" button not appearing in workspace detail pages.

## v0.102.2 - 2024-08-01

- Fix query to determine whether samples should be shown on organ pages.
- Prevent header from being clipped when the template selection grid is scrolled.
- Order templates alphabetically with the default template first.

## v0.102.1 - 2024-07-31

- Add alerts, errors, tooltips, and disabled buttons as needed to alert users when they have exceeded a dataset limit.
- Add datasets section with info banner to empty workspace detail pages.
- Fixed assays and samples section on the organ's detail page.
- Select blank template by default in "Create New Workspace" dialog.
- Updated query for recent datasets to avoid filtering based on presence of visualization.

## v0.102.0 - 2024-07-26

- Removed overlapping tooltip from current dataset in multi-assay relationships.
- Updated `vitessce-data` and `vitessce-data-v2` S3 bucket URLs to point to `data-1.vitessce.io` and `data-2.vitessce.io` subdomains, respectively.

## v0.101.4 - 2024-07-25

- Add confirmation modal to the 'delete workspaces' button.
- Add tooltips to the apps and profile icons in the navigation bar.
- Added status icon to the processed datasets to differentiate between different runs.
- Show IDs of workspaces in the workspaces list to differentiate between workspaces with the same name.
- Update login alert text on the workspaces landing page.
- Increase max dataset limit for workspaces to 150.
- Move API client to `portal-visualization` package to reduce code duplication between portal code and workspace templates.
- Add pull request templates to ease future PR reviews.

## v0.101.3 - 2024-07-20

- Fix changelog formatting for v0.101.1 entries.

## v0.101.1 - 2024-07-19

- Updated the status icons and colors with the provided mui icons.
- Update messaging on My Workspace landing page for users who are not logged in.

## v0.101.0 - 2024-07-17

- Updated back-end dependencies.
- Display dbGaP link to logged in users if one is available and logged in user does not have access to Globus.
- Fix incorrect URL structure in gene search results.
  Fix headers on support entity detail pages.
  Fix styling on related entities table tabs.
- Fixed the count in the Samples table header
- Removed twitter link from the footer.

## v0.100.1 - 2024-07-10

- Convert detail page components to TypeScript.
- Convert dataset detail page to TypeScript.
- Fix pip install issues in dev environments.

## v0.100.0 - 2024-07-08

- Fix minor nav issues found during QA.

## v0.99.2 - 2024-06-27

- Implement updated header/navigation components.
- Fix "explore datasets" link on updated homepage.
- Fix icon colors in tools section.
- Fix broken entity tiles.

## v0.99.1 - 2024-06-20

- Implement homepage tools section.
- Implement homepage redesign.

## v0.99.0 - 2024-06-20

- HuBMAP documentation site URL changed from https://software.docs.hubmapconsortium.org to https://docs.hubmapconsortium.org.

## v0.98.0 - 2024-06-12

- Make long samples sections in the provenance table view expandable.
- Fix entity table icon colors.
- Remove inaccurate data product generation info.
- Remove "other groups" from profile pages.
- Restore Donor Diversity chart legends.
- Remove YAML-loading dependencies and remaining references to IVT submodule.

## v0.97.1 - 2024-05-30

- Replace dependencies on ingest-validation-tools yaml files with data from ontology api.
- Remove ingest-validation-tools as a git submodule.

## v0.97.0 - 2024-05-23

- Add user profile page.
- Fix unexpected visualizations on unprocessed datasets.
- Bump portal-visualization to 0.2.4 to improve genomic profile visualizations.
- Handle redirect to s3 for search-api requests > 10MB.
- Update vitessce tracker to report scrolling and zooming appropriately based on the target component.
- Update vitessce tracker to appropriately report theme selection actions.

## v0.96.6 - 2024-05-14

- Fix undefined source in searchkit initial request.

## v0.96.5 - 2024-05-10

- Fix hard crash on removing all cell types from query.
- Fix workspace templates grid layout on small screens.
- Fix bug where workspaces FAQ was erroneously displayed on workspace detail page.
- Sort workspaces when displayed as a list. The active workspace is first followed by the remaining workspaces sorted by name.

## v0.96.4 - 2024-05-09

- Bump Vitessce to v3.4.5.

## v0.96.3 - 2024-05-09

- Implemented iterations to 3D tissue maps preview page.

## v0.96.2 - 2024-05-09

- Added support for querying datasets by cell type in Molecular Data view.
- Fix error handling while creating new workspaces.
- Add 3D spatial data preview.
- Update Vitessce to 3.4.2.
- Update alerts displayed on workspace loading page. Add logic to return users to workspace landing page in the case of unexpectedly long wait times.
- Update workspace access to allow users in HuBMAP Read globus group to access workspace features while in consortium beta.

## v0.96.1 - 2024-05-08

- Update to portal-visualization v0.2.3.
- Update language on workspaces landing page.

## v0.96.0 - 2024-05-06

- Bump portal-visualization to v0.2.2 to support revised 10X columns.
- Add dialog on workspace detail pages to add datasets to the workspace.
- Add dialog on the search page to add datasets to the workspace.
- Add job type support, including R, for workspaces.

## v0.95.0 - 2024-05-01

- Updated the HRA Organ Info web component options in CCFOrganInfo.tsx to improve performance

## v0.94.2 - 2024-04-18

- Added handling for visualizations of multiomic data.
- Improve usefulness of data products section by ensuring correct pipeline is linked as the source instead of portal containers and using GitHub repo names as a fallback for `pipeline.cwl`.
- Improve usability of data products section for datasets with many products by enabling scrolling.
- Bump Node to v20.12.0.
- Update various front-end dependencies.
- Migrate husky configuration to v9.

## v0.94.1 - 2024-04-10

- Remove extra "s" on provenance tables.

## v0.94.0 - 2024-04-10

- Add optional parameter to dev docker.sh to allow for alternate image name.
-
- Correct a typo which caused the metadata table to not display.
- Document Production deployment instructions.

## v0.93.1 - 2024-03-22

- Remove stale previews from tools.
- Add tracking for various donor and sample page events.
- Remove unused import.
- Update GitHub action checkout from v2 to v4.
- Update GitHub action setup-node from v3 to v4.
- Update GitHub action codeql from v2 to v4.
- Update GitHub action setup-python from v4 to v5.
- Fix broken publication cypress test.
- Update dataset detail page for multi-assay datasets.
- Add multi-assay provenance display on dataset detail pages.
- Use cython<3 at build time to address: "AttributeError: cython_sources".
- Explicitly set container architecture to amd64.

## v0.92.0 - 2024-03-08

- Fix tile view of search pages.
- Support display of legacy contact information which does not have `version` field available.
- Point genes page cells API client at same environment as the rest of the application.

## v0.91.2 - 2024-03-07

- Add support for new contributors schema to contributors table.
- Fix hierarchical facets on dev search.
- Fix size and order of hierarchical search facets.

## v0.91.1 - 2024-03-06

- Add tracking to Vitessce download links.
- Revise Vitessce event tracking from digest approach to individual actions.
- Revise Vitessce event tracking categories to indicate where the config is.
- Add assay related facets to dataset search page to improve navigation.

## v0.91.0 - 2024-03-04

- Add support for Visium datasets.
- Fix visualizations for image pyramid datasets.
- Add detail page for cell types present in HuBMAP.
- Show Globus link for datasets regardless of their status.

## v0.90.0 - 2024-02-15

- Fix bug in which new datasets without deprecated `data_types` field were not displaying visualizations correctly.
- Update bulk data transfer message for consortium members who do not have protected data access who are attempting to access protected data.
- Determine support entity to 'viz-lift' by presence of `is_support` in `vitessce-hints`.

## v0.89.1 - 2024-02-07

- Fix entity page event tracker to handle undefined entity in flask context.
- Fix create workspace button from dataset detail pages.

## v0.89.0 - 2024-02-05

- Add IDs to tracking event labels where applicable.
- Stringify objects sent in Matomo events.
- Remove web vitals tracking in Matomo.

## v0.88.1 - 2024-01-25

- Remove timeout from searchkit searches.
- Update faro version.
- Fix matomo event tracking to provide name field where applicable.
- Track entity page visits by HuBMAP ID not UUID.

## v0.88.0 - 2024-01-22

- Add fusion slide to homepage carousel and enable carousel autoplay until a user navigates the slides.
- Fix alignment of icon links.

## v0.87.1 - 2024-01-09

- Add portal analytics link to maintenance page footer.
- Fix consistency of external link icon logic.
- Add logging to troubleshoot soft assay lookups.
- Revise soft assay URL logic to be consistent with other suffixed API endpoints.

## v0.87.0 - 2024-01-04

- Update portal-visualization to 0.1.0.
- Remove vitessce conf generation usage of TypeClient.
- Improve approach to embedding HRA Organ UI.
- Add support for dynamic maintenance messages.
- Update Node version used in GitHub Actions workflow.

## v0.85.3 - 2023-12-14

- Restore disabled cypress tests.
- Fix mapping of organ counts on organ page.
- Add link to FUSION in atlas and tools links.
- Add utm_source query param to FUSION link for tracking.
- Updated target publication for cypress tests.

## v0.85.2 - 2023-12-06

- Adjust biomarker search input to ensure gene symbols are matched against.
- Make lexicographically sorted search facets display in case insensitive alphabetical order.

## v0.85.1 - 2023-12-04

- Add tutorials landing page.
- Add workspaces tutorial.

## v0.85.0 - 2023-12-01

- Added biomarkers landing page.
- Add link to currently running workspace from session time notification if not currently on the workspace's page.
- Fix matomo user group tracking.
- Add dialogs to workspace detail page to update workspace name and templates.

## v0.84.2 - 2023-11-21

- Fix workspace launch error message display logic.

## v0.84.1 - 2023-11-21

- Add links to organ pages from gene detail page's cell types list.
- Allow reopening closed workspace tabs without needing to relaunch the entire session.
- Fix bug with workspace creation locking after unsuccessful submit.
- Fix errors launching workspace when another workspace is running.

## v0.84.0 - 2023-11-20

- Prevent duplicate workspace creation via rapid submission of launch new workspace form.
- Add handling for workspace API requests with no results.
- Do not display workspace templates with designated `is_hidden` bool.
- Add a prompt to renew workspace sessions to the top of the workspaces screen.
- Handle workspace files which can be either strings or objects.

## v0.83.1 - 2023-11-16

- Enable selection of entities on all search pages.
- Limit scope of visualized and downloaded metadata to selected entities when user has made a selection in the search page.
- Bumped CCF-UI version to latest 3.x release for the organ-info pages
- Added ontology API to status page.
- Added View Datasets button to cell types table on gene pages for types that exist in HuBMAP datasets.
- Added handling for invalid gene name lookups.
- Prevent launch of additional workspaces while a launch is already in progress.
- Add authentication guard to workspace page.
- Add workspace detail page.
- Increase gap between templates in template grid.
- Remove tsc-files from our pre-commit type checks as it was not using the project's tsconfig.

## v0.83.0 - 2023-11-13

- Add tracking to interactions with vitessce visualizations.
- Introduce type checking to precommit and continuous integration scripts and fix reported type issues.
- Add constraints to prevent multiple workspaces from being launched at once.
- Add Biomarker Query section to gene detail page.
- Added basic cell types table reference to gene page.
- Update gene detail summary implementation.
- Removed spaces from tracked event names.
- Fix alignment of bar chart legends.
- Fix HTML rendering inside markdown sections.
- Updated UBKG endpoints to point to `genes` and `genes-info`.
- Removed unnecessary polyfill dependencies.
- Alphabetize data types facets on search page.
- Converted homepage images to webp to decrease load times.
- Add Azimuth dataset visualizations to gene detail pages.
- Prevent unnecessary calls to workspaces API by users without permissions.
- Updated the HRA API endpoint to point to the HuBMAP-only version
- Update CHANGELOG entry to match Docker tag for v0.82.3.
- Update push.sh to exit early if prerequisite is not met.
- Create a reusable table with updated design.
- Add table to show selected datasets in create workspace dialogs.

## v0.82.3 - 2023-10-31

- Implement workspace usability metric tracking.
- Add hook to check if user has any running workspaces.
- Update workspace landing page styling.
- Add docker logging to AWS CloudWatch.
- Fix push script to once again stage changes to dependencies markdown.
- Further constrain collections on landing page to only show collections with both a registered doi and doi url.
- Add dialog to launch workspaces from user templates.

## v0.82.2

- Version number skipped.

## v0.82.1 - 2023-10-25

- Fix overflow in chart legends.
- Only show collections with DOIs to non-HuBMAP users on collections landing page.
- Fix bug in header navigation menu items requiring you to click on the item's text.

## v0.82.0 - 2023-10-23

- Upgrade to Zustand v4.
- Upgrade to Immer v10.
- Remove legacy `mui/styles` theming engine.
- Restore magnifying glass icon to search bars.
- Added selection and workspace launching to main search page for users with Workspaces access.
- Update `cryptography` package to 41.0.4.

## v0.80.0 - 2023-09-27

- Update Jest and MockServiceWorker to latest versions.
- Update Human Reference Atlas slide text.
- Fix color of text in derived datasets button.
- Fix Faro logging function calls for query errors and slow loading warnings.
- Replace `ajv`/`yup` validation with Zod.
- Remove `marked` in favor of `react-markdown`.
- Upgrade to Node 20.7.0.

## v0.79.4 - 2023-09-19

- Add handling to prevent users from attempting to launch workspaces with more than 10 datasets.
- Add handling to prevent users from attempting to launch workspaces with protected datasets.
- Add button in workspace dialog to deselect protected datasets.
- Improve Matomo tracking specificity.

- Prevent already-selected options from being suggested by autocomplete component.
- Update linting packages to be compatible with Typescript 5.1+.
- Enable linting of JSON/Markdown/YAML files.
- Update homepage publication slide text to include Nature link.
- Update MUI Theme file to use TypeScript.
- Add Faro web tracing to stage/production environments.
- Add portal usage analytics link to site footer.
- Fix lint issues from branch that was created before lint rule updates.
- Improve push script specificity.
- Use infinite scrolling for organ page samples table.
- Update shared icons and links to use TypeScript and MUI's styled utility.
- Remove erroneously added file.
- Fix some TypeScript issues in the SWR helpers.
- Fix bug referencing vitessce version when downloading visualization notebooks.

## v0.79.3 - 2023-09-08

- Revert matomo changes.

## v0.79.2

- Version number skipped.

## v0.79.1

- Version number skipped.

## v0.79.0 - 2023-09-08

- Improve Matomo tracking specificity.

- Change email links to contact form links.
- Use legacy pip installer to fix docker build.
- Update lint scripts to include typescript files.

## v0.78.0 - 2023-09-01

- Add link to Antibody Validation Reports in atlas and tools menu.
- Implement Data Products panel under dataset description.
- Tag data products files in file browser view.
- Enable filtering file browser to only data products.
- Convert file browser to TypeScript.
- Use reusable HelpLink component where the hubmap support email is referenced.
- Fix Donor page table of contents link to derived samples and datasets section.
- Fix display of selected genes in Molecular Data query search.
- Add "Download All" functionality to data products panel.
- Adjust app config logging to prevent logging secrets.
- Update READMEs to reflect current practices.
- Add sort headers to samples tables on organ pages.

## v0.77.0 - 2023-08-14

- Fix Reference dataset link color on organ page.
- Fix molecular data queries beta page select and autocomplete components.
- Remove extra logic to determine whether to display publication slide.
- Make individual organs' routes case insensitive
- Handle spaces and underscores sent as part of organ name
- Upgrade portal-visualization to 0.0.13.

## v0.76.3 - 2023-08-10

- Implemented new panel design when entity api for globus link returns an error.
- Fix maintenance page config
- Remove underline from Visualize link.

## v0.76.2 - 2023-08-03

- Update error message when user attempts to access deleted list.
- Add missing Collections icon to header.
- Fix various styles broken during MUI 5 upgrade.
- Update desktop dropdown popper to use Popper v2 offset API.
- Restore MUI v4 font size.
- Fix Diversity page title size.
- Upgrade to Vitessce v3.1.1.

## v0.76.1 - 2023-08-02

- Add icons to header of donor, sample, and dataset detail pages.
- Add icons to tab in "Derived Datasets" table.
- Add icons to headers of donor, sample, and dataset search pages.
- Replace h1 Typography with PageTitle styled component.
- Upgrade from Material UI v4 to Material UI v5.

## v0.76.0 - 2023-07-31

- Renamed lightbluelink to internallink.
- Fix bug in hook to request publication vignettes files.
- Configure storybook to build with swc instead of babel and compile typescript.

## v0.75.8 - 2023-07-26

- Display message when protocols.io requests fail in protocols section.

## v0.75.7 - 2023-07-26

- Refactor props in Sample page to use context.
- Add tooltips for donor, sample, and dataset pages.
- Add arguments to dev-start script to skip installing dependencies.
- Update DataCite links to use DataCite Commons.
- Update sample and dataset organ links to visit specific organ page not organs landing page.
- Add support for multiple comma-separated protocols.io links.
- Improve parsing of protocols.io links.
- Restore display of public protocols.io links.
- Reverse no-wrap styles causing table of contents to overflow.

## v0.75.6 - 2023-07-18

- Disable auth header/token inclusion for unauthenticated users.

## v0.75.5 - 2023-07-17

- Update bulk data transfer section tooltips.

## v0.75.4 - 2023-07-17

- Fix bug causing the outbound link icon to not display in Globus links before the DUA has been agreed upon.
- Fix dbGaP study link in bulk data transfer section.

## v0.75.3 - 2023-07-17

- Create bulk data transfer section.
- Add links to Globus, dbGap study, and SRA Experiment for dbGaP datasets.

## v0.75.2 - 2023-07-17

- Fix links in collection page datasets table.
- Restore display of publication status for preprints.

## v0.75.1 - 2023-07-14

- Fix spacing of derived entities sections.
- Fix publication tooltip errantly appearing on other pages
- Remove 'Internet' from publication citations.

## v0.75.0 - 2023-07-14

- Adjust display of information for preprints to explicitly label them as preprints where appropriate.
- Add explanatory tooltips to publication page.
- Add publication slide to homepage.
- Get publication summary data types and organs from associated collection if applicable.
- Set max vertical height and enable vertical scrolling for provenance graph.
- Set initial vertical scroll position in provenance graph to halfway.

## v0.74.2 - 2023-07-13

- Add support for publications with associated collections.

## v0.74.1 - 2023-07-12

- Upgrade Vitessce to v3.0.1.
- Remove extra UUID suffix logic added when bumping from v2.x to v3.0.0, which is no longer required.
- Get collection datasets from separate search-api query instead of the collection es document.
- Expand test suite for Publication pages.
- Add support for text-only publication vignettes without Vitessce visualizations.
- Restore footer HuBMAP logo visibility.
- Use swr in search-api fetch hooks.
- Split publications landing page requests.
- Change label of published publications tab to peer reviewed on publications landing page.
- Upgraded to React 18.
- Upgraded various dependencies to work with React 18.
- Fixed undefined count tooltips popping up for entity counts on homepage.
- Upgraded React-PDF to speed up display of PDF attachments.

## v0.74.0 - 2023-07-06

- Add messaging for fair data principles to homepage, vitessce, and the dataset file browser.
- Fixed homepage Vitessce demonstration link.
- Fix flask data context destructuring to restore provenance features.
- Update workspaces landing page messaging to instruct users without membership in the workspaces Globus group to request access.
- Adjusted publication header to appear on one line only.
- Fixed changelog file format.
- Update project ESLint configuration and dependencies.
- Remove Babel.
- Introduce TypeScript.

## v0.73.1 - 2023-06-28

- Adjust page-wide error boundary to prevent error messages from overflowing
- Add error boundary around Vitessce visualization to keep Vitessce errors from crashing full page
- Update Cypress testing suite.
- Add end-to-end tests for publication pages.
- Upgrade from Webpack 4 -> 5
- Upgrade from Storybook 6 -> 7
- Migrate from babel-loader -> swc-loader
- Migrate to @swc/jest test runner
- Removed search feature from home page.
- Added vertical padding to the count section.
- Formatted 10k+ homepage entity counts to nearest thousands place. (10,500 -> 10.5k)
- Added tooltip hover feature on count entities.
- Ensure that lineup pages' data all have necessary keys and report any incomplete metadata in console
- Trim publication sub header characters to 100 max with trailing ellisis.
- Bump `portal-visualization` to 0.0.12.
- Remove publications and other dataset subtypes from dataset charts.
- Remove globus link for lifted publication ancillary entities on publication pages.

## v0.73.0 - 2023-06-20

- Fix donor metadata table display.
- Set up template for Biomarkers Gene Page.
- Built gene data API.
- Built gene id API.
- Rendered summary on summary section from gene data API.
- Fix type error on donor pages with no derived samples.
- Fix errors with query-portal-logs script.
- Release and QA instructions have been migrated to Confluence.

## v0.72.4 - 2023-06-15

- Built two custom hooks to call third party API in order to retrieve the common name to render it next to the gene symbol.
- Restore metadata table display
- Add uids to places in which multiple Vitessce configurations are listed in a dropdown

## v0.72.3 - 2023-06-13

- Add a context provider to pass flask data to react components.
- Pass flask data to Donor page components by context.
- refactor AppContext to useAppContext from Context.js.
- Use `origin_samples` field instead of `origin_sample` throughout.

## v0.72.0 - 2023-06-07

- Add link to publications landing page in 'Other' dropdown menu.
- Fix duplication of publications as both published and pre-print.
- Fixed support page entity header so the application doesn't crash to a white screen when scrolling down on Support entities' pages.
- Add error handling for cases where the image pyramid descendants are missing file metadata.
- Add more informative error messages on vitessce conf gen failures
- Fix provenance table sample sorting calculation
- Remove semicolon in the collections component for datasets.
- Upgrade google analytics to ga4.

## v0.71.0 - 2023-05-30

- Add files section to publication page.
- Update from deprecated createMuiTheme function to createTheme.
- Add propTypes entry for vignette_json.
- Fix proptypes error with DOI string being passed as boolean.
- Fix semantically invalid HTML nesting errors (ul inside of p, p inside of p).
- Import Accordion instead of deprecated ExpansionPanel.
- Add handling for SUBMITTED status to StatusIcon.
- Update workspace creation on workspaces page to create a blank notebook.
- Fix issues switching between different visualizations on the Publication page
- Fix overlap between expanded preview visualization and its header.
- Add Jupyter Notebook download button to expanded visualization view.
- Lift publication vignette data from publication ancillary dataset.
- Update development setup in README.
- Start workspace jobs on workspaces page not loading page.
- Update portal-visualization to 0.0.10.

## v0.69.1 - 2023-05-01

- Replace toSorted which firefox does not support.

## v0.69.0 - 2023-04-28

- Change dependencies in useDatasetsCollections hooks to fix infinite loop.
- Handle flask side redirect for search, entity and uuid apis.
- Update workspace loading page to reflect design.
- Update dataset collections hook to better use es query to return collections which contain dataset.
- Allow access to workspaces to users in workspaces globus group.
- Update workspaces logo color to reflect design.
- Fix spacing on workspaces page to reflect design.

## v0.68.0 - 2023-04-14

- Update prop name to fix missing collection page title.
- Fix organ icon over on the homepage.
- Add entire portal ui team to workspace allow list.

## v0.67.2 - 2023-03-27

- Add details to summary on publication page.

## v0.67.1 - 2023-03-27

- Add authors section to publication page.
- Add publication collections section to publication page.
- Add provenance section to publication page.
- Add table of contents sidebar to publication page.
- Add entity sub header details for publication page.
- Add visualization vignettes section to publication page.
- Bump Vitessce NPM package version from `^1.2.2` to `^2.0.3`

## v0.67.0 - 2023-03-24

- Add cells page to header menu other links.
- Add beta label to cells page title.
- Fix bug when separating publications by publication status resulting in preprints not being listed.
- Fix download visualization notebook button in vitessce section.

## v0.66.1 - 2023-03-23

- Fix bug in cells ui caused by mismatched dataset versions from cells and search api.
- Fix publications hook to handle support entities.
- Decrease response size from search api request on publications landing page.

## v0.66.0 - 2023-03-21

- Add additional users to workspaces allow list.
- Bump portal-visualization to 0.0.9.
- Refactor cells to use central store.
- Add reusable tutorial components.
- Add cells tutorial.
- Fix organ page table to show all samples belonging to the organ.
- Refactor panel components for reuse in upcoming publication pages.
- Add detail page stub for publications.
- Add data section to publication page.
- Separate publications on publications page by status.
- Add landing page for publications.

## v0.63.0 - 2023-02-09

- Pass organs count to entity counts iframe.

## v0.62.0 - 2023-01-19

- Add Gesina to workspaces allow list.
- Fix organ page table of contents to reflect actual section names.
- Update Vitessce homepage slide.

## v0.60.0 - 2022-12-20

- Handle change in elasticsearch document from specimen_type and mapped_specimen_type to sample_category.
- Added 4 more HRA previews
- Updated the CCF Portal to the HRA Portal and it's new home, humanatlas.io

## v0.59.0 - 2022-12-13

- Correct protein measurement labels to abundance in cells UI.
- Reset gene symbols/protein options when query type changes in autocomplete input.
- Update new search ui to only retain selections of hits included in the new results.
- Updates to support HRA Release 4 (v1.3)
- Enable users to launch workspace notebooks from dataset selections in new search ui.
- Enable users to select search results in new search ui.
- Add disclaimer to top of cells page.

## v0.57.0 - 2022-11-09

- Fix path in ls command cell in workspace visualization notebook.
- Updated the make_organ_dir.py logic to capture more HRA Reference Organs for display

## v0.56.1 - 2022-11-01

- Set workspace notebook path as URL param and use to create jupyter URL.
- Remove leading slash in workspace symlink name path.
- Update workspaces list after workspace create and delete so users no longer have to refresh the page for updates.
- Handle stopping workspace jobs.
- Launch dataset workspace notebook in new tab.
- Add form to allow users to specify a new workspace name.
- Pass job_types_id to workspace job start request.

## v0.56.0 - 2022-10-21

- Add additional email for Phil Blood to workspaces allow list.
- Add Nils to workspaces allow list and remove Chuck.
- Bump portal-vis to 0.0.7 to fix a regression in handling of unstiched imagery.
- Bump portal vis to 0.0.8 to handle search api v3.
- Integrate modified searchkit routing from searchkit src.
- Show the Vitessce version number in the powered-by message.
- Remove page size from updated search route state.
- Add filters from url as facets if not included in default facets.
- Synchronize url with search columns state in updated search.

## v0.54.0 - 2022-10-06

- Fix workspace creation flow for dataset URLs with parameters.
- The CCF uses a separate index, but it should also be bumped to v3.
- For consistency, make the link for "Citing HuBMAP" outbound.
- On the status page reference status-api rather than status-ui.
- No change in behavior, but we'll get an error if we try to regen organs and there is unexpected data.
- Limit organ-info datasets to HRA-mapped HuBMAP data only
- Add missing constraints to search links from organ pages.
- Upgrade `vitessce` to 1.2.2.
- Add `v3` to the types service, and at it to the Services page. No change to environment required.
- Update workspaces messaging to better explain what's working, and what it should be used for.

## v0.53.2 - 2022-09-22

- List all expected WS states: If we see something unexpected, it's an error.
- And a infobox to dev-search explaining its limitations.
- Fix url sync bug in new search involving a race condition in fetch which caused state to sometimes not reflect initial url params.
- Fix a bug that prevented highlighted genes from displaying.
- Add link to new preview.
- When a workspace is openned, if it contains a single notebook, open it by default.
- Use order of datasets provided by cells service in cells ui.
- Pull organ definitions from Uberon API. This sets us up to pull more ontology information from the API, if we want.
- Re-enable job stopping and workspace deletion.
- Remove twitter from homepage.
- Rotate x-axis chart labels to 90 degress for vertical bar charts.
- Serices page: The up-down state of and API is expressed differently now; Handle the current response structure.
- Workspaces is now included the in the services we have info for.
- Sort x axis values in cells cluster bar chart by descending y value.
- Update redeploy script with new user and deployment path.
- Add an icon in the header title.

## v0.53.1 - 2022-09-11

- Add a description for the `multimodal-mass-spectrometry-imaging-data` received from the data submitters.

## v0.53.0 - 2022-09-09

- Fix homepage organ link.

## v0.52.0 - 2022-09-08

- Destructure almost all of the component props.
- Only show "active" workspaces.
- Fix proptype warnings.
- Add a second param to record the type of the link.
- Add some color-coding to the README diagram.
- Add organs to organs page. (No public data yet, but good to be ready.)
- Add a new preview for multimodal mass spec; Not yet listed in public menu.
- Add count and link to organs page from homepage.
- Remove unused ASCT+B preview.
- Add scroll shadows to configure search table and select facets in search revision ui.
- Use the Workspace API's mechanism for mounting a data directory into the workspace.
- Fix bugs in TSV download and Lineup.
- Make the UI reflect the underlying API more closely. UI should not be responsible for managing state.

## v0.51.1 - 2022-08-25

- Adds an ugly button to access workspace.
- special case for "0" on range slider
- Fix twitter timeline overflow at the cost of scrolling until embedded widget api is fixed.
- Please-wait based on workspace ID rather than job ID.
- Rename component, and update the warning text on the workspace list.
- When a user logs in, add a cookie, and check it during logging, to distinguish internal and external traffic.
- Support workspace deletion.
- For beta users, and link to workspaces in menu.

## v0.51.0 - 2022-08-18

- Consistent title on cells page.
- Consolidate datasets selected by expression hooks in cells ui.
- From Cells UI, datasets open in new tab.
- Fix index v3 regression: Only show file browser is there are files.
- Fix bug which prevented previously expanded cells charts from being reloaded.
- Fix output dir path in query-portal-logs.py
- Add reusabe link button component and use in workspaces.
- Implement a "please-wait" page for workspaces which have not yet started.
- Fix proptype errors.

## v0.50.1 - 2022-08-11

- Add another parameter to the vis-scan script, so we can target other indices.
- Update query form labels and helper text in cells UI.
- Change the display of workspace status to match Tiffany's spec.
- Use Trevor's idiom for finding the git root.
- Expand first entry in query results on load in cells UI.
- Fix `make_organ_dir.py` script: Path needed to be adjusted after re-organization
- Handle the empty files array provided by the v3 index correctly.
- Add globus token to workspace creation call
- Set up directories and move files off the top level.
- Redo the login menu, in line with new design.
- Only offer to start jupyter is there is nothing active or pending.
- Refactor panel libraries for reuse.
- Profile find-vis-bug.py: Turns out that fetching JSON and generating viewconf are comparable, so it doesn't do much to optimize just one.
- mv scripts etc, for better autocompletion.
- Split dataset charts to separate levels in cells UI.
- Users will not supply a name when creating workspaces from datasets.
- Bring the Workspaces UI closer to spec.

## v0.50.0 - 2022-08-04

- Add organ to the downloadable TSVs.
- Enable users to click anywhere in dataset row to expand in cells UI.
- Show an alert when no results are returned in Cells UI.
- Add a description at the top of the cells-ui.
- Add script to find vis bugs before users hit them.
- Expand first entry in query results on load in cells UI.
- Fix column sort on dev-search.
- Associate each Job with the Workspace it belongs to.
- Instead of failing in python, vitessce load now fails... which is a little better.
- Log more details of the auth process.
- Simplify the homepage description component.

## v0.49.0 - 2022-07-25

- Add more fields to the downloadable TSV.
- Bump lxml to resolve security warning.
- Link from the Cells UI to the Dataset with gene pre-selected.
- Add new logic to create notebooks, not just download them: `.ipynb?name=new-notebook`
- In Cells UI, change from "substring" to something domain specific.
- Address the `npm ci` slowdow.
- Redesign organs page to use tiles.
- Add organ tile story and consolidate entity tile stories.

## v0.48.0 - 2022-07-14

- Add Workspaces API to the mermaid diagram.
- Remove unnecessary steps from cypress ci.
- For workspaces, add a link to Jupyter for each running job.
- Enable marker genes to be high-lighted on load.
- Upgrade dependency to resolve python dependency warning.
- Add a little message to the service page explaining that entity api depends on uuid api.
- Friendlier error if no workspace token.
- Upgrade pytest and dependencies. (We were pinned to a dependancy that was self-vandalized.)

## v0.47.2 - 2022-06-29

- Matomo React proved awkward: Just use plain JS functions.
- Matomo has more specialized handlers for links and searches, so use them.
- Demostrate the Workspaces API to start jobs and collect job information.
- Updated Vitessce version in notebook to match requirements.txt.
- Add scroll shadows to configure search table and select facets in search revision ui.
- Keep vitessce version in notebook automatically up-to-date.
- Fix plurals in workspace section header.
- Demonstrate how authorization for workspaces will work.
- Provide what information we have on workspaces on the services page.

## v0.47.1 - 2022-06-27

- Cells UI was hitting the Elasticsearch default of 10 results. Increase the limit.
- Parameterize the docker build, so that it will also be in sync with the versions used in CI and in dev-start.sh.
- Updated Vitessce version in notebook to match requirements.txt.
- Check in language version files for python and node, and reference from the README and CI.

## v0.47.0 - 2022-06-22

- Style configure search table in search revision ui to prevent column shift as new rows are added.
- Add form label to data types select form in search revision ui.
- Put labels before checkboxes in data types select form in search revision ui.
- Add tooltips to column cells in configure search table in search revision ui.
- Modify configure search table in search revision ui so the data types select form and table scroll separately.
- Add description tooltips to configure search table in search revision ui.
- Upgrade `portal-visualization` to 0.0.4 to fix validation issue for unpublished `zarr` stores.
- The Workspaces websocket URL also needs to be provided by the environment: Update the template used when initializing new dev environments.

## v0.46.1 - 2022-06-15

- Add search bar to filter rows in search revision configure search table.
- Show an alert when no fields in the configure search modal are shown in search revision ui.
- Consolidate search hooks into single hook.
- Add url sync for search ui revision.
- Only display view all button for select facets in search revision ui when additional aggs exist.
- Upgrade `vitessce` (and dependents) to allow for using an alias for genes.

## v0.46.0 - 2022-06-07

- Add default filters used in the existing search page to the search revision.
- Avoid referencing global variables: Instead get everything from a context provider.
- Add mapped_last_modified_timestamp as default sort for search revision.
- Add button to view all/less select facet items in search revision ui.
- Fix bug when configuring facets in search revision.
- Fix immer syntax bug in entity-searchs store for search ui revision.
- Clean up flask templates. Should not change behavior.
- Use `alert` as a stop-gap so we can understand how Cells API is working.
- Add the `--silent` option to jest to avoid cluttering the log with expected proptype warnings.
- Add metadata menu to search revision ui.
- Matomo React proved awkward: Just use plain JS functions.
- Migrate to Python 3.9.
- Add range slider components for numeric facets in search ui revision.
- Remove references to google analytics.
- Add search bar to search ui revision.
- Add facet chips to search revision ui.
- Add pagination to search ui revision.
- Update matomo init to reflect the new, paid, account.

## v0.44.0 - 2022-05-13

- Enable users to configure facets for string type fields in search ui revision.
- Fix how the search results accesses sample metadata from elasticsearch.
- Make query-portal-logs script executable.
- Use Matomo React integration.
- Remove date fields from configure search table in search revision ui.
- Remove vestigial meta tag and CSS import.

## v0.43.0 - 2022-05-05

- Add form to allow users to filter configure search table by data type.
- Add dialog to search page revision to allow users to specify table fields;
- Notebook generation from the search page was broken. Fixed now.
- Add three preview links for HRA..
- Add donor and sample pages for search ui revision.
- Sort fields in configure search table.
- Add sorting for the results table in the search page revision.

## v0.42.0 - 2022-04-20

- Clear mocks after every Jest test: We want to avoid a mock on one test having side effects on another.
- Replace the link in the footer that points to “Data Use Agreement” (meant for internal use within HuBMAP) with a link to the “Data Sharing Policy”.
- Add two hierarchical filters to dev-search; May help us represent assays better.
- Try to speed up our Docker build.
- Punctuate the donor ethnicity list in the header.
- Cache NPM and Python dependencies... though that doesn't really help us much because the slow part is Docker.
- Add group facets in search page revision.
- Add a somewhat gratuitous filter on the error-log report.
- Fix proptypes warning on Dataset page.
- Add boolean facets to identify raw or derived entities.
- Shorter summary of python dependencies.

## v0.41.1 - 2022-04-07

- Make the links a darker shade of blue for accessibility.
- Pin python dependencies.
- Change "Creator" to "Registered by".
- Add basic example of a dataset search page using searchkit's newest major version.
- Add list facet to search page revision.
- Split CI into several parts: Each will run faster, and a single failure won't stop everything.

## v0.41.0 - 2022-03-31

- Upgrade CCF so that it no longer relies on a Heroku server that will fail on initial requests because it's not warmed up.
- Fix error for deleted portal-visualization submodule.
- Pin werkzeug version to fix ci.
- If search looks like "HBM...", put quotes around it.

## v0.40.1 - 2022-03-23

- Stub out anndata section.
- Link icons default to `1rem` if unspecified.
- Add script to query portal ui container logs for errors.
- Revert to original NGINX timeout setting.
- Add thumbnails to entity tiles.
- Tiny typo: `SearcHits` -> `SearchHits`
- We were getting errors in the log because we tried to get visualizations for everything: Add a conditional to only do it for datasets.
- Use a python package, rather than a git submodule, for `portal-visualization`.

## v0.40.0 - 2022-03-17

- Upgrade ingest-validation: Explain the distinction between the 10X kit versions.
- Google colab pre-installs libraries with dependencies that conflict with Vitessce: Uninstall, then install vitessce.
- Exclude support entities from home and organ page data types charts.
- Fix mailto in attributions.
- For assays like PAS, we were adding RGB channels sliders. Revert back to a single opacity slider.
- Organize detail page summary components.
- Add icons to links going outside HuBMAP.
- Enable detail summary to wrap when needed.
- Configure msw for storybook.
- Change "onCLick" to "onClick".
- Move visualization docs to submodule.

## v0.39.1 - 2022-03-10

- If a publication date is available, use it in preference to the creation date.
- Generate a MD page summarizing the dependencies.
- Keep the query after stripping a trailing slash.
- Stub multi-dataset notebooks.
- Organize detail page summary components.
- Add instructions for authors of publication pages.
- Check notebook files into version control, rather than assembling them on the fly. Inputs are provided with `$`-templates.
- In generated notebooks, wrap output in DataFrame to get a table.

## v0.39.0 - 2022-03-03

- Add a contributors section to datasets.
- Use mermaid for the README repo diagram.
- Add DOI link on dataset pages.
- Add icons to email links.
- Make datasets robust against missing `contributors`.
- Update and simplify the notebook generation code.
- Submodules: In ingest-validation, update the IMS schema; In portal-visualization, add CellDIVE support, and change function signatures.

## v0.38.1 - 2022-02-24

- Link from organ names to the organ list page.
- Remove stray markdown files that got checked in after the docs submodule was removed. The redirects will now handle these routes.

## v0.38.0 - 2022-02-16

- Replace doc submodule with redirect files, so old URLs won't break.
- Reorganize header menus.
- Get the maintenance page build working again, and add a cypress test.
- Submodules are no longer auto-incremented on deploy. This was begun so that documentation updates could be
  published with the minimum hassle, but with the commitment to move to the github pages, it is no longer needed.
- Upgrade vitessce-builders: Should handle Azimuth now.
- Upgrade vitessce.

## v0.37.2 - 2022-02-09

- Vitessce conf builder code no longer has access to the flask context, so details must be passed explicitly.

## v0.37.1 - 2022-02-04

- Copy portal-visualization submodule in dockerfile.
- Fix overlap when viewing Vitessce in fullscreen.
- Display subheader when Vitessce is fullscreen on any page.

## v0.37.0 - 2022-02-03

- Add liver, bladder, eye, fallopian tube, knee, ovary, prostate, ureter, and uterus to the organs list.
- Updates to support CCF EUI v3.0
- Remove section in the changelog about deployment to Chromatic: We've dropped that.
- In dev-search, group the file descriptions by assay type: As the UI develops,
  this will give us a better idea where each description is coming from.
- Update README diagram.
- Only allow requests for one set of cells charts a time.
- Update the release protocol.
- Pull visualization code into submodule.

## v0.36.1 - 2022-01-27

- Add automated checking for security vulnerabilities in python and js.
- Slightly gratuitous refactor in the flask internals.
- Move move images to a cloudfront cdn with s3 origin.
- Fix table of contents links for organ pages.

## v0.36.0 - 2022-01-20

- On dev-search, add a facet showing the file descriptions available.
- Add a comment to each organ file, rather than just a README at the top.
- Add organ icons to the configuration; Not yet used.
- Add count to samples table on organ pages.
- Enable users to add samples to saved lists from samples table on organ pages.
- Remove trailing '/' and 's' from path and redirect.

## v0.35.2 - 2022-01-13

- Add consortium facet.
- Where there were just TODOs in the code, link to the relevant issue.
- Add a link to lineup on the search page.
- Add `/browse/<type>/<uuid>.vitessce.json` to get vitessce confs, with CORS header.
  If you are developing vitessce locally, it can be passed in as the `url` parameter.
- If there is an error during vitessce conf generation, generate a valid conf that just has an error message.

## v0.35.1 - 2022-01-11

- Do not include OME TIFFs that include `separate/` in their paths. This lets us handle the current MALDI-IMS structure.
- In the NGINX conf, bump the timeout up to 600s, so that requests to the cells API won't time out.
- Simplify `docker.sh`: Run `docker logs` if that's what you need.
- Fix TSV download in the Docker environment.
- Simplify Vitessce conf testing.

## v0.35.0 - 2022-01-04

- In the metadata TSV download, add a second row with the field descriptions.
- Add retracted datasets to the list of things that are hidden from the default search.
- Organize vitessce builder classes into related groups.
- `NullViewConfBuilder` does not need a separate invocation.
- Refactor the vitessce conf tests for readability.

## v0.33.1 - 2021-12-14

- Log when Cells API calls start, so if it times out, we have something to go on.
- Use hubmap-commons from pypi.
- Implement design for external datasets on detail pages.
- Add a timestamp to the filename of the TSV download.
- Render the react error page for all errors even if there is not an explict handler.
- If a `sub_status` is present ("Retracted"), use it instead of the `status`.
- Add dev-search for retracted.
- Revert https://github.com/hubmapconsortium/portal-ui/pull/2191:
  Return to the old organ facet until partonomy is sorted out.
- Handle both dataset_uuid and uuid keys from revisions.
- ES response structure has nested instances of `hits` as a key. Split our access across multiple lines of code so we can tell whether it's the inside or the outside that didn't match our expectations.

## v0.33.0 - 2021-12-06

- Add a CI test to check that each capitalized directory contains an index file.
- Configure lineup with column types.
- Add details logging on Cells API wrapper.
- Fix warning about invalid element nesting on markdown pages: `publication/*` and `docs/*`.
- Refactor assay types bar chart.
- Add assay types chart to organ pages.
- Replace outline with filter hover on stacked bar charts.
- Clean up formatting of publications page.
- Remove chromatic Github Actions workflow.

## v0.32.1 - 2021-11-29

- On the organs page, add Dataset and Sample icons in the respective buttons.
- Display more information about the cells service.
- Add descriptions to `donor.*` and `sample.*` metadata fields.
- Fix react warnings on the publication page.

## v0.32.0 - 2021-11-22

- Add ASCT support for RNA-seq visualizations
- Update metadata download on search pages to download current set.
- Fix usage of MALDI name in vitessce view configuration generation.
- In the JSX, move `Detail/` to `detailPage/`: Only directories containing an index should be capitalized.
- Move `files/` under `detailPage/`, since it is only used here.
- Upgrade Vitessce to 1.1.17

## v0.31.0 - 2021-11-17

- Switch Globus authentication from Globus Nexus to Globus Groups.

## v0.30.2 - 2021-11-04

- Fix checkbox facet alignment on search pages.

## v0.30.1 - 2021-11-04

- Add default query to search hooks.
- Fix HuBMAP commons install.
- Refactor search filter components.
- Track free text searches on search pages.
- Add analytics tracking for facets on search pages.
- Add analytics tracking for search page sorting.
- Add tracking for view switch on search pages.
- Add analytics tracking for facet chips on search pages.
- Update facet tracking to specify whether the facet was selected or unselected.

## v0.30.0 - 2021-10-26

- Handle incorrect casing for HuBMAP ID browse routes.
- Update tooltip for cells cluster chart.
- Fix vertical stack bar chart bar sizing bug.
- Fix expression histogram title.
- Add dropdown to dataset page to enable users to traverse between dataset versions.
- Fix dropdown hover and focus background color.

## v0.29.1 - 2021-10-19

- Add info to the Organ page section headers.
- Add donor and sample metadata.
- Add "Organ" subtitle.

## v0.29.0 - 2021-10-14

- Add dropdown to select genomic modality for cells gene queries.
- Remove breakpoints for cells query cell percentage slider.
- Fix bug relating to missing donor metadata on cells page.
- Add axis labels, legend and adjust bar colors in cell cluster bar chart.
- Rearrange cells chart layout.
- Add back fixed marks for cells percentage slider.
- Add text to cells chart skeleton loaders.
- Remove uuids from cells cluster method strings.
- Add a table of contents on the organ page.
- Validate the organs yaml that we generate, and fetch fresh azimuth data each time.
- Use partonomy in public search.
- Simplify the organs script by pulling more information from the Azimuth github repo.

## v0.28.4 - 2021-10-06

- Add loaders to cells page.
- React warnings: Add missing key in repeated component, and remove required prop.

## v0.28.3 - 2021-09-30

- Fix organ page request loop in samples table.

## v0.28.2 - 2021-09-30

- Add Uberon ID to organ list.
- Get the organ pages into an acceptable state and link from the Atlas menu.
- Add protein queries to cells UI.
- Add a story for EntitiesTable.
- Upgrade Vitessce to 1.1.15.

## v0.28.1 - 2021-09-28

- Bump to ccf 2.3.5.
- Refactor entities table to make it reusable.
- Rename "Lungs" to "Lung" in organ descriptions to match other organ names.
- Add organ regen to push.sh, so we will get the latest changes from IU and NYGC with every release.

## v0.28.0 - 2021-09-24

- Add reusable accordion steps component.
- Update the organ pages, based on the new approach using Uberon IDs.
- Put publication details in frontmatter.

## v0.27.2 - 2021-09-20

- Add accordions for cells query and results.
- Change language of firefox warning to indicate general perforamnce issues.
- Add SlideSeq visualization option to RNASeq visualization class.
- Add explicit `target` in SVG that is used in iframe.

## v0.27.1 - 2021-09-16

- Replace `create_timestamp` instances that were missed earlier.
- Exclude source maps from lineupjs when bundling to prevent console warnings.
- Add provenance columns to TSV.
- On search, a button to download the TSV.

## v0.27.0 - 2021-09-13

- Lineup was only showing columns for the first record, not the union of the columns for all records.
- Get cells ui chart colors from theme.
- Cleanup cells ui files.
- Organ URIs and descriptions added; organ-utils reworked to handle the new format.
- Change "Previews" menu to "Resources".

## v0.26.2 - 2021-09-09

- Fix `TSNE` -> `t-SNE` in portal.

## v0.26.1 - 2021-09-08

- Add cypress tests of file-backed pages: These don't require API mocking, and because of
  their relative simplicity, may get short shirt in manual testing.
- Add routes for iframes.
- Add a page with the metadata loaded into LineUp.
- Add note explaining the limitted scope of the publications page.
- Move `SectionContainer` to `PaddedSectionContainer`.
- Upgrade Vitessce to 1.1.14. Gene expression sliders and automatic overplot correction have been added.

## v0.26.0 - 2021-09-01

- Use fewer hard-coded values on the DonorChart page.
- Rough draft of organ detail pages.
- Rough draft of organ index and detail pages.
- Begin organ pages: Generate YAML from disparite sources of information.
- Support query parameters on TSV downloads.

## v0.25.4 - 2021-08-25

- Update SPRM viz to include new naming conventions + tsne.

## v0.25.3 - 2021-08-23

- Softer warning if 403 from Entities API.
- Add helper functions to simplify the diversity page.
- Enable external links directly to HuBMAP datasets on home page.
- Link to the diversity page from the footer.
- Add a flag so we could put up draft publications, but not show them in the list.
- Stub out publication page.
- Add an index page which lists all publication.
- Tiny grammar fix.
- Globus link for support datasets.

## v0.25.2 - 2021-08-19

- Deprecated assays are not present in `iterAssays` so we need to use `getAssayType` for Vitessce conf generation.

## v0.25.1 - 2021-08-18

- Add an endpoint for easy download of donor metadata.
- Refactor `ApiClient` mocking with OO.

## v0.25.0 - 2021-08-17

- Display datasets returned by cells gene expression query in rows with metadata.

## v0.24.4 - 2021-08-11

- Configure EUI via web-component properties
- Simplify App.jsx by just passing flaskData though, instead of destructuring and restructuring.
- Enable users to view files' pdfs without leaving the portal.
- In the python code, split the `/browse/*` routes to their own file, to keep things reasonable.
- Upgrade Vitessce to 1.1.13 for performance boost and slight alteration to how RGB images are handled internally.

## v0.24.3 - 2021-08-10

- Provide a fallback if `descendant_counts` is empty.
- Stub out publication page.

## v0.24.2 - 2021-08-05

- Remove descriptions from certain charts on diversity page.
- Rename diversity page to donor diversity.
- Introduce a log-scale slider.
- Add additional charts/tables to the donor diversity page.
- Style donor diversity page.
- Change donor diversity page's route from /vis to /diversity.
- Move submodule stuff into script, instead of cluttering readme.

## v0.24.1 - 2021-08-03

- Chart and table.
- Resolve a 500 error that happens when an HBM redirect can't find a matching record.
- Table with the race and sex of the donors.

## v0.24.0 - 2021-07-30

- Fix twitter timeline bug causing it not to display.

## v0.23.2 - 2021-07-28

- Fix more React warnings.
- Table with the race and sex of the donors.

## v0.23.1 - 2021-07-22

- Add entity tile components to storybook.
- Separate multivalued donor race with comma in entity tile.
- Fix Vitessce carousel demo by upgrading Vitessce to 1.1.12 + python package to 0.1.0a12 to gain backwards compatibility.
- Add a mechanism for site-wide alerts via config var. Could be used if half of our hybrid cloud goes down again.
- Add keys to silence React warnings.
- Loosen proptype checks for metadata tables.
- "ORCID ID" to "ORCID" in header; Add outbound icon in table body.
- Remove unused props passed from login button to dropdown.
- Upgrade to caniuse to silence warning.

## v0.23.0 - 2021-07-19

- Refactor tutorial components and add to storybook.
- Updated to CCF EUI 2.0
- List datasets indexed by Cells API.
- In the Cells Demo, demonstrate how multiple genes could be queried.
- Fix missing whitespace in optional message.
- Track dataset search tutorial events with google analytics.

## v0.22.1 - 2021-07-12

- Stub a cells-search, where new functionality can be developed.
- `create_timestamp` -> `created_timestamp`
- Search and replace: `display_doi` -> `hubmap_id`
- During QA, just clear localstorage.
- Demo how constrained sliders will work.
- Add and configure storybook.
- Created a table about the donor's race.

## v0.22.0 - 2021-07-08

- Factor out Cells API calls to a separate class.
- Hide fields which aren't really metadata.
- Skip changelog check if `GITHUB_HEAD_REF` or `GITHUB_BASE_REF` are blank.
- Move towards allowing more than gene/rna searches.
- Add doc strings to all Python Vitessce conf builders.
- Reference bookmarklet in QA instructions.
- Going forward, if a docs page is no longer needed, instead of just deleting it, replace `whatever.md` with `whatever.redirect`, and change the content to the new path.
- Upgrade Flask, primarily to silence warnings during tests.

## v0.21.4 - 2021-06-30

- Change the documention menu, at Jonathan's request.

## v0.21.3 - 2021-06-29

- Upgrade marked, so processing conforms better to Github-flavored MD.

## v0.21.2 - 2021-06-29

- All submodules now use the `main` branch.

## v0.21.1 - 2021-06-29

- Manually update docs repo.

## v0.21.0 - 2021-06-28

- Implement autosuggest UI for proteins and genes.
- Use sliders to select values for cell queries.
- If file-type descriptions are missing, don't show "i" in UI.
- Fix where Vitessce confs look for `offsets` file.
- Cleanup the boilerplate in the cells demo.
- Selecting multiple genes works now.
- Fix proptypes warning.
- Bump python from 3.7 to 3.8: There are some useful new language features.
- Search gene and protein substrings.
- Upgrade Vitessce to version 1.1.11 and adapt view confs for new 3D feature.

## v0.20.3 - 2021-06-17

- Add an endpoint which serves a Jupyter notebook with the viewconf for a dataset.

## v0.20.2 - 2021-06-14

- Change the title of the mobile menu.
- Note developer prerequisites.
- Update the README and manual QA instructions.

## v0.20.1 - 2021-06-09

- Add bitmask to SPRM `AnnData` example.
- Show search terms when the search input is focused or unfocused.
- Remove the path component from the cell endpoint in the config, for consistency with other endpoints.
- Fix homepage bar chart responsiveness.
- Fix text overflow for collections panel titles.
- Fix spacing for detail summary creation and modification dates.
- Remove support entity counts from provenance table tiles.
- Show derived samples in sample entity tiles.
- Upgrade Vitessce to 1.1.10 (and python package as well).

## v0.20.0 - 2021-06-07

- `ViewConf` to `ViewConfBuilder` to disambiguate the object from what it returns.
- Refactor to return a conf/cells tuple, instead of just a conf.
  (The cells part is `None` for now.)
- Add an endpoint which serves a Jupyter notebook with the viewconf for a dataset.
- Remove provenance section for support pages.
- Link to parent datasets in support page alert.
- Fix safari disabled button bug.

## v0.19.2 - 2021-06-03

- Update to the latest cells client, and update the flask endpoints.
- New dev-search query to find donor metadata.
- Gateway endpoint should also be provided as a config, instead of being hardcoded.
- Tweak redeploy script; Hope this will make sure that the prod-stage instance gets the right config.
- Show the URLs of the endpoints we hit on the status page.

## v0.19.1 - 2021-05-26

- Fix new stitched `AnnData` SPRM viewconf.
- Change home page bar chart title to hubmap datasets.

## v0.19.0 - 2021-05-24

- Add links to search page in home page bar chart bars.
- List the derived samples and datasets on donor pages.
- Fix changelog test for master build.

## v0.18.3 - 2021-05-17

- Three JSON endpoints and three react forms for the main usecases.
- Add a link to datacite on Collections.
- If there is a problem generating vitessce conf, show an error in the UI.

## v0.18.2 - 2021-05-13

- Add `git checkout main` to the deployment process for pulling new submodule repos.

## v0.18.1 - 2021-05-12

- Serve a 403 if the user requests a 32-character UUID, but it's not in ES.
- Add missing info button to citation.
- Add call to action button to home page revision carousel.
- On a derived search, show the assay type it is derived from.
- Fix image carousel srcset.
- Change variables label for SPRM vitessce view conf from `genes` to `antigens`.
- Bump lodash to 4.17.21.
- Remove publication status from homepage facet search.
- Replace homepage with new version.
- Add an explanatory warning at the top of Support pages.

## v0.18.0 - 2021-05-10

- Add a check on Cloudwatch to the deployment routine.
- Upgrade to lodash-4.17.21.
- Upgrade to ssri-6.0.2.
- Upgrade to underscore-1.13.1.
- Upgrade Vitessce to 1.1.9.

## v0.17.4 - 2021-05-06

- Add citation section to collections.
- Fix bug in dev-start.sh.
- Add facet search to new home page.
- Show correct count when a my-list includes a "Support" entity.
- Handle a few more edge-cases with the new Support entities.
- Stop using `everything`: Instead, use `all_text`, and highlight matches from `description`.

## v0.17.3 - 2021-05-03

- Remove duplicate file.
- Fix dev-start.sh warnings.
- Fix a tiny bit of copy-and-paste in the my-lists code.
- Show an icon in the tile for Support entities.

## v0.17.2 - 2021-04-28

- Make facet counts as dark as the labels.
- Friendlier 404 when UUID is the wrong length.
- Add key to PanelList and fix react warning.
- Re-enable visualization for seqFISH.
- Add docs on visualization processing to the portal.

## v0.17.1 - 2021-04-27

- UI support for new Support entity type.

## v0.17.0 - 2021-04-26

- Remove code that hit the cells-api from the client with a stub for hitting it from the server.
- In Collection, change label from "Creators" to "Contributors", to make this a better DOI landing page.
- Fix height of twitter timeline in safari on new homepage.
- Randomize intial carousel image.

## v0.16.3 - 2021-04-22

- Updated styles for CCF EUI v1.6.0
- Fix the z-index of the Files header.
- Add data use guidlines, external links and twitter timeline to home page revision.
- Add title, description and carousel to home page revision.
- Show titles of protocols that the API gives us.
- Remove unused python enums.
- Add sprm-to-anndata visualization
- Fix prop-types error on Summary.
- Upgrade vitessce to 1.1.8

## v0.16.2 - 2021-04-19

- Fix vis-lifting bug on Samples.
- Lift the visualization for image pyramids to the parent.
- Add a banner on the details page if it is not the latest version.

## v0.16.1 - 2021-04-15

- Supply metadata for webspiders, even when the donor is missing.
- Help users who may be logged into the wrong globus account.

## v0.16.0 - 2021-04-12

- Tweak dataset columns on Sample details.

## v0.15.4 - 2021-04-07

- Add assay type horizontal bar chart to home page revision.
- Bug fix: Donor metadata is now shown.

## v0.15.3 - 2021-04-05

- Move the Attribution section lower on the details pages.
- link edit: "Azimuth: Reference-based single cell mapping"
- Bump elliptic from 6.5.3 to 6.5.4.
- Exclude Datasets which have been superseded from search results.
- Hide nested objects in metadata table.
- In several cases, python errors were only being logged at the info level. Elevate to error.
- Bump pyyaml from 5.3.1 to 5.4.
- Bump y18n from 4.0.0 to 4.0.1.

## v0.15.2 - 2021-04-01

- Replace ccf dropdown in header with 'Atlas & Tools' and add link to Azimuth.

## v0.15.1 - 2021-03-29

- Fix a proptype error in FileBrowser.
- Fix proptypes error that occurs after login.
- Add route for homepage revision work in progress.
- Unnecessary auth headers for published zarr stores cause unecessary CORS preflight requests.

## v0.15.0 - 2021-03-26

- Show create list dialog instead of save items to list dialog when no lists exist.
- Handle collection missing doi_url.
- Distinguish the current page's node in provenance graph.
- Replace tooltip for provenance graph nodes.

## v0.14.6 - 2021-03-25

- Upgrade commons dependency.
  Wrap all Vitessce conf creation calls in try catch to return empty json as well as class instantiation.
- Add new sequencing conf generation for visualization of zarr-backed AnnDAta.
- For versioning, "previous" will be spelled out in the API response. Fix dev search.
- Upgrade Vitessce to 1.7.1.

## v0.14.5 - 2021-03-23

- Return donor registration/creation nodes for donor page provenance graphs.
- Fix a bug in the push.sh script: master is not being updated.

## v0.14.4 - 2021-03-23

- Tweak container names to be in sync with gateway.
- Update submodules before, rather than after, making an image.
- Add additional testing for provenance graph.
- Update provenance graph to not display donor registration node.

## v0.14.3 - 2021-03-19

- Loosen a regex to avoid a hard-to-reproduce error.

## v0.14.2 - 2021-03-19

- Update doc for IU again.

## v0.14.1 - 2021-03-18

- Pull in CCF and ASCT+B docs that are needed for DOI.
- Remove the ASCT+B preview, since it is in the other menu.
- Add table for sample specific datasets on the sample page.

## v0.14.0 - 2021-03-15

- Add collections section to dataset page.
- Remove metadata table for donors without metadata.
- Fix returning `self.conf` when it does not exist for XXX-seq assays with scatterplot conf.
- Port QA doc to markdown.
- Add linting which includes prettier check to test script.
- Tidy up the example config.

## v0.13.2 - 2021-03-11

- Dependabot version bump for ini.
- Upgrade commons to 2.0.0.
- Vitessce no longer errors if following a page anchor link.
- Fix bug where no assay is found for Vitessce.

## v0.13.1 - 2021-03-08

- Dependabot version bump for lodash.
- dependabot bumps the version number on marked.
- Add button to show descendants of entity in provenance graph detail pane.
- Fix the labels on the links for EUI and RUI.
- Add partonomy facet to dev-search.
- Add prev and next to dev-search.
- Rewrite Vitessce backend to use `vitessce-python` package.

## v0.13.0 - 2021-03-02

- Replace CCF link with menu.
- Add "My Lists" to the header menu when the window in narrow.
- Add software link to header menu.
- Remove hard-coded assay types from Vitessce, replace with type service.
- Add hubmap-commons to requirements.txt
- Upgrade dependency to agree with commons.

## v0.12.3 - 2021-02-23

- Fix eslint errors from description component export.
- Fix anchor tag locations on detail pages.
- Refactor prov vis components to be declarative and access providers.
- Fix saved entities table ui shift when selecting rows.
- Add link to software.

## v0.12.2 - 2021-02-17

- Handle Donors missing mapper_metadata.
- Display message instead of empty table on saved list page.
- Display alert and reset selected items when items are successfully added to lists.
- Disable save to list button when no lists are selected.
- Track outbound links with Google Analytics.

## v0.12.1 - 2021-02-17

- Disable saving collection entities.

## v0.12.0 - 2021-02-16

- Update text of ASCT+B Preview.
- Change language for alert shown on the entity detail page when saving the entity or editing its saved status.
- Fix incorrect column labels in saved lists and saved list pages.
- Display warning text when attempting to edit an entity's saved status when saved lists do not exist.
- Fix page view tracking to track visits to a saved list page together instead of separating by uuid.
- Track error boundary errors in Google Analytics.
- Track web vitals and send to Google Analytics.

## v0.11.2 - 2021-02-10

- Stub out a UI for the Cells API.
- Enable users to store entities and lists of entities in local storage.
- Add my lists page to interact with stored entities and lists.

## v0.11.1 - 2021-02-05

- Add a link to the CCF JSON, and a new route to serve the JSON.
- Pull new lightsheet docs.

## v0.11.0 - 2021-02-01

- Let the ProvGraph work against either the new or old Prov API.

## v0.10.2 - 2021-01-27

- Bring back selected filters UI.
- Provide two different view toggles, one for the main search, and one for dev.
- For the dev search, provide a stub where a CCF view could be filled in.
- Demo hierarchical facets with publication status.
- Remove unused props from ProvTable.

## v0.10.1 - 2021-01-25

- Link to collections DOI.
- Change "Login" to "Member Login".

## v0.10.0 - 2021-01-19

- Log config during docker startup.
- Use the github CI syntax for output folding.
- Add notes on design process to README.
- Pin the Ubuntu version used by github CI.
- Add a dev search facet to find spatially located datasets; Fix a bug in the facet for spatially located samples.

## v0.9.6 - 2021-01-11

- Add cypress tests for dataset search tutorial.
- Upgrade cypress.

## v0.9.5 - 2021-01-05

- Function to calculate minor version numbers given a reference.
- No longer run tests on Travis.
- Explicitly state how cookies should be handled cross-site. This resolves a console warning.
- Enable user to traverse tutorial with arrow keys.
- Alter tutorial language.
- Fix tutorial bugs.
- Disable schema validation warnings for now.

## v0.9.4

- Skipped because of deployment snafu.

## v0.9.3 - 2020-12-16

- Double UWSGI buffer size.

## v0.9.1 - 2020-12-11

- Add interactive tutorial for dataset search page.

## v0.8.1 - 2020-12-07

- Centralize color definitions in the theme.
- Remove broken link to /docs/help.
- submission.md in portal-docs had fallen out of sync with the ingest-validation-tools. Remove link.
- Remove dev server from ci test script.
- Remove vestigial config.py, and move list of entities types to routes_main.py.

## v0.8.0 - 2020-12-03

- Lazy load vitessce share button in entity header to keep vitessce out of bundle entry points.
- Link to the feedback process documentation from the README.
- Set proxy http version for gzip in example nginx conf.
- Simplify python routing code.
- Centralize our CSS z-indexes, so we have global view of what overlays what.

## v0.7.3 - 2020-11-25

- Tweak NGINX settings to allow caching on client.
- Rearrange Dockerfile to improve layer caching.
- Compress webpack assets with gzip and enable gzip in nginx.
- Fix conditional in test.sh
- Try out github actions for ci.
- Upgrade Vitessce to allow for shareable linkes, and add sharing functionality.

## v0.7.2 - 2020-11-23

- Update CCF template to use the same analytics key as the rest of the site.
- Change fullscreen visualization icon.
- Fix spacing between description and dates in entity detail page.
- Return collections page.
- Add contacts table to collection page.

## v0.7.1 - 2020-11-16

- Fix injection order for Search stylesheet.
- Indent the FAQs.
- Search pagination control immediately follows the table.
- Add "Software" section to footer.
- Add styled-components babel plugin
- Change table-height to land in the middle of a row.

## v0.6.4 - 2020-11-10

- Try to diagnose and fix versioning bug.

## v0.6.3 - 2020-11-09

- Improve accessibility of search sort dropdown.
- Split js bundle by route.
- Drop our standalone file, and use package.json for versioning info.

## v0.6.2 - 2020-11-05

- Update redeploy.sh to handle to stage environment.

## v0.6.1 - 2020-11-02

- Bump version to 0.6. (I forgot to increment for the 0.5 sprint. Sorry!)
- Change sort label for IDs from the entity type to HubMAP ID.
- Facet the validation errors, to understand what part of the schema is being violated,
  and what part of the documents are in violation.

## v0.4.7 - 2020-10-28

- Update search page ui to 8/17/2020 design.
- Compact search sidebar spacing and update font size and colors.
- Resize search table sort arrows.
- Add tile view for search page.
- On the status page, show where the API info comes from.

## v0.4.5 - 2020-10-26

- Disable provenance table for salmon_rnaseq_snareseq data types.
- Fix in ingest-api url on status page.
- Update home page html title.

## v0.4.4 - 2020-10-21

- Log validation errors, if we see them.
- Manual update of ingest-validation-tools to get Donor metadata field descriptions.
- Pad out short descriptions in JSON-LD metadata to meet minimum-length requirements.
- Add service status page.

## v0.4.3 - 2020-10-14

- Schema.org JSON-LD in header.
- Add /search to the disallow list in robots.txt.

## v0.4.2 - 2020-10-09

- Fix main header dropdown menus' z-index to be above the subheader.
- Fix header elevation when vitessce is fullscreen.
- Do not offset for entity header when visualization is fullscreen on preview pages.
- Make links in markdown-based pages blue.
- Fix proptypes error.
- Standardize icon button sizes.

## v0.4.1 - 2020-10-05

- Add theme switch and exit fullscreen button to subheader when visualization is fullscreen.
- Expand the primary header and entity subheader when vitessce is fullscreen.
- Make the facets a little more clear.
- Fix bug where entity header is stuck in a loop of appearing and disappearing in Safari.
- Fix issues with header elevation and subheader appearance on initial renders.
- Fix bug where header elevation was incorrect on entity detail pages when subheader was not displaying.
- Improve test coverage on Search.
- Find documents with validation-errors on dev-search.
- Bump version to v0.4.

## v0.3.3 - 2020-09-30

- Add entity header for detail pages.
- Change placement of visualization tile selector and close upon selection.
- Upgrade lodash to fix security warning.

## v0.3.2 - 2020-09-28

- Add more information to dev-search.
- Document maintenance build process.
- Move existing pages from components to pages directory.
- Reorganize provenance and visualization components.
- Do not pass `endpoints` down down to `Routes`; There is now a context provider.
- Only allow robots on the main production site, none of the other deployments.
- Add a meta tag that will give Chuck access to Google Search Console.
- Link to detail page in each row's HuBMAP ID cell not the entire row in search table.

## v0.3.1 - 2020-09-21

- Fix analysis detail links for pipeline origin fields which do not end with .git.
- Make derived from ancestor link the same color as other links.
- Fix error page html titles.
- Modify search table row links to fix safari bugs.
- Redirect to previous page following login.
- Change alerts to outlined variant and update their icons.

## v0.2.2 - 2020-09-16

- Add elevation to header app bar.
- Display user email dropdown in header when logged in.

## v0.2.1 - 2020-09-14

- Give a user-friendlier error if a bad type was in the search URL.
- Minor version bump.
- Disable no props spreading rule in eslintrc.
- Update dockerignore for smaller images.
- Fix metadata table short circuit for sample and dataset detail pages.
- Do not display provenance analysis details pipelines headers when pipelines do not exist.
- Fix bug where clicking a visualization theme switch button twice removes theme.
- Grouped, folding search facets.
- Style error boundary like other errors.

## v0.1.8 - 2020-09-09

- Add hover tooltips to entity detail buttons.
- Update spacing in entity detail summary.
- Remove anchors from data types links in entity detail summary.
- Update documentation about dataset statuses.
- Update docs. (Normally part of release, but we didn't release today.)
- Refactor detail layout and fix table of contents sections for entity detail pages.
- Fix filename for donor metadata table tsv.
- Fix prop type warning for summary data in home page.
- Fix headers in useProvData hook.
- Remove host from sample tissue ccf link.
- Create app context provider which includes endpoints and flask nexus token.
- Use flask nexus token instead of cookie nexus token for all requests.
- Move description in metadata table to icon tooltip.
- Update provenance analysis details to separate ingest and cwl pipelines.

## v0.1.7 - 2020-08-31

- Fix search request loop bug for derived entities.

## v0.1.6 - 2020-08-31

- Pull in FAQs.

## v0.1.5 - 2020-08-31

- Update detail page spacing.
- Fix anchor link locations in entity detail pages for Safari.
- Update icons for globus link.
- Replace index.css with global styles.
- Update initial padding for FileBrowser to be vertically aligned with other entity detail sections.
- Fix donor entity tile age to reflect changes to metadata field names.
- Replace sample tissue location placeholder with link to ccf.

## v0.1.4 - 2020-08-28

- Add artillery load tests.
- Update ProvTabs to disable table for snare_lab and TMT-LC-MS data types.
- Add eslintignore and ignore all public directories.
- Fix issue where login button was not displaying logout when logged in.
- Change link in footer from "Contact" to "Submit Feedback".
- Increase number of data types displayed in the home page bar chart to 30.
- Remove collections from navigation menus.
- Add a margin at the bottom of the search page.

## v0.1.3 - 2020-08-26

- Create react error pages.
- Create build process for static maintenance page.
- Display mapped data types for home page bar chart.
- Add route wrapper component.
- dev-start.sh now checks that submodules are being pulled.
- Add hashes to webpack bundle filenames.

## v0.1.2 - 2020-08-24

- Fix seq vitessce views.
- Use the dataset's own group, not the donor's.
- Follow up to fix donor search, again.
- Update donor search facets to reflect current strings.
- Upgrade vitessce to 0.2.4, giving us auto-adjusting sliders.

## v0.1.1 - 2020-08-24

- Fix "BioMedical" capitalization.
- Fix provenance table request loop.
- Simplify the README, and put the important parts at the top.
- Increment the minor version number: Releases over the next two weeks will update the patch number.

## v0.0.56 - 2020-08-21

- Fix seqFish hybcycles issue where wrong cycle is displayed.
- Don't show 500 on seqFish error - instead show no visualization.
- Hard code centers count in home page data summary to 5.
- Get nexus token for search and dev search pages from flask.
- Update donor search facets to reflect current strings.

## v0.0.55 - 2020-08-20

- Fix issue where a null token was being used in requests when not logged in.

## v0.0.54 - 2020-08-19

- Use the same metadata table as with datasets.
- Add tests for donor metadata component. (Older work, but we had missed the changelog.)
- Tweak script to flag misplaced changelogs
- Fix seqfish directories
- Limit width of screenshots in preview. (Older work, but we had missed the changelog.)
- Don't set an `Authorization` header when we don't have a nexus token. Public datasets are now visible without login.
- Add tests for sample tissue component. (Older work, but we had missed the changelog.)
- Setup tracking page views with Google Analytics. (Older work, but we had missed the changelog.)
- Replace "gender" with "sex" in the donor facets.

## v0.0.53 - 2020-08-17

- Add tests and prop types for files components.
- Move files components out of detail directory and into files directory within components.
- Search is now aligned with title and header content.
- seqFISH data layout updated.
- Show text search matches in context.

## v0.0.52 - 2020-08-12

- Stub out ASCTB and make vitessce config optional in previews.
- Make the changelog accessible at /CHANGELOG.
- Add tests for summary data component.
- Add tests for summary component.
- Implement a minimal search for /search without a query: This prevents errors, but we should not link to it.
- Add a redirect for HBM IDs; No exposure in UI -- just a tool for developers for now. (Since issue reports often reference the HBM IDs.)
- Add a bottom margin on markdown pages.
- Remove the access group facet.
- For a release, just do everything on master. Requiring manual PR doesn't really help us.
- Add pre-commit hook to lint js files.
- Filter for RUI in dev-search.
- When Vitessce is full-window, and Safari is full-screen, pressing escape once will take Vitessce out of full-window,
  and pressing again will take Safari out of full-screen (which is Safari's default behavior for escape).
- Add test for status icon component.
- Make token cookie a session cookie.

## v0.0.51 - 2020-08-05

- Upgrade Viv for IMC data fix.
- Reorder Dockerfile steps to improve caching.
- Simply webpack and jest import aliases.
- Make webpack dev build logs less verbose.
- Make webpack production build logs less verbose.

## v0.0.50 - 2020-08-03

- Use mapped_data_access_level consistently.
- Security update from dependabot.
- Show only imaging SPRM when there are no cell segmentations.

## v0.0.49 - 2020-08-03

Chuck neglected to merge the PR for v0.0.47,
though the docker image and tag were made successfully.
He then misdiagnosed the problem, and incremented the version number.

So: Changes below include work from v0.0.47, and there is no v0.0.48. Sorry!

- Add "Access Group" facet.
- CCF is now explicitly versioned, instead of just pulling latest.
- Add description section to collections page.
- Display access level in dataset detail.
- Update docs submodule: Fix formatting, change "assay/" to "assays/", etc.
- Add href to 'Citing HuBMAP' link in the footer.
- Use Material UI styling for the search table.
- Don't show the currently selected filters across the top.
- Add description of all previews.
- Update titles of previews.
- Sort columns by clicking headers.
- Update footer per 07/29/2020 design.
- Updated Vitessce view config generation script to fill in the fileType layer property
- Added a snackbar to display warning messages from Vitessce
- Fix wrapping in search results on Safari.

## v0.0.46 - 2020-07-28

- Automatically open link in new window after agreeing to DUA.
- Tweaks to make docker build a little faster.
- Reference docs as submodule.
- Require user to agree to DUA before accessing Globus files.
- Update DUA Typography.
- Display latest protocol version in entity detail protocol section.
- Tweak style of results table so it's more clear that the hole row is the result.

## v0.0.45 - 2020-07-27

- Change center to group in entity detail attribution section.
- Display derived entities button in provenance table only if descendant entities exist.
- Change creator to contact in entity detail attribution and collection datasets table.
- Display descendant dataset count in dataset entity tiles.
- Handle DUA by data access level.
- No longer run eslint as part of webpack: it was missing tests, and we're running eslint across everything outside webpack now.
- Add more single cell assay support.
- Add Jeff Spraggins' description to the preview of the Spraggins data.

## v0.0.44 - 2020-07-24

- CCF no longer opens in new tab.
- Display descendant dataset count in dataset entity tiles.
- Remove references to portal_uploaded_protocol_files.
- Misc. small fixes to docs.
- Fix npm run test issues and add to test script.
- Replace link to JSON on entity detail pages with icon.
- Fix early exit in push.sh.
- Use the rounded variants of all icons.
- Upgrade Vitessce to 0.1.9.

## v0.0.43 - 2020-07-23

- Add bottom section to entity tiles.
- Fix and simplify entity tile color logic.
- Updated version of vitessce-data in view config URLs for Satija showcase
- Move entity tile into components directory and split into subcomponents.

## v0.0.42 - 2020-07-22

- Display alert in provenance section when provenance data is unavailable.
- Link to CCF docs.
- Remove unused methods and corresponding tests for the python API client; combine copy-and-paste methods for GET and POST.
- Add a search page focussed on the needs of developers.
- Run eslint across all js/jsx before webpack.
- In the narrow layout, the header linked to "/help", which is not valid. Help is still available from "/docs".
- Run JS tests as part of Travis.
- Display down chevron in provenance table for datasets.
- Change "Showcase" to "Preview"
- Add a generic image viewing vitessce configuration.

## v0.0.41 - 2020-07-20

- Update homepage data use guidelines.
- Make icon usage more consistent.
- Get rid of the quick-start script.
- Incorporate the ProvVis wrapper directly. This simplifies the build process.
- Update globus link per 07/15/2020 design.
- Upgrade lodash to fix potential vulnerabilities.
- Updated the styles for the .vitessce-container to make the Vitessce Please wait... modal visible

## v0.0.40 - 2020-07-15

- Move seldom used facets to the bottom.
- Fix entity tile divider and icon colors.
- Make entire login/logout button a link.
- Only use variable font from typeface-inter.
- Update font sizes throughout per design changes.
- Separate home page bar chart into own bundle chunks and lazy load.
- Separate vitessce visualization into own bundle chunks and lazy load.
- Markdown syntax fixes.
- Add metadata table to sample detail.
- Fix sample tissue header size.
- Add bundle entry chunk for vendors.
- Update submodules to latest master with each run of push.sh.
- Add a docs page with links to constrained searches with and without metadata.

## v0.0.39 - 2020-07-13

- Change documentation button in nav to a dropdown menu.
- Make entire nav button a clickable link instead of only the text.
- Change globus link text to "Download from Globus"

- Updated the markdown content for the cell type annotation (spleen) showcase

## v0.0.38 - 2020-07-10

- Put donor metadata facets on all search pages.
- Rearrange entity counts on home page.
- Fix entity tile duplication in the provenance table.
- Sort entities in provenance table by create_timestamp.
- Update ingest-validation-tools.

## v0.0.37 - 2020-07-08

- Make the display of the download link conditional on having agreed to the DUA.
- Use local storage to persist DUA agreement.
- push.sh now handles steps that were in the readme.
- Use mapped_data_types in search and details.
- Fix MD sytax problems.
- Add tiles to provenance table.
- Fix bugs in node click handling in ProvVis.
- Changed layout of Showcase and Visualization control styling.

## v0.0.36 - 2020-07-06

- Reorder search facets.
- Fix safari/firefox sticky header issues in the collection creators table.
- Fix documentation links, add title.
- Changed the `Satija` showcase dropdown option strings to HuBMAP IDs rather than Globus IDs to improve readability.

## v0.0.35 - 2020-07-06

- Still waiting for the index that would map abbreviations to full names, but this makes sure the link targets are rendered, and datasets with multiple types can link to each.
- Look up the ancestor on constrained searches to provide more information.
- Factor this functionality out as a general purpose LookupEntity.
- Add basis CSS for markdown content.
- In search table, split array fields.
- Remove stub doc pages and fix links.

## v0.0.34 - 2020-07-03

- Rename DagProv component to ProvAnalysisDetails.
- Add links to ProvAnalysisDetails.
- Added a new showcase for the spleen cell type annotation dataset from the Satija Lab at NYGC, with data from UF.
- Add dataset file browser.
- Add an Error Boundary about routes.
- Fix errors when dataset doesn't have a data_types field.
- Do the git tag only after a successful Docker build.
- Put markdown content on a sheet.
- Limit width of images.
- Render markdown in React.
- Added a z-index of `5` to the `ShowcaseDropdown` styles to allow it to be rendered above the `Visualization` component.
- Changed the `ShowcaseDropdown` arrow icon behavior (point down when closed, point up when open).
- Upgrade Vitessce to `v1.0.8`.
  Update Vitessce to handle changing multiple sources from SPRM and Showcase.

## v0.0.33 - 2020-07-01

- Update collections page and add colletion detail.
- Add shared-styles dir.
- Add eslint plugins to resolve webpack aliases.
- Lots of markdown.
- If not logged in, will append: "Login to view more results."
- Fix bug in the proptypes for Search which was giving load-time error messages.
- Update provvis node-hover UI.

## v0.0.32 - 2020-06-29

-Add basic collections page to demonstrate api response.

- Set intial bar chart data to empty array.
- Upgrade Vitessce to 0.1.7 to fix Safari issues.
- Update hover state for login button.
- No login required on any page.

## v0.0.31 - 2020-06-25

- Add button to download dataset metadata table.
- Switch to using `cell-sets.json` files with the `cellSets` Vitessce component, rather than `factors.json` files with the `factors` component.
- Link to globus file browser.
- Add vega-lite bar chart to home page.
- Add hooks dir.
- Add last modified column to search results.
- Add mailto link on homepage.
- Update with the latest docs from the google drive.
- Allow us to override searchkit SCSS variables.
- Update submodule.

## v0.0.30 - 2020-06-23

- Disable eslint camelcase rule.
- Fix links to documentation.
- Move docs down a level, to keep top-level namespace clean.
- Support free-text search, using the "everything" field we create at index time.
- Make the header icon stats into.
- Add histogram selectors for Age and BMI.
- No login required for CCF.
- Fix pagination by updating searchkit.
- Get rid of search-schema submodule: We are giving up on validation, and the mappings are handled at index-time.
- Get rid of excess space at top of search page.
- Show ancestor constraint.
- Point to the `portal` index.
- Fixed a bug on expansion of Vitessce due to `z-index` not being taken into account without `position: relative` as well.
- Add "Welcome" so it's not just "| HuBMAP".

## v0.0.29 - 2020-06-18

- Update home page per design.
- Add infrastructure documentation.
- Added a toggle to change the Vitessce theme from `"light"` to `"dark"`.

## v0.0.28 - 2020-06-17

- Stub out the docs to be filled in.
- Fix JS OOM error during build.
- Make Peter Kant's commitments explicit.

## v0.0.27 - 2020-06-16

- Adds an "expand" button to expand the Vitessce component to the full window size.
- Further configure jest and react-testing-library.
- Add eslint plugins for jest-dom and testing-library.
- Add mock service worker to mock responses.
- Take advantage of Elasticsearch index routing.
- Add showcase page for Spraggins.

## v0.0.26 - 2020-06-14

- Add the CCF page to python tests.
- Fix bug in our template for the CCF.
- Fix errors displaying Visualization in table of contents.
- Enable free-text search. Caveats:
  - Values represented with abbreviations will not be searchable until we have our own index up which expands them.
  - Only searching the column fields right now. Searching all fields could be done by:
    - Listing every single field in the config here.
    - Using ES mapping to copy fields during indexing. (https://github.com/hubmapconsortium/search-api/issues/63)
    - Doing it explicitly in the code which constructs our index.
- Provide hubmapPortalUrl to CCF.
- Make VERSION a MD file: Easy to remember path, ("/VERSION") and it doesn't try to download the file. Downside: No URL to curl that just returns the VERSION without anything else... but we could add a raw MD handler, if needed.
- Get doctests working in Python.

## v0.0.25 - 2020-06-09

- Add a Markdown page listing the assays, and add anchors based on the types Bill tells me we will see on Prod.
- Pull cypress into its own space so the docker build won't require it.
- Provide PORTAL_INDEX_PATH and CCF_INDEX_PATH, so we can hit the separated indexes, when available.
- Overhaul react file structure.
- Add Markdown from Peter Kant.
- Extend prettier/react in eslint config.
- Insure that changelog is written with a NL between each concatenated file.
- Refactor and fix minor issues in detail components.
- Install and setup jest and react-testing-library.
- Release branches were failing because there were not CHANGELOG-\*.md.
- Include DOI and type in tab title.
- Pull latest field descriptions.

## v0.0.24 - 2020-06-05

- Integrate CCF-EUI.
- Add clean-webpack-plugin to webpack common config.

## v0.0.23 - 2020-06-04

- Move dag provenance to provenance tabs.
- Add donor metadata units where applicable.
- Add racial group to donor metadata.
- Fix prov graph width.
- Make metadata table description its own column.
- Add prettier formatter.
- Add webpack dev server.
- Split webpack config into separate files for each env.
- Add webpack bundle analyzer/visualizer.

## v0.0.22 - 2020-06-02

- Make short circuit length checks evaluate to booleans.
- Bump the ingest-validation-tools to add a mapping from metadata fields to descriptions.
- Make max width for content uniform.
- Update detail attribution page per v2 design.
- Use the Elasticsearch `_id` field, whose uniqueness is assured.

## v0.0.21 - 2020-05-28

- Concatenate separate files to build changelog on release; This will help us minimize merge conflicts
- Make theme accessible from styled components.
- Add dataset detail status icon.
- Add detail table of contents.

## v0.0.20 - 2020-05-27

### Added

- Triage issue template.
- Dag provenance to dataset detail page.

### Changed

- Use webpack aliasing to shorten relative path.
- Make Prov API request from client-side instead of server-side.

## v0.0.19 - 2020-05-18

### Added

- Only validate if in development.

### Changed

- Fix derived searches.
- Move vitessce into visualization section.
- Fix material-ui style conflicts with vitessce.
- Fix sample organ logic.
- Increase max height for detail file table.
- Make detail section padding uniform.

## v0.0.18 - 2020-05-18

### Added

- PropTypes on WrappedSearch.
- Translate result columns as well as filters.
- Make search columns appropriate to type.
- Get favicons on React pages.
- Call to action on home page.

### Changed

- Move VERSION down to the static directory, with a symlink in the original location.
- Upgrade Vitessce to 0.1.3 to fix small bugs and add description for tiff.
- Change scRNASEQ file searching.
- Separate detail pages by entity and update design.
- Display provenance table links for samples and datasets.

## v0.0.17 - 2020-05-15

### Added

- Python util to pull data from submodules.
- Appropriate facets for different types.

### Changed

- Fix Vitessce sizing bug.

## v0.0.16 - 2020-05-13

### Added

- Sort by last_modified.
- Hide entity_type facet.
- Different search configs for different types.
- Add data visualization in Vitessce for scRNASEQ and CODEX.
- Link to derived Samples and Datasets.
- Title on search page.

### Changed

- Use the code that had been in portal-search directly.
- Fix VisTabs panel overflow.
- Fix NoticeAlert to only display when errors exist.
- Moved react routes to own component.
- Make Webpack handle source maps and sassfiles
- Move unpkg dependencies to node_modules.
- Move Search and Home into App.
- Upgrade webpack.
- Pass api endpoints into App from flask.
- Move assay type to subheader instead of inline in ProvTable.
- Move ProvTable below title panel in Details.
- Fix NoticeAlert conditional causing a '0' to be rendered.

### Removed

- "Layout" from Search... just added border we didn't need.
- Removed old code to dump to nested tables.
- Remove vitessce from VisTabs.
- Remove unused fragments templates.
- Remove unused stylesheets.

## [v0.0.15](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.15) - 2020/05/07

### Added

- Redirect to the correct entity type, if we've landed on the wrong one.
- Limit Flask session to just one hour to avoid problems with Globus tokens expiring.
- Redeploy script.
- Add git submodules for search-schema and ingest-validation-tools.
- Add `ASSETS_ENDPOINT` to app.conf.
- Add static/public to dockerignore
- Add stage to dockerfile to build static

### Changed

- Add provenance table to details.
- Add expansion panels for details data.
- Add prop types checks to components.
- Make details page react by default.
- Remove unused templates.
- Fix data in details top title panel.
- Remove breadcrumbs links from details top title panel.
- Moved files needed to build static inside context.

## v0.0.14 - Mistake

## [v0.0.13](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.13) - 2020/05/03

### Added

- Added favicon
- Copy-and-paste new schemas... and we have fewer errors!

## [v0.0.12](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.12) - 2020/04/28

### Changed

- Rename Docker Compose config.
- Remove actual endpoint from default_config.py: This must be provided during deployment.
- Fix react to show content on details pages.
- Use cookie for search.
- Add react header and footer
- Tweak to accommodate new ES document structure.
- Make header links relative to root.
- Update facets to reflect current index structure.

## [v0.0.11](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.11) - 2020/04/16

### Added

- Hit Elasticsearch instance and start configuring facets.
- Add react, webpack, eslint, and styling dependencies.
- Make the Elasticsearch endpoint part of the config; Make it a single setting.
- Make the HuBMAP-Read group ID part of the config.
- Use Elasticsearch to read single records.
- Use the HuBMAP API ES instance for client-side faceted search, too.

## [v0.0.10](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.10) - 2020/03/06

### Added

- Handle 401, when Globus token has expired, but Flask session is still active.
- After login, check groups membership and 401 if not in HuBMAP.

### Changed

- Use API the right way and fix prov-vis.

## [v0.0.9](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.9) - 2020/02/07

### Added

- Demo of end-to-end UMAP scatterplot.

## [v0.0.8](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.8) - 2020/01/31

### Changed

- Demonstrate Docker Compose reverse proxy.
- Simplify Vitessce demo to just a scatterplot with data from HuBMAP.
- Add Cypress.io tests.

## [v0.0.7](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.7) - 2020-01-08

### Added

- Link to JSON from details, and test.
- Added many more rules to schema, and confirm that fields present are appropriate for type.
- Nice human readable error pages for 400, 403, 404 (routing and API), and 504.
- More realistic Vitessce demo, using the Mermaid data.
- Better labels on prov nodes, and handle clicks.

### Changed

- Fix redirect problem.
- Better documentation for IS_MOCK config option.
- Post-merge Travis runs were failing; fixed now.
- Fix docker.sh by being tighter about routing for markdown pages.
- app.conf is no longer read during tests.

## [v0.0.6](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.6) - 2019-12-18

### Added

- Make protocols.io links work.
- Github issues can be referenced in the schema, and if there is a related failure,
  a link will be given in the UI.

### Changed

- Clarify deployment process.

## [v0.0.5](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.5) - 2019-12-16

### Added

- Format details page headers.
- Support markdown pages.
- Add Searchkit.
- Config option to use mock API responses.
- Docker compose configuration.

### Removed

- Removed "TODO" styles, for now.

## [v0.0.4](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.4) - 2019-11-22

### Added

- Globus login/logout. Handle expired tokens.
- Hit the real API.
- Add a Vitessce hello-world to each details page.
- Add Dockerfile with nginx and uWSGI, and minimal Travis test.
- Script to tag and push to github and dockerhub.

## [v0.0.2](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.2) - 2019-10-30

### Added

- Start applying Bootstrap styles.
- Add a minimalist browse page and homepage.
- Check that tags are balanced.
- Add a "File" page; Start specializing the details pages.
- Add provenance to fake UI, and add it to details page.
- Add fake contribution info to the details page.

## [v0.0.1](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.1) - 2019-10-11

### Added

- Simple flask app with minimal routes. Test that known routes are 200, unknown are 404.
- With a just fresh checkout, `quick-start.sh` will bring up the flask app in development mode. Tested.
- Minimal, intentionally ugly CSS to flag the work that still needs to be done.
- Stub API. Demonstrate testing that an API call produces expected HTTP GET.
- Recursive tabular details rendering. Test input/output pairs.
