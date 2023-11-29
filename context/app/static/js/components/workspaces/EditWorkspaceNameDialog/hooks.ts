import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useEditWorkspaceNameStore } from 'js/stores/useWorkspaceModalStore';
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
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace({ workspaceId });
  const { close } = useEditWorkspaceNameStore();

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

  function handleClose() {
    close();
    reset();
  }

  async function onSubmit({ workspaceName }: SubmitEditWorkspaceNameTypes) {
    if (isSubmitting || isSubmitSuccessful) return;
    await handleUpdateWorkspace({ name: workspaceName });
    reset();
    handleClose();
  }

  return {
    handleClose,
    handleSubmit,
    control,
    errors,
    onSubmit,
    reset,
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}

export { useEditWorkspaceForm, type EditWorkspaceFormTypes };
