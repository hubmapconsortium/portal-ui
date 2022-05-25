import React from 'react';
import { useSearchkit, useSearchkitQueryValue } from '@searchkit/client';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

import TextField from '@material-ui/core/TextField';

function SearchBar() {
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
    >
      <TextField
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
