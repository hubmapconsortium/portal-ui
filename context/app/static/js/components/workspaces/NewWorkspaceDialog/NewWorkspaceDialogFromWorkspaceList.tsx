import AddRounded from '@mui/icons-material/AddRounded';
import React from 'react';
import WorkspaceButton from '../WorkspaceButton';
import NewWorkspaceDialog from './NewWorkspaceDialog';
import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';

function NewWorkspaceDialogFromWorkspaceList() {
  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({});
  return (
    <>
      <WorkspaceButton onClick={() => setDialogIsOpen(true)} tooltip="Create workspace">
        <AddRounded />
      </WorkspaceButton>
      <NewWorkspaceDialog {...rest} />
    </>
  );
}

export default NewWorkspaceDialogFromWorkspaceList;
