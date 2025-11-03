import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { trackEvent } from 'js/helpers/trackers';
import { useTutorialLandingPageSearchActions, useTutorialLandingPageSearchData } from './TutorialLandingPageContext';
import { useEventCallback } from '@mui/material/utils';

const searchbarPlaceholder = 'Search tutorials by title or keyword.';

export default function TutorialsSearchBar() {
  const { search } = useTutorialLandingPageSearchData();
  const { setSearch } = useTutorialLandingPageSearchActions();

  const onChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  });

  const onBlur = useEventCallback(() => {
    trackEvent({
      category: 'Tutorials Landing Page',
      action: 'Search Bar',
      label: search,
    });
  });

  return (
    <SearchBar
      sx={{ mb: 2, width: '100%' }}
      placeholder={searchbarPlaceholder}
      value={search}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
