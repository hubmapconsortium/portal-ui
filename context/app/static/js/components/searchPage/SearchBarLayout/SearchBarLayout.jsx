import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle, SimpleQueryString } from 'searchkit';
import Stack from '@mui/material/Stack';

import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';
import { withAnalyticsCategory } from 'js/components/searchPage/hooks';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import MetadataMenu from '../MetadataMenu';
import TilesSortDropdown from '../TilesSortDropdown';
import SelectedFilter from '../SelectedFilter';
import { Flex, CenteredDiv } from './style';

function SearchBarLayout({ type, queryFields, sortOptions, isDevSearch, analyticsCategory }) {
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
          <Stack direction="row" spacing={1} marginLeft={1}>
            {!isDevSearch && <MetadataMenu type={type} analyticsCategory={analyticsCategory} />}
            {!isDevSearch && <WorkspacesDropdownMenu type={type} />}
            {!isDevSearch && <BulkDownloadButtonFromSearch type={type} />}
            <ViewSwitcherToggle listComponent={SwitchComponent} analyticsCategory={analyticsCategory} />
          </Stack>
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
