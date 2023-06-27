import React from 'react';
import Button from '@material-ui/core/Button';

import { AddIcon } from 'js/shared-styles/icons';
import CreateWorkspaceDialog from 'js/components/workspaces/CreateWorkspaceDialog';

function AddButton(props) {
  return (
    <Button {...props}>
      <AddIcon color="primary" />
    </Button>
  );
}

function CreateWorkspaceButton({ handleCreateWorkspace }) {
  return <CreateWorkspaceDialog handleCreateWorkspace={handleCreateWorkspace} buttonComponent={AddButton} />;
}

export default CreateWorkspaceButton;
