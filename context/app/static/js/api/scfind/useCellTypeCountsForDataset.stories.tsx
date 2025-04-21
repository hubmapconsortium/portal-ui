import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useCellTypeCountForDataset, { CellTypeCountForDatasetParams } from './useCellTypeCountForDataset';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function CellTypeCountsControl(params: CellTypeCountForDatasetParams) {
  const result = useCellTypeCountForDataset(params);
  return <StoryControlTemplate title="Cell Type Counts for Dataset" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CellTypeCountForDataset',
  component: CellTypeCountsControl,
  parameters: {
    msw: {
      handlers: [
        http.get(`${SCFIND_BASE_STORYBOOK}/api/*`, () => {
          return passthrough();
        }),
      ],
    },
  },
  argTypes: {
    dataset: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof CellTypeCountsControl>;

export const CellTypeCountForDataset: Story = {
  args: {
    dataset: 'HBM444.DXLZ.643',
  },
};

export default meta;
