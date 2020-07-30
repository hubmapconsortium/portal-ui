import React from 'react';
import PropTypes from 'prop-types';

import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  LayoutResults,
  SortingSelector,
  ActionBar,
  ActionBarRow,
  SelectedFilters,
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
import { ArrowUpOn, ArrowDownOn, ArrowDownOff } from './style';

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

function getOrderIcon(order) {
  if (order === 'asc') return <ArrowUpOn />;
  if (order === 'desc') return <ArrowDownOn />;
  return <ArrowDownOff />;
}

function SortingThead(props) {
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
    <thead>
      <tr>
        {pairs.map((pair) => {
          const order = getOrder(pair, selectedItems);
          return (
            <th
              key={pair[0].key}
              onClick={() => {
                toggleItem(pair[order && order === pair[0].order ? 1 : 0].key);
              }}
            >
              {pair[0].label} {getOrderIcon(order)}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

function makeTbodyComponent(resultFields, detailsUrlPrefix, idField) {
  return function ResultsTbody(props) {
    const { hits } = props;
    /* eslint-disable no-underscore-dangle */
    return (
      <tbody>
        {hits.map((hit) => (
          <tr key={hit._id}>
            {resultFields.map((field) => (
              <td key={field.id}>
                <a href={detailsUrlPrefix + hit._source[idField]}>{getByPath(hit._source, field)}</a>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
    /* eslint-enable no-underscore-dangle */
  };
}

function MaskedSelectedFilters(props) {
  const { hiddenFilterIds } = props;
  const SelectedFilter = (filterProps) => {
    const isHidden = hiddenFilterIds.indexOf(filterProps.filterId) !== -1;

    const style = isHidden ? { display: 'None' } : {};

    // Copy and paste from
    // http://docs.searchkit.co/v0.8.3/docs/components/navigation/selected-filters.html
    // plus typo corrections and wrapping div.
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        style={style}
        className={filterProps.bemBlocks
          .option()
          .mix(filterProps.bemBlocks.container('item'))
          .mix(`selected-filter--${filterProps.filterId}`)}
      >
        <div className={filterProps.bemBlocks.option('name')}>
          {`${filterProps.labelKey}: ${filterProps.labelValue}`}
        </div>
        <div className={filterProps.bemBlocks.option('remove-action')} onClick={filterProps.removeFilter}>
          x
        </div>
      </div>
    );
    /* eslint-enable */
  };
  return <SelectedFilters itemComponent={SelectedFilter} />;
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
              <MaskedSelectedFilters hiddenFilterIds={hiddenFilterIds} />
            </ActionBarRow>
          </ActionBar>
          <table className="sk-table">
            <SortingSelector options={sortOptions} listComponent={SortingThead} />
            <Hits
              mod="sk-hits-list"
              hitsPerPage={hitsPerPage}
              listComponent={makeTbodyComponent(resultFields, detailsUrlPrefix, idField)}
              sourceFilter={resultFieldIds}
            />
          </table>
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

const refinementListPropTypes = PropTypes.exact({
  type: PropTypes.oneOf(['RefinementListFilter']).isRequired,
  props: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  }),
});

const rangeFilterPropTypes = PropTypes.exact({
  type: PropTypes.oneOf(['RangeFilter']).isRequired,
  props: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    showHistogram: PropTypes.bool.isRequired,
  }),
});

const checkboxFilterPropTypes = PropTypes.exact({
  type: PropTypes.oneOf(['CheckboxFilter']).isRequired,
  props: PropTypes.exact({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
  }),
});

SearchWrapper.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.oneOfType([refinementListPropTypes, rangeFilterPropTypes, checkboxFilterPropTypes]),
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
