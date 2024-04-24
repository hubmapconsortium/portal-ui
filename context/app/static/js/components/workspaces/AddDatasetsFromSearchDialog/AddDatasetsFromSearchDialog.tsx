import React, { useMemo } from 'react';
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
  workspaceIdErrorMessages,
}: Pick<
  ReturnType<typeof useAddDatasetsFromSearchDialog>,
  'selectedWorkspace' | 'selectWorkspace' | 'workspaceIdErrorMessages'
>) {
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
      {workspaceIdErrorMessages.length > 0 && <ErrorMessages errorMessages={workspaceIdErrorMessages} />}

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

function AddDatasetsStep({
  control,
  protectedHubmapIds,
  protectedRows,
  removeProtectedDatasets,
  datasetsErrorMessages,
  ...rest
}: Pick<
  ReturnType<typeof useAddDatasetsFromSearchDialog>,
  | 'control'
  | 'protectedHubmapIds'
  | 'protectedRows'
  | 'removeProtectedDatasets'
  | 'datasetsErrorMessages'
  | 'inputValue'
  | 'setInputValue'
  | 'autocompleteValue'
  | 'addDataset'
  | 'removeDatasets'
  | 'workspaceDatasets'
  | 'allDatasets'
  | 'searchHits'
>) {
  return (
    <Stack spacing={3}>
      <Alert severity="info">
        Enter HuBMAP IDs below to add to a workspace. Datasets that already exist in the workspace cannot be selected
        for deletion.
      </Alert>
      {datasetsErrorMessages.length > 0 && <ErrorMessages errorMessages={datasetsErrorMessages} />}
      <RemoveProtectedDatasetsFormField
        control={control}
        protectedHubmapIds={protectedHubmapIds}
        removeProtectedDatasets={removeProtectedDatasets}
        protectedRows={protectedRows}
      />
      <AddDatasetsTable {...rest} />
    </Stack>
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
    datasetsErrorMessages,
    workspaceIdErrorMessages,
    selectedWorkspace,
    selectWorkspace,
    ...rest
  } = useAddDatasetsFromSearchDialog();

  const steps = useMemo(() => {
    return [
      {
        heading: '1. Select Workspace to Edit',
        content: (
          <SelectWorkspaceStep
            selectedWorkspace={selectedWorkspace}
            selectWorkspace={selectWorkspace}
            workspaceIdErrorMessages={workspaceIdErrorMessages}
          />
        ),
      },
      {
        heading: '2. Add Datasets',
        content: <AddDatasetsStep datasetsErrorMessages={datasetsErrorMessages} {...rest} />,
      },
    ];
  }, [selectedWorkspace, selectWorkspace, workspaceIdErrorMessages, datasetsErrorMessages, rest]);

  return (
    <EditWorkspaceDialogContent
      title="Add Datasets to Existing Workspace"
      reset={reset}
      resetState={resetAutocompleteState}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
      disabled={Boolean(datasetsErrorMessages.length || workspaceIdErrorMessages.length)}
    >
      <AccordionStepsProvider stepsLength={2}>
        <AccordionSteps id="add-datasets-to-workspace-steps" steps={steps} />
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
