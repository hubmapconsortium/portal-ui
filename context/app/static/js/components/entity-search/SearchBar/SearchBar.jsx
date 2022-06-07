import React from 'react';
import { useSearchkit, useSearchkitQueryValue } from '@searchkit/client';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import TextField from '@material-ui/core/TextField';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';

function SearchBar() {
  const { entityType } = useStore();

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
      <TextField
        id={`${entityType}-search`}
        variant="outlined"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
        fullWidth
        size="small"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

export default SearchBar;
