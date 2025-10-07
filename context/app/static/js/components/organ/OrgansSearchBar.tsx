import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { trackEvent } from 'js/helpers/trackers';
import { useOrgansSearchActions, useOrgansSearchState } from './OrgansSearchContext';

const searchbarPlaceholder = 'Search organs by name or UBERON ID.';

export default function OrgansSearchBar() {
  const { search } = useOrgansSearchState();
  const { setSearch } = useOrgansSearchActions();
  return (
    <SearchBar
      sx={{ width: '100%' }}
      placeholder={searchbarPlaceholder}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      onBlur={() => {
        trackEvent({
          category: 'Organs Landing Page',
          action: 'Search Bar',
          label: search,
        });
      }}
    />
  );
}
