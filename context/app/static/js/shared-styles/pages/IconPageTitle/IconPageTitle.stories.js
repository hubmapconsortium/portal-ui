import React from 'react';

import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import { DatasetIcon } from 'js/shared-styles/icons';

export default {
  title: 'Pages/IconPageTitle',
  component: IconPageTitle,
  subcomponents: { PageTitle },
};

const sharedArgs = {
  icon: DatasetIcon,
  children: 'Page Title',
};

function Template(args) {
  return <IconPageTitle {...args}>{args.children}</IconPageTitle>;
}

export const Default = Template.bind({});
Default.args = sharedArgs;

export const WithIconProps = Template.bind({});
WithIconProps.args = { ...sharedArgs, iconProps: { color: 'secondary' } };
