/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, StyledDiv, StyledCancelIcon } from './style';

function SelectedFilter(props) {
  const { bemBlocks, labelKey, labelValue, removeFilter, filterId } = props;
  return (
    <div className={bemBlocks.option().mix(bemBlocks.container('item')).mix(`selected-filter--${filterId}`)}>
      <div className={bemBlocks.option('name')}>
        {labelKey}: {labelValue}
      </div>
      <StyledCancelIcon onClick={removeFilter} />
    </div>
  );
}

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
      <SelectedFilters itemComponent={SelectedFilter} />
    </>
  );
}

SearchBarLayout.propTypes = {
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchBarLayout;
