import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Typography, Stack } from '@mui/material';
import { http, passthrough } from 'msw';
import useHyperQueryCellTypes, { CellTypeNamesParams } from './useHyperQueryCellTypes';

import { SCFIND_BASE } from './utils';

function HyperQueryCellTypesControl(params: CellTypeNamesParams) {
  console.log({ params });
  const result = useHyperQueryCellTypes(params);
  return (
    <Stack>
      <Typography variant="h6">HyperQuery Cell Types</Typography>
      <Typography variant="body1">Params:</Typography>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <Typography variant="body1">Results:</Typography>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </Stack>
  );
}

const meta: Meta = {
  title: 'SCFind/HyperQueryCellTypes',
  component: HyperQueryCellTypesControl,
  parameters: {
    msw: {
      handlers: [
        http.get(`${SCFIND_BASE}/*`, () => {
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
    annotationNames: {
      control: {
        type: 'select',
        options: ['lung', 'kidney'],
        mapping: {
          lung: [{ Organ: 'lung' }],
          kidney: [{ Organ: 'kidney' }],
        },
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
    annotationNames: [{ Organ: 'Kidney', Tissue: 'Kidney' }],
  },
};

export default meta;
