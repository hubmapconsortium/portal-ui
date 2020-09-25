import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import LookupEntity from 'js/helpers/LookupEntity';
import { getAuthHeader } from 'js/helpers/functions';
import SearchWrapper from 'js/components/Search/SearchWrapper';
import { donorConfig, sampleConfig, datasetConfig } from 'js/components/Search/config';
// eslint-disable-next-line import/named
import { listFilter } from 'js/components/Search/utils';
import AncestorNote from 'js/components/Search/AncestorNote';

function Search(props) {
  const { title } = props;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const hiddenFilters = [listFilter('ancestor_ids', 'Ancestor ID'), listFilter('entity_type', 'Entity Type')];

  const filtersByType = {
    donor: { ...donorConfig.filters, '': hiddenFilters },
    sample: { ...sampleConfig.filters, '': hiddenFilters },
    dataset: { ...datasetConfig.filters, '': hiddenFilters },
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
    // Sidebar facet configuration:
    filters: filtersByType[type],
    queryFields: ['everything'],
    isLoggedIn: Boolean(nexusToken),
  };
  const allProps = { apiUrl: elasticsearchEndpoint, ...searchProps }; // TODO: Not needed?

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
  title: PropTypes.string.isRequired,
  nexusToken: PropTypes.string,
};

Search.defaultProps = {
  nexusToken: '',
};

export default Search;
