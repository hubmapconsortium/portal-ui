import {
  filter, field,
  organFilter, specimenTypeFilter,
  organTranslations, specimenTypeTranslations,
} from './utils';


export const donorConfig = {
  filters: [
    filter('created_by_user_displayname', 'Creator'),
    filter('group_name', 'Group'),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('group_name', 'Group'),
    field('age', 'Age'),
    field('bmi', 'BMI'),
    field('gender', 'Gender'),
    field('description', 'Description'),
  ],
};

export const sampleConfig = {
  filters: [
    organFilter('origin_sample.organ'),
    specimenTypeFilter('specimen_type'),
    filter('donor.group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
  ],
  fields: [
    field('display_doi', 'ID'),
    field('donor.group_name', 'Group'),
    field('specimen_type', 'Speciment Type', specimenTypeTranslations),
    field('origin_sample.organ', 'Organ', organTranslations),
  ],
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
  fields: [
    field('display_doi', 'ID'),
    field('donor.group_name', 'Group'),
    field('data_types', 'Data Types'),
    field('origin_sample.organ', 'Organ', organTranslations),
    field('status', 'Status'),
  ]
};
