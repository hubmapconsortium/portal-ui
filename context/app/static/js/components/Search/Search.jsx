import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import LookupEntity from 'js/helpers/LookupEntity';
import SearchWrapper from './SearchWrapper';
import { donorConfig, sampleConfig, datasetConfig, fallbackConfig } from './config';
// eslint-disable-next-line import/named
import { filter } from './utils';
import AncestorNote from './AncestorNote';

function Search(props) {
  const { title, elasticsearchEndpoint, nexusToken } = props;

  const hiddenFilters = [filter('ancestor_ids', 'Ancestor ID'), filter('entity_type', 'Entity Type')];

  const filtersByType = {
    '': fallbackConfig.filters,
    donor: { hiddenFilters, ...donorConfig.filters },
    sample: { hiddenFilters, ...sampleConfig.filters },
    dataset: { hiddenFilters, ...datasetConfig.filters },
  };

  const resultFieldsByType = {
    '': fallbackConfig.fields,
    donor: donorConfig.fields,
    sample: sampleConfig.fields,
    dataset: datasetConfig.fields,
  };

  const { searchParams } = new URL(document.location);
  const type = (searchParams.get('entity_type[0]') || '').toLowerCase();
  const hasAncestorParam = searchParams.has('ancestor_ids[0]');

  const httpHeaders = nexusToken
    ? {
        Authorization: `Bearer ${nexusToken}`,
      }
    : {};
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
    // Sidebar facet configuration:
    filters: filtersByType[type],
    hiddenFilterIds: hiddenFilters.map((hiddenFilter) => hiddenFilter.props.id),
    queryFields: ['everything'],
    isLoggedIn: Boolean(nexusToken),
  };
  const allProps = { apiUrl: elasticsearchEndpoint, ...searchProps }; // TODO: Not needed?

  // eslint-disable-next-line react/jsx-props-no-spreading
  const wrappedSearch = <SearchWrapper {...allProps} />;
  return (
    <>
      <Typography component="h1" variant="h2">
        {title}
      </Typography>
      {hasAncestorParam && (
        <LookupEntity uuid={searchParams.get('ancestor_ids[0]')} elasticsearchEndpoint={elasticsearchEndpoint}>
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
