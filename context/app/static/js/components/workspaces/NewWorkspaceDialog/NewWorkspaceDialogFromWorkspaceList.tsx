import React from 'react';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';
import { useEventCallback } from '@mui/material/utils';

import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { trackEvent } from 'js/helpers/trackers';
import NewWorkspaceDialog from './NewWorkspaceDialog';
import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import YACConflictDialogWrapper from './YACConflictDialogWrapper';

function NewWorkspaceDialogFromWorkspaceList() {
  const { setDialogIsOpen, showYACConflictDialog, setShowYACConflictDialog, yacConflictData, ...rest } =
    useCreateWorkspaceForm({});

  const handleClick = useEventCallback(() => {
    trackEvent({
      category: WorkspacesEventCategories.WorkspaceDialog,
      action: 'Open Create Workspace Dialog',
    });
    setDialogIsOpen(true);
  });

  return (
    <>
      <Button onClick={handleClick} variant="contained" startIcon={<AddRounded sx={{ width: '1rem' }} />} size="medium">
        Create New
      </Button>
      <NewWorkspaceDialog
        showDatasetsSearchBar
        trackingInfo={{ category: WorkspacesEventCategories.WorkspaceLandingPage }}
        {...rest}
      />
      <YACConflictDialogWrapper
        showDialog={showYACConflictDialog}
        setShowDialog={setShowYACConflictDialog}
        conflictData={yacConflictData}
      />
    </>
  );
}

export default NewWorkspaceDialogFromWorkspaceList;
