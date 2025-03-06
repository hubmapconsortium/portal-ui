import React, { useEffect, useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import ShareIcon from '@mui/icons-material/Share';
import debounce from '@mui/material/utils/debounce';

import { useSelectItems } from 'js/hooks/useSelectItems';
import NewWorkspaceDialogFromWorkspaceList from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialogFromWorkspaceList';
import WorkspacesTable from 'js/components/workspaces/Tables/WorkspacesTable';
import WorkspacesAutocomplete from 'js/components/workspaces/WorkspacesAutocomplete';
import WorkspacesListDialogs from 'js/components/workspaces/WorkspacesListDialogs';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { WorkspaceTooltipButton } from 'js/components/workspaces/WorkspaceButton/WorkspaceButton';
import { useWorkspacesListWithSharerInfo } from './hooks';

function WorkspacesList() {
  const { workspacesList, isDeleting, isLoading } = useWorkspacesListWithSharerInfo();
  const { setDialogType } = useEditWorkspaceStore();
  const { selectedItems, toggleItem, toggleAllItems } = useSelectItems();
  const [inputValue, setInputValue] = useState('');
  const [debouncedInput, setDebouncedInput] = useState<string>(inputValue);

  useEffect(() => {
    const handler = debounce((value: string) => setDebouncedInput(value), 100);
    handler(inputValue);
  }, [inputValue]);

  const filteredWorkspaces = useMemo(() => {
    if (!debouncedInput.trim()) return workspacesList;
    return workspacesList.filter(
      (ws) =>
        ws.name.toLowerCase().includes(debouncedInput.toLowerCase()) ||
        ws.id.toString().includes(debouncedInput.toLowerCase()),
    );
  }, [workspacesList, debouncedInput]);

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
            <WorkspaceTooltipButton
              onClick={() => setDialogType('DELETE_WORKSPACE')}
              disabled={disabled}
              tooltip={deleteTooltip}
            >
              <DeleteRounded />
            </WorkspaceTooltipButton>
            <WorkspaceTooltipButton
              onClick={() => setDialogType('SHARE_WORKSPACE')}
              disabled={disabled}
              tooltip={shareTooltip}
            >
              <ShareIcon />
            </WorkspaceTooltipButton>
            <NewWorkspaceDialogFromWorkspaceList />
          </Stack>
        </Stack>
        <WorkspacesTable
          workspacesList={filteredWorkspaces}
          selectedItems={selectedItems}
          toggleItem={toggleItem}
          toggleAllItems={toggleAllItems}
          isLoading={isLoading}
        />
      </Stack>
    </>
  );
}

export default WorkspacesList;
