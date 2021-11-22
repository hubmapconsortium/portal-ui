import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import { SearchkitManager, SearchkitProvider, LayoutResults, NoHits, LayoutBody } from 'searchkit'; // eslint-disable-line import/no-duplicates

import useSearchViewStore from 'js/stores/useSearchViewStore';
import Filters from 'js/components/searchPage/filters/Filters';
import PaginationWrapper from './PaginationWrapper';
import SearchBarLayout from './SearchBarLayout';
import { resultFieldsToSortOptions } from './utils';
import { StyledSideBar } from './style';
import { NoResults, SearchError } from './noHitsComponents';

const searchViewStoreSelector = (state) => state.setSearchHitsCount;

function SearchWrapper(props) {
  const {
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
  } = props;

  const sortOptions = resultFieldsToSortOptions(resultFields.table);
  const resultFieldIds = [...resultFields.table, ...resultFields.tile, ...resultFields.ccf]
    .map((field) => field.id)
    .concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });
  searchkit.addDefaultQuery((query) => query.addQuery(defaultQuery));

  const setSearchHitsCount = useSearchViewStore(searchViewStoreSelector);

  const queryString = useRef(false);

  useEffect(() => {
    const removalFn = searchkit.addResultsListener((results) => {
      const newQueryString = searchkit.state?.q;
      if (![queryString.current, undefined].includes(newQueryString)) {
        ReactGA.event({
          category: analyticsCategory,
          action: 'Free Text Search',
          label: newQueryString,
        });
      }
      queryString.current = newQueryString;
      setSearchHitsCount(results.hits.total.value);
    });
    return () => {
      removalFn();
    };
  }, [analyticsCategory, searchkit, setSearchHitsCount]);

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
