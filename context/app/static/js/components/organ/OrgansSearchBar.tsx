import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { trackEvent } from 'js/helpers/trackers';
import { useOrgansSearchActions, useOrgansSearchState } from './OrgansSearchContext';
import { useEventCallback } from '@mui/material/utils';

const searchbarPlaceholder = 'Search organs by name or UBERON ID.';

export default function OrgansSearchBar() {
  const { search } = useOrgansSearchState();
  const { setSearch } = useOrgansSearchActions();

  const onChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  });

  const onBlur = useEventCallback(() => {
    trackEvent({
      category: 'Organs Landing Page',
      action: 'Search Bar',
      label: search,
    });
  });

  return (
    <SearchBar
      sx={{ width: '100%' }}
      placeholder={searchbarPlaceholder}
      value={search}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
