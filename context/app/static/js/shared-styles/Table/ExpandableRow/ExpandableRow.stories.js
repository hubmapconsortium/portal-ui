import React from 'react';

import ExpandableRowCell from 'js/shared-styles/Table/ExpandableRowCell';
import ExpandableRow from './ExpandableRow';

export default {
  title: 'ExpandableRow',
  component: ExpandableRow,
};

const Template = (args) => (
  <ExpandableRow {...args}>
    <ExpandableRowCell>A</ExpandableRowCell>
    <ExpandableRowCell>B</ExpandableRowCell>
    <ExpandableRowCell>C</ExpandableRowCell>
  </ExpandableRow>
);
export const Default = Template.bind({});
Default.args = {
  numCells: 4,
  expandedContent: <div>123</div>,
};
