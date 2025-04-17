import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindDatasetForGenes, { DatasetsForGenesParams } from './useFindDatasetForGenes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function DatasetsForGenesControl(params: DatasetsForGenesParams) {
  const result = useFindDatasetForGenes(params);
  return <StoryControlTemplate title="Datasets for Genes" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CellTypeCountForDataset',
  component: DatasetsForGenesControl,
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
        type: 'object',
      },
    },
  },
};

type Story = StoryObj<typeof DatasetsForGenesControl>;

export const MarkerGenes: Story = {
  args: {
    geneList: ['CD4', 'MMRN1', 'ABCA1', '5S_rRNA'],
  },
};

export default meta;
