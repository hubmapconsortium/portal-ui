import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useUpdateWorkspaceDatasets } from '../hooks';
import {
  datasetsField as datasetsFieldSchema,
  workspaceIdField as workspaceIdFieldSchema,
  protectedDatasetsField,
} from '../workspaceFormFields';
import { useDatasetsAutocomplete } from '../AddDatasetsTable';
import { useProtectedDatasetsForm, useTooManyDatasetsErrors } from '../formHooks';

export interface AddDatasetsFromSearchFormTypes {
  datasets: string[];
  workspaceId: number;
  protectedDatasets: string;
}

const schema = z
  .object({
    ...datasetsFieldSchema,
    ...workspaceIdFieldSchema,
    ...protectedDatasetsField,
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
    setValue,
  } = useForm<AddDatasetsFromSearchFormTypes>({
    defaultValues: {
      datasets: initialDatasetUUIDs,
      workspaceId: initialWorkspaceId,
      protectedDatasets: undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}
function useAddDatasetsFromSearchDialog({ initialWorkspaceId }: { initialWorkspaceId: number }) {
  const {
    selectedRows,
    errorMessages: protectedDatasetsErrorMessages,
    ...restProtectedDatasets
  } = useProtectedDatasetsForm();
  const datasetsFromSearch = useMemo(() => [...selectedRows], [selectedRows]);

  const { handleSubmit, isSubmitting, control, errors, reset, setValue } = useAddWorkspaceDatasetsFromSearchForm({
    initialWorkspaceId,
    initialDatasetUUIDs: datasetsFromSearch,
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
    setSelectedDatasets,
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

  const { isOpen } = useEditWorkspaceStore();

  // react-hook-form's defaultValues are cached and must be set upon open. https://react-hook-form.com/docs/useform#defaultValues
  useEffect(() => {
    setValue('datasets', datasetsFromSearch);
    setSelectedDatasets(datasetsFromSearch);
  }, [datasetsFromSearch, setValue, setSelectedDatasets, isOpen]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaceIdField.value);

  const datasetErrorMessage = datasetsFieldState?.error?.message;
  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({
    numWorkspaceDatasets: selectedDatasets.size + workspaceDatasets.length,
  });

  const errorMessages = [...protectedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages];

  if (datasetErrorMessage) {
    errorMessages.push(datasetErrorMessage);
  }

  return {
    control,
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
    ...restProtectedDatasets,
  };
}

export { useAddDatasetsFromSearchDialog };
