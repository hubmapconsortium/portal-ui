import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CreateTemplateNotebooksTypes } from '../types';
import { useTemplateNotebooks } from './hooks';
import {
  workspaceNameField,
  protectedDatasetsField,
  templatesField,
  workspaceJobTypeIdField,
  datasetsField,
} from '../workspaceFormFields';
import { useProtectedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings } from '../formHooks';
import { DEFAULT_JOB_TYPE, DEFAULT_TEMPLATE_KEY } from '../constants';

export interface FormWithTemplates {
  templates: string[];
}
interface CreateWorkspaceFormTypes extends FormWithTemplates {
  'workspace-name': string;
  'protected-datasets': string;
  workspaceJobTypeId: string;
  datasets: string[];
}

interface UseCreateWorkspaceTypes {
  defaultName?: string;
  defaultTemplate?: string;
  initialProtectedDatasets?: string;
}

const schema = z
  .object({
    ...workspaceNameField,
    ...protectedDatasetsField,
    ...templatesField,
    ...workspaceJobTypeIdField,
    ...datasetsField,
  })
  .partial()
  .required({ 'workspace-name': true, templates: true });

function useCreateWorkspaceForm({ defaultName, defaultTemplate, initialProtectedDatasets }: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const createTemplateNotebooks = useTemplateNotebooks();

  const checkedWorkspaceName = defaultName ?? '';
  const checkedProtectedDatasets = initialProtectedDatasets ?? '';

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    trigger,
  } = useForm({
    defaultValues: {
      'workspace-name': checkedWorkspaceName,
      'protected-datasets': checkedProtectedDatasets,
      templates: [defaultTemplate ?? DEFAULT_TEMPLATE_KEY],
      workspaceJobTypeId: DEFAULT_JOB_TYPE,
      datasets: [],
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  async function onSubmit({ templateKeys, uuids, workspaceName, workspaceJobTypeId }: CreateTemplateNotebooksTypes) {
    if (isSubmitting || isSubmitSuccessful) return;
    await createTemplateNotebooks({ templateKeys, uuids, workspaceName, workspaceJobTypeId });
    reset();
    handleClose();
  }

  useEffect(() => {
    if (initialProtectedDatasets && initialProtectedDatasets !== '') {
      reset({
        'workspace-name': checkedWorkspaceName,
        'protected-datasets': checkedProtectedDatasets,
        templates: [defaultTemplate ?? DEFAULT_TEMPLATE_KEY],
        workspaceJobTypeId: DEFAULT_JOB_TYPE,
      });
    }
  }, [initialProtectedDatasets, reset, checkedWorkspaceName, checkedProtectedDatasets, defaultTemplate]);

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
