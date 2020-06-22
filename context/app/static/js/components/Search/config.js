// eslint-disable-next-line import/named
import { filter, field } from './utils';

export const donorConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('group_name', 'Group'),
    filter('mapped_metadata.gender', 'Gender'),
    filter('mapped_metadata.race', 'Race'),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('group_name', 'Group'),
    field('mapped_metadata.age', 'Age'),
    field('mapped_metadata.bmi', 'BMI'),
    field('mapped_metadata.gender', 'Gender'),
    field('mapped_metadata.race', 'Race'),
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
  ],
};

export const datasetConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('data_types', 'Data types'),
    filter('donor.group_name', 'Group'),
    filter('source_sample.mapped_specimen_type', 'Specimen Type'),
    filter('mapped_status', 'Status'),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('donor.group_name', 'Group'),
    field('data_types', 'Data Types'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_status', 'Status'),
  ],
};
