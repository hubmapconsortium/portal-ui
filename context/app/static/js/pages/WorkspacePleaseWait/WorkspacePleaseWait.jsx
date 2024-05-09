import React from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import useWorkspacesPleaseWait from './hooks';
import { FlexColumn, CenteredFlexItem, StyledAlert } from './style';

function WorkspacePleaseWait({ workspaceId }) {
  const { message, isPending30s } = useWorkspacesPleaseWait(workspaceId);

  return (
    <FlexColumn>
      <div>
        {!isPending30s && <StyledAlert severity="info">Your workspace is currently launching.</StyledAlert>}
        {isPending30s && (
          <StyledAlert severity="warning">
            Due to high demand, there is currently a wait to launch your workspace. If your workspace does not launch
            within 5 minutes, please try again later.
          </StyledAlert>
        )}
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
