import React from 'react';
import Typography from '@material-ui/core/Typography';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import useWorkspacesPleaseWait from './hooks';

function WorkspacePleaseWait({ workspaceId }) {
  const { message } = useWorkspacesPleaseWait(workspaceId);

  return (
    <>
      <WorkspacesTitle />
      <Typography>Please wait... {message}</Typography>
    </>
  );
}

export default WorkspacePleaseWait;
