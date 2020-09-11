import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { ExistsQuery, BoolMustNot } from 'searchkit';

import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';
import SearchWrapper from './SearchWrapper';
// eslint-disable-next-line import/named
import { field, filter, checkboxFilter } from './utils';

function DevSearch() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const httpHeaders = getAuthHeader(nexusToken);

  const searchProps = {
    // The default behavior is to add a "_search" path.
    // We don't want that.
    searchUrlPath: '',
    // Pass Globus token:
    httpHeaders,
    // Prefix for details links: (Entities which are not datasets will redirect.)
    detailsUrlPrefix: '/browse/dataset/',
    // Search results field which will be appended to detailsUrlPrefix:
    idField: 'uuid',
    // Search results fields to display in table:
    resultFields: [
      field('entity_type', 'type'),
      field('display_doi', 'ID'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
      field('mapper_metadata.size', 'Doc Size'),
    ],
    // Default hitsPerPage is 10:
    hitsPerPage: 20,
    // Sidebar facet configuration:
    filters: [
      filter('entity_type', 'Entity Type'),
      filter('mapper_metadata.version', 'Mapper Version'),
      checkboxFilter('has_metadata', 'Has metadata?', ExistsQuery('metadata.metadata')),
      checkboxFilter('no_metadata', 'No metadata?', BoolMustNot(ExistsQuery('metadata.metadata'))),
      checkboxFilter('has_files', 'Has files?', ExistsQuery('files')),
      checkboxFilter('no_files', 'No files?', BoolMustNot(ExistsQuery('files'))),
      checkboxFilter('has_files', 'Spatially Located (CCF)?', ExistsQuery('rui_location')),
      checkboxFilter('no_files', 'Not Spatially Located (CCF)?', BoolMustNot(ExistsQuery('rui_location'))),
    ],
    queryFields: ['everything'],
    isLoggedIn: Boolean(nexusToken),
  };

  const allProps = { ...searchProps, apiUrl: elasticsearchEndpoint };

  const wrappedSearch = <SearchWrapper {...allProps} />;
  return (
    <>
      <Typography component="h1" variant="h2">
        Dev Search
      </Typography>
      {wrappedSearch}
    </>
  );
}

export default DevSearch;
