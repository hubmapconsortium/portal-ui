import { filter } from './utils';

export const datasetConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('data_types', 'Data types'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
    filter('source_sample.specimen_type', 'Specimen type'),
    filter('status', 'Status'),
  ],
  fields: ['description', 'status', 'entity_type'],
};

export const donorConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('group_name', 'Group'),
  ],
  fields: ['description', 'status', 'entity_type'],
};

export const sampleConfig = {
  filters: [
    filter('origin_sample.organ', 'Organ'),
    filter('specimen_type', 'Specimen Type'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
  ],
  fields: ['description', 'status', 'entity_type'],
};
