import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import LookupEntity from 'js/helpers/LookupEntity';
import { getAuthHeader } from 'js/helpers/functions';
import SearchWrapper from './SearchWrapper';
import { donorConfig, sampleConfig, datasetConfig } from './config';
// eslint-disable-next-line import/named
import { filter } from './utils';
import AncestorNote from './AncestorNote';

function Search(props) {
  const { title } = props;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const hiddenFilters = [filter('ancestor_ids', 'Ancestor ID'), filter('entity_type', 'Entity Type')];

  const filtersByType = {
    donor: donorConfig.filters.concat(hiddenFilters),
    sample: sampleConfig.filters.concat(hiddenFilters),
    dataset: datasetConfig.filters.concat(hiddenFilters),
  };

  const resultFieldsByType = {
    donor: donorConfig.fields,
    sample: sampleConfig.fields,
    dataset: datasetConfig.fields,
  };

  const { searchParams } = new URL(document.location);
  const typeParam = 'entity_type[0]';
  const type = (searchParams.get(typeParam) || '').toLowerCase();
  if (!(type in resultFieldsByType)) {
    throw Error(
      `Unexpected URL param "${typeParam}=${type}"; Should be one of {${Object.keys(resultFieldsByType).join(', ')}}`,
    );
  }
  const hasAncestorParam = searchParams.has('ancestor_ids[0]');

  const httpHeaders = getAuthHeader(nexusToken);
  const resultFields = resultFieldsByType[type];
  const searchProps = {
    // The default behavior is to add a "_search" path.
    // We don't want that.
    searchUrlPath: '',
    // Pass Globus token:
    httpHeaders,
    // Prefix for details links:
    detailsUrlPrefix: `/browse/${type || 'dataset'}/`,
    // Search results field which will be appended to detailsUrlPrefix:
    idField: 'uuid',
    // Search results fields to display in table:
    resultFields,
    // Default hitsPerPage is 10:
    hitsPerPage: 20,
    // Sidebar facet configuration;
    // "type" should be one of the filters described here:
    // http://docs.searchkit.co/stable/components/navigation/
    filters: filtersByType[type],
    hiddenFilterIds: hiddenFilters.map((hiddenFilter) => hiddenFilter.props.id),
    queryFields: ['everything'],
    isLoggedIn: Boolean(nexusToken),
  };
  const allProps = Object.assign(searchProps, { apiUrl: elasticsearchEndpoint });

  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrappedSearch = <SearchWrapper {...allProps} />;
  return (
    <>
      <Typography component="h1" variant="h2">
        {title}
      </Typography>
      {hasAncestorParam && (
        <LookupEntity
          uuid={searchParams.get('ancestor_ids[0]')}
          elasticsearchEndpoint={elasticsearchEndpoint}
          nexusToken={nexusToken}
        >
          <AncestorNote />
        </LookupEntity>
      )}
      {wrappedSearch}
    </>
  );
}

Search.propTypes = {
  elasticsearchEndpoint: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  nexusToken: PropTypes.string,
};

Search.defaultProps = {
  nexusToken: '',
};

export default Search;
