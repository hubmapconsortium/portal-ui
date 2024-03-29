import React, { useMemo } from 'react';

import { FlaskDataContext } from 'js/components/Contexts';

import { organNotFoundMessageTemplate } from '../../pages/Organs/hooks';

import { RedirectAlert } from './RedirectAlert';

const templates = {
  default: undefined,
  'organ not found': organNotFoundMessageTemplate,
};

const templateOptions = Object.keys(templates);

export default {
  title: 'Alerts/RedirectAlert',
  component: RedirectAlert,
  argTypes: {
    severity: {
      options: ['warning', 'error', 'success', 'info'],
      control: { type: 'select' },
      default: 'info',
    },
    messageTemplate: {
      options: templateOptions,
      mapping: templates,
      control: {
        type: 'select',
        labels: {
          default: 'Default',
          'organ not found': 'Organ Not Found',
        },
      },
      default: 'Default',
    },
    redirected_from: {
      control: { type: 'text' },
      default: 'Test String',
    },
  },
};

export function RedirectAlertStory({ redirected_from, ...args }) {
  const value = useMemo(() => ({ redirected_from }), [redirected_from]);
  return (
    <FlaskDataContext.Provider value={value}>
      <RedirectAlert {...args} />
    </FlaskDataContext.Provider>
  );
}
RedirectAlertStory.args = {
  severity: 'info',
  messageTemplate: templates.default,
  redirected_from: 'Test String',
};
RedirectAlertStory.storyName = 'RedirectAlert'; // needed for single story hoisting for multi word component names
