import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LinkButton from './LinkButton';

export default {
  title: 'Buttons/LinkButton',
  component: LinkButton,
};

const Template = (args) => <LinkButton {...args} />;

const sharedArgs = {
  onClick: () => {},
};

export const Default = Template.bind({});
Default.args = { ...sharedArgs, children: 'Default Link Button' };

export const OutboundIconLinkButton = Template.bind({});

OutboundIconLinkButton.args = {
  ...sharedArgs,
  children: 'Outbound Icon Link Button',
  linkComponent: OutboundIconLink,
};
