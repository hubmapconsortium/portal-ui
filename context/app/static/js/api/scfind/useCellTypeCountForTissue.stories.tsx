import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useCellTypeCountForTissue, { CellTypeCountForTissueParams } from './useCellTypeCountForTissue';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function CellTypeCountsControl(params: CellTypeCountForTissueParams) {
  const result = useCellTypeCountForTissue(params);
  return <StoryControlTemplate title="Cell Type Counts for Tissue" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CellTypeCountForTissue',
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
    tissue: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof CellTypeCountsControl>;

export const CellTypeCountForTissue: Story = {
  args: {
    tissue: 'kidney',
  },
};

export default meta;
