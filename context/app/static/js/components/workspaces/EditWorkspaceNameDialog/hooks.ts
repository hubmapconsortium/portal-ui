import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useHandleUpdateWorkspace } from '../hooks';
import { workspaceDescriptionField, workspaceNameField } from '../workspaceFormFields';

interface EditWorkspaceFormTypes {
  'workspace-name': string;
  'workspace-description': string;
}

interface UseEditWorkspaceNameFormTypes {
  defaultName: string;
  defaultDescription: string;
  workspaceId: number;
}

interface SubmitEditWorkspaceNameTypes {
  workspaceName: string;
  workspaceDescription: string;
}

const schema = z
  .object({
    ...workspaceNameField,
    ...workspaceDescriptionField,
  })
  .partial();

function useEditWorkspaceForm({ defaultName, defaultDescription, workspaceId }: UseEditWorkspaceNameFormTypes) {
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      'workspace-name': defaultName,
      'workspace-description': defaultDescription,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ workspaceName, workspaceDescription }: SubmitEditWorkspaceNameTypes) => {
      await handleUpdateWorkspace({ body: { name: workspaceName, description: workspaceDescription }, workspaceId });
    },
    [handleUpdateWorkspace, workspaceId],
  );

  return {
    handleSubmit,
    control,
    errors,
    onSubmit,
    reset,
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}

export { useEditWorkspaceForm, type EditWorkspaceFormTypes };
