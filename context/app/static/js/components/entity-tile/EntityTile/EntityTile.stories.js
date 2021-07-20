import React from 'react';

import EntityTile from './EntityTile';

export default {
  title: 'EntityTile/EntityTile',
  component: EntityTile,
};

const uuid = 'abc123';

const Template = (args) => <EntityTile {...args} />;
export const Donor = Template.bind({});
Donor.args = {
  uuid,
  entity_type: 'Donor',
  id: 'DNRID123',
  invertColors: false,
  entityData: {
    last_modified_timestamp: Date.now(),
    mapped_metadata: {
      sex: 'Donor Sex',
      age_value: 200,
      age_unit: 'years',
      race: ['Donor Race 1', 'Donor Race 2'],
    },
  },
  descendantCounts: { Sample: 1, Dataset: 2 },
};

export const Sample = Template.bind({});
Sample.args = {
  uuid,
  entity_type: 'Sample',
  id: 'SMPLID123',
  invertColors: false,
  entityData: {
    last_modified_timestamp: Date.now(),
    mapped_specimen_type: 'Specimen Type',
    origin_sample: { mapped_organ: 'Organ Type' },
  },
  descendantCounts: { Sample: 1, Dataset: 2 },
};

const datasetArgs = {
  uuid,
  entity_type: 'Dataset',
  id: 'DATAID123',
  invertColors: false,
  entityData: {
    last_modified_timestamp: Date.now(),

    origin_sample: { mapped_organ: 'Organ Type' },
    mapped_data_types: ['Data Type 1', 'Data Type 2'],
  },
  descendantCounts: { Dataset: 2 },
};

export const Dataset = Template.bind({});
Dataset.args = datasetArgs;

export const InvertedColors = Template.bind({});
InvertedColors.args = { ...datasetArgs, invertColors: true };
