import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { SegmentationMetadataEntry } from 'js/components/types';
import { InternalLink } from 'js/shared-styles/Links';

const TOOLTIPS = {
  QualityScore:
    'Overall quality score of image and segmentation results, computed from all available metrics weighted by a PCA model.',
  Mean_SNZ: 'Signal to noise ratio of expression image, averaged across all channels.',
  ACVF: 'Coefficient of variation in foreground pixels outside cells, averaged across all expression image channels.',
};

function formatChannels(channels: string[] | undefined): string {
  if (!channels || channels.length === 0) {
    return 'Unknown';
  }
  if (channels.length === 1 && channels[0].toLowerCase() === 'none') {
    return 'Unknown';
  }
  return channels.join(', ');
}

function pickEntry(
  segmentationMetadata: SegmentationMetadataEntry[] | undefined,
  activeConfigName: string | undefined,
): SegmentationMetadataEntry | undefined {
  if (!segmentationMetadata || segmentationMetadata.length === 0) {
    return undefined;
  }
  if (segmentationMetadata.length === 1) {
    return segmentationMetadata[0];
  }
  return segmentationMetadata.find((entry) => entry.Image === `${activeConfigName}.ome.tiff`);
}

interface SegmentationChannelsAndQualityProps {
  segmentationMetadata?: SegmentationMetadataEntry[];
  activeConfigName?: string;
  workflowDetailsHref?: string;
}

function SegmentationChannelsAndQuality({
  segmentationMetadata,
  activeConfigName,
  workflowDetailsHref = '#protocols-and-workflow-details',
}: SegmentationChannelsAndQualityProps) {
  const entry = useMemo(
    () => pickEntry(segmentationMetadata, activeConfigName),
    [segmentationMetadata, activeConfigName],
  );

  if (!entry) {
    return null;
  }

  return (
    <Box mt={2}>
      <Typography variant="subtitle1" component="h3" gutterBottom>
        Segmentation Channels & Quality
      </Typography>
      <Typography variant="body1" gutterBottom>
        These channels were used for segmentation, which are visible in the visualization. Segmentation outputs and
        quality control scores are available for each image, with additional segmentation information described in the
        workflow description in the <InternalLink href={workflowDetailsHref}>Protocols & Workflow Details</InternalLink>{' '}
        section.
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={2}>
        <SectionPaper sx={{ flex: 1 }}>
          <Typography variant="subtitle1" component="h4" gutterBottom>
            Segmentation Channels
          </Typography>
          <LabelledSectionText label="Nucleus Segmentation Channels" bottomSpacing={2}>
            {formatChannels(entry.NucleusSegmentationChannels)}
          </LabelledSectionText>
          <LabelledSectionText label="Cell Segmentation Channels">
            {formatChannels(entry.CellSegmentationChannels)}
          </LabelledSectionText>
        </SectionPaper>
        <SectionPaper sx={{ flex: 1 }}>
          <Typography variant="subtitle1" component="h4" gutterBottom>
            Segmentation Quality
          </Typography>
          <LabelledSectionText label="Quality Score" iconTooltipText={TOOLTIPS.QualityScore} bottomSpacing={2}>
            {entry.QualityScore.toFixed(3)}
          </LabelledSectionText>
          <LabelledSectionText label="Mean SNZ" iconTooltipText={TOOLTIPS.Mean_SNZ} bottomSpacing={2}>
            {entry.Mean_SNZ.toFixed(3)}
          </LabelledSectionText>
          <LabelledSectionText label="ACVF" iconTooltipText={TOOLTIPS.ACVF}>
            {entry.ACVF.toFixed(3)}
          </LabelledSectionText>
        </SectionPaper>
      </Stack>
    </Box>
  );
}

export default SegmentationChannelsAndQuality;
