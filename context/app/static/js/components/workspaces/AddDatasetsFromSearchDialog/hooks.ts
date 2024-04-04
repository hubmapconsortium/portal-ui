import { useCallback, useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useUpdateWorkspaceDatasets } from '../hooks';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from '../api';
import {
  datasetsField as datasetsFieldSchema,
  workspaceIdField as workspaceIdFieldSchema,
} from '../workspaceFormFields';
import { useDatasetsAutocomplete } from '../AddDatasetsTable';

export interface AddDatasetsFromSearchFormTypes {
  datasets: string[];
  workspaceId: number;
}

const schema = z
  .object({
    ...datasetsFieldSchema,
    ...workspaceIdFieldSchema,
  })
  .required({ datasets: true, workspaceId: true });

function useAddWorkspaceDatasetsFromSearchForm({
  initialDatasetUUIDs,
  initialWorkspaceId,
}: {
  initialDatasetUUIDs: string[];
  initialWorkspaceId: number;
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AddDatasetsFromSearchFormTypes>({
    defaultValues: {
      datasets: initialDatasetUUIDs,
      workspaceId: initialWorkspaceId,
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

function useAddDatasetsFromSearchDialog({
  initialWorkspaceId,
  initialDatasetUUIDs,
}: {
  initialWorkspaceId: number;
  initialDatasetUUIDs: string[];
}) {
  const { handleSubmit, isSubmitting, control, errors, reset } = useAddWorkspaceDatasetsFromSearchForm({
    initialWorkspaceId,
    initialDatasetUUIDs,
  });

  const { field: datasetsField, fieldState: datasetsFieldState } = useController({
    control,
    name: 'datasets',
  });

  const { field: workspaceIdField } = useController({
    control,
    name: 'workspaceId',
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
    workspaceId: workspaceIdField.value,
    initialDatasetsUUIDS: datasetsField.value,
    updateDatasetsFormState: datasetsField.onChange,
  });

  const updateWorkspaceDatasets = useUpdateWorkspaceDatasets({ workspaceId: workspaceIdField.value });

  const submit = useCallback(
    async ({ datasets }: { datasets: string[] }) => {
      await updateWorkspaceDatasets({
        datasetUUIDs: datasets,
      });
    },
    [updateWorkspaceDatasets],
  );

  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaceIdField.value);

  const errorMessage = datasetsFieldState?.error?.message;
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
    selectedWorkspace,
    setSelectedWorkspace,
  };
}

export { useAddDatasetsFromSearchDialog };
