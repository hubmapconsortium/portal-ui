import React from 'react';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';

import Step from 'js/shared-styles/surfaces/Step';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import AddDatasetsTable from '../AddDatasetsTable';
import { useAddDatasetsFromSearchDialog } from './hooks';
import { useWorkspacesList } from '../hooks';
import WorkspaceListItem from '../WorkspaceListItem';
import { MergedWorkspace } from '../types';

function WorkspacesList({
  toggleItem,
  selectedWorkspace,
}: {
  toggleItem: (workspaceId: number) => void;
  selectedWorkspace: number;
}) {
  const { workspacesList } = useWorkspacesList();
  return (
    <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
      {workspacesList.map((workspace) => (
        <WorkspaceListItem
          workspace={workspace}
          key={workspace.id}
          toggleItem={toggleItem}
          selected={workspace.id === selectedWorkspace}
          ToggleComponent={Radio}
        />
      ))}
    </Box>
  );
}

function AddDatasetsFromSearchDialog({ workspacesList }: { workspacesList: MergedWorkspace[] }) {
  const inititialWorkspace = workspacesList[0];

  const {
    submit,
    handleSubmit,
    isSubmitting,
    errors,
    reset,
    resetAutocompleteState,
    errorMessages,
    selectedWorkspace,
    setSelectedWorkspace,
    ...rest
  } = useAddDatasetsFromSearchDialog({ initialDatasetUUIDs: [], initialWorkspaceId: inititialWorkspace.id });

  return (
    <EditWorkspaceDialogContent
      title="Add Datasets to Existing Workspace"
      reset={reset}
      resetState={resetAutocompleteState}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
      disabled={errorMessages.length > 0}
    >
      <Step title="Select Workspace to Edit" index={0}>
        <Stack spacing={3}>
          <WorkspacesList
            selectedWorkspace={selectedWorkspace}
            toggleItem={(workspaceId: number) => setSelectedWorkspace(workspaceId)}
          />
        </Stack>
      </Step>
      <Step title="Add Datasets" index={1}>
        <Stack spacing={3}>
          {errorMessages.length > 0 && <ErrorMessages errorMessages={errorMessages} />}
          <AddDatasetsTable {...rest} />
        </Stack>
      </Step>
    </EditWorkspaceDialogContent>
  );
}

function J() {
  const { workspacesList, isLoading } = useWorkspacesList();
  if (isLoading) {
    return null;
  }

  return <AddDatasetsFromSearchDialog workspacesList={workspacesList} />;
}

export default J;
