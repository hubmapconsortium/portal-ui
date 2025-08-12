import React from 'react';
import esb from 'elastic-builder';

import Search from 'js/components/search';
import { FACETS } from 'js/components/search/store';
import { Alert } from 'js/shared-styles/alerts';

const devConfig = {
  searchFields: ['all_text', 'description'],
  size: 20,
  sourceFields: {
    table: ['entity_type', 'hubmap_id', 'mapped_last_modified_timestamp', 'mapper_metadata.size'],
    tile: [],
  },
  sortField: { field: 'mapped_last_modified_timestamp', direction: 'desc' as const },
  facets: {
    Core: [
      { field: 'entity_type', type: FACETS.term },
      { field: 'mapper_metadata.version', type: FACETS.term },
      { field: 'index_version', type: FACETS.term },
      {
        field: 'anatomy_1',
        childField: 'anatomy_2',
        type: FACETS.hierarchical,
        order: { type: '_term', dir: 'asc' } as const,
      },
    ],
    'Assay Types': [
      { field: 'data_types', type: FACETS.term },
      { field: 'mapped_data_types', type: FACETS.term },
      { field: 'metadata.assay_category', type: FACETS.term },
      { field: 'metadata.assay_type', type: FACETS.term },
      { field: 'processing', type: FACETS.term },
      {
        field: 'metadata.analyte_class',
        childField: 'mapped_data_types',
        type: FACETS.hierarchical,
        order: { type: '_term', dir: 'asc' } as const,
      },
      {
        field: 'metadata.assay_category',
        childField: 'mapped_data_types',
        type: FACETS.hierarchical,
        order: { type: '_term', dir: 'asc' } as const,
      },
    ],
    'File Descriptions': [
      { field: 'files.description', type: FACETS.term },
      {
        field: 'mapped_data_types',
        childField: 'files.description',
        type: FACETS.hierarchical,
        order: { type: '_term', dir: 'asc' } as const,
      },
    ],
    'Validation Errors': [
      { field: 'mapper_metadata.validation_errors.absolute_path', type: FACETS.term },
      { field: 'mapper_metadata.validation_errors.absolute_schema_path', type: FACETS.term },
    ],
    Booleans: [
      { field: 'sub_status', type: FACETS.exists, default: false },
      { field: 'metadata.living_donor_data', type: FACETS.exists, default: false },
      { field: 'metadata.organ_donor_data', type: FACETS.exists, default: false },
      { field: 'metadata', type: FACETS.exists, default: false },
      { field: 'files', type: FACETS.exists, default: false },
      { field: 'rui_location', type: FACETS.exists, default: false },
      { field: 'mapper_metadata.validation_errors', type: FACETS.exists, default: false },
      { field: 'next_revision_uuid', type: FACETS.exists, default: false },
      { field: 'previous_revision_uuid', type: FACETS.exists, default: false },
    ],
  },
  defaultQuery: esb.boolQuery().mustNot([esb.existsQuery('next_revision_uuid'), esb.existsQuery('sub_status')]),
  type: 'Dev Search' as const,
};
function DevSearch() {
  return (
    <>
      <Alert severity="info" $marginBottom={16}>
        The data and features provided on this page are for debugging purposes only and no guarantees are made for
        correctness or completeness of the data shown.
      </Alert>
      <Search config={devConfig} />
    </>
  );
}

export default DevSearch;
