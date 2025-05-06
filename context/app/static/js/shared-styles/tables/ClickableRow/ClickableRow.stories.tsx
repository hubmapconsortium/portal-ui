import React from 'react';
import TableCell from '@mui/material/TableCell';
import { StoryObj } from '@storybook/react';
import ClickableRow, { ClickableRowProps } from './ClickableRow';

export default {
  title: 'Tables/ClickableRow',
  component: ClickableRow,
};

function Template(args: ClickableRowProps) {
  return (
    <ClickableRow {...args}>
      <TableCell>A</TableCell>
      <TableCell>B</TableCell>
      <TableCell>C</TableCell>
    </ClickableRow>
  );
}

const sharedArgs = { label: 'onClick label', onClick: () => {} };

type Story = StoryObj<typeof Template>;

export const Default: Story = {
  render: Template,
  args: sharedArgs,
};

export const Disabled: Story = {
  render: Template,
  args: {
    ...sharedArgs,
    disabled: true,
  },
};
