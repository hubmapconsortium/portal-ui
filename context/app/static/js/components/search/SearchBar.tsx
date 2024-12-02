import React, { useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { trackSiteSearch, trackEvent } from 'js/helpers/trackers';
import SearchBarComponent from 'js/shared-styles/inputs/SearchBar';
import { useSearchStore } from './store';

function SearchBar({ type }: { type: string }) {
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

      setSearch(input.match(/^\s*HBM\S+\s*$/i) ? `"${input}"` : input);

      const category = 'Free Text Search';

      if (input) {
        trackSiteSearch(input, category);
        trackEvent({
          category: analyticsCategory,
          action: category,
          label: input,
        });
      }
    },
    [analyticsCategory, input, setSearch],
  );

  return (
    <form onSubmit={handleSubmit}>
      <SearchBarComponent
        id="free-text-search"
        fullWidth
        placeholder={`Search ${type.toLowerCase()}s`}
        value={input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />
    </form>
  );
}

export default SearchBar;
