import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, StyledDiv } from './style';

function SearchBarLayout(props) {
  const { queryFields, sortOptions } = props;
  return (
    <>
      <Flex>
        <SearchBox autofocus queryFields={queryFields} />
        <StyledDiv>
          <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
          <ViewSwitcherToggle listComponent={SearchViewSwitch} />
        </StyledDiv>
      </Flex>
      <SelectedFilters />
    </>
  );
}

SearchBarLayout.propTypes = {
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchBarLayout;
