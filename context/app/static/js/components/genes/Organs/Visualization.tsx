import React from 'react';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import ReferenceBasedAnalysis, {
  ReferenceBasedAnalysisSkeleton,
} from 'js/components/organ/Azimuth/ReferenceBasedAnalysis';
import Stack from '@mui/material/Stack';
import { VisualizationSuspenseFallback } from 'js/components/detailPage/visualization/VisualizationWrapper/VisualizationSuspenseFallback';
import { OrganFile } from 'js/components/organ/types';

function VisualizationSkeleton() {
  return (
    <Stack dir="column" gap={1}>
      <ReferenceBasedAnalysisSkeleton />
      <VisualizationSuspenseFallback />
    </Stack>
  );
}

interface AzimuthVisualizationProps {
  organ: OrganFile;
}

export function AzimuthVisualization({ organ }: AzimuthVisualizationProps) {
  if (!organ) return null;
  if (!organ?.azimuth) return <VisualizationSkeleton />;
  const { azimuth } = organ;
  return (
    <Stack dir="column" gap={1}>
      <ReferenceBasedAnalysis modalities={azimuth.modalities} nunit={azimuth.nunit} dataref={azimuth.dataref} />
      <VisualizationWrapper
        vitData={azimuth.vitessce_conf}
        uuid={azimuth.title}
        hasBeenMounted
        hasNotebook={false}
        isPublicationPage={false}
        shouldDisplayHeader={false}
      />
    </Stack>
  );
}
