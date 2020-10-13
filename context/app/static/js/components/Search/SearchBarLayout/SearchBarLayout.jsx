import React from 'react';
import { SearchBox } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import { Flex, StyledDiv } from './style';

function SearchBarLayout({ queryFields, searchView, setSearchView }) {
  return (
    <Flex>
      <SearchBox autofocus queryFields={queryFields} />
      <StyledDiv>
        <SearchViewSwitch searchView={searchView} setSearchView={setSearchView} />
      </StyledDiv>
    </Flex>
  );
}

export default SearchBarLayout;
