import React from 'react';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRow from './ExpandableRow';

export default {
  title: 'Tables/ExpandableRow',
  component: ExpandableRow,
};

function Content({ heightRef }) {
  return (
    <div ref={heightRef}>
      Mollit irure sit fugiat eiusmod ullamco laborum. Deserunt aliqua nulla occaecat reprehenderit est cupidatat ex
      laborum. Occaecat ipsum anim dolore anim ut velit irure exercitation sunt. Incididunt pariatur dolore ut duis. Eu
      nulla ut amet irure deserunt eiusmod aliqua fugiat labore.
    </div>
  );
}
function Template(args) {
  return (
    <ExpandableRow {...args}>
      <ExpandableRowCell>A</ExpandableRowCell>
      <ExpandableRowCell>B</ExpandableRowCell>
      <ExpandableRowCell>C</ExpandableRowCell>
    </ExpandableRow>
  );
}

const sharedArgs = {
  numCells: 4,
  expandedContent: <Content />,
};

export const Default = Template.bind({});
Default.args = sharedArgs;

export const Disabled = Template.bind({});

Disabled.args = {
  ...sharedArgs,
  disabled: true,
};

export const DisabledWithTooltip = Template.bind({});
DisabledWithTooltip.args = {
  ...sharedArgs,
  disabled: true,
  disabledTooltipTitle: "Can't open now.",
};
