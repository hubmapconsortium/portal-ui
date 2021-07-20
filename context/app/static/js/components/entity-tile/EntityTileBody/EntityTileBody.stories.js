import React from 'react';

import EntityTileBody from './EntityTileBody';

export default {
  title: 'EntityTile/EntityTileBody',
  component: EntityTileBody,
};

const Template = (args) => <EntityTileBody {...args} />;
export const Donor = Template.bind({});
Donor.args = {
  entity_type: 'Donor',
  id: 'DNRID123',
  invertColors: false,
  entityData: {
    mapped_metadata: {
      sex: 'Donor Sex',
      age_value: 200,
      age_unit: 'years',
      race: ['Donor Race 1', 'Donor Race 2'],
    },
  },
};

export const Sample = Template.bind({});
Sample.args = {
  entity_type: 'Sample',
  id: 'SMPLID123',
  invertColors: false,
  entityData: {
    mapped_specimen_type: 'Specimen Type',
    origin_sample: { mapped_organ: 'Organ Type' },
  },
};

export const Dataset = Template.bind({});
Dataset.args = {
  entity_type: 'Dataset',
  id: 'DATAID123',
  invertColors: false,
  entityData: {
    origin_sample: { mapped_organ: 'Organ Type' },
    mapped_data_types: ['Data Type 1', 'Data Type 2'],
  },
};
