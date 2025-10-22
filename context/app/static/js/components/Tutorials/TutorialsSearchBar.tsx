import React from 'react';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { trackEvent } from 'js/helpers/trackers';
import { useTutorialLandingPageSearchActions, useTutorialLandingPageSearchData } from './TutorialLandingPageContext';

const searchbarPlaceholder = 'Search tutorials by title or keyword.';

export default function TutorialsSearchBar() {
  const { search } = useTutorialLandingPageSearchData();
  const { setSearch } = useTutorialLandingPageSearchActions();

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
          category: 'Tutorials Landing Page',
          action: 'Search Bar',
          label: search,
        });
      }}
    />
  );
}
