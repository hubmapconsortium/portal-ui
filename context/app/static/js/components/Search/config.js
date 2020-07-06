import { ExistsQuery } from 'searchkit';

// eslint-disable-next-line import/named
import { filter, rangeFilter, checkboxFilter, field } from './utils';

export const donorConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('group_name', 'Group'),
    filter('mapped_metadata.gender', 'Gender'),
    filter('mapped_metadata.race', 'Race'),
    rangeFilter('mapped_metadata.age', 'Age', 0, 100),
    rangeFilter('mapped_metadata.bmi', 'BMI', 0, 50),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('group_name', 'Group'),
    field('mapped_metadata.age', 'Age'),
    field('mapped_metadata.bmi', 'BMI'),
    field('mapped_metadata.gender', 'Gender'),
    field('mapped_metadata.race', 'Race'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};

export const sampleConfig = {
  filters: [
    filter('origin_sample.mapped_organ', 'Organ'),
    filter('mapped_specimen_type', 'Specimen Type'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('donor.group_name', 'Group'),
    field('mapped_specimen_type', 'Speciment Type'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};

export const datasetConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('data_types', 'Data types'),
    filter('donor.group_name', 'Group'),
    filter('source_sample.mapped_specimen_type', 'Specimen Type'),
    filter('mapped_status', 'Status'),
    checkboxFilter('has_files', 'Has files?', ExistsQuery('files')),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('donor.group_name', 'Group'),
    field('data_types', 'Data Types'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_status', 'Status'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};
