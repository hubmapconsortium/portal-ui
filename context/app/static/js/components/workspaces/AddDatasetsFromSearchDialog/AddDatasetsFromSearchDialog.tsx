import React from 'react';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { Alert } from 'js/shared-styles/alerts';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import AddDatasetsTable from '../AddDatasetsTable';
import { useAddDatasetsFromSearchDialog } from './hooks';
import { useWorkspacesList } from '../hooks';
import WorkspaceListItem from '../WorkspaceListItem';
import { StopWorkspaceAlert } from '../WorkspaceLaunchStopButtons';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';

function SelectWorkspaceStep({
  selectedWorkspace,
  selectWorkspace,
}: Pick<ReturnType<typeof useAddDatasetsFromSearchDialog>, 'selectedWorkspace' | 'selectWorkspace'>) {
  const { completeStep } = useAccordionStep();

  const { workspacesList } = useWorkspacesList();

  const selectedWorkspaceDetails = workspacesList.find((workspace) => workspace.id === selectedWorkspace);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Only one workspace can be selected at a time for editing. Workspaces that are running cannot be edited until all
        jobs are stopped.
      </Alert>
      <StopWorkspaceAlert />
      <Stack spacing={3} component={Paper}>
        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {workspacesList.map((workspace) => (
            <WorkspaceListItem
              workspace={workspace}
              key={workspace.id}
              toggleItem={selectWorkspace}
              selected={workspace.id === selectedWorkspace}
              ToggleComponent={Radio}
            />
          ))}
        </Box>
      </Stack>
      <Button
        variant="contained"
        onClick={() => completeStep(selectedWorkspaceDetails?.name ?? '')}
        sx={{ mt: 2 }}
        disabled={!selectedWorkspace}
      >
        Select Workspace
      </Button>
    </Box>
  );
}

function AddDatasetsFromSearchDialog() {
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
  } = useAddDatasetsFromSearchDialog();

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
      <AccordionStepsProvider stepsLength={2}>
        <AccordionSteps
          id="add-datasets-to-workspace-steps"
          steps={[
            {
              heading: 'Select Workspace to Edit',
              content: <SelectWorkspaceStep selectedWorkspace={selectedWorkspace} selectWorkspace={selectWorkspace} />,
            },
            {
              heading: 'Add Datasets',
              content: (
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
              ),
            },
          ]}
        />
      </AccordionStepsProvider>
    </EditWorkspaceDialogContent>
  );
}

function J() {
  const { isLoading } = useWorkspacesList();
  if (isLoading) {
    return null;
  }

  return <AddDatasetsFromSearchDialog />;
}

export default J;
