import React from 'react';

import ExpandCollapseIconButton from './ExpandCollapseIconButton';

export default {
  title: 'Buttons/ExpandCollapseIconButton',
  component: ExpandCollapseIconButton,
};

function Template(args) {
  return <ExpandCollapseIconButton {...args} />;
}
export const Expanded = Template.bind({});
Expanded.args = { isExpanded: true };

export const Collapsed = Template.bind({});
Collapsed.args = { isExpanded: false };
