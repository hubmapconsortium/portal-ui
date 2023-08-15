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

export function OutlinedAlert(args) {
  return <Alert {...args} />;
}
OutlinedAlert.args = {
  severity: 'warning',
  children: 'Alert, intruders!',
};
OutlinedAlert.storyName = 'OutlinedAlert'; // needed for single story hoisting for multi word component names
