import React from 'react';

import Panel from 'js/shared-styles/panels/Panel';
import PanelListComponent from './PanelList';

export default {
  title: 'Panels/PanelList',
  component: PanelListComponent,
  subcomponents: { Panel },
};

export function PanelList(args) {
  return <PanelListComponent {...args} />;
}
PanelList.args = {
  panelsProps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => ({
    title: `Title ${i}`,
    secondaryText: `Secondary Text ${i}`,
    rightText: `Right Text ${i}`,
  })),
};
PanelList.storyName = 'PanelList'; // needed for single story hoisting for multi word component names
