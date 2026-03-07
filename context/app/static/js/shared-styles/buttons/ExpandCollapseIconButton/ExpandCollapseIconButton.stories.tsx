import type { Meta, StoryObj } from '@storybook/react';

import ExpandCollapseIconButton from './ExpandCollapseIconButton';

const meta = {
  title: 'Buttons/ExpandCollapseIconButton',
  component: ExpandCollapseIconButton,
} satisfies Meta<typeof ExpandCollapseIconButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: { isExpanded: true },
};

export const Collapsed: Story = {
  args: { isExpanded: false },
};
