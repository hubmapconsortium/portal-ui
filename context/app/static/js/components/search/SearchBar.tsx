import React, { useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { trackSiteSearch, trackEvent } from 'js/helpers/trackers';
import SearchBarComponent from 'js/shared-styles/inputs/SearchBar';
import { useSearchStore } from './store';
import { isDevSearch, SearchTypeProps } from './utils';

function SearchBar({ type }: SearchTypeProps) {
  const { setSearch, search, analyticsCategory } = useSearchStore(
    useShallow((state) => ({
      setSearch: state.setSearch,
      search: state.search,
      analyticsCategory: state.analyticsCategory,
    })),
  );

  const [input, setInput] = useState(search);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Trim incidental whitespace so HuBMAP-ID and UUID format detection in buildQuery
      // can match the canonical formats exactly.
      const trimmed = input.trim();
      setSearch(trimmed);

      const action = 'Free Text Search';

      if (trimmed) {
        trackSiteSearch(trimmed, action);
        trackEvent({
          category: analyticsCategory,
          action,
          label: trimmed,
        });
      }
    },
    [analyticsCategory, input, setSearch],
  );

  const placeholder = isDevSearch(type) ? 'Search entities' : `Search ${type.toLowerCase()}s`;

  return (
    <form onSubmit={handleSubmit}>
      <SearchBarComponent
        id="free-text-search"
        fullWidth
        placeholder={placeholder}
        value={input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />
    </form>
  );
}

export default SearchBar;
