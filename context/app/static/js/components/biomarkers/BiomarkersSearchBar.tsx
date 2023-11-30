import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { useBiomarkersSearchActions, useBiomarkersSearchState } from './BiomarkersSearchContext';

const searchbarPlaceholder =
  'Search for biomarkers by gene symbol, gene name or protein name. Example: CD4, Cytokeratin';

export default function BiomarkersSearchBar() {
  const { search } = useBiomarkersSearchState();
  const { setSearch } = useBiomarkersSearchActions();
  return <SearchBar placeholder={searchbarPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />;
}
