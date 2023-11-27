import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useEditWorkspaceNameStore } from './store';
import { useHandleUpdateWorkspace } from '../hooks';

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

function withCustomMessage(message: string): z.ZodErrorMap {
  return function tooSmallErrorMap(issue, ctx) {
    if (issue.code === z.ZodIssueCode.too_small) {
      return { message };
    }
    return { message: ctx.defaultError };
  };
}

const schema = z
  .object({
    'workspace-name': z
      .string({ errorMap: withCustomMessage('A workspace name is required. Please enter a workspace name.') })
      .min(1)
      .max(150),
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
