import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindHousekeepingGenes, { FindHouseKeepingGenesParams } from './useFindHouseKeepingGenes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindHousekeepingGenes(params: FindHouseKeepingGenesParams) {
  const result = useFindHousekeepingGenes(params);
  return <StoryControlTemplate title="Find Housekeeping Genes" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindHouseKeepingGenes',
  component: FindHousekeepingGenes,
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
        type: 'text',
      },
    },
    minRecall: {
      control: {
        type: 'number',
      },
    },
    maxGenes: {
      control: {
        type: 'number',
      },
    },
  },
};

type Story = StoryObj<typeof FindHousekeepingGenes>;

export const FindHouseKeepingGenes: Story = {
  args: {
    cellTypes: 'Kidney.B cell,Kidney.conventional dendritic cell',
  },
};

export default meta;
