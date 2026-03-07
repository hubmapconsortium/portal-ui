import type { Meta, StoryObj } from '@storybook/react';

import PanelComponent from './Panel';

const meta = {
  title: 'Panels/Panel',
  component: PanelComponent,
} satisfies Meta<typeof PanelComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {
  args: {
    title: 'Title',
    href: '#',
    secondaryText: 'Secondary Text',
    rightText: 'Right Text',
  },
};
