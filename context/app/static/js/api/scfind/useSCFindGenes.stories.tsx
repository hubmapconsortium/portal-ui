import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { http, passthrough } from 'msw';
import useSCFindGenes from './useSCFindGenes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function SCFindGenesListControl() {
  const result = useSCFindGenes();
  return <StoryControlTemplate title="Marker Genes" params={{}} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/SCFindGenes',
  component: SCFindGenesListControl,
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

type Story = StoryObj<typeof SCFindGenesListControl>;

export const MarkerGenes: Story = {};

export default meta;
