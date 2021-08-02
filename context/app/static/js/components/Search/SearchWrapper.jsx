import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { SearchkitManager, SearchkitProvider, LayoutResults, NoHits, LayoutBody } from 'searchkit'; // eslint-disable-line import/no-duplicates

import useSearchViewStore from 'js/stores/useSearchViewStore';

import { AppContext } from 'js/components/Providers';
import useEntityData from 'js/hooks/useEntityData';
import SearchNote from 'js/components/Search/SearchNote';
import Accordions from './Accordions';
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
  } = props;

  const sortOptions = resultFieldsToSortOptions(resultFields.table);
  const resultFieldIds = [...resultFields.table, ...resultFields.tile, ...resultFields.ccf]
    .map((field) => field.id)
    .concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });
  searchkit.addDefaultQuery((query) => query.addQuery(defaultQuery));

  const setSearchHitsCount = useSearchViewStore(searchViewStoreSelector);

  useEffect(() => {
    const removalFn = searchkit.addResultsListener((results) => {
      setSearchHitsCount(results.hits.total.value);
    });
    return () => {
      removalFn();
    };
  }, [searchkit, setSearchHitsCount]);

  const [provUUID, setProvUUID] = useState(null);
  const [provMusts, setProvMusts] = useState([]);
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  searchkit.setQueryProcessor((query) => {
    // setQueryProcessor is typically used to change the query,
    // but we're just using it as a place to call hooks.
    const musts = query?.post_filter?.bool?.must || [];
    setProvMusts(
      musts.filter((must) => 'ancestor_ids.keyword' in must?.term || 'descendant_ids.keyword' in must?.term),
    );
    return query;
  });

  let fieldName = null;
  let newProvUuid = null;
  if (provMusts.length) {
    if (provMusts.length > 1) {
      throw new Error(`More than one provenance constraint: ${provMusts}`);
    }
    const entries = Object.entries(provMusts[0].term);
    if (entries.length > 1) {
      throw new Error(`More than one provenance field constraint: ${entries}`);
    }
    [[fieldName, newProvUuid]] = entries;
  }
  const entity = useEntityData(newProvUuid, elasticsearchEndpoint, nexusToken);

  let message;
  if (provUUID !== newProvUuid) {
    setProvUUID(newProvUuid);
    message = <SearchNote label={fieldName} entity={entity} />;
  }

  return (
    <SearchkitProvider searchkit={searchkit}>
      <>
        {message}
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
};

SearchWrapper.defaultProps = {
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
  type: undefined,
};

export default SearchWrapper;
