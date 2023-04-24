import React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

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
