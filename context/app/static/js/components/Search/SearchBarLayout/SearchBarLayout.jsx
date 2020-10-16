import React from 'react';
import { SearchBox, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, StyledDiv } from './style';

function SearchBarLayout(props) {
  const { queryFields, sortOptions } = props;
  return (
    <Flex>
      <SearchBox autofocus queryFields={queryFields} />
      <StyledDiv>
        <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
        <ViewSwitcherToggle listComponent={SearchViewSwitch} />
      </StyledDiv>
    </Flex>
  );
}

export default SearchBarLayout;
