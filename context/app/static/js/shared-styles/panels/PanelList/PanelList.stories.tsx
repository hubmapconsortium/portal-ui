import type { Meta, StoryObj } from '@storybook/react';

import Panel from 'js/shared-styles/panels/Panel';
import PanelListComponent from './PanelList';

const meta = {
  title: 'Panels/PanelList',
  component: PanelListComponent,
  subcomponents: { Panel },
} satisfies Meta<typeof PanelListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const panelsProps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => ({
  title: `Title ${i}`,
  href: '#',
  secondaryText: `Secondary Text ${i}`,
  rightText: `Right Text ${i}`,
}));

export const PanelList: Story = {
  args: {
    panelsProps,
  },
};
