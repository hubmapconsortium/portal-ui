import type { Meta, StoryObj } from '@storybook/react';
import { http } from 'msw';

import EntityTile from './EntityTile';

const meta = {
  title: 'Tiles/EntityTile',
  component: EntityTile,
} satisfies Meta<typeof EntityTile>;
export default meta;

type Story = StoryObj<typeof meta>;

const uuid = 'abc123';

export const Donor: Story = {
  args: {
    uuid,
    entity_type: 'Donor' as const,
    id: 'DNRID123',
    invertColors: false,
    ariaLabelText: 'Donor DNRID123',
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
  },
};

export const Sample: Story = {
  args: {
    uuid,
    entity_type: 'Sample' as const,
    id: 'SMPLID123',
    invertColors: false,
    ariaLabelText: 'Sample SMPLID123',
    entityData: {
      last_modified_timestamp: Date.now(),
      sample_category: 'Sample Category',
      origin_samples: [{ mapped_organ: 'Organ Type' }, { mapped_organ: 'Organ Type 2' }],
    },
    descendantCounts: { Sample: 1, Dataset: 2 },
  },
};

const datasetArgs = {
  uuid,
  entity_type: 'Dataset' as const,
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
  ariaLabelText: 'Dataset DATAID123',
};

export const Dataset: Story = {
  args: datasetArgs,
};

export const InvertedColors: Story = {
  args: { ...datasetArgs, invertColors: true },
};

const overflowEntityData = {
  ...datasetArgs.entityData,
  mapped_data_types: ['Data Type 1', 'Data Type 2', 'Data Type 3', 'Data Type 4', 'Data Type 5'],
};

const { thumbnail_file, ...entityDataWithoutImage } = overflowEntityData;
export const Overflow: Story = {
  args: {
    ...datasetArgs,
    entityData: entityDataWithoutImage,
  },
};

export const OverflowWithImage: Story = {
  args: {
    ...datasetArgs,
    entityData: {
      ...overflowEntityData,
    },
  },
};

export const ImageNotFound: Story = {
  args: datasetArgs,
  parameters: {
    msw: {
      handlers: [
        http.get('https://assets.hubmapconsortium.org/ffff0185e2163e03da79489140fee0d1/thumbnail.jpg', () => {
          return new Response(null, { status: 404 });
        }),
      ],
    },
  },
};
