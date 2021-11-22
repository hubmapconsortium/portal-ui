import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle } from 'searchkit';

import { withAnalyticsCategory } from 'js/components/Search/hooks';
import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import DownloadButton from '../DownloadButton';
import TilesSortDropdown from '../TilesSortDropdown';
import SelectedFilter from '../SelectedFilter';
import { Flex, CenteredDiv } from './style';

function SearchBarLayout(props) {
  const { type, queryFields, sortOptions, isDevSearch, analyticsCategory } = props;

  const SwitchComponent = withAnalyticsCategory(
    isDevSearch ? DevSearchViewSwitch : SearchViewSwitch,
    analyticsCategory,
  );
  return (
    <>
      <Flex>
        <SearchBox autofocus queryFields={queryFields} />
        <CenteredDiv>
          <SortingSelector
            options={sortOptions}
            listComponent={withAnalyticsCategory(TilesSortDropdown, analyticsCategory)}
            analyticsCategory={analyticsCategory}
          />
          {!isDevSearch && <DownloadButton type={type} analyticsCategory={analyticsCategory} />}
          <ViewSwitcherToggle listComponent={SwitchComponent} analyticsCategory={analyticsCategory} />
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
