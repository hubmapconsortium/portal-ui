import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import ClickableRow from './ClickableRow';

export default {
  title: 'Tables/ClickableRow',
  component: ClickableRow,
};

const Template = (args) => (
  <ClickableRow {...args}>
    <TableCell>A</TableCell>
    <TableCell>B</TableCell>
    <TableCell>C</TableCell>
  </ClickableRow>
);

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
};
