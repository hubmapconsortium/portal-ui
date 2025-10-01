import React from 'react';
import { http } from 'msw';

import EntityTile from './EntityTile';

export default {
  title: 'Tiles/EntityTile',
  component: EntityTile,
};

const uuid = 'abc123';

function Template(args) {
  return <EntityTile {...args} />;
}
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
    sample_category: 'Sample Category',
    origin_samples: [{ mapped_organ: 'Organ Type' }, { mapped_organ: 'Organ Type 2' }],
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

    origin_samples: [{ mapped_organ: 'Organ Type' }, { mapped_organ: 'Organ Type 2' }],
    mapped_data_types: ['Data Type 1', 'Data Type 2'],
    thumbnail_file: {
      file_uuid: 'ffff0185e2163e03da79489140fee0d1',
    },
  },
  descendantCounts: { Dataset: 2 },
};

export const Dataset = Template.bind({});
Dataset.args = datasetArgs;

export const InvertedColors = Template.bind({});
InvertedColors.args = { ...datasetArgs, invertColors: true };

const overflowEntityData = {
  ...datasetArgs.entityData,
  mapped_data_types: ['Data Type 1', 'Data Type 2', 'Data Type 3', 'Data Type 4', 'Data Type 5'],
};

const { thumbnail_file, ...entityDataWithoutImage } = overflowEntityData;
export const Overflow = Template.bind({});
Overflow.args = {
  ...datasetArgs,
  entityData: entityDataWithoutImage,
};

export const OverflowWithImage = Template.bind({});
OverflowWithImage.args = {
  ...datasetArgs,
  entityData: {
    ...overflowEntityData,
  },
};

export const ImageNotFound = Template.bind({});
ImageNotFound.args = datasetArgs;
ImageNotFound.parameters = {
  msw: {
    handlers: [
      http.get(
        'https://assets.hubmapconsortium.org/ffff0185e2163e03da79489140fee0d1/thumbnail.jpg',
        (req, res, ctx) => {
          return res(ctx.status(404));
        },
      ),
    ],
  },
};
