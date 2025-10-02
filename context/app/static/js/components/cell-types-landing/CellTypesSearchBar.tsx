import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { trackEvent } from 'js/helpers/trackers';
import { useCellTypesSearchActions, useCellTypesSearchState } from './CellTypesSearchContext';

// Once protein search is implemented, this should be changed to:
// const searchbarPlaceholder =
//   'Search for biomarkers by gene symbol, gene name or protein name. Example: CD4, Cytokeratin';

const searchbarPlaceholder = 'Search cell type by name or Cell Ontology ID.';

export default function CellTypesSearchBar() {
  const { search } = useCellTypesSearchState();
  const { setSearch } = useCellTypesSearchActions();
  return (
    <SearchBar
      sx={{ mb: 2, width: '100%' }}
      placeholder={searchbarPlaceholder}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      onBlur={() => {
        trackEvent({
          category: 'Cell Type Landing Page',
          action: 'Search Bar',
          label: search,
        });
      }}
    />
  );
}
