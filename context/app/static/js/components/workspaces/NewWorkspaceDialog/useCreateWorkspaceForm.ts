import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CreateTemplateNotebooksTypes, WorkspaceResourceOptions } from '../types';
import { useTemplateNotebooks } from './hooks';
import {
  workspaceNameField,
  protectedDatasetsField,
  templatesField,
  workspaceJobTypeIdField,
  workspaceResourceOptionsField,
} from '../workspaceFormFields';
import { useProtectedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings } from '../formHooks';
import {
  DEFAULT_GPU_ENABLED,
  DEFAULT_JOB_TYPE,
  DEFAULT_MEMORY_MB,
  DEFAULT_NUM_CPUS,
  DEFAULT_TEMPLATE_KEY,
  DEFAULT_TIME_LIMIT_MINUTES,
} from '../constants';

export interface FormWithTemplates {
  templates: string[];
}
interface CreateWorkspaceFormTypes extends FormWithTemplates {
  'workspace-name': string;
  'protected-datasets': string;
  workspaceJobTypeId: string;
  workspaceResourceOptions: WorkspaceResourceOptions;
}

interface UseCreateWorkspaceTypes {
  defaultName?: string;
  defaultTemplate?: string;
}

const schema = z
  .object({
    ...workspaceNameField,
    ...protectedDatasetsField,
    ...templatesField,
    ...workspaceJobTypeIdField,
    ...workspaceResourceOptionsField,
  })
  .partial()
  .required({ 'workspace-name': true, templates: true });

function useCreateWorkspaceForm({ defaultName, defaultTemplate }: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const createTemplateNotebooks = useTemplateNotebooks();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    trigger,
  } = useForm({
    defaultValues: {
      'workspace-name': defaultName ?? '',
      'protected-datasets': '',
      templates: [defaultTemplate ?? DEFAULT_TEMPLATE_KEY],
      workspaceJobTypeId: DEFAULT_JOB_TYPE,
      workspaceResourceOptions: {
        num_cpus: DEFAULT_NUM_CPUS,
        memory_mb: DEFAULT_MEMORY_MB,
        time_limit_minutes: DEFAULT_TIME_LIMIT_MINUTES,
        gpu_enabled: DEFAULT_GPU_ENABLED,
      },
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  async function onSubmit({
    templateKeys,
    uuids,
    workspaceName,
    workspaceJobTypeId,
    workspaceResourceOptions,
  }: CreateTemplateNotebooksTypes) {
    if (isSubmitting || isSubmitSuccessful) return;
    await createTemplateNotebooks({ templateKeys, uuids, workspaceName, workspaceJobTypeId, workspaceResourceOptions });
    reset();
    handleClose();
  }

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
  };
}

function useCreateWorkspaceDatasets() {
  const { errorMessages: protectedDatasetsErrorMessages, selectedRows, ...rest } = useProtectedDatasetsForm();
  const tooManyDatasetsErrorMessages = useTooManyDatasetsErrors({ numWorkspaceDatasets: selectedRows.size });
  const tooManyDatasetsWarningMessages = useTooManyDatasetsWarnings({ numWorkspaceDatasets: selectedRows.size });

  return {
    errorMessages: [...protectedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages],
    warningMessages: [...tooManyDatasetsWarningMessages],
    selectedRows,
    ...rest,
  };
}

export { useCreateWorkspaceForm, useCreateWorkspaceDatasets, type CreateWorkspaceFormTypes };
