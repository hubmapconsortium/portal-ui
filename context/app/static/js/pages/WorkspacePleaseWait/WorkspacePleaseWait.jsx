import React from 'react';
import Typography from '@material-ui/core/Typography';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import useWorkspacesPleaseWait from './hooks';
import { StyledAlert } from './style';

function WorkspacePleaseWait({ workspaceId }) {
  const { message } = useWorkspacesPleaseWait(workspaceId);

  return (
    <>
      <StyledAlert color="info">Workspaces are loading. Workspaces can take a few minutes to load.</StyledAlert>
      <WorkspacesTitle />
      <Typography>Please wait... {message}</Typography>
    </>
  );
}

export default WorkspacePleaseWait;
