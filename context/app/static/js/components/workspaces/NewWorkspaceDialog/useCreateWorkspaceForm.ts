import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CreateTemplateNotebooksTypes } from '../types';
import { useTemplateNotebooks } from './hooks';
import { workspaceNameField, protectedDatasetsField, templatesField } from '../workspaceFormFields';
import { useProtectedDatasetsForm, useTooManyDatasetsErrors } from '../formHooks';

export interface FormWithTemplates {
  templates: string[];
}
interface CreateWorkspaceFormTypes extends FormWithTemplates {
  'workspace-name': string;
  'protected-datasets': string;
}

interface UseCreateWorkspaceTypes {
  defaultName?: string;
}

const schema = z
  .object({ ...workspaceNameField, ...protectedDatasetsField, ...templatesField })
  .partial()
  .required({ 'workspace-name': true, templates: true });

function useCreateWorkspaceForm({ defaultName }: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const createTemplateNotebooks = useTemplateNotebooks();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      'workspace-name': defaultName ?? '',
      'protected-datasets': '',
      templates: [],
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  async function onSubmit({ templateKeys, uuids, workspaceName }: CreateTemplateNotebooksTypes) {
    if (isSubmitting || isSubmitSuccessful) return;
    await createTemplateNotebooks({ templateKeys, uuids, workspaceName });
    reset();
    handleClose();
  }

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

  return { errorMessages: [...protectedDatasetsErrorMessages, ...tooManyDatasetsErrorMessages], selectedRows, ...rest };
}

export { useCreateWorkspaceForm, useCreateWorkspaceDatasets, type CreateWorkspaceFormTypes };
