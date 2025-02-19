import React, { useMemo, useState } from 'react';

import { Autocomplete, AutocompleteRenderInputParams, Box, InputAdornment } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import ShareIcon from '@mui/icons-material/Share';

import { useSelectItems } from 'js/hooks/useSelectItems';
import WorkspaceButton from 'js/components/workspaces/WorkspaceButton';
import NewWorkspaceDialogFromWorkspaceList from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialogFromWorkspaceList';
import WorkspacesTable from 'js/components/workspaces/Tables/WorkspacesTable';
import { WorkspaceWithUserId } from 'js/components/workspaces/types';
import { StyledSearchIcon, StyledTextField } from 'js/components/workspaces/style';
import { useWorkspacesListWithSharerInfo } from './hooks';
import ConfirmDeleteWorkspacesDialog from './ConfirmDeleteWorkspacesDialog';

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

function WorkspaceOption(props: React.HTMLAttributes<HTMLLIElement>, option: WorkspaceWithUserId) {
  const { name, id } = option;

  return (
    <li {...props} key={id}>
      <div>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2">{`ID: ${id}`}</Typography>
      </div>
    </li>
  );
}

function WorkspaceSearchField(params: AutocompleteRenderInputParams) {
  const { InputProps } = params;
  return (
    <StyledTextField
      {...params}
      fullWidth
      size="small"
      placeholder="Search workspace by name or ID"
      slotProps={{
        input: {
          ...InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <StyledSearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

function useWorkspacesAutocomplete({ workspaces = [] }: { workspaces: WorkspaceWithUserId[] }) {
  const [inputValue, setInputValue] = useState('');
  const autocompleteValue = '';

  const filteredWorkspaces = useMemo(() => {
    if (!inputValue.trim()) return workspaces;
    return workspaces.filter(
      (ws) =>
        ws.name.toLowerCase().includes(inputValue.toLowerCase()) || ws.id.toString().includes(inputValue.toLowerCase()),
    );
  }, [inputValue, workspaces]);

  return {
    inputValue,
    setInputValue,
    autocompleteValue,
    filteredWorkspaces,
  };
}

function WorkspacesList() {
  const { workspacesList, handleDeleteWorkspace, isDeleting, isLoading } = useWorkspacesListWithSharerInfo();
  const { selectedItems, toggleItem } = useSelectItems();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { inputValue, setInputValue, autocompleteValue, filteredWorkspaces } = useWorkspacesAutocomplete({
    workspaces: workspacesList,
  });

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
            <Autocomplete
              value={autocompleteValue}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              filterOptions={(x) => x}
              options={filteredWorkspaces}
              renderOption={WorkspaceOption}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              freeSolo
              fullWidth
              renderInput={WorkspaceSearchField}
            />
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
