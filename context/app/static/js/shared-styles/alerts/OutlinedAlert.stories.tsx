import type { Meta, StoryObj } from '@storybook/react';

import { Alert } from './Alert';

const meta = {
  title: 'Alerts/OutlinedAlert',
  component: Alert,
  argTypes: {
    severity: {
      options: ['warning', 'error', 'success', 'info'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OutlinedAlert: Story = {
  args: {
    severity: 'warning',
    children: 'Alert, intruders!',
  },
};
