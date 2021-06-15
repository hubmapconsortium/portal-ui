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

const Template = (args) => <Alert {...args} />;

export const Default = Template.bind({});
Default.args = {
  severity: 'warning',
  children: 'Alert, intruders!',
};
