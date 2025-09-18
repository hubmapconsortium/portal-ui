import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { http, passthrough } from 'msw';
import useCLIDtoLabel, { CellTypeLabelsForCLIDParams } from './useCLIDToLabel';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function CLIDtoLabelControl(params: CellTypeLabelsForCLIDParams) {
  const result = useCLIDtoLabel(params);
  return <StoryControlTemplate title="Cell Type Counts for Tissue" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CLIDtoLabel',
  component: CLIDtoLabelControl,
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
    clid: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof CLIDtoLabelControl>;

export const CLIDToCellType: Story = {
  args: {
    clid: 'CL:0000236',
  },
};

export default meta;
