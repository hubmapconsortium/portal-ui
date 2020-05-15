import { filter, organFilter, specimenTypeFilter } from './utils';


export const donorConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('group_name', 'Group'),
  ],
  fields: ['display_doi', 'group_name', 'age', 'bmi', 'gender', 'description'],
};

export const sampleConfig = {
  filters: [
    organFilter('origin_sample.organ'),
    specimenTypeFilter('specimen_type'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
  ],
  fields: ['display_doi', 'donor.group_name', 'specimen_type', 'origin_sample.organ'],
};

export const datasetConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('data_types', 'Data types'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
    specimenTypeFilter('source_sample.specimen_type'),
    filter('status', 'Status'),
  ],
  fields: ['display_doi', 'donor.group_name', 'data_types', 'origin_sample.organ', 'status'],
};
