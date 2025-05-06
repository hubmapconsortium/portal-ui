import React from 'react';

import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';

function WorkspacesTitle() {
  return (
    <IconPageTitle icon={WorkspacesIcon as MUIIcon} data-testid="my-workspaces-title">
      Workspaces
    </IconPageTitle>
  );
}

export default WorkspacesTitle;
