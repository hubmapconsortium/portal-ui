import React from 'react';
import OrganTile from 'js/components/organ/OrganTile';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { useGeneOrgans } from '../hooks';
import { useSelectedOrganContext } from './SelectedOrganContext';

function OrganTileSkeleton() {
  return (
    <Stack direction="row" gap={4} py={1}>
      <Skeleton width={225} height={80} />
      <Skeleton width={225} height={80} />
      <Skeleton width={225} height={80} />
      <Skeleton width={225} height={80} />
    </Stack>
  );
}

export default function GeneOrgans() {
  const { data, isLoading } = useGeneOrgans();
  const { selectedOrgan, setSelectedOrgan } = useSelectedOrganContext();
  if (!data || isLoading) return <OrganTileSkeleton />;

  if ((!isLoading && !data) || Object.keys(data).length === 0) return null;

  if (!selectedOrgan && data) {
    setSelectedOrgan(data[Object.keys(data)[0]]);
  }

  return (
    <Stack direction="row" gap={4} py={1}>
      {Object.entries(data).map(([name, organ]) => (
        <OrganTile
          key={name}
          organ={organ}
          selected={selectedOrgan?.uberon_short === organ.uberon_short}
          onClick={() => setSelectedOrgan(organ)}
        />
      ))}
    </Stack>
  );
}
