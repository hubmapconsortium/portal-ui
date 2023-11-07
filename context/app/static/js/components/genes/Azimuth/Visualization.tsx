import React from 'react';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import ReferenceBasedAnalysis from 'js/components/organ/Azimuth/ReferenceBasedAnalysis';
import Stack from '@mui/material/Stack';
import { useSelectedOrganContext } from './SelectedOrganContext';

export function AzimuthVisualization() {
  const { selectedOrgan } = useSelectedOrganContext();
  if (!selectedOrgan?.azimuth) return null;
  const { azimuth } = selectedOrgan;
  return (
    <Stack dir="column" gap={1}>
      <ReferenceBasedAnalysis modalities={azimuth.modalities} nunit={azimuth.nunit} dataref={azimuth.dataref} />
      <VisualizationWrapper
        vitData={selectedOrgan.azimuth.vitessce_conf}
        uuid={selectedOrgan.azimuth.title}
        hasBeenMounted
        hasNotebook={false}
        isPublicationPage={false}
        shouldDisplayHeader={false}
      />
    </Stack>
  );
}
