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

function DebugItem(props) {
  return <pre>{JSON.stringify(props, false, 2)}</pre>;
}

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
  return current;
}

function makeTableComponent(resultFields, detailsUrlPrefix, idField) {
  return function ResultsTable(props) {
    const { hits } = props;
    /* eslint-disable no-underscore-dangle */
    return (
      <table className="sk-table sk-table-striped" style={{ width: '100%' }}>
        <thead>
          <tr>
            {resultFields.map((field) => (
              <th key={field.id}>{field.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hits.map((hit) => (
            <tr key={hit._id}>
              {resultFields.map((field) => (
                <td key={field.id}>
                  <a href={detailsUrlPrefix + hit._source[idField]} style={{ display: 'block' }}>
                    {getByPath(hit._source, field)}
                  </a>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
    /* eslint-enable no-underscore-dangle */
  };
}

function MaskedSelectedFilters(props) {
  const { hiddenFilterIds } = props;
  const SelectedFilter = (filterProps) => {
    const style = hiddenFilterIds.indexOf(filterProps.filterId) === -1 ? {} : { display: 'None' };
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
          {filterProps.labelKey}: {filterProps.labelValue}
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
    debug,
    httpHeaders,
    sortOptions,
    hiddenFilterIds,
    searchUrlPath,
  } = props;
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
          <SearchBox autofocus searchOnChange />
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
              <SortingSelector options={sortOptions} />
            </ActionBarRow>
          </ActionBar>
          {debug && (
            <Hits
              mod="sk-hits-list"
              hitsPerPage={hitsPerPage}
              itemComponent={DebugItem}
              sourceFilter={resultFieldIds}
            />
          )}

          <Hits
            mod="sk-hits-list"
            hitsPerPage={hitsPerPage}
            listComponent={makeTableComponent(resultFields, detailsUrlPrefix, idField)}
            sourceFilter={resultFieldIds}
          />
          <NoHits />
          <Pagination showNumbers />
        </LayoutResults>
      </LayoutBody>
    </SearchkitProvider>
  );
}

SearchWrapper.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.exact({
      type: PropTypes.oneOf([
        // Expand as needed; Starting small to catch typos.
        'RefinementListFilter',
      ]).isRequired,
      props: PropTypes.exact({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        operator: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        translations: PropTypes.objectOf(PropTypes.string),
      }),
    }),
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
  debug: PropTypes.bool,
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
};

SearchWrapper.defaultProps = {
  debug: false,
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
};

export default SearchWrapper;
