import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import { DatasetIcon } from 'js/shared-styles/icons';
import IconTooltipCell from './IconTooltipCell';

export default {
  title: 'Tables/IconTooltipCell',
  component: IconTooltipCell,
};
function Template(args) {
  return (
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
  );
}
export const Default = Template.bind({});
Default.args = { tooltipTitle: 'More info' };

export const CustomIcon = Template.bind({});
CustomIcon.args = { tooltipTitle: 'Custom Icon', icon: DatasetIcon };
