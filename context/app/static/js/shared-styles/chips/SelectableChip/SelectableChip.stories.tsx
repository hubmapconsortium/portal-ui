import type { Meta, StoryObj } from '@storybook/react';
import SelectableChip from './SelectableChip';

const meta = {
  title: 'Chips/SelectableChip',
  component: SelectableChip,
  args: {
    onDelete: undefined,
  },
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    isSelected: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof SelectableChip>;

type Story = StoryObj<typeof SelectableCard>;

export const Selected: Story = {
  args: {
    label: 'Selected Chip',
    isSelected: true,
  },
};

export const Unselected: Story = {
  args: {
    label: 'Unselected Chip',
    isSelected: false,
  },
};

export default meta;
