import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useMarkerGenes, { MarkerGenesParams } from './useMarkerGenes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function MarkerGenesControl(params: MarkerGenesParams) {
  const result = useMarkerGenes(params);
  return <StoryControlTemplate title="Marker Genes" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/MarkerGenes',
  component: MarkerGenesControl,
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
    markerGenes: {
      control: {
        type: 'text',
      },
    },
    datasetName: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof MarkerGenesControl>;

export const MarkerGenes: Story = {
  args: {
    markerGenes: 'PKHD1L1,MMRN1,PPFIBP1,PLCG2',
    datasetName: 'Kidney',
  },
};

export default meta;
