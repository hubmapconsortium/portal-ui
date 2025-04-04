import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindDatasetForCellType, { FindDatasetForCellTypeParams } from './useFindDatasetForCellType';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindDatasetForCellTypeControl(params: FindDatasetForCellTypeParams) {
  const result = useFindDatasetForCellType(params);
  return <StoryControlTemplate title="Find Datasets For Cell Type" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindDatasetForCellType',
  component: FindDatasetForCellTypeControl,
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
    cellType: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof FindDatasetForCellTypeControl>;

export const FindCellTypeSpecificities: Story = {
  args: {
    cellType: 'kidney.B cell',
  },
};

export default meta;
