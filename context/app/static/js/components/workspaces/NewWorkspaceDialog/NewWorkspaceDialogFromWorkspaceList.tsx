import React from 'react';
import AddRounded from '@mui/icons-material/AddRounded';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
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
      <NewWorkspaceDialog
        showDatasetsSearchBar
        onCreateWorkspace={({ name, files, symlinks }) => {
          trackEvent({
            category: WorkspacesEventCategories.WorkspaceLandingPage,
            action: 'Create Workspace',
            label: {
              name,
              files,
              symlinks,
            },
          });
        }}
        {...rest}
      />
    </>
  );
}

export default NewWorkspaceDialogFromWorkspaceList;
