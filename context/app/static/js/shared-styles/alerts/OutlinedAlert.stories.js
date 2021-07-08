import React from 'react';

import { Alert } from './index';

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

export const OutlinedAlert = (args) => <Alert {...args} />;
OutlinedAlert.args = {
  severity: 'warning',
  children: 'Alert, intruders!',
};
OutlinedAlert.storyName = 'OutlinedAlert'; // needed for single story hoisting for multi word component names
