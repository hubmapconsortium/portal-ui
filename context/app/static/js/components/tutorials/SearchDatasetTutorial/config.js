const sortTileViewStepTitle = 'Sort Search Results for Tile View';

const defaultSteps = [
  {
    target: '#Dataset-Type > div > div:nth-child(1)',
    disableBeacon: true,
    content:
      'The Dataset Metadata menu on the left side allows filtering datasets by any combination of metadata categories: Dataset Type, Organ and Sample Category. Search results update automatically as you edit the selection of filters.',
    title: 'Filter Your Browsing',
  },
  {
    target: 'div.sk-search-box',
    content:
      'To further narrow the relevant datasets, type search terms or phrases in “quotes" into the Search bar. Datasets containing any of the search terms will be returned.',
    disableBeacon: true,
    title: 'Search Datasets by Free Text',
  },
  {
    target: 'div.sk-layout__results.sk-results-list > table > thead > tr > th:nth-child(3)',
    content:
      'Clicking the arrow button by the relevant column will sort search results. A bolded arrow indicates the current sorting selection. Clicking again will reverse the order.',
    disableBeacon: true,
    title: 'Sort Search Results',
  },
  {
    target: '#tile-view-toggle-button',
    content: 'Toggling the results display mode will switch between table view and tile view.',
    title: 'Toggle Display Mode',
    disableBeacon: true,
  },
  {
    target: '#search-tiles-sort-button',
    content: 'Selecting your sorting option in this dropdown menu will sort your search results in tile view.',
    disableBeacon: true,
    title: sortTileViewStepTitle,
  },
];

const stepToAddIfViewMoreExists = {
  target: '#Data-Type div.sk-refinement-list__view-more-action',
  content: 'Clicking the "View All" button will display the entire list of filters in the selected category.',
  disableBeacon: true,
  title: 'View More Filters',
};

export { sortTileViewStepTitle, defaultSteps, stepToAddIfViewMoreExists };
