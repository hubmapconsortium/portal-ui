import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useController, ControllerFieldState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useUpdateWorkspaceDatasets, useWorkspaceDetail } from '../hooks';
import {
  datasetsField as datasetsFieldSchema,
  workspaceIdField as workspaceIdFieldSchema,
  protectedDatasetsField,
} from '../workspaceFormFields';
import { useDatasetsAutocomplete } from '../AddDatasetsTable';
import { useWorkspacesProtectedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings } from '../formHooks';

export interface AddDatasetsFromSearchFormTypes {
  datasets: string[];
  workspaceId: number;
  'protected-datasets': string;
}

function buildErrorMessages({
  fieldState,
  otherErrors = [],
}: {
  fieldState: ControllerFieldState;
  otherErrors?: string[];
}) {
  const errorMessages = [];
  const fieldErrorMessage = fieldState?.error?.message;
  if (fieldErrorMessage) {
    errorMessages.push(fieldErrorMessage);
  }
  return [...errorMessages, ...otherErrors];
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
  initialProtectedDatasets,
}: {
  initialDatasetUUIDs: string[];
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
      workspaceId: undefined,
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

function useAddDatasetsFromSearchDialog() {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const {
    errorMessages: protectedDatasetsErrorMessages,
    warningMessages: protectedDatasetsWarningMessages,
    protectedHubmapIds,
    removeInaccessibleDatasets: removeProtectedDatasetsFromSearchSelections,
    protectedRows,
    ...restProtectedDatasets
  } = useWorkspacesProtectedDatasetsForm({
    selectedRows,
    deselectRows,
  });

  const datasetsFromSearch = useMemo(() => [...selectedRows], [selectedRows]);

  const { handleSubmit, isSubmitting, control, errors, reset, setValue } = useAddWorkspaceDatasetsFromSearchForm({
    initialDatasetUUIDs: datasetsFromSearch,
    initialProtectedDatasets: protectedHubmapIds,
  });

  const { field: datasetsField, fieldState: datasetsFieldState } = useController({
    control,
    name: 'datasets',
  });

  const { field: workspaceIdField, fieldState: workspaceIdFieldState } = useController({
    control,
    name: 'workspaceId',
  });

  const { workspaceDatasets: initialDatasets } = useWorkspaceDetail({ workspaceId: workspaceIdField.value });

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
    workspaceDatasets: initialDatasets,
    selectedDatasets: datasetsField.value,
    updateDatasetsFormState: datasetsField.onChange,
  });

  const updateWorkspaceDatasets = useUpdateWorkspaceDatasets({ workspaceId: workspaceIdField.value });

  const removeInaccessibleDatasets = useCallback(() => {
    const protectedUUIDs = protectedRows.filter((uuid): uuid is string => Boolean(uuid));
    removeProtectedDatasetsFromSearchSelections();
    removeDatasets(protectedUUIDs);
  }, [removeProtectedDatasetsFromSearchSelections, removeDatasets, protectedRows]);

  const submit = useCallback(
    async ({ datasets }: { datasets: string[] }) => {
      const workspaceDatasetsSet = new Set(workspaceDatasets);
      const newDatasets = datasets.filter((uuid) => !workspaceDatasetsSet.has(uuid));
      await updateWorkspaceDatasets({
        datasetUUIDs: newDatasets,
      });
    },
    [updateWorkspaceDatasets, workspaceDatasets],
  );

  const { isOpen } = useEditWorkspaceStore();
  // react-hook-form's defaultValues are cached and must be set upon open. https://react-hook-form.com/docs/useform#defaultValues
  useEffect(() => {
    setValue('datasets', datasetsFromSearch);
  }, [datasetsFromSearch, setValue, protectedHubmapIds, isOpen]);

  const selectWorkspace = useCallback(
    (workspaceId: number) => {
      workspaceIdField.onChange(workspaceId);
      const selectedDatasetsSet = new Set([...datasetsField.value, ...datasetsFromSearch]);
      setValue('datasets', [...selectedDatasetsSet]);
      setValue('protected-datasets', protectedHubmapIds);
    },
    [setValue, datasetsField.value, protectedHubmapIds, datasetsFromSearch, workspaceIdField],
  );

  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({
    numWorkspaceDatasets: datasetsField.value.length + workspaceDatasets.length,
  });

  const tooManyDatasetsWarningMessages = useTooManyDatasetsWarnings({
    numWorkspaceDatasets: datasetsField.value.length + workspaceDatasets.length,
  });

  const datasetsErrorMessages = buildErrorMessages({
    fieldState: datasetsFieldState,
    otherErrors: [...protectedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages],
  });

  const datasetsWarningMessages = buildErrorMessages({
    fieldState: datasetsFieldState,
    otherErrors: [...protectedDatasetsWarningMessages, ...tooManyDatasetsWarningMessages],
  });

  const workspaceIdErrorMessages = buildErrorMessages({
    fieldState: workspaceIdFieldState,
  });

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
    datasetsErrorMessages,
    datasetsWarningMessages,
    workspaceIdErrorMessages,
    selectWorkspace,
    protectedHubmapIds,
    protectedRows,
    removeInaccessibleDatasets,
    ...restProtectedDatasets,
  };
}

export { useAddDatasetsFromSearchDialog };
