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
} satisfies Meta<typeof SelectableCard>;

type Story = StoryObj<typeof SelectableCard>;

export const Default: Story = {
  args: {
    title: 'Squirtle',
    description: 'Squirtle is a small reptilian Pokémon that resembles a light-blue turtle.',
    tags: ['Type: Water', 'Gen: 1'],
    isSelected: false,
    selectItem: () => {},
    cardKey: 'Squirtle',
  },
};

export default meta;
