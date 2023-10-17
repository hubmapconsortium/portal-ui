import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';

interface UseCreateWorkspaceTypes {
  defaultName?: string;
}

const schema = z
  .object({
    'workspace-name': z.string().max(150),
  })
  .required();

function useCreateWorkspace({ defaultName }: UseCreateWorkspaceTypes) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '' || defaultName,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  function onSubmit(submitCallback: () => void) {
    submitCallback();
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

export { useCreateWorkspace, useDatasetsAccessLevel };
