import React from 'react';
import AddRounded from '@mui/icons-material/AddRounded';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import WorkspaceButton from 'js/components/workspaces/WorkspaceButton';
import NewWorkspaceDialog from './NewWorkspaceDialog';
import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';

function NewWorkspaceDialogFromWorkspaceList() {
  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({});

  return (
    <>
      <WorkspaceButton onClick={() => setDialogIsOpen(true)} tooltip="Create workspace">
        <AddRounded />
      </WorkspaceButton>
      <NewWorkspaceDialog
        showDatasetsSearchBar
        trackingCategory={WorkspacesEventCategories.WorkspaceLandingPage}
        {...rest}
      />
    </>
  );
}

export default NewWorkspaceDialogFromWorkspaceList;
