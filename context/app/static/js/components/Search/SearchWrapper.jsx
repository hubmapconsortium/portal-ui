import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  SideBar,
  Pagination,
} from 'searchkit'; // eslint-disable-line import/no-duplicates

import * as filterTypes from 'searchkit'; // eslint-disable-line import/no-duplicates
// There is more in the name space, but we only need the filterTypes.

import { resultFieldsToSortOptions } from './utils';
import {
  ArrowUpOn,
  ArrowDownOn,
  ArrowDownOff,
  StyledHeaderCell,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
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

function getOrder(orderPair, selectedItems) {
  if (selectedItems.length > 1) {
    console.warn('Expected only a single sort, not:', selectedItems);
  }
  const selectedItem = selectedItems.length ? selectedItems[0] : undefined;
  const match = orderPair.filter((item) => item.key === selectedItem);
  return match.length ? match[0].order : undefined;
}

function OrderIcon(props) {
  const { order } = props;
  if (order === 'asc') return <ArrowUpOn />;
  if (order === 'desc') return <ArrowDownOn />;
  return <ArrowDownOff />;
}

function SortingTableHead(props) {
  const { items, toggleItem, selectedItems } = props;
  const pairs = [];
  for (let i = 0; i < items.length; i += 2) {
    const pair = items.slice(i, i + 2);
    pairs.push(pair);
    if (pair[0].label !== pair[1].label || pair[0].field !== pair[1].field) {
      console.warn('Expected pair.label and .field to match', pair);
    }
  }
  return (
    <TableHead>
      <TableRow>
        {pairs.map((pair) => {
          const order = getOrder(pair, selectedItems);
          return (
            <StyledHeaderCell
              role="button"
              key={pair[0].key}
              onClick={() => {
                toggleItem(pair[order && order === pair[0].order ? 1 : 0].key);
              }}
            >
              {pair[0].label} <OrderIcon order={order} />
            </StyledHeaderCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
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
    hiddenFilterIds,
    searchUrlPath,
    queryFields,
    isLoggedIn,
  } = props;
  const sortOptions = resultFieldsToSortOptions(resultFields);
  const resultFieldIds = resultFields.map((field) => field.id).concat(idField);
  const searchkit = new SearchkitManager(apiUrl, { httpHeaders, searchUrlPath });

  const filterElements = filters.map((def) => {
    const Filter = filterTypes[def.type];
    const style = hiddenFilterIds.indexOf(def.props.id) === -1 ? {} : { display: 'None' };
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <div key={def.props.id} style={style}>
        <Filter {...def.props} />
      </div>
    );
    /* eslint-enable */
  });

  return (
    <SearchkitProvider searchkit={searchkit}>
      <LayoutBody>
        <SideBar>
          <SearchBox autofocus queryFields={queryFields} />
          {filterElements}
        </SideBar>
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
  filters: PropTypes.arrayOf(
    PropTypes.oneOfType([
      filterPropTypes.refinementListPropTypes,
      filterPropTypes.rangeFilterPropTypes,
      filterPropTypes.checkboxFilterPropTypes,
    ]),
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
  hiddenFilterIds: PropTypes.arrayOf(PropTypes.string),
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
  hiddenFilterIds: [],
  searchUrlPath: '_search',
  httpHeaders: {},
  isLoggedIn: false,
};

export default SearchWrapper;
export { getByPath, getOrder }; // For tests
