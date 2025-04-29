import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { useCollectionsSearchActions, useCollectionsSearchState } from './CollectionsSearchContext';

const searchbarPlaceholder = 'Search collections by title';

export default function CollectionsSearchBar() {
  const { search } = useCollectionsSearchState();
  const { setSearch } = useCollectionsSearchActions();
  return (
    <SearchBar
      sx={{ mb: 2, width: '100%' }}
      placeholder={searchbarPlaceholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
