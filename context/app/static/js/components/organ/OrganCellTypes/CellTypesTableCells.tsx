import React, { MouseEventHandler } from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Skeleton from '@mui/material/Skeleton';
import ViewEntitiesButton from '../ViewEntitiesButton';
import { useCLID, useUUIDsFromHubmapIds } from '../hooks';
import { CellTypeProps, CellTypeRowProps, CLIDCellProps } from './types';

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

export function OrganCellTypeCell({ cellType }: CellTypeProps) {
  const clid = useCLID(cellType);

  if (!clid) return cellType;
  return <CellTypeLink clid={clid} cellType={cellType} />;
}

interface CLIDCellPropsWithTracking extends CLIDCellProps {
  onClick?: MouseEventHandler;
}

export function CLIDLink({ clid, onClick }: CLIDCellPropsWithTracking) {
  if (!clid) return <Skeleton variant="text" width={100} />;
  return (
    <OutboundIconLink
      onClick={onClick}
      href={`https://www.ebi.ac.uk/ols4/search?q=${clid}&ontology=cl&exactMatch=true`}
    >
      {clid}
    </OutboundIconLink>
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
