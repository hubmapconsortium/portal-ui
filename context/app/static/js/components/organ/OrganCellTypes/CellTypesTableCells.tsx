import React, { MouseEventHandler } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import Skeleton from '@mui/material/Skeleton';
import { LineClamp } from 'js/shared-styles/text';
import ViewEntitiesButton from '../ViewEntitiesButton';
import { useUUIDsFromHubmapIds } from '../hooks';
import { CellTypeRowProps } from './types';

interface CellTypeLinkProps {
  clid: string;
  cellType: string;
  onClick?: MouseEventHandler;
}

export function CellTypeLink({ clid, cellType, onClick }: CellTypeLinkProps) {
  return (
    <InternalLink href={`/cell-types/${clid}`} onClick={onClick}>
      {cellType}
    </InternalLink>
  );
}

export function CellTypeWithCLIDCell({ cellType, clid }: { cellType: string; clid?: string | null }) {
  return (
    <Stack spacing={1}>
      {clid ? (
        <>
          <CellTypeLink clid={clid} cellType={cellType} />
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            {clid}
          </Typography>
        </>
      ) : (
        cellType
      )}
    </Stack>
  );
}

export function MatchedDatasetsCell({
  totalIndexedDatasets,
  matchedDatasets,
  percentage,
}: Pick<CellTypeRowProps, 'matchedDatasets' | 'totalIndexedDatasets' | 'clid' | 'percentage'>) {
  const matchedDatasetsCount = matchedDatasets?.length ?? 0;

  if (!totalIndexedDatasets) {
    return <Skeleton variant="text" width={150} />;
  }

  return `${matchedDatasetsCount}/${totalIndexedDatasets} (${percentage})`;
}

export function ViewDatasetsCell({ matchedDatasets }: Pick<CellTypeRowProps, 'matchedDatasets'>) {
  const { datasetUUIDs, isLoading } = useUUIDsFromHubmapIds(matchedDatasets ?? []);

  if (isLoading) {
    return <Skeleton variant="text" width={150} />;
  }

  return <ViewEntitiesButton entityType="Dataset" filters={{ datasetUUIDs }} />;
}

export function DescriptionCell({
  description,
  isLoadingDescriptions,
}: {
  description: string;
  isLoadingDescriptions: boolean;
}) {
  return (
    <LineClamp lines={2}>{isLoadingDescriptions ? <Skeleton /> : description || 'No description available'}</LineClamp>
  );
}
