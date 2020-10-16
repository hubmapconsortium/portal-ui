/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/named
import { listFilter, rangeFilter, field } from './utils';

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

const affiliationFilters = [listFilter('group_name', 'Group'), listFilter('created_by_user_displayname', 'Creator')];

const donorConfig = {
  filters: {
    'Donor Metadata': makeDonorMetadataFilters(true),
    Affiliation: affiliationFilters,
  },
  fields: {
    table: [
      field('display_doi', 'Donor'),
      field('group_name', 'Group'),
      field(`mapped_metadata.${ageField}`, 'Age'),
      field(`mapped_metadata.${bmiField}`, 'BMI'),
      field('mapped_metadata.sex', 'Sex'),
      field('mapped_metadata.race', 'Race'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
    ],
    tile: [
      field('last_modified_timestamp', 'Last Modified Unmapped'),
      field('descendant_counts.entity_type', 'Descendant Counts'),
      field(`mapped_metadata.${ageUnitField}`, 'Age Unit'),
    ],
  },
};

const sampleConfig = {
  filters: {
    'Sample Metadata': [
      listFilter('origin_sample.mapped_organ', 'Organ'),
      listFilter('mapped_specimen_type', 'Specimen Type'),
    ],
    'Donor Metadata': makeDonorMetadataFilters(false),
    Affiliation: affiliationFilters,
  },
  fields: {
    table: [
      field('display_doi', 'Sample'),
      field('group_name', 'Group'),
      field('mapped_specimen_type', 'Speciment Type'),
      field('origin_sample.mapped_organ', 'Organ'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
    ],
    tile: [
      field('last_modified_timestamp', 'Last Modified Unmapped'),
      field('descendant_counts.entity_type', 'Descendant Counts'),
    ],
  },
};

const datasetConfig = {
  filters: {
    'Dataset Metadata': [
      listFilter('mapped_data_types', 'Data Type'),
      listFilter('origin_sample.mapped_organ', 'Organ'),
      listFilter('source_sample.mapped_specimen_type', 'Specimen Type'),
      listFilter('mapped_status', 'Status'),
      listFilter('mapped_data_access_level', 'Access Level'),
    ],
    'Donor Metadata': makeDonorMetadataFilters(false),
    Affiliation: affiliationFilters,
  },
  fields: {
    table: [
      field('display_doi', 'Dataset'),
      field('group_name', 'Group'),
      field('mapped_data_types', 'Data Types'),
      field('origin_sample.mapped_organ', 'Organ'),
      field('mapped_status', 'Status'),
      field('mapped_last_modified_timestamp', 'Last Modified'),
    ],
    tile: [
      field('last_modified_timestamp', 'Last Modified Unmapped'),
      field('descendant_counts.entity_type', 'Descendant Counts'),
    ],
  },
};

export { donorConfig, sampleConfig, datasetConfig };
