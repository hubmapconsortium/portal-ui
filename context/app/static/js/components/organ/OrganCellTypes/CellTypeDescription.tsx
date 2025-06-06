import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useCellTypeOntologyDetail } from 'js/hooks/useUBKG';

import { CLIDCellProps } from './types';

export default function CellTypeDescription({ clid }: CLIDCellProps) {
  const cellIdWithoutPrefix = clid ? clid.replace('CL:', '') : undefined;
  const { data, error, isLoading } = useCellTypeOntologyDetail(cellIdWithoutPrefix);
  const description = data?.cell_type.definition;

  if (error) {
    return (
      <Typography variant="body2" sx={{ p: 2 }}>
        Error loading description for cell type {clid}.
      </Typography>
    );
  }

  if (isLoading) {
    return <Skeleton variant="text" sx={{ p: 2 }} />;
  }

  return (
    <Typography variant="body2" sx={{ p: 2 }}>
      {description ?? 'No description available for this cell type.'}
    </Typography>
  );
}
