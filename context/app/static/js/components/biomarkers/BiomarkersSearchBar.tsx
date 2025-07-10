import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { useEventCallback } from '@mui/material/utils';
import { useBiomarkersSearchActions, useBiomarkersSearchState } from './BiomarkersSearchContext';
import { useTrackBiomarkerLandingPage } from './hooks';

// Once protein search is implemented, this should be changed to:
// const searchbarPlaceholder =
//   'Search for biomarkers by gene symbol, gene name or protein name. Example: CD4, Cytokeratin';

const searchbarPlaceholder =
  'Search for biomarkers by gene symbol. Note that searches are case-sensitive. Example: CD4, MMRN1';

export default function BiomarkersSearchBar() {
  const { search } = useBiomarkersSearchState();
  const { setSearch } = useBiomarkersSearchActions();
  const track = useTrackBiomarkerLandingPage();
  const onBlur = useEventCallback(() => {
    track({
      action: 'Enter Search Term',
      label: search,
    });
  });
  return (
    <SearchBar
      sx={{ mb: 2, width: '100%' }}
      placeholder={searchbarPlaceholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onBlur={onBlur}
    />
  );
}
