import React from 'react';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';

import Step from 'js/shared-styles/surfaces/Step';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { Alert } from 'js/shared-styles/alerts';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import AddDatasetsTable from '../AddDatasetsTable';
import { useAddDatasetsFromSearchDialog } from './hooks';
import { useWorkspacesList } from '../hooks';
import WorkspaceListItem from '../WorkspaceListItem';
import { MergedWorkspace } from '../types';
import { StopWorkspaceAlert } from '../WorkspaceLaunchStopButtons';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';

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
    selectWorkspace,
    control,
    protectedHubmapIds,
    removeProtectedDatasets,
    protectedRows,
    ...rest
  } = useAddDatasetsFromSearchDialog({
    initialWorkspaceId: inititialWorkspace.id,
  });

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
        <Alert severity="info" sx={{ mb: 2 }}>
          Only one workspace can be selected at a time for editing. Workspaces that are running cannot be edited until
          all jobs are stopped.
        </Alert>
        <StopWorkspaceAlert />
        <Stack spacing={3}>
          <WorkspacesList selectedWorkspace={selectedWorkspace} toggleItem={selectWorkspace} />
        </Stack>
      </Step>
      <Step title="Add Datasets" index={1}>
        <Stack spacing={3}>
          {errorMessages.length > 0 && <ErrorMessages errorMessages={errorMessages} />}
          <RemoveProtectedDatasetsFormField
            control={control}
            protectedHubmapIds={protectedHubmapIds}
            removeProtectedDatasets={removeProtectedDatasets}
            protectedRows={protectedRows}
          />
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
