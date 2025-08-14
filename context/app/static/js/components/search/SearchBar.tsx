import React, { useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { trackSiteSearch, trackEvent } from 'js/helpers/trackers';
import SearchBarComponent from 'js/shared-styles/inputs/SearchBar';
import { useSearchStore } from './store';
import { isDevSearch, TypeProps } from './utils';

function SearchBar({ type }: TypeProps) {
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

      setSearch(/^\s*HBM\S+\s*$/i.exec(input) ? `"${input}"` : input);

      const action = 'Free Text Search';

      if (input) {
        trackSiteSearch(input, action);
        trackEvent({
          category: analyticsCategory,
          action,
          label: input,
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
