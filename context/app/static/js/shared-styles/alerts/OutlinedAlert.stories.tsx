import React from 'react';

import { Alert } from './Alert';

export default {
  title: 'Alerts/OutlinedAlert',
  component: Alert,
  argTypes: {
    severity: {
      options: ['warning', 'error', 'success', 'info'],
      control: { type: 'select' },
    },
  },
};

export function OutlinedAlert(args: any) {
  return <Alert {...args} />;
}
(OutlinedAlert as any).args = {
  severity: 'warning',
  children: 'Alert, intruders!',
};
OutlinedAlert.storyName = 'OutlinedAlert'; // needed for single story hoisting for multi word component names
