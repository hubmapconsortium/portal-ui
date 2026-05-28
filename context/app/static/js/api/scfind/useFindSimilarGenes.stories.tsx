import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindSimilarGenes, { FindSimilarGenesParams } from './useFindSimilarGenes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindSimilarGenesControl(params: FindSimilarGenesParams) {
  const result = useFindSimilarGenes(params);
  return <StoryControlTemplate title="Find Similar Genes" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindSimilarGenes',
  component: FindSimilarGenesControl,
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
    annotationNames: {
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

type Story = StoryObj<typeof FindSimilarGenesControl>;

export const FindSimilarGenes: Story = {
  args: {
    geneList: 'MMRN1,PKHD1L1',
  },
};

export default meta;
