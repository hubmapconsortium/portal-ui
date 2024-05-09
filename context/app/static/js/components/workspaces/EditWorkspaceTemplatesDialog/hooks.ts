import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCallback } from 'react';
import { useHandleUpdateWorkspace, useCreateTemplates } from '../hooks';
import { templatesField } from '../workspaceFormFields';
import { FormWithTemplates } from '../NewWorkspaceDialog/useCreateWorkspaceForm';

type EditTemplatesFormTypes = FormWithTemplates;

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
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace();
  const { createTemplates } = useCreateTemplates();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EditTemplatesFormTypes>({
    defaultValues: {
      templates: [],
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ templateKeys, uuids }: SubmitEditTemplatesTypes) => {
      const templatesDetails = await createTemplates({ templateKeys, uuids });
      await handleUpdateWorkspace({
        workspaceId,
        body: {
          workspace_details: {
            files: templatesDetails,
          },
        },
      });
    },
    [createTemplates, handleUpdateWorkspace, workspaceId],
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

export { useEditWorkspaceForm, type EditTemplatesFormTypes };
