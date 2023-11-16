import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import { InternalLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { StyledDescription } from './style';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';

function Workspaces() {
  return (
    <>
      <WorkspacesTitle />
      <WorkspacesAuthGuard>
        <WorkspacesAuthenticated />
      </WorkspacesAuthGuard>
    </>
  );
}

export default Workspaces;
