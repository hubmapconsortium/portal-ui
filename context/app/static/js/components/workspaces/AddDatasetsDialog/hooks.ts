import { useCallback } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Workspace } from '../types';
import { useUpdateWorkspaceDatasets } from '../hooks';
import { datasetsField } from '../workspaceFormFields';
import { useDatasetsAutocomplete } from '../AddDatasetsTable';
import { useTooManyDatasetsErrors, useTooManyDatasetsWarnings } from '../formHooks';

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
    addDataset,
    removeDatasets,
    workspaceDatasets,
    allDatasets,
    searchHits,
    resetAutocompleteState,
  } = useDatasetsAutocomplete({
    workspaceId,
    selectedDatasets: field.value,
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
  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({
    numWorkspaceDatasets: field.value.length + workspaceDatasets.length,
  });
  const errorMessages = [...tooManyDatasetsErrorMessages];

  if (errorMessage) {
    errorMessages.push(errorMessage);
  }

  const warningMessages = useTooManyDatasetsWarnings({
    numWorkspaceDatasets: field.value.length + workspaceDatasets.length,
  });

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
    warningMessages,
  };
}

export { useAddDatasetsDialog };
