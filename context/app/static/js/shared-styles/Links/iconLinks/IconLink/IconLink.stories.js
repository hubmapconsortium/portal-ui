import React from 'react';

import { ExternalLinkIcon } from 'js/shared-styles/icons';
import IconLink from './IconLink';

export default {
  title: 'Links/IconLink',
  component: IconLink,
};

const icon = <ExternalLinkIcon $fontSize="1rem" />;

function Template(args) {
  return <IconLink {...args} />;
}
export const Start = Template.bind({});
Start.args = { icon, iconPosition: 'start', children: 'Start' };

export const End = Template.bind({});
End.args = {
  icon,
  iconPosition: 'end',
  children: 'End',
};
