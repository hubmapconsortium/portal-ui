import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import DownloadButton from '../DownloadButton';
import TilesSortDropdown from '../TilesSortDropdown';
import SelectedFilter from '../SelectedFilter';
import { Flex, CenteredDiv } from './style';

function SearchBarLayout(props) {
  const { queryFields, sortOptions, isDevSearch } = props;
  return (
    <>
      <Flex>
        <SearchBox autofocus queryFields={queryFields} />
        <CenteredDiv>
          <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
          <DownloadButton />
          <ViewSwitcherToggle listComponent={isDevSearch ? DevSearchViewSwitch : SearchViewSwitch} />
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
