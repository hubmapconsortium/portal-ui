import React from 'react';
import esb from 'elastic-builder';

import Search from 'js/components/search';
import { FACETS } from 'js/components/search/store';
import { EntityWithType, isDonor } from 'js/components/types';
import { getPortalESField } from 'js/components/search/buildTypesMap';

const sharedConfig = {
  searchFields: ['all_text', 'description'],
  // TODO: figure out how to make assertion unnecessary.
  sortField: { field: 'last_modified_timestamp', direction: 'desc' as const },
  size: 18,
};

const sharedTileFields = [
  'hubmap_id',
  'uuid',
  'last_modified_timestamp',
  'entity_type',
  'descendant_counts.entity_type',
];

const sharedAffiliationFilters = [
  { field: 'group_name', type: FACETS.term },
  { field: 'created_by_user_displayname', type: FACETS.term },
];

function makeDonorMetadataFilters(e: EntityWithType) {
  const isDonorEntity = isDonor(e);

  const pathPrefix = isDonorEntity ? '' : 'donor.';
  return [
    { field: `${pathPrefix}mapped_metadata.sex`, type: FACETS.term },
    { field: `${pathPrefix}mapped_metadata.age_value`, min: 0, max: 100, type: FACETS.range },
    { field: `${pathPrefix}mapped_metadata.race`, type: FACETS.term },
    { field: `${pathPrefix}mapped_metadata.body_mass_index_value`, min: 0, max: 50, type: FACETS.range },
  ];
}

function buildDefaultQuery(type: 'Dataset' | 'Donor' | 'Sample') {
  return {
    defaultQuery: esb
      .boolQuery()
      .must([
        esb.termsQuery(getPortalESField('entity_type'), [type]),
        esb.boolQuery().mustNot([esb.existsQuery('next_revision_uuid'), esb.existsQuery('sub_status')]),
      ]),
  };
}

const donorFacetGroups = {
  'Donor Metadata': makeDonorMetadataFilters({ entity_type: 'Donor' }),
  Affiliation: sharedAffiliationFilters,
};

const donorConfig = {
  ...sharedConfig,
  sourceFields: {
    table: [
      'hubmap_id',
      'group_name',
      'mapped_metadata.age_value',
      'mapped_metadata.body_mass_index_value',
      'mapped_metadata.sex',
      'mapped_metadata.race',
      'last_modified_timestamp',
    ],
    tile: [...sharedTileFields, 'mapped_metadata.age_unit'],
  },
  facets: donorFacetGroups,
  ...buildDefaultQuery('Donor'),
  // TODO: figure out how to make assertion unnecessary.
  type: 'Donor' as const,
};

const sampleFacetGroups = {
  'Sample Metadata': [
    {
      field: 'origin_samples_unique_mapped_organs',
      type: FACETS.term,
    },
    {
      field: 'sample_category',
      type: FACETS.term,
    },
  ],
  'Donor Metadata': makeDonorMetadataFilters({ entity_type: 'Sample' }),
  Affiliation: sharedAffiliationFilters,
};

const sampleConfig = {
  ...sharedConfig,
  sourceFields: {
    table: [
      'hubmap_id',
      'group_name',
      'sample_category',
      'origin_samples_unique_mapped_organs',
      'last_modified_timestamp',
    ],
    tile: [...sharedTileFields, 'origin_samples_unique_mapped_organs'],
  },
  facets: sampleFacetGroups,
  ...buildDefaultQuery('Sample'),
  // TODO: figure out how to make assertion unnecessary.
  type: 'Sample' as const,
};

const datasetFacetGroups = {
  'Dataset Metadata': [
    { field: 'raw_dataset_type', childField: 'assay_display_name', type: FACETS.hierarchical },
    {
      field: 'origin_samples_unique_mapped_organs',
      type: FACETS.term,
    },
    {
      field: 'analyte_class',
      type: FACETS.term,
    },
    {
      field: 'source_samples.sample_category',
      type: FACETS.term,
    },
    { field: 'mapped_status', childField: 'mapped_data_access_level', type: FACETS.hierarchical },
  ],
  'Dataset Processing': [
    {
      field: 'processing',
      type: FACETS.term,
    },
    {
      field: 'pipeline',
      type: FACETS.term,
    },
    {
      field: 'visualization',
      type: FACETS.term,
    },
    {
      field: 'processing_type',
      type: FACETS.term,
    },
    {
      field: 'assay_modality',
      type: FACETS.term,
    },
  ],
  'Donor Metadata': makeDonorMetadataFilters({ entity_type: 'Dataset' }),
  Affiliation: [{ field: 'mapped_consortium', type: FACETS.term }, ...sharedAffiliationFilters],
};

const datasetConfig = {
  ...sharedConfig,
  sourceFields: {
    table: [
      'hubmap_id',
      'group_name',
      'assay_display_name',
      'origin_samples_unique_mapped_organs',
      'mapped_status',
      'last_modified_timestamp',
    ],
    tile: [...sharedTileFields, 'thumbnail_file.file_uuid', 'origin_samples_unique_mapped_organs'],
  },
  facets: datasetFacetGroups,
  ...buildDefaultQuery('Dataset'),
  // TODO: figure out how to make assertion unnecessary.
  type: 'Dataset' as const,
};

const configs = {
  donors: donorConfig,
  samples: sampleConfig,
  datasets: datasetConfig,
};

function S({ type }: { type: 'donors' | 'samples' | 'datasets' }) {
  const config = configs[type];
  return <Search config={config} />;
}
export default S;
