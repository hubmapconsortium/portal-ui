import React, { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import ShareIcon from '@mui/icons-material/Share';

import { useSelectItems } from 'js/hooks/useSelectItems';
import WorkspaceButton from 'js/components/workspaces/WorkspaceButton';
import NewWorkspaceDialogFromWorkspaceList from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialogFromWorkspaceList';
import WorkspacesTable from 'js/components/workspaces/Tables/WorkspacesTable';
import WorkspacesAutocomplete from 'js/components/workspaces/WorkspacesAutocomplete';
import WorkspacesListDialogs from 'js/components/workspaces/WorkspacesListDialogs';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspacesListWithSharerInfo } from './hooks';

function WorkspacesList() {
  const { workspacesList, isDeleting, isLoading } = useWorkspacesListWithSharerInfo();
  const { setDialogType } = useEditWorkspaceStore();
  const { selectedItems, toggleItem } = useSelectItems();
  const [inputValue, setInputValue] = useState('');

  // Filter workspaces in list based on search input
  const filteredWorkspaces = useMemo(() => {
    if (!inputValue.trim()) return workspacesList;
    return workspacesList.filter(
      (ws) =>
        ws.name.toLowerCase().includes(inputValue.toLowerCase()) || ws.id.toString().includes(inputValue.toLowerCase()),
    );
  }, [inputValue, workspacesList]);

  const disabled = !selectedItems.size || isDeleting;
  const shareTooltip = disabled ? 'Select workspace to share a copy.' : 'Share copies of the selected workspaces.';
  const deleteTooltip = disabled ? 'Select workspace to delete.' : 'Delete selected workspaces.';

  return (
    <>
      <WorkspacesListDialogs selectedWorkspaceIds={selectedItems} />
      <Stack spacing={2}>
        <Typography variant="h4">{`My Workspaces (${workspacesList.length})`}</Typography>
        <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
          <WorkspacesAutocomplete
            inputValue={inputValue}
            setInputValue={setInputValue}
            filteredWorkspaces={filteredWorkspaces}
          />
          <Stack display="flex" direction="row" spacing={2}>
            <WorkspaceButton
              onClick={() => setDialogType('DELETE_WORKSPACE')}
              disabled={disabled}
              tooltip={deleteTooltip}
            >
              <DeleteRounded />
            </WorkspaceButton>
            <WorkspaceButton
              onClick={() => setDialogType('SHARE_WORKSPACE')}
              disabled={disabled}
              tooltip={shareTooltip}
            >
              <ShareIcon />
            </WorkspaceButton>
            <NewWorkspaceDialogFromWorkspaceList />
          </Stack>
        </Stack>
        <WorkspacesTable
          workspacesList={filteredWorkspaces}
          selectedItems={selectedItems}
          toggleItem={toggleItem}
          isLoading={isLoading}
        />
      </Stack>
    </>
  );
}

export default WorkspacesList;
