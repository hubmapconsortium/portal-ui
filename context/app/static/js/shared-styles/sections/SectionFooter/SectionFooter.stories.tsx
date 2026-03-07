import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SectionFooter from './SectionFooter';

const meta = {
  title: 'Sections/SectionFooter',
  component: SectionFooter,
} satisfies Meta<typeof SectionFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    items: [
      { key: '1', component: <>Item 1</> },
      { key: '2', component: <>Item 2</> },
    ],
  },
};
