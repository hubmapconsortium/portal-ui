import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useHyperQueryCellTypes, { HyperQueryCellTypesParams } from './useHyperQueryCellTypes';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function HyperQueryCellTypesControl(params: HyperQueryCellTypesParams) {
  const result = useHyperQueryCellTypes(params);
  return <StoryControlTemplate title="HyperQuery Cell Types" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/HyperQueryCellTypes',
  component: HyperQueryCellTypesControl,
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
    datasetName: {
      control: {
        type: 'text',
      },
    },
    includePrefix: {
      control: {
        type: 'boolean',
      },
    },
  },
};

type Story = StoryObj<typeof HyperQueryCellTypesControl>;

export const HyperQueryCellTypes: Story = {
  args: {
    geneList: 'UMOD',
    datasetName: 'kidney',
  },
};

export default meta;
