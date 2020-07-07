// eslint-disable-next-line import/named
import { filter, rangeFilter, field } from './utils';

export const donorConfig = {
  filters: [
    filter('mapped_metadata.gender', 'Gender'),
    rangeFilter('mapped_metadata.age', 'Age', 0, 100),
    filter('mapped_metadata.race', 'Race'),
    rangeFilter('mapped_metadata.bmi', 'BMI', 0, 50),
    filter('group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
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
    filter('mapped_data_types', 'Data Type'),
    filter('origin_sample.mapped_organ', 'Organ'),
    filter('source_sample.mapped_specimen_type', 'Specimen Type'),
    filter('mapped_status', 'Status'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('donor.group_name', 'Group'),
    field('mapped_data_types', 'Data Types'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_status', 'Status'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};
