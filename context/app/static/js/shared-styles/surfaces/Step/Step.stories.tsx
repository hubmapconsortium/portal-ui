import type { Meta, StoryObj } from '@storybook/react';
import Step from './Step';

const meta = {
  title: 'Surfaces/Step',
  component: Step,
  argTypes: {
    index: {
      control: { type: 'number' },
    },
    isRequired: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
  },
  args: {
    children: 'Step Content...',
  },
} satisfies Meta<typeof Step>;

type Story = StoryObj<typeof Step>;

export const Required: Story = {
  args: {
    index: 0,
    isRequired: true,
    title: 'First Step',
  },
};

export const Optional: Story = {
  args: {
    index: 1,
    isRequired: false,
    title: 'Second Step',
  },
};

export default meta;
