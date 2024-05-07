import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useHandleUpdateWorkspace } from '../hooks';
import { workspaceNameField } from '../workspaceFormFields';

interface EditWorkspaceFormTypes {
  'workspace-name': string;
}

interface UseEditWorkspaceNameFormTypes {
  defaultName: string;
  workspaceId: number;
}

interface SubmitEditWorkspaceNameTypes {
  workspaceName: string;
}

const schema = z
  .object({
    ...workspaceNameField,
  })
  .partial()
  .required({ 'workspace-name': true });

function useEditWorkspaceForm({ defaultName, workspaceId }: UseEditWorkspaceNameFormTypes) {
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      'workspace-name': defaultName,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ workspaceName }: SubmitEditWorkspaceNameTypes) => {
      await handleUpdateWorkspace({ body: { name: workspaceName }, workspaceId });
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
