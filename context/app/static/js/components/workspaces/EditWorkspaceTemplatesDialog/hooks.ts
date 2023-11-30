import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useEditWorkspaceNameStore } from 'js/stores/useWorkspaceModalStore';
import { useHandleUpdateWorkspace, useCreateTemplates } from '../hooks';
import { templatesField } from '../workspaceFormFields';

interface EditTemplatesFormTypes {
  templates: string[];
}

interface UseEditTemplatesFormTypes {
  workspaceId: number;
}

interface SubmitEditTemplatesTypes {
  templateKeys: string[];
  uuids: string[];
}

const schema = z
  .object({
    ...templatesField,
  })
  .partial()
  .required({ templates: true });

function useEditWorkspaceForm({ workspaceId }: UseEditTemplatesFormTypes) {
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace({ workspaceId });
  const { close } = useEditWorkspaceNameStore();
  const { createTemplates } = useCreateTemplates();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      templates: [],
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  function handleClose() {
    close();
    reset();
  }

  async function onSubmit({ templateKeys, uuids }: SubmitEditTemplatesTypes) {
    if (isSubmitting || isSubmitSuccessful) return;
    const templatesDetails = await createTemplates({ templateKeys, uuids });
    await handleUpdateWorkspace({
      workspace_details: {
        files: templatesDetails,
      },
    });
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

export { useEditWorkspaceForm, type EditTemplatesFormTypes };
