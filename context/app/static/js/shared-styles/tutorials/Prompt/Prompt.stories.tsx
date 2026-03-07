import type { Meta, StoryObj } from '@storybook/react';

import { LinkPrompt } from './Prompt';

const meta = {
  title: 'Tutorials/Prompt',
  component: LinkPrompt,
} satisfies Meta<typeof LinkPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Prompt: Story = {
  args: {
    headerText: 'Tutorial Title',
    descriptionText: 'Welcome to the tutorial!',
    buttonText: 'Start the tutorial',
    buttonHref: '#',
  },
};
