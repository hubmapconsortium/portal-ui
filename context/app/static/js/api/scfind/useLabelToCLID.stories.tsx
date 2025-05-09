import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useCLIDtoLabel, { CellTypeToCLIDParams } from './useLabelToCLID';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function LabelToCLIDControl(params: CellTypeToCLIDParams) {
  const result = useCLIDtoLabel(params);
  return <StoryControlTemplate title="Cell Type Counts for Tissue" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/LabelToCLID',
  component: LabelToCLIDControl,
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

type Story = StoryObj<typeof LabelToCLIDControl>;

export const CLIDToCellType: Story = {
  args: {
    cellType: 'Kidney.B cell',
  },
};

export default meta;
