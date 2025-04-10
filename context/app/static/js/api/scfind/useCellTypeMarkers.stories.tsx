import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useCellTypeMarkers, { CellTypeMarkersParams } from './useCellTypeMarkers';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function CellTypeMarkersControl(params: CellTypeMarkersParams) {
  const result = useCellTypeMarkers(params);
  return <StoryControlTemplate title="Cell Type Markers" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CellTypeMarkers',
  component: CellTypeMarkersControl,
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
        defaultValue: 'immature B cell',
      },
    },
    backgroundCellTypes: {
      control: {
        type: 'text',
      },
    },
    topK: {
      control: {
        type: 'number',
        defaultValue: 10,
      },
    },
    sortField: {
      control: {
        type: 'text',
        defaultValue: 'f1',
      },
    },
    includePrefix: {
      control: {
        type: 'boolean',
        defaultValue: true,
      },
    },
  },
};

type Story = StoryObj<typeof CellTypeMarkersControl>;

export const CellTypeMarkers: Story = {
  args: {
    cellTypes: 'Kidney.B cell',
  },
};

export default meta;
