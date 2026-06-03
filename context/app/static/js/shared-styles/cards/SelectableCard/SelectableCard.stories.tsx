import type { Meta, StoryObj } from '@storybook/react';
import SelectableCard from './SelectableCard';

const meta = {
  title: 'Cards/SelectableCard',
  component: SelectableCard,
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    tags: {
      control: { type: 'object' },
    },
    isSelected: {
      control: { type: 'boolean' },
    },
  },
  args: {
    title: 'Squirtle',
    description: 'Squirtle is a small reptilian Pokémon that resembles a light-blue turtle.',
    tags: ['Type: Water', 'Gen: 1'],
    selectItem: () => {},
    cardKey: 'Squirtle',
  },
} satisfies Meta<typeof SelectableCard>;

type Story = StoryObj<typeof SelectableCard>;

export const Unselected: Story = {
  args: {
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export default meta;
