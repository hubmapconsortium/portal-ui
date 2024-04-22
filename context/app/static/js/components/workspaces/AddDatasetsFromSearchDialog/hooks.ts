import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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
  'protected-datasets': string;
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
  initialProtectedDatasets,
}: {
  initialDatasetUUIDs: string[];
  initialWorkspaceId: number;
  initialProtectedDatasets: string;
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
      'protected-datasets': initialProtectedDatasets,
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
    protectedHubmapIds,
    removeProtectedDatasets: removeProtectedDatasetsFromSearchSelections,
    protectedRows,
    ...restProtectedDatasets
  } = useProtectedDatasetsForm();

  const datasetsFromSearch = useMemo(() => [...selectedRows], [selectedRows]);

  const { handleSubmit, isSubmitting, control, errors, reset, setValue } = useAddWorkspaceDatasetsFromSearchForm({
    initialWorkspaceId,
    initialDatasetUUIDs: datasetsFromSearch,
    initialProtectedDatasets: protectedHubmapIds,
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

  const removeProtectedDatasets = useCallback(() => {
    const protectedUUIDs = protectedRows.map((d) => d?._source?.uuid).filter((uuid): uuid is string => Boolean(uuid));
    removeProtectedDatasetsFromSearchSelections();
    removeDatasets(protectedUUIDs);
  }, [removeProtectedDatasetsFromSearchSelections, removeDatasets, protectedRows]);

  const submit = useCallback(
    async ({ datasets }: { datasets: string[] }) => {
      await updateWorkspaceDatasets({
        datasetUUIDs: datasets,
      });
    },
    [updateWorkspaceDatasets],
  );

  const { isOpen } = useEditWorkspaceStore();

  const hasOpened = useRef(false);

  // react-hook-form's defaultValues are cached and must be set upon open. https://react-hook-form.com/docs/useform#defaultValues
  useEffect(() => {
    if (!hasOpened.current && isOpen) {
      setValue('datasets', datasetsFromSearch);
      setValue('protected-datasets', protectedHubmapIds);
      setSelectedDatasets(datasetsFromSearch);
      hasOpened.current = true;
    }
  }, [datasetsFromSearch, setValue, setSelectedDatasets, isOpen, protectedHubmapIds]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaceIdField.value);

  const selectWorkspace = useCallback(
    (workspaceId: number) => setSelectedWorkspace(workspaceId),
    [setSelectedWorkspace],
  );

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
    selectWorkspace,
    protectedHubmapIds,
    protectedRows,
    removeProtectedDatasets,
    ...restProtectedDatasets,
  };
}

export { useAddDatasetsFromSearchDialog };
