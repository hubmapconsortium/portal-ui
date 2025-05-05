import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, passthrough } from 'msw';
import useIndexedDatasets from './useIndexedDatasets';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

function IndexedDatasetsControl() {
  const result = useIndexedDatasets();
  return <StoryControlTemplate title="Indexed Datasets" params={{}} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/IndexedDatasets',
  component: IndexedDatasetsControl,
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

type Story = StoryObj<typeof IndexedDatasetsControl>;

export const IndexedDatasets: Story = {
  args: {},
};

export default meta;
