import React from 'react';
import OrganTile from 'js/components/organ/OrganTile';
import Stack from '@mui/material/Stack';
import { useGeneOrgans } from '../hooks';
import { useSelectedOrganContext } from './SelectedOrganContext';

export default function GeneOrgans() {
  const { data } = useGeneOrgans();
  const { selectedOrgan, setSelectedOrgan } = useSelectedOrganContext();
  if (!data) return null;
  return (
    <Stack direction="row" gap={4}>
      {Object.entries(data).map(([name, organ]) => (
        <OrganTile key={name} organ={organ} selected={selectedOrgan?.uberon_short === organ.uberon_short} onClick={() => setSelectedOrgan(organ)} />
      ))}
    </Stack>
  );
}
