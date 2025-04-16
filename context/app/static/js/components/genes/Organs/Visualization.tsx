import React from 'react';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import ReferenceBasedAnalysis from 'js/components/organ/Azimuth/ReferenceBasedAnalysis';
import Stack from '@mui/material/Stack';
import { OrganFile } from 'js/components/organ/types';
import { DetailPageAlert } from 'js/components/detailPage/style';
import { Typography } from '@mui/material';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { useGenePageContext } from '../hooks';

interface AzimuthVisualizationProps {
  organ: OrganFile;
}

export function AzimuthVisualization({ organ }: AzimuthVisualizationProps) {
  const { geneSymbol } = useGenePageContext();
  if (!organ) return null;
  if (!organ?.azimuth) {
    return <DetailPageAlert severity="info">No Azimuth reference-based analysis available.</DetailPageAlert>;
  }
  const { azimuth } = organ;
  return (
    <Stack dir="column" gap={1}>
      <Stack direction="row" gap={0.5} justifyItems="items-center" alignItems="center">
        <Typography variant="subtitle1" display="flex">
          Azimuth Overview
        </Typography>
        <InfoTooltipIcon iconTooltipText="Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment." />
      </Stack>
      <ReferenceBasedAnalysis modalities={azimuth.modalities} nunit={azimuth.nunit} dataref={azimuth.dataref} />
      <VisualizationWrapper
        vitData={azimuth.vitessce_conf}
        trackingInfo={{ action: 'Reference Based Analysis' }}
        uuid={azimuth.title}
        hasBeenMounted
        hasNotebook={false}
        isPublicationPage={false}
        shouldDisplayHeader={false}
        markerGene={geneSymbol}
      />
    </Stack>
  );
}
