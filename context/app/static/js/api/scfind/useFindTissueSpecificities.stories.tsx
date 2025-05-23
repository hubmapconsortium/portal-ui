import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindTissueSpecificities, { FindTissueSpecificitiesParams } from './useFindTissueSpecificities';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindTissueSpecificitiesControl(params: FindTissueSpecificitiesParams) {
  const result = useFindTissueSpecificities(params);
  return <StoryControlTemplate title="Find Tissue Specificities" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindTissueSpecificities',
  component: FindTissueSpecificitiesControl,
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
    geneList: {
      control: {
        type: 'text',
      },
    },
    minCells: {
      control: {
        type: 'number',
      },
    },
  },
};

type Story = StoryObj<typeof FindTissueSpecificitiesControl>;

export const FindTissueSpecificities: Story = {
  args: {
    geneList: 'PKHD1L1,MMRN1,PPFIBP1',
  },
};

export default meta;
