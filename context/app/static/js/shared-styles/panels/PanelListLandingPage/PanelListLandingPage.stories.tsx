import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Panel from 'js/shared-styles/panels/Panel';
import PanelListComponent from 'js/shared-styles/panels/PanelList';
import { panelsProps } from 'js/shared-styles/panels/PanelList/PanelList.stories';
import PanelListLandingPageComponent from './PanelListLandingPage';

const meta = {
  title: 'Panels/PanelListLandingPage',
  component: PanelListLandingPageComponent,
  subcomponents: { PanelListComponent, Panel },
} satisfies Meta<typeof PanelListLandingPageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const lorem =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

export const PanelListLandingPage: Story = {
  args: {
    title: 'Landing Page Title',
    subtitle: 'Landing Page Subtitle',
    description: lorem,
  },
  render: (args) => (
    <PanelListLandingPageComponent {...args}>
      <PanelListComponent panelsProps={panelsProps} />
    </PanelListLandingPageComponent>
  ),
};
