import React, { useEffect, useMemo } from 'react';
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
  const { data } = useGeneOrgans();
  const { selectedOrgan, setSelectedOrgan } = useSelectedOrganContext();
  const organsWithAzimuth = useMemo(() => {
    if (!data) return null;
    return Object.entries(data).reduce(
      (acc, [name, organ]) => {
        if (organ.azimuth) {
          acc[name] = organ;
        }
        return acc;
      },
      {} as typeof data,
    );
  }, [data]);

  useEffect(() => {
    if (organsWithAzimuth) {
      setSelectedOrgan(organsWithAzimuth[Object.keys(organsWithAzimuth)[0]]);
    }
  }, [organsWithAzimuth, setSelectedOrgan]);
  if (!organsWithAzimuth) return <OrganTileSkeleton />;

  return (
    <Stack direction="row" gap={4} py={1}>
      {Object.entries(organsWithAzimuth).map(([name, organ]) => (
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
