import type { Meta, StoryObj } from '@storybook/react';
import { AuthButton } from './AuthButton';

const meta: Meta = {
  title: 'Header/AuthButton',
  component: AuthButton,
};

type Story = StoryObj<typeof AuthButton>;

export const Default: Story = {
  args: {
    isAuthenticated: false,
  },
};

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
  },
};

export default meta;
