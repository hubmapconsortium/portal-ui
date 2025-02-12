import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Typography, Stack } from '@mui/material';
import { http, passthrough } from 'msw';
import useCellTypeNames, { CellTypeNamesParams } from './useCellTypeNames';

import { SCFIND_BASE } from './utils';

function CellTypeNamesControl(params: CellTypeNamesParams) {
  const result = useCellTypeNames(params);
  return (
    <Stack>
      <Typography variant="h6">Cell Type Names</Typography>
      <Typography variant="body1">Params:</Typography>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <Typography variant="body1">Results:</Typography>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </Stack>
  );
}

const meta: Meta = {
  title: 'SCFind/CellTypeNames',
  component: CellTypeNamesControl,
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
    annotationNames: {
      control: {
        type: 'text',
      },
    },
  },
};

type Story = StoryObj<typeof CellTypeNamesControl>;

export const CellTypeNames: Story = {
  args: {},
};

export default meta;
