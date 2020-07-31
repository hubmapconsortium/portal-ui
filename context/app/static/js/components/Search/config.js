/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/named
import { filter, rangeFilter, field } from './utils';

function makeDonorMetadataFilters(isDonor) {
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';
  return [
    filter(`${pathPrefix}mapped_metadata.gender`, `${labelPrefix}Gender`),
    rangeFilter(`${pathPrefix}mapped_metadata.age`, `${labelPrefix}Age`, 0, 100),
    filter(`${pathPrefix}mapped_metadata.race`, `${labelPrefix}Race`),
    rangeFilter(`${pathPrefix}mapped_metadata.bmi`, `${labelPrefix}BMI`, 0, 50),
  ];
}

export const donorConfig = {
  filters: makeDonorMetadataFilters(true).concat([
    filter('group_name', 'Group'),
    filter('created_by_user_displayname', 'Creator'),
    filter('access_group', 'Access Group'),
  ]),
  fields: [
    field('display_doi', 'Donor'),
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
    filter('access_group', 'Access Group'),
  ]
    .concat(makeDonorMetadataFilters(false))
    .concat([filter('donor.group_name', 'Group'), filter('created_by_user_displayname', 'Creator')]),
  fields: [
    field('display_doi', 'Sample'),
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
    filter('access_group', 'Access Group'),
  ]
    .concat(makeDonorMetadataFilters(false))
    .concat([filter('donor.group_name', 'Group'), filter('created_by_user_displayname', 'Creator')]),
  fields: [
    field('display_doi', 'Dataset'),
    field('donor.group_name', 'Group'),
    field('mapped_data_types', 'Data Types'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_status', 'Status'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};
