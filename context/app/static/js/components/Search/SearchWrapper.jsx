import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { SearchkitManager, SearchkitProvider, LayoutResults, NoHits, LayoutBody } from 'searchkit'; // eslint-disable-line import/no-duplicates

import Accordions from './Accordions';
import Results from './Results';
import PaginationWrapper from './PaginationWrapper';
import SearchBarLayout from './SearchBarLayout';
import { resultFieldsToSortOptions } from './utils';
import { StyledSideBar } from './style';
import './Search.scss';
import { NoResults, SearchError } from './noHitsComponents';

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
  } = props;
  const [searchView, setSearchView] = useState('table');

  const sortOptions = resultFieldsToSortOptions(resultFields.table);
  const resultFieldIds = [...resultFields.table, ...resultFields.tile].map((field) => field.id).concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });

  return (
    <SearchkitProvider searchkit={searchkit}>
      <>
        <SearchBarLayout
          queryFields={queryFields}
          searchView={searchView}
          setSearchView={setSearchView}
          sortOptions={sortOptions}
        />
        <LayoutBody>
          <StyledSideBar>
            <Accordions filters={filters} />
          </StyledSideBar>
          <LayoutResults>
            <Results
              sortOptions={sortOptions}
              hitsPerPage={hitsPerPage}
              resultFields={resultFields[searchView]}
              detailsUrlPrefix={detailsUrlPrefix}
              idField={idField}
              resultFieldIds={resultFieldIds}
              searchView={searchView}
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
  }).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  httpHeaders: PropTypes.objectOf(PropTypes.string),

  searchUrlPath: PropTypes.string,
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool,
};

SearchWrapper.defaultProps = {
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
};

export default SearchWrapper;
