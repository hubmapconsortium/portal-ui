import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindDatasetForCellTypes, { FindDatasetForCellTypesParams } from './useFindDatasetForCellTypes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindDatasetForCellTypesControl(params: FindDatasetForCellTypesParams) {
  const result = useFindDatasetForCellTypes(params);
  return <StoryControlTemplate title="Find Datasets For Cell Type" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindDatasetForCellTypes',
  component: FindDatasetForCellTypesControl,
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
    cellTypes: {
      control: {
        type: 'object',
      },
    },
  },
};

type Story = StoryObj<typeof FindDatasetForCellTypesControl>;

export const FindDatasetForCellType: Story = {
  args: {
    cellTypes: ['kidney.B cell', 'lung.B cell'],
  },
};

export default meta;
