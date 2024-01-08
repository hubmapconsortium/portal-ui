import React from 'react';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import ReferenceBasedAnalysis, {
  ReferenceBasedAnalysisSkeleton,
} from 'js/components/organ/Azimuth/ReferenceBasedAnalysis';
import Stack from '@mui/material/Stack';
import { VisualizationSuspenseFallback } from 'js/components/detailPage/visualization/VisualizationWrapper/VisualizationSuspenseFallback';
import { useSelectedOrganContext } from './SelectedOrganContext';

function VisualizationSkeleton() {
  return (
    <Stack dir="column" gap={1}>
      <ReferenceBasedAnalysisSkeleton />
      <VisualizationSuspenseFallback />
    </Stack>
  );
}

export function AzimuthVisualization() {
  const { selectedOrgan } = useSelectedOrganContext();
  if (!selectedOrgan) return null;
  if (!selectedOrgan?.azimuth) return <VisualizationSkeleton />;
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
