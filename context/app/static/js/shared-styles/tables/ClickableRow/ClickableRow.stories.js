import React from 'react';
import TableCell from '@mui/material/TableCell';
import ClickableRow from './ClickableRow';

export default {
  title: 'Tables/ClickableRow',
  component: ClickableRow,
};

function Template(args) {
  return (
    <ClickableRow {...args}>
      <TableCell>A</TableCell>
      <TableCell>B</TableCell>
      <TableCell>C</TableCell>
    </ClickableRow>
  );
}

const sharedArgs = { label: 'onClick label', onClick: () => {} };

export const Default = Template.bind({});
Default.args = sharedArgs;

export const Disabled = Template.bind({});

Disabled.args = {
  ...sharedArgs,
  disabled: true,
};
