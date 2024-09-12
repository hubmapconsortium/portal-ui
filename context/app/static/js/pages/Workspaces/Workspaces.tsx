import React from 'react';
import Stack from '@mui/material/Stack';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';
import WorkspaceRelaunchAlert from 'js/components/workspaces/WorkspaceRelaunchAlert';
import { TextItems } from 'js/components/workspaces/workspaceMessaging';

import { LinkPrompt } from 'js/shared-styles/tutorials/Prompt';

function WorkspacesTutorialPrompt() {
  return (
    <LinkPrompt
      headerText="Getting Started"
      descriptionText="Get a tutorial of how to explore workspaces to analyze HuBMAP data."
      buttonText="Navigate to the Workspace Tutorial"
      buttonHref="/tutorials/workspaces"
    />
  );
}

function Workspaces() {
  return (
    <Stack spacing={2} direction="column" mb={2}>
      <WorkspaceRelaunchAlert />
      <WorkspaceSessionWarning link />
      <WorkspacesTitle />
      <WorkspacesTutorialPrompt />
      <WorkspacesAuthGuard>
        <TextItems textKey="workspacesUserOrLoggedOut" />
        <WorkspacesAuthenticated />
      </WorkspacesAuthGuard>
    </Stack>
  );
}

export default Workspaces;
