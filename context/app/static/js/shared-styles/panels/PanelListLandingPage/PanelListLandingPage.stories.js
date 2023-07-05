import React from 'react';

import Panel from 'js/shared-styles/panels/Panel';
import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelList as PanelListStory } from 'js/shared-styles/panels/PanelList/PanelList.stories';
import PanelListLandingPageComponent from './PanelListLandingPage';

export default {
  title: 'Panels/PanelListLandingPage',
  component: PanelListLandingPageComponent,
  subcomponents: [PanelList, Panel],
};

const lorem =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

export function PanelListLandingPage(args) {
  return (
    <PanelListLandingPageComponent {...args}>
      <PanelListStory {...PanelListStory.args} />
    </PanelListLandingPageComponent>
  );
}

PanelListLandingPage.args = {
  title: 'Landing Page Title',
  subtitle: 'Landing Page Subtitle',
  description: lorem,
  panelsProps: PanelListStory.args.panelsProps,
};

PanelListLandingPage.storyName = 'PanelListLandingPage'; // needed for single story hoisting for multi word component names
