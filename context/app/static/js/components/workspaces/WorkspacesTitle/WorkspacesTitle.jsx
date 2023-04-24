import React from 'react';

import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';

function WorkspacesTitle() {
  return <IconPageTitle icon={WorkspacesIcon}>My Workspaces</IconPageTitle>;
}

export default WorkspacesTitle;
