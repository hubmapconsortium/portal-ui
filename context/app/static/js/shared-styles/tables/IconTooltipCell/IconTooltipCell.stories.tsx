import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import { DatasetIcon } from 'js/shared-styles/icons';
import IconTooltipCell from './IconTooltipCell';

const meta = {
  title: 'Tables/IconTooltipCell',
  component: IconTooltipCell,
} satisfies Meta<typeof IconTooltipCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tooltipTitle: 'More info', children: 'Hello' },
  render: (args) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Col A</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <IconTooltipCell {...args}>Hello</IconTooltipCell>
      </TableBody>
    </Table>
  ),
};

export const CustomIcon: Story = {
  args: { tooltipTitle: 'Custom Icon', icon: DatasetIcon, children: 'Hello' },
  render: (args) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Col A</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <IconTooltipCell {...args}>Hello</IconTooltipCell>
      </TableBody>
    </Table>
  ),
};
