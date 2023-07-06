import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { trackEvent, trackSiteSearch } from 'js/helpers/trackers';

import { SearchkitManager, SearchkitProvider, LayoutResults, NoHits, LayoutBody } from 'searchkit'; // eslint-disable-line import/no-duplicates

import useSearchViewStore from 'js/stores/useSearchViewStore';
import Filters from 'js/components/searchPage/filters/Filters';
import { fetchSearchData } from 'js/hooks/useSearchData';
import PaginationWrapper from './PaginationWrapper';
import SearchBarLayout from './SearchBarLayout';
import { resultFieldsToSortOptions } from './utils';
import { StyledSideBar } from './style';
import { NoResults, SearchError } from './noHitsComponents';

const setSearchHitsCountSelector = (state) => state.setSearchHitsCount;
const setAllResultsUUIDsSelector = (state) => state.setAllResultsUUIDs;

function SearchWrapper({
  apiUrl,
  filters,
  detailsUrlPrefix,
  idField,
  resultFields,
  hitsPerPage,
  httpHeaders,
  searchUrlPath,
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
    () => new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath }),
    [apiUrl, httpHeaders, searchUrlPath],
  );
  searchkit.addDefaultQuery((query) => query.addQuery(defaultQuery));

  const setSearchHitsCount = useSearchViewStore(setSearchHitsCountSelector);
  const setAllResultsUUIDs = useSearchViewStore(setAllResultsUUIDsSelector);

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
        const allResults = await fetchSearchData(
          { query, post_filter, _source: false, size: 10000 },
          elasticsearchEndpoint,
          groupsToken,
        );
        // eslint-disable-next-line no-underscore-dangle
        setAllResultsUUIDs(allResults.hits.hits.map((hit) => hit._id));
      }
      getAndSetAllUUIDs();
    });
    return () => {
      removalFn();
    };
  }, [analyticsCategory, elasticsearchEndpoint, groupsToken, searchkit, setAllResultsUUIDs, setSearchHitsCount]);

  return (
    <SearchkitProvider searchkit={searchkit}>
      <>
        <SearchBarLayout
          type={type}
          queryFields={queryFields}
          sortOptions={sortOptions}
          isDevSearch={isDevSearch}
          analyticsCategory={analyticsCategory}
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
      </>
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
  httpHeaders: PropTypes.objectOf(PropTypes.string),

  searchUrlPath: PropTypes.string,
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  resultsComponent: PropTypes.func.isRequired,
};

SearchWrapper.defaultProps = {
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
  type: undefined,
};

export default SearchWrapper;
