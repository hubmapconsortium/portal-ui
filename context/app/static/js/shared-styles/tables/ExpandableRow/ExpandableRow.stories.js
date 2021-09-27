import React from 'react';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRowComponent from './ExpandableRow';

export default {
  title: 'Tables/ExpandableRow',
  component: ExpandableRowComponent,
};

export const ExpandableRow = (args) => (
  <ExpandableRowComponent {...args}>
    <ExpandableRowCell>A</ExpandableRowCell>
    <ExpandableRowCell>B</ExpandableRowCell>
    <ExpandableRowCell>C</ExpandableRowCell>
  </ExpandableRowComponent>
);
ExpandableRow.args = {
  numCells: 4,
  expandedContent: <div>123</div>,
};

ExpandableRow.storyName = 'ExpandableRow'; // needed for single story hoisting for multi word component names
