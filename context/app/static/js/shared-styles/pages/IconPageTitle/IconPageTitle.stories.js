import React from 'react';

import IconPageTitleComponent from 'js/shared-styles/pages/IconPageTitle';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import { DatasetIcon } from 'js/shared-styles/icons';

export default {
  title: 'Pages/IconPageTitle',
  component: IconPageTitleComponent,
  subcomponents: { PageTitle },
};

export const IconPageTitle = (args) => (
  <IconPageTitleComponent icon={args.icon}>{args.children}</IconPageTitleComponent>
);
IconPageTitle.args = {
  icon: DatasetIcon,
  children: 'Page Title',
};

IconPageTitle.storyName = 'IconPageTitle'; // needed for single story hoisting for multi word component names
