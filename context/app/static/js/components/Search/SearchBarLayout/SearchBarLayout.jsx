import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, StyledDiv } from './style';

function SearchBarLayout(props) {
  const { queryFields, sortOptions, isDevSearch } = props;
  return (
    <Flex>
      <SearchBox autofocus queryFields={queryFields} />
      <StyledDiv>
        <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
        <ViewSwitcherToggle listComponent={isDevSearch ? DevSearchViewSwitch : SearchViewSwitch} />
      </StyledDiv>
    </Flex>
  );
}

SearchBarLayout.propTypes = {
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchBarLayout;
