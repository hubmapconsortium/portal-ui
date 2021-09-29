import React from 'react';

import ExpandableRowCell from 'js/shared-styles/Table/ExpandableRowCell';
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

function Content({ heightRef }) {
  return (
    <div ref={heightRef}>
      Mollit irure sit fugiat eiusmod ullamco laborum. Deserunt aliqua nulla occaecat reprehenderit est cupidatat ex
      laborum. Occaecat ipsum anim dolore anim ut velit irure exercitation sunt. Incididunt pariatur dolore ut duis. Eu
      nulla ut amet irure deserunt eiusmod aliqua fugiat labore.
    </div>
  );
}
ExpandableRow.args = {
  numCells: 4,
  expandedContent: <Content />,
};

ExpandableRow.storyName = 'ExpandableRow'; // needed for single story hoisting for multi word component names
