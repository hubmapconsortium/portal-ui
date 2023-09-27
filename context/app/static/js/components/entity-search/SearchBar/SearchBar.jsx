import React from 'react';
import { useSearchkit, useSearchkitQueryValue } from '@searchkit/client';

import SearchBarInput from 'js/shared-styles/inputs/SearchBar';
import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';

function SearchBar() {
  const { entityType } = useSearchConfigStore();

  const [query, setQuery] = useSearchkitQueryValue();
  const api = useSearchkit();
  return (
    <form
      onSubmit={(event) => {
        setQuery(query);
        api.setQuery(query);
        api.search();
        event.preventDefault();
      }}
      role="search"
    >
      <SearchBarInput
        id={`${entityType}-search`}
        onChange={(event) => setQuery(event.target.value)}
        value={query}
        fullWidth
      />
    </form>
  );
}

export default SearchBar;
