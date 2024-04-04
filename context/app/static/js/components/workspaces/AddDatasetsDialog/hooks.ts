import { useCallback } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Workspace } from '../types';
import { useUpdateWorkspaceDatasets } from '../hooks';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from '../api';
import { datasetsField } from '../workspaceFormFields';
import { useDatasetsAutocomplete } from '../AddDatasetsTable';

export interface AddDatasetsFormTypes {
  datasets: string[];
}

const schema = z
  .object({
    ...datasetsField,
  })
  .partial()
  .required({ datasets: true });

function useAddWorkspaceDatasetsForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AddDatasetsFormTypes>({
    defaultValues: {
      datasets: [],
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return {
    handleSubmit,
    control,
    errors,
    reset,
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}

const tooManyDatasetsMessage =
  'Workspaces can currently only contain 10 datasets. Datasets can no longer be added to this workspace unless datasets are removed.';

function useAddDatasetsDialog({ workspace }: { workspace: Workspace }) {
  const workspaceId = workspace.id;

  const { handleSubmit, isSubmitting, control, errors, reset } = useAddWorkspaceDatasetsForm();
  const { field, fieldState } = useController({
    control,
    name: 'datasets',
  });

  const {
    inputValue,
    setInputValue,
    autocompleteValue,
    selectedDatasets,
    addDataset,
    removeDatasets,
    workspaceDatasets,
    allDatasets,
    searchHits,
    resetAutocompleteState,
  } = useDatasetsAutocomplete({
    workspaceId,
    initialDatasetsUUIDS: field.value,
    updateDatasetsFormState: field.onChange,
  });

  const updateWorkspaceDatasets = useUpdateWorkspaceDatasets({ workspaceId });

  const submit = useCallback(
    async ({ datasets }: { datasets: string[] }) => {
      await updateWorkspaceDatasets({
        datasetUUIDs: datasets,
      });
    },
    [updateWorkspaceDatasets],
  );

  const errorMessage = fieldState?.error?.message;
  const tooManyDatasetsSelected = selectedDatasets.size + workspaceDatasets.length > MAX_NUMBER_OF_WORKSPACE_DATASETS;

  const errorMessages = [];

  if (tooManyDatasetsSelected) {
    errorMessages.push(tooManyDatasetsMessage);
  }
  if (errorMessage) {
    errorMessages.push(errorMessage);
  }

  return {
    autocompleteValue,
    inputValue,
    setInputValue,
    submit,
    handleSubmit,
    isSubmitting,
    errors,
    reset,
    resetAutocompleteState,
    addDataset,
    removeDatasets,
    searchHits,
    workspaceDatasets,
    allDatasets,
    errorMessages,
  };
}

export { useAddDatasetsDialog };
