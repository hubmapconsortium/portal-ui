import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

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
