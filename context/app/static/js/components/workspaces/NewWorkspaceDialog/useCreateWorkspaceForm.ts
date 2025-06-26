import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { CreateTemplateNotebooksTypes, WorkspaceResourceOptions } from '../types';
import { useTemplateNotebooks } from './hooks';
import {
  workspaceNameField,
  protectedDatasetsField,
  templatesField,
  workspaceJobTypeIdField,
  workspaceResourceOptionsField,
  datasetsField,
  workspaceDescriptionField,
} from '../workspaceFormFields';
import { useWorkspacesProtectedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings } from '../formHooks';
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
  'protected-datasets': string;
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
  initialProtectedDatasets?: string;
  initialSelectedDatasets?: string[];
}

const schema = z
  .object({
    ...workspaceNameField,
    ...workspaceDescriptionField,
    ...protectedDatasetsField,
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
  initialProtectedDatasets,
  initialSelectedDatasets = [],
}: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const createTemplateNotebooks = useTemplateNotebooks();

  const { setDialogType } = useLaunchWorkspaceStore();
  const checkedWorkspaceName = defaultName ?? '';
  const checkedProtectedDatasets = initialProtectedDatasets ?? '';

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
      'protected-datasets': checkedProtectedDatasets,
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
    if (initialProtectedDatasets && initialProtectedDatasets !== '') {
      setValue('protected-datasets', initialProtectedDatasets);
    }
    // Necessary to update dialog state between different processed datasets on detail pages
    if (initialSelectedDatasets && initialSelectedDatasets.length !== 0) {
      setValue('datasets', initialSelectedDatasets);
    }
  }, [initialProtectedDatasets, initialSelectedDatasets, setValue]);

  useEffect(() => {
    if (dialogIsOpen) {
      trigger('workspace-name').catch((e) => {
        console.error(e);
      });
    }
  }, [dialogIsOpen, trigger]);

  return {
    dialogIsOpen,
    setDialogIsOpen,
    handleClose,
    handleSubmit,
    control,
    errors,
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
  const {
    errorMessages: protectedDatasetsErrorMessages,
    warningMessages: protectedDatasetsWarningMessages,
    selectedRows,
    ...rest
  } = useWorkspacesProtectedDatasetsForm();

  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({ numWorkspaceDatasets: selectedRows.size });
  const tooManyDatasetsWarningMessages = useTooManyDatasetsWarnings({ numWorkspaceDatasets: selectedRows.size });

  return {
    errorMessages: [...protectedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages],
    warningMessages: [...protectedDatasetsWarningMessages, ...tooManyDatasetsWarningMessages],
    selectedRows,
    ...rest,
  };
}

export { useCreateWorkspaceForm, useCreateWorkspaceDatasets, type CreateWorkspaceFormTypes };
