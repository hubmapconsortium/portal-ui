import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LinkButton from './LinkButton';

export default {
  title: 'Buttons/LinkButton',
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component: 'A button with the appearance of a link.',
      },
    },
  },
};

function Template(args: any) {
  return <LinkButton {...args} />;
}

const sharedArgs = {
  onClick: () => {},
};

export const Default = Template.bind({}) as any;
Default.args = { ...sharedArgs, children: 'Default Link Button' };

export const OutboundIconLinkButton = Template.bind({}) as any;

OutboundIconLinkButton.args = {
  ...sharedArgs,
  children: 'Outbound Icon Link Button',
  linkComponent: OutboundIconLink,
};
