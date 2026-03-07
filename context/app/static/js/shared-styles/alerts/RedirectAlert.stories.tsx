import React, { ComponentProps, useMemo } from 'react';
import type { Meta } from '@storybook/react';

import { FlaskDataContext, FlaskDataContextType } from 'js/components/Contexts';

import { organNotFoundMessageTemplate } from '../../pages/Organs/hooks';

import { RedirectAlert } from './RedirectAlert';

const templates = {
  default: undefined,
  'organ not found': organNotFoundMessageTemplate,
};

const templateOptions = Object.keys(templates);

const meta: Meta = {
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

export default meta;

export function RedirectAlertStory({
  redirected_from,
  ...args
}: ComponentProps<typeof RedirectAlert> & { redirected_from: string }) {
  const value = useMemo(() => ({ entity: {}, redirected_from }) as unknown as FlaskDataContextType, [redirected_from]);
  return (
    <FlaskDataContext.Provider value={value}>
      <RedirectAlert {...args} messageTemplate={(r: string) => `Redirected from ${r}`} />
    </FlaskDataContext.Provider>
  );
}
RedirectAlertStory.args = {
  severity: 'info',
  redirected_from: 'Test String',
};
RedirectAlertStory.storyName = 'RedirectAlert'; // needed for single story hoisting for multi word component names
