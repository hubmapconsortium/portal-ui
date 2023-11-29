import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { CreateTemplateNotebooksTypes } from '../types';
import { useTemplateNotebooks } from './hooks';
import { workspaceNameField, protectedDatasetsField, templatesField } from '../workspaceFormFields';

interface CreateWorkspaceFormTypes {
  'workspace-name': string;
  'protected-datasets': undefined;
  templates: string[];
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
