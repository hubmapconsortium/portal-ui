/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/named
import { capitalizeString } from 'js/helpers/functions';
import { listFilter, rangeFilter, field, hierarchicalFilter, boolListFilter } from './utils';

const bmiField = 'body_mass_index_value';
const ageField = 'age_value';
const ageUnitField = 'age_unit';

function makeDonorMetadataFilters(isDonor) {
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';
  return [
    listFilter(`${pathPrefix}mapped_metadata.sex`, `${labelPrefix}Sex`),
    rangeFilter(`${pathPrefix}mapped_metadata.${ageField}`, `${labelPrefix}Age`, 0, 100),
    listFilter(`${pathPrefix}mapped_metadata.race`, `${labelPrefix}Race`),
    rangeFilter(`${pathPrefix}mapped_metadata.${bmiField}`, `${labelPrefix}BMI`, 0, 50),
  ];
}

const affiliationFilters = [
  listFilter('group_name', 'Group'),
  listFilter('created_by_user_displayname', 'Registered by'),
];

const sharedTileFields = [
  field('last_modified_timestamp', 'Last Modified Unmapped'),
  field('descendant_counts.entity_type', 'Descendant Counts'),
];

// On hold:
//
// const partonomyFilter = hierarchicalFilter(
//   [...Array(5).keys()].map((i) => `anatomy_${i + 1}`),
//   'Anatomy',
// );

const donorConfig = {
  filters: {
    'Donor Metadata': makeDonorMetadataFilters(true),
    Affiliation: affiliationFilters,
  },
  fields: {
    table: [
      field('hubmap_id', 'HuBMAP ID'),
      field('group_name', 'Group'),
      field(`mapped_metadata.${ageField}`, 'Age'),
      field(`mapped_metadata.${bmiField}`, 'BMI'),
      field('mapped_metadata.sex', 'Sex'),
      field('mapped_metadata.race', 'Race'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
    ],
    tile: [...sharedTileFields, field(`mapped_metadata.${ageUnitField}`, 'Age Unit')],
    ccf: [],
  },
};

const sampleConfig = {
  filters: {
    'Sample Metadata': [
      listFilter('origin_samples.mapped_organ', 'Organ'),
      listFilter('sample_category', 'Sample Category'),
    ],
    'Donor Metadata': makeDonorMetadataFilters(false),
    Affiliation: affiliationFilters,
  },
  fields: {
    table: [
      field('hubmap_id', 'HuBMAP ID'),
      field('group_name', 'Group'),
      field('sample_category', 'Sample Category'),
      field('origin_samples.mapped_organ', 'Organ'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
    ],
    tile: sharedTileFields,
    ccf: [],
  },
};

const alphabeticSort = {
  orderKey: '_term',
  orderDirection: 'asc',
}

function mapLabel({label, map}){
  return map?.[label] ? map[label]: label;
}

const datasetConfig = {
  filters: {
    'Dataset Metadata': [
      hierarchicalFilter(['raw_dataset_type', 'assay_display_name'], 'Dataset Type', alphabeticSort),
      listFilter('origin_samples.mapped_organ', 'Organ'),
      listFilter('source_samples.sample_category', 'Sample Category'),
      listFilter('analyte_class', 'Analyte Class', {}, { labelTransformations: [capitalizeString]}),
      hierarchicalFilter(['mapped_status', 'mapped_data_access_level'], 'Status'),
      listFilter('mapped_consortium', 'Consortium'),
      
    ],
    'Dataset Processing': [
      listFilter('processing', 'Dataset Category', {}, { labelTransformations: [capitalizeString]}),
      listFilter('processing_type', 'Processing Type', {}, { labelTransformations: [(label) => mapLabel({label, map: {
        hubmap: 'HuBMAP',
      }}), capitalizeString]}),
      boolListFilter('visualization', 'Visualization', {}, { labelTransformations: [capitalizeString]}),
      listFilter('pipeline', 'Pipeline'),
    ],
    'Donor Metadata': makeDonorMetadataFilters(false),
    Affiliation: affiliationFilters,
  },
  fields: {
    table: [
      field('hubmap_id', 'HuBMAP ID'),
      field('group_name', 'Group'),
      field('mapped_data_types', 'Data Types'),
      field('origin_samples.mapped_organ', 'Organ'),
      field('mapped_status', 'Status'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
    ],
    tile: [...sharedTileFields, field('thumbnail_file.file_uuid', 'Thumbnail UUID')],
    ccf: [],
  },
};

const fieldsToHighlight = ['description'];
const customHighlight = {
  fields: Object.fromEntries(fieldsToHighlight.map((fieldName) => [fieldName, { type: 'plain' }])),
};

export { donorConfig, sampleConfig, datasetConfig, fieldsToHighlight, customHighlight };
