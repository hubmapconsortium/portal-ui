import React from 'react';

import PanelComponent from './Panel';

export default {
  title: 'Panels/Panel',
  component: PanelComponent,
};

export const Panel = (args) => <PanelComponent {...args} />;
Panel.args = {
  title: 'Title',
  secondaryText: 'Secondary Text',
  rightText: 'Right Text',
};
Panel.storyName = 'Panel'; // needed for single story hoisting for multi word component names
