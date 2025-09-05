import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useCellTypeOntologyDetail } from 'js/hooks/useUBKG';

import { formatCellTypeName } from 'js/api/scfind/utils';
import { CLIDCellProps } from './types';

export function CellTypeDescriptionSkeleton({ cellType }: { cellType: string }) {
  const cellTypeName = formatCellTypeName(cellType);
  return (
    <Skeleton
      width="100%"
      height={48}
      variant="rounded"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Loading description for {cellTypeName}...
    </Skeleton>
  );
}

export default function CellTypeDescription({ clid, cellType }: CLIDCellProps) {
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
    return <CellTypeDescriptionSkeleton cellType={cellType} />;
  }

  return (
    <Typography variant="body2" sx={{ p: 2 }}>
      {description ?? 'No description available for this cell type.'}
    </Typography>
  );
}
