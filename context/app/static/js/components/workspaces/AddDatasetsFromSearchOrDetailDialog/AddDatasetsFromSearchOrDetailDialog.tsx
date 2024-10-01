import React, { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';
import { Alert } from 'js/shared-styles/alerts';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import { isWorkspaceAtDatasetLimit } from 'js/helpers/functions';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import AddDatasetsTable from '../AddDatasetsTable';
import { useAddDatasetsFromSearchOrDetailDialog } from './hooks';
import { useWorkspacesList } from '../hooks';
import WorkspaceListItem from '../WorkspaceListItem';
import { StopWorkspaceAlert } from '../WorkspaceLaunchStopButtons';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';
import { MergedWorkspace } from '../types';

function SearchDialogWorkspaceListItem({
  workspace,
  toggleItem,
  selected,
}: {
  workspace: MergedWorkspace;
  toggleItem: (workspaceId: number) => void;
  selected: boolean;
}) {
  const hasMaxDatasets = isWorkspaceAtDatasetLimit(workspace);
  const tooltip = hasMaxDatasets
    ? 'This workspace has reached the maximum number of datasets allowed. You cannot add any more datasets.'
    : undefined;

  return (
    <WorkspaceListItem
      workspace={workspace}
      key={workspace.id}
      toggleItem={toggleItem}
      selected={selected}
      ToggleComponent={Radio}
      disabled={hasMaxDatasets}
      tooltip={tooltip}
    />
  );
}

function SelectWorkspaceStep({
  selectWorkspace,
  workspaceIdErrorMessages,
}: Pick<ReturnType<typeof useAddDatasetsFromSearchOrDetailDialog>, 'selectWorkspace' | 'workspaceIdErrorMessages'>) {
  const { completeStep } = useAccordionStep();

  const { workspacesList } = useWorkspacesList();
  const [toggledWorkspace, toggleWorkspace] = useState<number | undefined>(undefined);

  const selectedWorkspaceDetails = workspacesList.find((workspace) => workspace.id === toggledWorkspace);

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Alert severity="info">
          Only one workspace can be selected at a time for editing. Workspaces that are running cannot be edited until
          all jobs are stopped.
        </Alert>
        <StopWorkspaceAlert />
        <ErrorOrWarningMessages errorMessages={workspaceIdErrorMessages} />
      </Stack>
      <Stack spacing={3} component={Paper}>
        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {workspacesList.map((workspace) => (
            <SearchDialogWorkspaceListItem
              key={workspace.id}
              workspace={workspace}
              toggleItem={toggleWorkspace}
              selected={workspace.id === toggledWorkspace}
            />
          ))}
        </Box>
      </Stack>
      <Button
        variant="contained"
        onClick={() => {
          if (toggledWorkspace) {
            completeStep(selectedWorkspaceDetails?.name ?? '');
            selectWorkspace(toggledWorkspace);
          }
        }}
        sx={{ mt: 2 }}
        disabled={!toggledWorkspace}
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
  datasetsWarningMessages,
  ...rest
}: Pick<
  ReturnType<typeof useAddDatasetsFromSearchOrDetailDialog>,
  | 'control'
  | 'protectedHubmapIds'
  | 'protectedRows'
  | 'removeProtectedDatasets'
  | 'datasetsErrorMessages'
  | 'datasetsWarningMessages'
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
      <ErrorOrWarningMessages errorMessages={datasetsErrorMessages} warningMessages={datasetsWarningMessages} />
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

function AddDatasetsFromSearchOrDetailDialogForm() {
  const {
    submit,
    handleSubmit,
    isSubmitting,
    errors,
    reset,
    resetAutocompleteState,
    datasetsErrorMessages,
    datasetsWarningMessages,
    workspaceIdErrorMessages,
    selectWorkspace,
    ...rest
  } = useAddDatasetsFromSearchOrDetailDialog();

  const steps = useMemo(() => {
    return [
      {
        heading: '1. Select Workspace to Edit',
        content: (
          <SelectWorkspaceStep selectWorkspace={selectWorkspace} workspaceIdErrorMessages={workspaceIdErrorMessages} />
        ),
      },
      {
        heading: '2. Add Datasets',
        content: (
          <AddDatasetsStep
            datasetsErrorMessages={datasetsErrorMessages}
            datasetsWarningMessages={datasetsWarningMessages}
            {...rest}
          />
        ),
      },
    ];
  }, [selectWorkspace, workspaceIdErrorMessages, datasetsErrorMessages, datasetsWarningMessages, rest]);

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

function AddDatasetsFromSearchOrDetailDialog() {
  const { isLoading } = useWorkspacesList();
  if (isLoading) {
    return null;
  }

  return <AddDatasetsFromSearchOrDetailDialogForm />;
}

export default AddDatasetsFromSearchOrDetailDialog;
