import React from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import useWorkspacesPleaseWait from './hooks';
import { FlexColumn, CenteredFlexItem, StyledAlert } from './style';

function WorkspacePleaseWait({ workspaceId }) {
  const { message } = useWorkspacesPleaseWait(workspaceId);

  return (
    <FlexColumn>
      <div>
        <StyledAlert severity="info">Workspaces are loading. Workspaces can take a few minutes to load.</StyledAlert>
        <WorkspacesTitle />
      </div>
      <CenteredFlexItem>
        <CircularProgress size="3rem" />
        <Typography>{message}</Typography>
      </CenteredFlexItem>
    </FlexColumn>
  );
}

export default WorkspacePleaseWait;
