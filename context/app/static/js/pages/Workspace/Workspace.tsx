import React from 'react';

interface Props {
  workspaceId: string;
}

function Workspace({ workspaceId }: Props) {
  return <div>{workspaceId}</div>;
}

export default Workspace;
