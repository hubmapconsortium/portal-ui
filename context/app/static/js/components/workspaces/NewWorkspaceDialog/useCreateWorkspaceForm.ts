import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { CreateTemplateNotebooksTypes, WorkspaceResourceOptions } from '../types';
import { useTemplateNotebooks } from './hooks';
import {
  workspaceNameField,
  restrictedDatasetsField,
  templatesField,
  workspaceJobTypeIdField,
  workspaceResourceOptionsField,
  datasetsField,
  workspaceDescriptionField,
} from '../workspaceFormFields';
import {
  useWorkspacesRestrictedDatasetsForm,
  useTooManyDatasetsErrors,
  useTooManyDatasetsWarnings,
} from '../formHooks';
import {
  DEFAULT_GPU_ENABLED,
  DEFAULT_JOB_TYPE,
  DEFAULT_MEMORY_MB,
  DEFAULT_NUM_CPUS,
  DEFAULT_PYTHON_TEMPLATE_KEY,
  DEFAULT_TIME_LIMIT_MINUTES,
} from '../constants';
import { useDatasetsAutocomplete } from '../AddDatasetsTable/hooks';

export interface FormWithTemplates {
  templates: string[];
}
interface CreateWorkspaceFormTypes extends FormWithTemplates {
  'workspace-name': string;
  'workspace-description': string;
  'restricted-datasets': string[];
  workspaceJobTypeId: string;
  workspaceResourceOptions: WorkspaceResourceOptions;
  datasets: string[];
}

interface UseCreateWorkspaceTypes {
  defaultName?: string;
  defaultDescription?: string;
  defaultTemplate?: string;
  defaultJobType?: string;
  defaultResourceOptions?: Partial<WorkspaceResourceOptions>;
  initialRestrictedDatasets?: string[];
  initialSelectedDatasets?: string[];
}

const schema = z
  .object({
    ...workspaceNameField,
    ...workspaceDescriptionField,
    ...restrictedDatasetsField,
    ...templatesField,
    ...workspaceJobTypeIdField,
    ...workspaceResourceOptionsField,
    ...datasetsField,
  })
  .partial()
  .required({ 'workspace-name': true, templates: true });

function useCreateWorkspaceForm({
  defaultName,
  defaultDescription = '',
  defaultTemplate = DEFAULT_PYTHON_TEMPLATE_KEY,
  defaultJobType = DEFAULT_JOB_TYPE,
  defaultResourceOptions = {},
  initialRestrictedDatasets = [],
  initialSelectedDatasets = [],
}: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const createTemplateNotebooks = useTemplateNotebooks();

  const { setDialogType } = useLaunchWorkspaceStore();
  const checkedWorkspaceName = defaultName ?? '';
  const checkedProtectedDatasets = initialRestrictedDatasets ?? [];

  const initialResourceOptions = {
    num_cpus: DEFAULT_NUM_CPUS,
    memory_mb: DEFAULT_MEMORY_MB,
    time_limit_minutes: DEFAULT_TIME_LIMIT_MINUTES,
    gpu_enabled: DEFAULT_GPU_ENABLED,
    ...defaultResourceOptions,
  };
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    trigger,
  } = useForm({
    defaultValues: {
      'workspace-name': checkedWorkspaceName,
      'workspace-description': defaultDescription,
      'restricted-datasets': checkedProtectedDatasets,
      templates: [defaultTemplate],
      workspaceJobTypeId: defaultJobType,
      workspaceResourceOptions: initialResourceOptions,
      datasets: initialSelectedDatasets,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
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
    selectedDatasets: getValues('datasets'),
    updateDatasetsFormState: (newDatasets) => setValue('datasets', newDatasets),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  async function onSubmit({
    templateKeys,
    uuids,
    workspaceName,
    workspaceDescription,
    workspaceJobTypeId,
    workspaceResourceOptions,
    trackingInfo,
  }: CreateTemplateNotebooksTypes) {
    if (isSubmitting || isSubmitSuccessful) return;
    setDialogType('LAUNCH_NEW_WORKSPACE');
    await createTemplateNotebooks({
      templateKeys,
      uuids,
      workspaceName,
      workspaceDescription,
      workspaceJobTypeId,
      workspaceResourceOptions,
      trackingInfo,
    });
    reset();
    handleClose();
  }

  useEffect(() => {
    if (initialRestrictedDatasets && initialRestrictedDatasets.length !== 0) {
      setValue('restricted-datasets', initialRestrictedDatasets);
    }
    // Necessary to update dialog state between different processed datasets on detail pages
    if (initialSelectedDatasets && initialSelectedDatasets.length !== 0) {
      setValue('datasets', initialSelectedDatasets);
    }
  }, [initialRestrictedDatasets, initialSelectedDatasets, setValue]);

  useEffect(() => {
    if (dialogIsOpen) {
      trigger('workspace-name').catch((e) => {
        console.error(e);
      });
    }
  }, [dialogIsOpen, trigger]);

  const { errorMessages, warningMessages } = useWorkspacesRestrictedDatasetsForm({
    selectedRows: new Set(allDatasets),
    deselectRows: (uuids) => removeDatasets(uuids),
  });

  return {
    dialogIsOpen,
    setDialogIsOpen,
    handleClose,
    handleSubmit,
    control,
    errors,
    errorMessages,
    warningMessages,
    onSubmit,
    isSubmitting: isSubmitting || isSubmitSuccessful,
    inputValue,
    setInputValue,
    autocompleteValue,
    addDataset,
    removeDatasets,
    workspaceDatasets,
    allDatasets,
    searchHits,
    resetAutocompleteState,
  };
}

function useCreateWorkspaceDatasets() {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const {
    errorMessages: protectedDatasetsErrorMessages,
    warningMessages: protectedDatasetsWarningMessages,
    ...rest
  } = useWorkspacesRestrictedDatasetsForm({
    selectedRows,
    deselectRows,
  });

  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({ numWorkspaceDatasets: selectedRows.size });
  const tooManyDatasetsWarningMessages = useTooManyDatasetsWarnings({ numWorkspaceDatasets: selectedRows.size });

  return {
    errorMessages: [...protectedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages],
    warningMessages: [...protectedDatasetsWarningMessages, ...tooManyDatasetsWarningMessages],
    ...rest,
  };
}

export { useCreateWorkspaceForm, useCreateWorkspaceDatasets, type CreateWorkspaceFormTypes };
