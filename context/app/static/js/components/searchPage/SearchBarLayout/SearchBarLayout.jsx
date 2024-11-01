import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchBox, SelectedFilters, SortingSelector, ViewSwitcherToggle, SimpleQueryString } from 'searchkit';

import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';

import { withAnalyticsCategory } from 'js/components/searchPage/hooks';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { getIDsQuery } from 'js/helpers/queries';
import SearchViewSwitch, { DevSearchViewSwitch } from './SearchViewSwitch';
import MetadataMenu from '../MetadataMenu';
import TilesSortDropdown from '../TilesSortDropdown';
import SelectedFilter from '../SelectedFilter';
import { Flex, CenteredDiv } from './style';

function SearchBarLayout({ type, queryFields, sortOptions, isDevSearch, analyticsCategory }) {
  const { openDialog } = useBulkDownloadDialog();
  const { selectedRows } = useSelectableTableStore();
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const datasetQuery = {
      query: getIDsQuery([...selectedRows]),
      _source: ['hubmap_id', 'processing', 'uuid', 'files'],
    };
    fetchSearchData(datasetQuery, elasticsearchEndpoint, groupsToken)
      .then((response) => {
        const results = response?.hits?.hits || [];
        setDatasets(results.map((d) => d._source));
      })
      .catch((e) => console.error('Error fetching datasets:', e));
  }, [selectedRows, elasticsearchEndpoint, groupsToken]);

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
          {!isDevSearch && (
            <WhiteBackgroundIconTooltipButton
              tooltip="Download dataset manifest"
              onClick={() => openDialog(datasets)}
              sx={{ mr: 1 }}
            >
              <SvgIcon color="primary" component={Download} />
            </WhiteBackgroundIconTooltipButton>
          )}
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
