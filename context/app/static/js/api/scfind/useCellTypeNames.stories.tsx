import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useCellTypeNames from './useCellTypeNames';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function CellTypeNamesControl() {
  const result = useCellTypeNames();
  return <StoryControlTemplate title="Cell Type Names" params={{}} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CellTypeNames',
  component: CellTypeNamesControl,
  parameters: {
    msw: {
      handlers: [
        http.get(`${SCFIND_BASE_STORYBOOK}/api/*`, () => {
          return passthrough();
        }),
      ],
    },
  },
};

type Story = StoryObj<typeof CellTypeNamesControl>;

export const CellTypeNames: Story = {
  args: {},
};

export default meta;
