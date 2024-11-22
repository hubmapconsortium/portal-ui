import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { trackEvent, trackSiteSearch } from 'js/helpers/trackers';

import { SearchkitManager, SearchkitProvider, LayoutResults, NoHits, LayoutBody } from 'searchkit'; // eslint-disable-line import/no-duplicates

import useSearchViewStore from 'js/stores/useSearchViewStore';
import Filters from 'js/components/searchPage/filters/Filters';
import { fetchSearchData } from 'js/hooks/useSearchData';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import PaginationWrapper from './PaginationWrapper';
import SearchBarLayout from './SearchBarLayout';
import { resultFieldsToSortOptions } from './utils';
import { StyledSideBar } from './style';
import { NoResults, SearchError } from './noHitsComponents';
import { WorkspaceSearchDialogs } from '../workspaces/WorkspacesDropdownMenu';
import { SearchTransport } from './SearchTransport';

const setSearchHitsCountSelector = (state) => state.setSearchHitsCount;
const setAllResultsUUIDsSelector = (state) => state.setAllResultsUUIDs;
const allResultsUUIDsSelector = (state) => state.allResultsUUIDs;

function SearchWrapper({
  apiUrl,
  filters,
  detailsUrlPrefix,
  idField,
  resultFields,
  hitsPerPage,
  queryFields,
  type,
  isLoggedIn,
  isDevSearch,
  defaultQuery,
  resultsComponent: ResultsComponent,
  analyticsCategory,
  elasticsearchEndpoint,
  groupsToken,
}) {
  const sortOptions = resultFieldsToSortOptions(resultFields.table);
  const resultFieldIds = [...resultFields.table, ...resultFields.tile, ...resultFields.ccf]
    .map((field) => field.id)
    .concat(idField);

  const searchkit = useMemo(
    () =>
      new SearchkitManager(apiUrl, {
        transport: new SearchTransport(elasticsearchEndpoint, groupsToken),
      }),
    [apiUrl, elasticsearchEndpoint, groupsToken],
  );
  searchkit.addDefaultQuery((query) => query.addQuery(defaultQuery));

  // _source and _size seem to only be updated after searchkit's ViewSwitcherHits mounts and updates. This ensures these values are correct on initial search.
  searchkit.setQueryProcessor((query) => {
    query._source = resultFieldIds;
    query.size = hitsPerPage;
    return query;
  });

  const setSearchHitsCount = useSearchViewStore(setSearchHitsCountSelector);
  const setAllResultsUUIDs = useSearchViewStore(setAllResultsUUIDsSelector);
  const allResultsUUIDs = useSearchViewStore(allResultsUUIDsSelector);

  const queryString = useRef(false);
  useEffect(() => {
    const removalFn = searchkit.addResultsListener((results) => {
      const newQueryString = searchkit.state?.q;
      if (![queryString.current, undefined].includes(newQueryString)) {
        const category = 'Free Text Search';
        // TODO: How is trackSiteSeach reported? Can we use it instead of trackEvent?
        // TODO: Use a range of values for category?
        trackSiteSearch(newQueryString, category);
        // TODO: Remove trackEvent, eventually?
        trackEvent({
          category: analyticsCategory,
          action: category,
          label: newQueryString,
        });
      }
      queryString.current = newQueryString;
      setSearchHitsCount(results.hits.total.value);
      async function getAndSetAllUUIDs() {
        const {
          query: { query, post_filter },
        } = searchkit.query;
        try {
          const allResults = await fetchSearchData(
            { query, post_filter, _source: false, size: 10000 },
            elasticsearchEndpoint,
            groupsToken,
          );
          // eslint-disable-next-line no-underscore-dangle
          setAllResultsUUIDs(allResults.hits.hits.map((hit) => hit._id));
        } catch (error) {
          console.error('Error fetching result UUIDs', error);
        }
      }
      getAndSetAllUUIDs();
    });
    return () => {
      removalFn();
    };
  }, [analyticsCategory, elasticsearchEndpoint, groupsToken, searchkit, setAllResultsUUIDs, setSearchHitsCount]);

  return (
    <SearchkitProvider searchkit={searchkit}>
      <SelectableTableProvider tableLabel={type}>
        <SearchBarLayout
          type={type}
          queryFields={queryFields}
          sortOptions={sortOptions}
          isDevSearch={isDevSearch}
          analyticsCategory={analyticsCategory}
          allResultsUUIDs={allResultsUUIDs}
        />
        <LayoutBody>
          <StyledSideBar>
            <Filters filters={filters} analyticsCategory={analyticsCategory} />
          </StyledSideBar>
          <LayoutResults>
            <ResultsComponent
              sortOptions={sortOptions}
              hitsPerPage={hitsPerPage}
              tableResultFields={resultFields.table}
              detailsUrlPrefix={detailsUrlPrefix}
              idField={idField}
              resultFieldIds={resultFieldIds}
              type={type}
              analyticsCategory={analyticsCategory}
            />
            <NoHits component={<NoResults isLoggedIn={isLoggedIn} />} errorComponent={SearchError} />
            <PaginationWrapper />
          </LayoutResults>
        </LayoutBody>
        <WorkspaceSearchDialogs />
      </SelectableTableProvider>
    </SearchkitProvider>
  );
}

SearchWrapper.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  filters: PropTypes.objectOf(PropTypes.array).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFields: PropTypes.exact({
    table: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        translations: PropTypes.objectOf(PropTypes.string),
      }),
    ),
    tile: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        translations: PropTypes.objectOf(PropTypes.string),
      }),
    ),
    ccf: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        translations: PropTypes.objectOf(PropTypes.string),
      }),
    ),
  }).isRequired,
  hitsPerPage: PropTypes.number.isRequired,

  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  resultsComponent: PropTypes.func.isRequired,
};

SearchWrapper.defaultProps = {
  isLoggedIn: false,
  type: undefined,
};

export default SearchWrapper;
