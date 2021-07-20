import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { SearchkitManager, SearchkitProvider, LayoutResults, NoHits, LayoutBody } from 'searchkit'; // eslint-disable-line import/no-duplicates

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { useSearchHits } from 'js/hooks/useSearchData';
import Accordions from './Accordions';
import PaginationWrapper from './PaginationWrapper';
import SearchBarLayout from './SearchBarLayout';
import { resultFieldsToSortOptions } from './utils';
import { StyledSideBar } from './style';
import { NoResults, SearchError } from './noHitsComponents';

const searchViewStoreSelector = (state) => state.setSearchHitsCount;

function AllUUIDs(props) {
  const { uuidsQuery, apiUrl } = props;
  const hits = useSearchHits(uuidsQuery, apiUrl);
  // eslint-disable-next-line no-console
  console.log(
    'UUIDs',
    // eslint-disable-next-line no-underscore-dangle
    hits.searchHits.map((hit) => hit._id),
  );
  return null;
}

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
    getAllUUIDs,
    resultsComponent: ResultsComponent,
  } = props;

  const sortOptions = resultFieldsToSortOptions(resultFields.table);
  const resultFieldIds = [...resultFields.table, ...resultFields.tile, ...resultFields.ccf]
    .map((field) => field.id)
    .concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });
  searchkit.addDefaultQuery((query) => query.addQuery(defaultQuery));

  const [uuidsQuery, setUuidsQuery] = useState({});
  searchkit.setQueryProcessor((originalQuery) => {
    const { post_filter, query } = originalQuery;
    setUuidsQuery({
      _source: ['uuid'],
      size: 1000,
      post_filter,
      query,
    });
    return originalQuery;
  });

  const setSearchHitsCount = useSearchViewStore(searchViewStoreSelector);

  useEffect(() => {
    const removalFn = searchkit.addResultsListener((results) => {
      setSearchHitsCount(results.hits.total.value);
    });
    return () => {
      removalFn();
    };
  }, [searchkit, setSearchHitsCount]);

  return (
    <SearchkitProvider searchkit={searchkit}>
      <>
        {getAllUUIDs && <AllUUIDs uuidsQuery={uuidsQuery} apiUrl={apiUrl} />}
        <SearchBarLayout queryFields={queryFields} sortOptions={sortOptions} isDevSearch={isDevSearch} />
        <LayoutBody>
          <StyledSideBar>
            <Accordions filters={filters} />
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
  getAllUUIDs: PropTypes.bool,
};

SearchWrapper.defaultProps = {
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
  type: undefined,
  getAllUUIDs: false,
};

export default SearchWrapper;
