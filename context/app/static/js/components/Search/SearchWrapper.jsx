import React from 'react';
import PropTypes from 'prop-types';

import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  LayoutResults,
  ActionBar,
  ActionBarRow,
  NoHits,
  HitsStats,
  LayoutBody,
  Pagination,
} from 'searchkit'; // eslint-disable-line import/no-duplicates

import Accordions from './Accordions';
import ResultsTable from './ResultsTable';
import { resultFieldsToSortOptions } from './utils';
import { StyledSideBar } from './style';
import './Search.scss';

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
    isLoggedIn,
  } = props;
  const sortOptions = resultFieldsToSortOptions(resultFields);
  const resultFieldIds = resultFields.map((field) => field.id).concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });

  return (
    <SearchkitProvider searchkit={searchkit}>
      <LayoutBody>
        <StyledSideBar>
          <SearchBox autofocus queryFields={queryFields} />
          <Accordions filters={filters} />
        </StyledSideBar>
        <LayoutResults>
          <ActionBar>
            <ActionBarRow>
              <HitsStats
                translations={{
                  'hitstats.results_found': '{hitCount} results found',
                }}
              />
            </ActionBarRow>
          </ActionBar>
          <ResultsTable
            sortOptions={sortOptions}
            hitsPerPage={hitsPerPage}
            resultFields={resultFields}
            detailsUrlPrefix={detailsUrlPrefix}
            idField={idField}
            resultFieldIds={resultFieldIds}
          />
          <NoHits
            translations={{
              'NoHits.NoResultsFound': `No results found. ${isLoggedIn ? '' : 'Login to view more results.'}`,
            }}
          />
          <Pagination showNumbers />
        </LayoutResults>
      </LayoutBody>
    </SearchkitProvider>
  );
}

SearchWrapper.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  filters: PropTypes.objectOf(PropTypes.array).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFields: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      translations: PropTypes.objectOf(PropTypes.string),
    }),
  ).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  httpHeaders: PropTypes.objectOf(PropTypes.string),

  searchUrlPath: PropTypes.string,
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoggedIn: PropTypes.bool,
};

SearchWrapper.defaultProps = {
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
};

export default SearchWrapper;
