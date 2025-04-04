import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useFindGeneSignatures, { FindGeneSignaturesParams } from './useFindGeneSignatures';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function FindGeneSignaturesControl(params: FindGeneSignaturesParams) {
  const result = useFindGeneSignatures(params);
  return <StoryControlTemplate title="Find Gene Signatures" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/FindGeneSignatures',
  component: FindGeneSignaturesControl,
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
    minCells: {
      control: {
        type: 'number',
      },
    },
    minFraction: {
      control: {
        type: 'number',
      },
    },
  },
};

type Story = StoryObj<typeof FindGeneSignaturesControl>;

export const FindGeneSignatures: Story = {
  args: {
    cellTypes: 'Lung.B cell',
  },
};

export default meta;
