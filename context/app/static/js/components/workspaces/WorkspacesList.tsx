import React, { useState } from 'react';

import { Box, useEventCallback } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import ShareIcon from '@mui/icons-material/Share';

import { useSelectItems } from 'js/hooks/useSelectItems';
import SearchBarComponent from 'js/shared-styles/inputs/SearchBar';
import WorkspaceButton from 'js/components/workspaces/WorkspaceButton';
import NewWorkspaceDialogFromWorkspaceList from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialogFromWorkspaceList';
import WorkspacesTable from 'js/components/workspaces/Tables/WorkspacesTable';
import { useWorkspacesListWithSharerInfo } from './hooks';
import ConfirmDeleteWorkspacesDialog from './ConfirmDeleteWorkspacesDialog';

function SearchBar() {
  const [search, setSearch] = useState('');
  const [input, setInput] = useState(search);

  const handleSubmit = useEventCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(/^\s*HBM\S+\s*$/i.exec(input) ? `"${input}"` : input);
  });

  return (
    <form onSubmit={handleSubmit}>
      <SearchBarComponent
        id="free-text-search"
        fullWidth
        placeholder="Search workspace by name or ID"
        value={input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />
    </form>
  );
}

function DeleteWorkspaceButton({
  disabled,
  setDialogIsOpen,
}: {
  disabled: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <WorkspaceButton onClick={() => setDialogIsOpen(true)} disabled={disabled} tooltip="Delete selected workspaces">
      <DeleteRounded />
    </WorkspaceButton>
  );
}

function ShareWorkspaceButton({ selectedItems }: { selectedItems: Set<string> }) {
  const disabled = selectedItems.size === 0;
  const tooltip = disabled
    ? 'Select workspace to share a copy. Copies can only be shared to users with required workspace permissions.'
    : 'Share copies of the selected workspaces with users with the required workspace permissions.';

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <WorkspaceButton onClick={() => {}} disabled={disabled} tooltip={tooltip}>
      <ShareIcon />
    </WorkspaceButton>
  );
}

function WorkspacesList() {
  const { workspacesList, handleDeleteWorkspace, isDeleting, isLoading } = useWorkspacesListWithSharerInfo();
  const { selectedItems, toggleItem } = useSelectItems();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <ConfirmDeleteWorkspacesDialog
        dialogIsOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
        handleDeleteWorkspace={handleDeleteWorkspace}
        selectedWorkspaceIds={selectedItems}
        workspacesList={workspacesList}
      />
      <Stack spacing={2}>
        <Typography variant="h4">{`My Workspaces (${workspacesList.length})`}</Typography>
        <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
          <Box flex={1} maxWidth="50%">
            <SearchBar />
          </Box>
          <Stack display="flex" direction="row" spacing={2}>
            <DeleteWorkspaceButton
              disabled={isDeleting || selectedItems.size === 0}
              setDialogIsOpen={setDialogIsOpen}
            />
            <ShareWorkspaceButton selectedItems={selectedItems} />
            <NewWorkspaceDialogFromWorkspaceList />
          </Stack>
        </Stack>
        <WorkspacesTable
          workspacesList={workspacesList}
          selectedItems={selectedItems}
          toggleItem={toggleItem}
          isLoading={isLoading}
        />
      </Stack>
    </>
  );
}

export default WorkspacesList;
