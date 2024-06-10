import React, { useState } from 'react';

import SearchBarComponent from 'js/shared-styles/inputs/SearchBar';
import { useSearchStore } from './store';

function SearchBar() {
  const { setSearch } = useSearchStore();

  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(input.match(/^\s*HBM\S+\s*$/i) ? `"${input}"` : input);
  };
  return (
    <form onSubmit={handleSubmit}>
      <SearchBarComponent
        id="free-text-search"
        fullWidth
        value={input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />
    </form>
  );
}

export default SearchBar;
