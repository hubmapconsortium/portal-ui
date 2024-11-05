import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle, SimpleQueryString } from 'searchkit';

import { withAnalyticsCategory } from 'js/components/searchPage/hooks';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import { BulkDownloadButton } from 'js/components/bulkDownload/BulkDownloadButton';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import MetadataMenu from '../MetadataMenu';
import TilesSortDropdown from '../TilesSortDropdown';
import SelectedFilter from '../SelectedFilter';
import { Flex, CenteredDiv } from './style';

const bulkDownloadTooltip =
  'Bulk download files for selected datasets. If no datasets are selected, all datasets given the current filters will be selected.';

function SearchBarLayout({ type, queryFields, sortOptions, isDevSearch, analyticsCategory }) {
  const { selectedRows } = useSelectableTableStore();
  const SwitchComponent = withAnalyticsCategory(
    isDevSearch ? DevSearchViewSwitch : SearchViewSwitch,
    analyticsCategory,
  );

  return (
    <>
      <Flex>
        <SearchBox
          autofocus
          queryFields={queryFields}
          queryBuilder={(query, options) =>
            SimpleQueryString(query.match(/^\s*HBM\S+\s*$/i) ? `"${query}"` : query, options)
          }
        />
        <CenteredDiv>
          <SortingSelector
            options={sortOptions}
            listComponent={withAnalyticsCategory(TilesSortDropdown, analyticsCategory)}
            analyticsCategory={analyticsCategory}
          />
          {!isDevSearch && <MetadataMenu type={type} analyticsCategory={analyticsCategory} />}
          {!isDevSearch && <WorkspacesDropdownMenu type={type} />}
          {!isDevSearch && <BulkDownloadButton uuids={selectedRows} tooltip={bulkDownloadTooltip} />}
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
