import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  LayoutResults,
  SortingSelector,
  ActionBar,
  ActionBarRow,
  NoHits,
  HitsStats,
  Hits,
  LayoutBody,
  Pagination,
} from 'searchkit'; // eslint-disable-line import/no-duplicates

import * as filterTypes from 'searchkit'; // eslint-disable-line import/no-duplicates
// There is more in the name space, but we only need the filterTypes.

import SortingTableHead from './SortingTableHead';
import { resultFieldsToSortOptions } from './utils';
import {
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
  InnerAccordion,
  OuterAccordion,
  StyledAccordionDetails,
  StyledSideBar,
  StyledAccordionSummary,
} from './style';
import './Search.scss';
import * as filterPropTypes from './filterPropTypes';

function getByPath(nested, field) {
  const path = field.id;
  let current = nested;
  const pathEls = path.split('.');
  while (pathEls.length) {
    const nextEl = pathEls.shift();
    if (typeof current === 'object' && nextEl in current) {
      current = current[nextEl];
    } else {
      return null;
    }
  }
  if ('translations' in field) {
    return field.translations[current];
  }
  if (Array.isArray(current)) {
    return current.join(' / ');
  }
  return current;
}

function makeTableBodyComponent(resultFields, detailsUrlPrefix, idField) {
  return function ResultsTableBody(props) {
    const { hits } = props;
    /* eslint-disable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
    return (
      <>
        {hits.map((hit) => (
          <StyledTableBody key={hit._id}>
            <StyledTableRow className={'highlight' in hit && 'before-highlight'}>
              {resultFields.map((field) => (
                <StyledTableCell key={field.id}>
                  <a href={detailsUrlPrefix + hit._source[idField]}>{getByPath(hit._source, field)}</a>
                </StyledTableCell>
              ))}
            </StyledTableRow>
            {'highlight' in hit && (
              <StyledTableRow className="highlight">
                <StyledTableCell colSpan={resultFields.length}>
                  <a
                    href={detailsUrlPrefix + hit._source[idField]}
                    dangerouslySetInnerHTML={{
                      __html: hit.highlight.everything.join(' ... '),
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            )}
          </StyledTableBody>
        ))}
      </>
    );
    /* eslint-enable no-underscore-dangle, react/no-danger, jsx-a11y/control-has-associated-label */
  };
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
    isLoggedIn,
  } = props;
  const sortOptions = resultFieldsToSortOptions(resultFields);
  const resultFieldIds = resultFields.map((field) => field.id).concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });

  const filterElements = Object.entries(filters).map(([title, filterGroup]) => {
    const innerAccordion = filterGroup.map((def) => {
      const Filter = filterTypes[def.type];
      /* eslint-disable react/jsx-props-no-spreading */
      return (
        <InnerAccordion key={def.props.title}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>{def.props.title}</StyledAccordionSummary>
          <StyledAccordionDetails>
            <Filter {...def.props} />
          </StyledAccordionDetails>
        </InnerAccordion>
      );
      /* eslint-enable react/jsx-props-no-spreading */
    });
    if (!title) {
      // We leave the title blank for the group of facets
      // that need to be on the page for Searchkit,
      // but that we don't want to display.
      return (
        <div style={{ display: 'none' }} key="hidden">
          {innerAccordion}
        </div>
      );
    }
    return (
      <OuterAccordion key={title}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</StyledAccordionSummary>
        <StyledAccordionDetails>{innerAccordion}</StyledAccordionDetails>
      </OuterAccordion>
    );
  });

  return (
    <SearchkitProvider searchkit={searchkit}>
      <LayoutBody>
        <StyledSideBar>{filterElements}</StyledSideBar>
        <LayoutResults>
          <ActionBar>
            <ActionBarRow>
              <SearchBox autofocus queryFields={queryFields} />
            </ActionBarRow>
            <ActionBarRow>
              <HitsStats
                translations={{
                  'hitstats.results_found': '{hitCount} results found',
                }}
              />
            </ActionBarRow>
          </ActionBar>
          <Table>
            <SortingSelector options={sortOptions} listComponent={SortingTableHead} />
            <Hits
              hitsPerPage={hitsPerPage}
              listComponent={makeTableBodyComponent(resultFields, detailsUrlPrefix, idField)}
              sourceFilter={resultFieldIds}
              customHighlight={{
                fields: { everything: { type: 'plain' } },
              }}
            />
          </Table>
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
  filters: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        filterPropTypes.refinementListPropTypes,
        filterPropTypes.rangeFilterPropTypes,
        filterPropTypes.checkboxFilterPropTypes,
      ]),
    ),
  ).isRequired,
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
  sortOptions: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      order: PropTypes.oneOf(['asc', 'desc']).isRequired,
      defaultOption: PropTypes.bool.isRequired,
    }),
  ),
  searchUrlPath: PropTypes.string,
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoggedIn: PropTypes.bool,
};

SearchWrapper.defaultProps = {
  sortOptions: [
    {
      label: 'Relevance',
      field: '_score',
      order: 'desc',
      defaultOption: true,
    },
  ],
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
};

export default SearchWrapper;
export { getByPath }; // For tests
