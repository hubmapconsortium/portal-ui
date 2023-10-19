import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { CreateTemplateNotebooksTypes } from '../types';
import { useTemplateNotebooks } from './hooks';

interface CreateWorkspaceFormTypes {
  'workspace-name': string;
  'protected-datasets': undefined;
  templates: string[];
}

interface UseCreateWorkspaceTypes {
  defaultName?: string;
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
    'protected-datasets': z.string(),
    templates: z
      .array(z.string(), {
        errorMap: withCustomMessage('At least one template must be selected. Please select a template.'),
      })
      .nonempty(),
  })
  .partial()
  .required({ 'workspace-name': true, templates: true });

function useCreateWorkspaceForm({ defaultName }: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const createTemplateNotebooks = useTemplateNotebooks();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      'workspace-name': defaultName ?? '',
      'protected-datasets': undefined,
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
    await createTemplateNotebooks({ templateKeys, uuids, workspaceName });
    reset();
    handleClose();
  }

  return { dialogIsOpen, setDialogIsOpen, handleClose, handleSubmit, control, errors, onSubmit };
}

interface DatasetAccessLevelHits {
  mapped_data_access_level: 'Public' | 'Protected';
  hubmap_id: string;
  [key: string]: unknown;
}

function useDatasetsAccessLevel(ids: string[]) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids), getTermClause('mapped_data_access_level.keyword', 'Protected')],
      },
    },
    _source: ['mapped_data_access_level', 'hubmap_id'],
    size: ids.length,
  };
  const { searchHits: datasets } = useSearchHits(query) as { searchHits: DatasetAccessLevelHits[] };
  return { datasets };
}

export { useCreateWorkspaceForm, useDatasetsAccessLevel, type CreateWorkspaceFormTypes };
