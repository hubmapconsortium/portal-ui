import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindCellTypeSpecificities, { FindCellTypeSpecificitiesParams } from './useFindCellTypeSpecificities';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindCellTypeSpecificitiesControl(params: FindCellTypeSpecificitiesParams) {
  const result = useFindCellTypeSpecificities(params);
  return <StoryControlTemplate title="Find Cell Type Specificities" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindCellTypeSpecificities',
  component: FindCellTypeSpecificitiesControl,
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
    cellTypes: {
      control: {
        type: 'object',
      },
    },
    backgroundCellTypes: {
      control: {
        type: 'text',
      },
    },
    backgroundAnnotationNames: {
      control: {
        type: 'text',
      },
    },
    sortField: {
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

type Story = StoryObj<typeof FindCellTypeSpecificitiesControl>;

export const EvaluateMarkers: Story = {
  args: {},
};

export default meta;
