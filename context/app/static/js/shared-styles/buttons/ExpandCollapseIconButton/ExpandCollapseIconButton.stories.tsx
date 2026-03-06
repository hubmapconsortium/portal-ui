import React from 'react';

import ExpandCollapseIconButton from './ExpandCollapseIconButton';

export default {
  title: 'Buttons/ExpandCollapseIconButton',
  component: ExpandCollapseIconButton,
};

function Template(args: any) {
  return <ExpandCollapseIconButton {...args} />;
}
export const Expanded = Template.bind({}) as any;
Expanded.args = { isExpanded: true };

export const Collapsed = Template.bind({}) as any;
Collapsed.args = { isExpanded: false };
