import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useCellTypeExpressionBins, { useCellTypeExpression, GeneExpressionParams } from './useCellTypeExpression';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function CellTypeExpressionControl(params: GeneExpressionParams) {
  const result = useCellTypeExpression(params);
  const binnedResult = useCellTypeExpressionBins(params);
  return (
    <>
      <StoryControlTemplate title="Dataset Expression" params={params} result={result} />;
      <StoryControlTemplate title="Dataset Expression Binned" params={params} result={binnedResult} />
    </>
  );
}

const meta: Meta = {
  title: 'SCFind/CellTypeExpression',
  component: CellTypeExpressionControl,
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
    datasetName: {
      control: {
        type: 'text',
      },
    },
    geneList: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof CellTypeExpressionControl>;

export const CellTypeMarkers: Story = {
  args: {
    datasetName: 'HBM762.RPDR.282',
    geneList: 'MMRN1',
  },
};

export default meta;
