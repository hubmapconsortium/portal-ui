import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import DownloadButton from '../DownloadButton';
import TilesSortDropdown from '../TilesSortDropdown';
import SelectedFilter from '../SelectedFilter';
import { Flex, CenteredDiv } from './style';

function withAnalyticsCategory(BaseComponent, analyticsCategory) {
  return function UpdatedSelectedFilter(props) {
    return <BaseComponent analyticsCategory={analyticsCategory} {...props} />;
  };
}

function SearchBarLayout(props) {
  const { type, queryFields, sortOptions, isDevSearch, analyticsCategory } = props;
  return (
    <>
      <Flex>
        <SearchBox autofocus queryFields={queryFields} />
        <CenteredDiv>
          <SortingSelector options={sortOptions} listComponent={TilesSortDropdown} />
          {!isDevSearch && <DownloadButton type={type} />}
          <ViewSwitcherToggle listComponent={isDevSearch ? DevSearchViewSwitch : SearchViewSwitch} />
        </CenteredDiv>
      </Flex>
      <SelectedFilters itemComponent={withAnalyticsCategory(SelectedFilter, analyticsCategory)} />
    </>
  );
}

SearchBarLayout.propTypes = {
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchBarLayout;
