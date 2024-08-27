import React from 'react';
import { ExistsQuery, BoolMustNot, TermQuery } from 'searchkit';

import { Alert } from 'js/shared-styles/alerts';
import { useAppContext } from 'js/components/Contexts';
import {
  field,
  listFilter,
  checkboxFilter,
  hierarchicalFilter,
  legacyHierarchicalFilter,
} from 'js/components/searchPage/utils';
import { fieldsToHighlight } from 'js/components/searchPage/config';
import SearchWrapper from 'js/components/searchPage/SearchWrapper';
import DevResults from 'js/components/searchPage/DevResults';
import { SearchHeader } from './style';

function DevSearch() {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const searchProps = {
    // Prefix for details links: (Entities which are not datasets will redirect.)
    detailsUrlPrefix: '/browse/dataset/',
    // Search results field which will be appended to detailsUrlPrefix:
    idField: 'uuid',
    // Search results fields to display in table:
    resultFields: {
      table: [
        field('entity_type', 'type'),
        field('hubmap_id', 'ID'),
        field('mapped_last_modified_timestamp', 'Last Modified'),
        field('mapper_metadata.size', 'Doc Size'),
      ],
      tile: [],
      ccf: [field('rui_location', 'Location JSON')],
    },
    // Default hitsPerPage is 10:
    hitsPerPage: 20,
    // Sidebar facet configuration:
    filters: {
      Core: [
        listFilter('entity_type', 'Entity Type'),
        listFilter('mapper_metadata.version', 'Mapper Version'),
        listFilter('index_version', 'Index Version'),
        legacyHierarchicalFilter(
          [...Array(5).keys()].map((i) => `anatomy_${i + 1}`),
          'Anatomy',
        ),
      ],
      'Assay Types': [
        listFilter('data_types', 'data_types'),
        listFilter('mapped_data_types', 'mapped_data_types'),
        listFilter('metadata.metadata.assay_category', 'assay_category'),
        listFilter('metadata.metadata.assay_type', 'assay_type'),
        checkboxFilter('is_derived', 'Is derived?', TermQuery('processing', 'processed')),
        checkboxFilter('is_raw', 'Is raw?', BoolMustNot(TermQuery('processing', 'raw'))),
        hierarchicalFilter({
          fields: {
            parent: { id: 'metadata.metadata.analyte_class.keyword' },
            child: { id: 'mapped_data_types.keyword' },
          },
          name: 'By analyte',
        }),
        hierarchicalFilter({
          fields: {
            parent: { id: 'metadata.metadata.assay_category.keyword' },
            child: { id: 'mapped_data_types.keyword' },
          },
          name: 'By category',
        }),
      ],
      'File Descriptions': [
        listFilter('files.description', 'Flat'),
        hierarchicalFilter({
          fields: { parent: { id: 'mapped_data_types.keyword' }, child: { id: 'files.description.keyword' } },
          name: 'By Assay',
        }),
      ],
      'Validation Errors': [
        listFilter('mapper_metadata.validation_errors.absolute_path', 'Document Path'),
        listFilter('mapper_metadata.validation_errors.absolute_schema_path', 'Schema Path'),
      ],
      Booleans: [
        checkboxFilter('has_substatus', 'Has substatus?', ExistsQuery('sub_status')),
        checkboxFilter('is_living_donor', 'Is living donor?', ExistsQuery('metadata.living_donor_data')),
        checkboxFilter('is_organ_donor', 'Is organ donor?', ExistsQuery('metadata.organ_donor_data')),
        checkboxFilter('has_metadata', 'Has metadata?', ExistsQuery('metadata.metadata')),
        checkboxFilter('no_metadata', 'No metadata?', BoolMustNot(ExistsQuery('metadata.metadata'))),
        checkboxFilter('has_files', 'Has files?', ExistsQuery('files')),
        checkboxFilter('no_files', 'No files?', BoolMustNot(ExistsQuery('files'))),
        checkboxFilter('is_spatial', 'Spatial?', ExistsQuery('rui_location')),
        checkboxFilter('not_spatial', 'Not Spatial?', BoolMustNot(ExistsQuery('rui_location'))),
        checkboxFilter('has_errors', 'Validation Errors?', ExistsQuery('mapper_metadata.validation_errors')),
        checkboxFilter(
          'no_errors',
          'No Validation Errors?',
          BoolMustNot(ExistsQuery('mapper_metadata.validation_errors')),
        ),
        checkboxFilter('has_next', 'Has next?', ExistsQuery('next_revision_uuid')),
        checkboxFilter('has_previous', 'Has previous?', ExistsQuery('previous_revision_uuid')),
      ],
    },
    queryFields: ['all_text', ...fieldsToHighlight],
    isLoggedIn: Boolean(groupsToken),
  };

  const allProps = { ...searchProps, apiUrl: elasticsearchEndpoint };

  const wrappedSearch = (
    <SearchWrapper
      {...allProps}
      resultsComponent={DevResults}
      analyticsCategory="Dev Search Page Interactions"
      isDevSearch
      elasticsearchEndpoint={elasticsearchEndpoint}
      groupsToken={groupsToken}
    />
  );
  return (
    <>
      <SearchHeader component="h1" variant="h2">
        Dev Search
      </SearchHeader>
      <Alert severity="info" $marginBottom="16">
        The data and features provided on this page are for debugging purposes only and no guarantees are made for
        correctness or completeness of the data shown.
      </Alert>
      {wrappedSearch}
    </>
  );
}

export default DevSearch;
