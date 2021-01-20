/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch from '../SearchViewSwitch';
import TilesSortDropdown from '../TilesSortDropdown';
import { Flex, CenteredDiv, StyledCancelIcon, SelectedFilterDiv, SelectedFilterName } from './style';

function SelectedFilter(props) {
  const { labelKey, labelValue, removeFilter, filterId } = props;
  if (filterId === 'entity_type') {
    return null;
  }
  return (
    <SelectedFilterDiv>
      <SelectedFilterName>
        {labelKey}: {labelValue}
      </SelectedFilterName>
      <StyledCancelIcon onClick={removeFilter} />
    </SelectedFilterDiv>
  );
}

function SearchBarLayout(props) {
  const { queryFields, sortOptions } = props;
  return (
    <>
      <Flex>
        <SearchBox autofocus queryFields={queryFields} />
        <CenteredDiv>
          <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
          <ViewSwitcherToggle listComponent={SearchViewSwitch} />
        </CenteredDiv>
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
