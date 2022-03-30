import React from 'react';
import { SearchkitClient, SearchkitProvider } from '@searchkit/client';

import Search from 'js/components/test-search/Search';

const skClient = new SearchkitClient();

function TestSearch() {
  return (
    <SearchkitProvider client={skClient}>
      <Search />
    </SearchkitProvider>
  );
}

export default TestSearch;
