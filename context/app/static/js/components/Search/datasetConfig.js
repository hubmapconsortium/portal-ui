import { filter } from './utils';

export default {
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
