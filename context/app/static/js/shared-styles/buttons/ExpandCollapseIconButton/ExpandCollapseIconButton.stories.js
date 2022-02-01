import React from 'react';

import ExpandCollapseIconButton from './ExpandCollapseIconButton';

export default {
  title: 'Buttons/ExpandCollapseIconButton',
  component: ExpandCollapseIconButton,
};

const Template = (args) => <ExpandCollapseIconButton {...args} />;
export const Expanded = Template.bind({});
Expanded.args = { isExpanded: true };

export const Collapsed = Template.bind({});
Collapsed.args = { isExpanded: false };
