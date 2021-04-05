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
- Release branches were failing because there were not CHANGELOG-*.md.
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
