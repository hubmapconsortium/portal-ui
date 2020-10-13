import React from 'react';
import { SearchBox } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import { Flex } from './style';

function SearchBarLayout({ queryFields }) {
  return (
    <Flex>
      <SearchBox autofocus queryFields={queryFields} />
      <SearchViewSwitch />
    </Flex>
  );
}

export default SearchBarLayout;
