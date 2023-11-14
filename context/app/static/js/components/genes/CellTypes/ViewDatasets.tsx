import React from 'react';

import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useCellTypeDatasets } from './hooks';

interface Props {
  id: string;
  name: string;
}

export default function ViewDatasets({ id, name }: Props) {
  const { data, isLoading } = useCellTypeDatasets(id, true);
  if (isLoading) {
    return <Skeleton />;
  }
  if (!data || data.length === 0) {
    return null;
  }
  const url = new URL('/search', window.location.origin);
  url.searchParams.append('entity_type[0]', 'Dataset');
  url.searchParams.append('uuid', data.join(','));
  url.searchParams.append('cell_type', name);

  return (
    <Button startIcon={<entityIconMap.Dataset />} variant="outlined" sx={{ borderRadius: '4px' }} href={url.toString()}>
      View&nbsp;Datasets
    </Button>
  );
}
