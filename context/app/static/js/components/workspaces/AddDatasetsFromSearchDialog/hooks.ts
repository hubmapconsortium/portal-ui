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
  restrictedDatasetsField,
} from '../workspaceFormFields';
import { useDatasetsAutocomplete } from '../AddDatasetsTable';
import {
  useWorkspacesRestrictedDatasetsForm,
  useTooManyDatasetsErrors,
  useTooManyDatasetsWarnings,
} from '../formHooks';

export interface AddDatasetsFromSearchFormTypes {
  datasets: string[];
  workspaceId: number;
  'restricted-datasets': string[];
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
    ...restrictedDatasetsField,
  })
  .required({ datasets: true, workspaceId: true });

function useAddWorkspaceDatasetsFromSearchForm({
  initialDatasetUUIDs,
  initialRestrictedDatasets,
}: {
  initialDatasetUUIDs: string[];
  initialRestrictedDatasets: string[];
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
      'restricted-datasets': initialRestrictedDatasets,
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
    errorMessages: restrictedDatasetsErrorMessages,
    warningMessages: restrictedDatasetsWarningMessages,
    restrictedHubmapIds,
    removeRestrictedDatasets: removeRestrictedDatasetsFromSearchSelections,
    ...restRestrictedDatasets
  } = useWorkspacesRestrictedDatasetsForm({
    selectedRows,
    deselectRows,
  });

  const datasetsFromSearch = useMemo(() => [...selectedRows], [selectedRows]);

  const { handleSubmit, isSubmitting, control, errors, reset, setValue } = useAddWorkspaceDatasetsFromSearchForm({
    initialDatasetUUIDs: datasetsFromSearch,
    initialRestrictedDatasets: restrictedHubmapIds,
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
  }, [datasetsFromSearch, setValue, isOpen]);

  const selectWorkspace = useCallback(
    (workspaceId: number) => {
      workspaceIdField.onChange(workspaceId);
      const selectedDatasetsSet = new Set([...datasetsField.value, ...datasetsFromSearch]);
      setValue('datasets', [...selectedDatasetsSet]);
      setValue('restricted-datasets', restrictedHubmapIds);
    },
    [setValue, datasetsField.value, restrictedHubmapIds, datasetsFromSearch, workspaceIdField],
  );

  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({
    numWorkspaceDatasets: datasetsField.value.length + workspaceDatasets.length,
  });

  const tooManyDatasetsWarningMessages = useTooManyDatasetsWarnings({
    numWorkspaceDatasets: datasetsField.value.length + workspaceDatasets.length,
  });

  const datasetsErrorMessages = buildErrorMessages({
    fieldState: datasetsFieldState,
    otherErrors: [...restrictedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages],
  });

  const datasetsWarningMessages = buildErrorMessages({
    fieldState: datasetsFieldState,
    otherErrors: [...restrictedDatasetsWarningMessages, ...tooManyDatasetsWarningMessages],
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
    restrictedHubmapIds,
    removeRestrictedDatasets: removeRestrictedDatasetsFromSearchSelections,
    ...restRestrictedDatasets,
  };
}

export { useAddDatasetsFromSearchDialog };
