import type { Meta, StoryObj } from '@storybook/react';

import SearchBarComponent from './SearchBar';

const meta = {
  title: 'inputs/SearchBar',
  component: SearchBarComponent,
} satisfies Meta<typeof SearchBarComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchBar: Story = {
  args: {
    onChange: () => {},
  },
};
